import { Saver, SaverResult } from '../../execution/saver';
import { ImageGeneratorResult } from '../../interfaces/image-generator';
import fs from 'fs';
import { randomId } from '../../utils/random';

export class SaveBase64ImgOnDisk extends Saver<ImageGeneratorResult> {
    constructor(private prefix: string) {
        super();
        fs.mkdirSync(prefix, { recursive: true });
    }

    protected async saveRaw(value: ImageGeneratorResult): Promise<SaverResult> {
        const path = `${this.prefix}/${randomId()}.png`;
        const buffer = Buffer.from(value.base64, 'base64');
        await fs.promises.writeFile(path, buffer);
        const absolutePath = 'file://' + fs.realpathSync(path)
        return { accessUrl: absolutePath };
    }
}
