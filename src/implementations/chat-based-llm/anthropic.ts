import { ChatBasedLLMInterface, LLMChatResponse } from '../../interfaces/chat-based-llm';
import { InvokerProps } from '../../execution/invoker';
import { ChatContext } from '../../framework/chat-context';
import { NoCache } from '../cache/no-cache';

export interface AnthropicChatBasedLLMOptions extends InvokerProps<LLMChatResponse> {
    apiKey?: string;
    modelId?: string;
}

export class AnthropicChatBasedLLM extends ChatBasedLLMInterface {
    private modelId = 'claude-3-opus-20240229';
    private apiKey: string;

    constructor(props: AnthropicChatBasedLLMOptions = {}) {
        super({
            cache: new NoCache(),
            ...props,
        });
        this.apiKey = props.apiKey || (process && process.env.ANTHROPIC_API_KEY!),
        this.modelId = props.modelId || this.modelId;
    }

    protected getName(): string {
        return 'anthropic-' + this.modelId;
    }

    protected async onLLMInvoke(context: ChatContext): Promise<LLMChatResponse> {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01',
            },
            method: 'POST',
            body: JSON.stringify({
                model: this.modelId,
                messages: context.getMessages().map(message => ({
                    role: message.from === 'user' ? 'user' : 'assistant',
                    content: message.text,
                })),
                max_tokens: 3000,
            })
        })

        const responseJson = await response.json();
        
        return {
            text: responseJson.content[0].text,
        };
    }
}
