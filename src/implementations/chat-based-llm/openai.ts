import { ChatBasedLLMInterface, LLMChatResponse } from '../../interfaces/chat-based-llm';
import { InvokerProps } from '../../execution/invoker';
import { ChatContext } from '../../framework/chat-context';
import { NoCache } from '../cache/no-cache';

export interface OpenAIChatBasedLLMOptions extends InvokerProps<LLMChatResponse> {
    apiKey?: string;
    modelId?: string;
}

export class OpenAIChatBasedLLM extends ChatBasedLLMInterface {
    private modelId = 'gpt-4-turbo-2024-04-09'
    private apiKey: string;

    constructor(props: OpenAIChatBasedLLMOptions = {}) {
        super({
            cache: new NoCache(),
            ...props,
        });
        this.apiKey = props.apiKey || (process && process.env.OpenAI_API_KEY!),
        this.modelId = props.modelId || this.modelId;
    }

    protected getName(): string {
        return 'openai-' + this.modelId;
    }

    protected async onLLMInvoke(context: ChatContext): Promise<LLMChatResponse> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            method: 'POST',
            body: JSON.stringify({
                model: this.modelId,
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant designed to output JSON."
                    },
                    ...context.getMessages().map(message => ({
                        role: message.from === 'user' ? 'user' : 'assistant',
                        content: message.text,
                    }))
                ]
            })
        })

        const responseJson = await response.json();
        
        return {
            text: responseJson.choices[0].message.content,
        };
    }
}
