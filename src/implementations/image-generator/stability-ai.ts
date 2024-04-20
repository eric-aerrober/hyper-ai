import { ImageGeneratorAIInterface, ImageGeneratorAIInterfaceProps, ImageGeneratorInput, ImageGeneratorResult } from '../../interfaces/image-generator';

export interface StabilityAIGeneratorInput extends ImageGeneratorAIInterfaceProps {
    apiKey?: string;
    engineId?: string;
}

export class StabilityAiImageGenerator extends ImageGeneratorAIInterface {

    private apiKey: string;
    private engineId = 'stable-diffusion-xl-1024-v1-0'

    constructor(props: StabilityAIGeneratorInput = {}) {
        super(props);
        this.apiKey = props.apiKey || (process && process.env.STABILITY_AI_API_KEY!);
        this.engineId = props.engineId || this.engineId;
    }

    protected getName(): string {
        return 'stable-diffusion-' + this.engineId;
    }

    protected async onGenerateImage(input: ImageGeneratorInput): Promise<ImageGeneratorResult> {

        const response = await fetch(
            `https://api.stability.ai/v1/generation/${this.engineId}/text-to-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    text_prompts: [
                    {
                        text: input.prompt,
                    },
                    ],
                    cfg_scale: 7,
                    height: 1024,
                    width: 1024,
                    steps: 30,
                    samples: 1,
                }),
            }
        )

        const body = await response.json();

        return {
            base64: body.artifacts[0].base64,
        };
    }
}
