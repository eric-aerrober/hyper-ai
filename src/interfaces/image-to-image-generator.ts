import { Invoker, InvokerProps } from '../execution/invoker';
import { Saver, SaverResult } from '../execution/saver';
import { HyperExecution } from '../framework/hyper-execution';
import { SaveBase64ImgOnDisk } from '../implementations/saver/save-b64-on-disk';

export interface ImageToImageGeneratorInput {
    prompt: string;
    imageUrl: string;
    strength?: number;
}

export interface ImageToImageGeneratorResult {
    base64: string;
}

export interface ImageToImageGeneratorAIInterfaceProps extends InvokerProps<SaverResult> {
    saver?: Saver<ImageToImageGeneratorResult>;
}

export class ImageToImageGeneratorAIInterface extends Invoker<ImageToImageGeneratorInput, SaverResult> {
    private saver: Saver<ImageToImageGeneratorResult>;

    constructor(props: ImageToImageGeneratorAIInterfaceProps) {
        super(props);
        this.saver = props.saver!;
    }

    protected async onInvoke(input: ImageToImageGeneratorInput, execution: HyperExecution): Promise<SaverResult> {
        const formattedInput = {
            ...input,
            imageUrl: input.imageUrl.split(process.cwd())[1] || input.imageUrl
        }
        if (formattedInput.imageUrl.startsWith('/')) formattedInput.imageUrl = formattedInput.imageUrl.slice(1);
        const image = await this.onGenerateImage(formattedInput);
        return await this.saver.save('image-result', image, execution) 
    }

    protected onGenerateImage(input: ImageToImageGeneratorInput): Promise<ImageToImageGeneratorResult> {
        throw new Error('Not implemented');
    }
}
