import '@anthropic-ai/sdk/shims/node';
import Anthropic from '@anthropic-ai/sdk';
import { ChatBasedLLMInterface, LLMChatResponse } from '../../interfaces/chat-based-llm';
import { InvokerProps } from '../../execution/invoker';
import { ChatContext } from '../../framework/chat-context';
import { CacheOnDisk } from '../cache/cache-on-disk';

interface AnthropicChatBasedLLMOptions extends InvokerProps<LLMChatResponse> {
    apiKey?: string;
    modelId?: string;
}

export class AnthropicChatBasedLLM extends ChatBasedLLMInterface {
    private anthropic: Anthropic;
    private modelId = 'claude-3-opus-20240229';

    constructor(props: AnthropicChatBasedLLMOptions = {}) {
        super({
            cache: new CacheOnDisk('.hyper/cache/anthropic'),
            ...props,
        });
        this.anthropic = new Anthropic({
            apiKey: props.apiKey || process.env.ANTHROPIC_API_KEY,
        });
        this.modelId = props.modelId || this.modelId;
    }

    protected getName(): string {
        return 'Anthropic-' + this.modelId;
    }

    protected async onLLMInvoke(context: ChatContext): Promise<LLMChatResponse> {
        const response = await this.anthropic.messages.create({
            model: this.modelId,
            messages: context.getMessages().map(message => ({
                role: message.from === 'user' ? 'user' : 'assistant',
                content: message.text,
            })) as any,
            max_tokens: 3000,
        });
        return {
            text: response.content[0].text,
        };
    }
}
