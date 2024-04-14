import { Invoker } from '../../execution/invoker';
import OpenAI from 'openai';
import {
    ImageGeneratorAIInterface,
    ImageGeneratorAIInterfaceProps,
    ImageGeneratorInput,
    ImageGeneratorResult,
} from '../../interfaces/image-generator';
import { CacheOnDisk } from '../cache/cache-on-disk';

interface DalleImageGeneratorInput extends ImageGeneratorAIInterfaceProps {
    apiKey?: string;
    modelId?: string;
}

export class DalleImageGenerator extends ImageGeneratorAIInterface {
    private openAI: OpenAI;
    private modelId = 'dall-e-3';

    constructor(props: DalleImageGeneratorInput = {}) {
        super({
            cache: new CacheOnDisk('.hyper/cache/openai-dalle'),
            ...props,
        });
        this.openAI = new OpenAI({
            apiKey: props.apiKey || process.env.OPENAI_API_KEY,
        });
        this.modelId = props.modelId || this.modelId;
    }

    protected getName(): string {
        return 'OPENAI-' + this.modelId;
    }

    protected async onGenerateImage(input: ImageGeneratorInput): Promise<ImageGeneratorResult> {
        const completion = await this.openAI.images.generate({
            model: this.modelId,
            prompt: input.prompt,
            quality: 'hd',
            response_format: 'b64_json',
            size: '1024x1024',
        });
        return {
            base64: completion.data[0].b64_json!,
        };
    }
}
