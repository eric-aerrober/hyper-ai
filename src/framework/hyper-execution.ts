import { BestEffortJsonParser } from '../utils/parser';
import { ChatContext } from './chat-context';
import { Hyper } from './hyper';
import { FlameLogger } from 'flame-logs';
import { deepMergeTogether } from '../utils/deepMerge';
import { Saver, SaverResult } from '../execution/saver';
import { SaveExecutionDataOnDisk } from '../implementations/saver/save-chat-on-disk';
import { LLMChatResponse } from '../interfaces/chat-based-llm';

export interface HyperExecutionResultAsset {
    type: 'image';
    access: string;
}

export class HyperExecution {
    private startedAt: Date = new Date();
    private runningState: any = {};
    private chatContext: ChatContext = new ChatContext([]);
    private resultAssets: Record<string, HyperExecutionResultAsset> = {};

    constructor(private hyper: Hyper, public readonly log: FlameLogger) {}

    // Operations to the execution itself

    get state(): any {
        return this.runningState;
    }
    get assets(): Record<string, HyperExecutionResultAsset> {
        return this.resultAssets;
    }

    saveAsset(id: string, asset: HyperExecutionResultAsset): void {
        this.resultAssets[id] = asset;
    }

    updateState(state: any): void {
        this.runningState = deepMergeTogether(this.runningState, state);
    }

    // Final Results

    save(): Promise<SaverResult> {
        return this.hyper.executionDataSaver.save({
            start: this.startedAt,
            end: new Date(),
            state: this.state,
            messages: this.chatContext.getMessages(),
            assets: this.assets,
        });
    }

    // Interacting with AI interfaces

    async ask({ prompt, format }: { prompt: string; format: any }): Promise<LLMChatResponse> {
        return await this.askFreeform(prompt, JSON.stringify(format));
    }

    async askFreeform(
        prompt: string,
        format = '{ answer: string // your answer here }'
    ): Promise<LLMChatResponse> {
        const fullPrompt = `${prompt}\nPlease respond as a valid JSON string matching this format: ${format}`;
        const updatedContext = this.chatContext.addUserMessage(fullPrompt);
        const modelResponse = await this.hyper.chatBasedLLMInvoker.invoke(updatedContext, this);
        const jsonData = BestEffortJsonParser(modelResponse.text);
        this.chatContext = updatedContext.addBotMessage(modelResponse.text);
        this.updateState(jsonData);
        return modelResponse;
    }

    async generateImage(id: string, prompt: string): Promise<SaverResult> {
        const image = await this.hyper.imageGeneratorInvoker.invoke({ prompt }, this);
        this.resultAssets[id] = { type: 'image', access: image.accessUrl };
        return image;
    }

    async generateImages(...prompts: { id: string; prompt: string }[]): Promise<SaverResult[]> {
        return await Promise.all(prompts.map(p => this.generateImage(p.id, p.prompt)));
    }
}
