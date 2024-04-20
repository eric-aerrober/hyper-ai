import {
    ImageGeneratorAIInterface,
    ImageGeneratorAIInterfaceProps,
    ImageGeneratorInput,
    ImageGeneratorResult,
} from '../../interfaces/image-generator';

export interface DalleImageGeneratorInput extends ImageGeneratorAIInterfaceProps {
    apiKey?: string;
    modelId?: string;
}

export class DalleImageGenerator extends ImageGeneratorAIInterface {
    private modelId = 'dall-e-3';
    private apiKey: string;

    constructor(props: DalleImageGeneratorInput = {}) {
        super(props);
        this.apiKey = props.apiKey || (process && process.env.OPENAI_API_KEY!)
        this.modelId = props.modelId || this.modelId;
    }

    protected getName(): string {
        return 'dalle-' + this.modelId;
    }

    protected async onGenerateImage(input: ImageGeneratorInput): Promise<ImageGeneratorResult> {

        const completion = await fetch('https://api.openai.com/v1/images/generations', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.apiKey,
            },
            method: 'POST',
            body: JSON.stringify({
                model: this.modelId,
                prompt: input.prompt,
                quality: 'hd',
                response_format: 'b64_json',
                size: '1024x1024',
            })
        });

        const completionJson = await completion.json();

        return {
            base64: completionJson.data[0].b64_json!,
        };
    }
}
