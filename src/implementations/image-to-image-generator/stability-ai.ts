import { ImageToImageGeneratorAIInterface, ImageToImageGeneratorAIInterfaceProps, ImageToImageGeneratorInput, ImageToImageGeneratorResult } from '../../interfaces/image-to-image-generator';
// import { execute } from '../../utils/execute';
import { randomId } from '../../utils/random';
import { CacheOnDisk } from '../cache/cache-on-disk';
import fs from 'fs';

export interface StabilityImageToImageAIGeneratorInput extends ImageToImageGeneratorAIInterfaceProps {
    apiKey?: string;
    engineId?: string;
}

export class StabilityImageToImageAiImageGenerator extends ImageToImageGeneratorAIInterface {

    private apiKey: string;
    private engineId = 'stable-diffusion-xl-1024-v1-0'

    constructor(props: StabilityImageToImageAIGeneratorInput = {}) {
        super({
            cache: new CacheOnDisk('.hyper/cache/stability-ai-images'),
            ...props,
        });
        this.apiKey = props.apiKey || process.env.STABILITY_AI_API_KEY!;
        this.engineId = props.engineId || this.engineId;
    }

    protected getName(): string {
        return 'stability-image-' + this.engineId;
    }

    protected async onGenerateImage(input: ImageToImageGeneratorInput): Promise<ImageToImageGeneratorResult> {

        const outPath = './.hyper/tmp/' + randomId() + '.png';
        
        try {
        // await execute(`
        //     curl -f -sS -X POST "https://api.stability.ai/v1/generation/${this.engineId}/image-to-image" \
        //     -H 'Content-Type: multipart/form-data' \
        //     -H 'Accept: image/png' \
        //     -H "Authorization: Bearer ${this.apiKey}" \
        //     -F 'init_image=@"${input.imageUrl}"' \
        //     -F 'init_image_mode=IMAGE_STRENGTH' \
        //     -F 'image_strength=${input.strength || 0.05}' \
        //     -F 'text_prompts[0][text]=${input.prompt.replace(/['"\n]+/g, '')}' \
        //     -F 'cfg_scale=7' \
        //     -F 'samples=1' \
        //     -F 'steps=30' \
        //     -o '${outPath}'
        // `)

        } catch (e) {
            return { base64: ''}
        }
        // read the image
        const raw = await fs.promises.readFile(outPath);
        const base64 = new Buffer(raw).toString('base64')
        await fs.promises.unlink(outPath)

        return {
            base64: base64
        };
    }
}
