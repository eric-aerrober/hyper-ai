import { Invoker } from '../execution/invoker';
import { ChatContext } from '../framework/chat-context';

export interface LLMChatResponse {
    text: string;
}

export class ChatBasedLLMInterface extends Invoker<ChatContext, LLMChatResponse> {
    protected onInvoke(input: ChatContext): Promise<LLMChatResponse> {
        return this.onLLMInvoke(input);
    }

    protected onLLMInvoke(input: ChatContext): Promise<LLMChatResponse> {
        throw new Error('Not implemented');
    }
}
