import { BestEffortJsonParser } from '../utils/parser';
import { ChatContext, ChatMessage } from './chat-context';
import { Hyper } from './hyper';
import { deepMergeTogether } from '../utils/deepMerge';
import { SaverResult } from '../execution/saver';
import { LLMChatResponse } from '../interfaces/chat-based-llm';
import { randomId } from '../utils/random';
import { ImageToImageGeneratorInput } from '../interfaces/image-to-image-generator';

export interface HyperExecutionResultAsset {
    type: 'image';
    accessUrl: string;
}

export interface ExecutionResult {
    id: string;
    start: Date;
    end: Date;
    state: any;
    messages: ChatMessage[];
    assets: Record<string, HyperExecutionResultAsset>;
}

export class HyperExecution {

    private id: string = randomId();
    private startedAt: Date = new Date();
    private runningState: any = {};
    private chatContext: ChatContext = new ChatContext([]);
    private resultAssets: Record<string, HyperExecutionResultAsset> = {};

    private rootTaskId: string

    constructor(private hyper: Hyper) {
        this.rootTaskId = this.tasks.startTask('Execution');
    }

    // Operations to the execution itself

    get state(): any {
        return this.runningState;
    }
    get assets(): Record<string, HyperExecutionResultAsset> {
        return this.resultAssets;
    }
    get tasks() {
        return this.hyper.tasks;
    }
    get rootTask() {
        return this.rootTaskId;
    }

    saveAsset(id: string, asset: HyperExecutionResultAsset): void {
        this.resultAssets[id] = asset;
    }

    updateState(state: any): void {
        this.runningState = deepMergeTogether(this.runningState, state);
    }

    // Final Results

    async save(): Promise<SaverResult> {
        const executionResult: ExecutionResult = {
            id: this.id,
            start: this.startedAt,
            end: new Date(),
            state: this.state,
            messages: this.chatContext.getMessages(),
            assets: this.assets,
        }
        const data = await this.hyper.executionDataSaver.save('execution result data', executionResult, this);
        this.tasks.endTask(this.rootTaskId);
        return { accessUrl: data.accessUrl, raw: executionResult };
    }

    // Interacting with AI interfaces

    tell(message: string) {
        this.chatContext = this.chatContext
            .addUserMessage(message)
            .addBotMessage("Understood")
    }

    async consider(message: string): Promise<LLMChatResponse> {
        const fullPrompt = `
            I am now asking you the following: 
            
            ${prompt}

            ----
            Please respond as in sentences or pharagraphs or bullets. Do not use an explicit JSON format.
        `;
        const updatedContext = this.chatContext.addUserMessage(fullPrompt);
        const modelResponse = await this.hyper.chatBasedLLMInvoker.invoke(updatedContext, this);
        this.chatContext = updatedContext.addBotMessage(modelResponse.text);
        return modelResponse;
    }

    async ask({ prompt, format }: { prompt: string; format: any }): Promise<LLMChatResponse> {
        const fullPrompt = `
            I am now asking you the following: 
            
            ${prompt}

            ----

            Please respond as a valid JSON string matching this format: ${JSON.stringify(format)}. 
            
            Match the structure provided, but a valid response string might be: { "answer": "your answer here" }
            Also avoid any characters in your response that may break the JSON format, like double quotes within double quotes.
            Add quotes around keys and values if they are strings, but not within the string itself.
            
            - good format: { "answer": "i said yes to her" }
            - bad format: { "answer": "i said "yes" to her" }
        `;
        const updatedContext = this.chatContext.addUserMessage(fullPrompt);
        const modelResponse = await this.hyper.chatBasedLLMInvoker.invoke(updatedContext, this);
        const jsonData = BestEffortJsonParser(modelResponse.text);
        if (!jsonData) {
            this.tasks.errorTask(this.rootTaskId, 'Invalid JSON response from model: ' + modelResponse.text);
            console.log(modelResponse.text);
            throw new Error('Invalid JSON response from model');
        }
        this.chatContext = updatedContext.addBotMessage(modelResponse.text);
        this.updateState(jsonData);
        return modelResponse;
    }

    async generateImageFromImage(input: ImageToImageGeneratorInput): Promise<SaverResult> {
        const image = await this.hyper.imageToImageGeneratorInvoker.invoke(input, this);
        this.resultAssets[input.prompt] = { type: 'image', accessUrl: image.accessUrl };
        return image;
    }

    async generateImagesFromImages(inputs: ImageToImageGeneratorInput[]): Promise<SaverResult[]> {
        return await Promise.all(
            inputs.map(input => this.generateImageFromImage(input))
        );
    }

    async generateImage(id: string, prompt: string): Promise<SaverResult> {
        const image = await this.hyper.imageGeneratorInvoker.invoke({ prompt }, this);
        this.resultAssets[id] = { type: 'image', accessUrl: image.accessUrl };
        return image;
    }

    async generateImages(prompts: { [key: string] : string }): Promise<SaverResult[]> {
        return await Promise.all(
            Object.entries(prompts).map(([id, prompt]) => this.generateImage(id, prompt))
        );
    }
}
