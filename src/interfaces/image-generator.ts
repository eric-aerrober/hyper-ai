import { Invoker, InvokerProps } from '../execution/invoker';
import { Saver, SaverResult } from '../execution/saver';
import { HyperExecution } from '../framework/hyper-execution';
import { SaveBase64ImgOnDisk } from '../implementations/saver/save-b64-on-disk';

export interface ImageGeneratorInput {
    prompt: string;
}

export interface ImageGeneratorResult {
    base64: string;
}

export interface ImageGeneratorAIInterfaceProps extends InvokerProps<SaverResult> {
    saver?: Saver<ImageGeneratorResult>;
}

export class ImageGeneratorAIInterface extends Invoker<ImageGeneratorInput, SaverResult> {
    private saver: Saver<ImageGeneratorResult>;

    constructor(props: ImageGeneratorAIInterfaceProps) {
        super(props);
        this.saver = props.saver!;
    }

    protected async onInvoke(input: ImageGeneratorInput, execution: HyperExecution): Promise<SaverResult> {
        const image = await this.onGenerateImage(input);
        return await this.saver.save('image-result', image, execution) 
    }

    protected onGenerateImage(input: ImageGeneratorInput): Promise<ImageGeneratorResult> {
        throw new Error('Not implemented');
    }
}
