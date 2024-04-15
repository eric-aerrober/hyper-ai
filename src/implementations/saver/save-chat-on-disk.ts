import { Saver, SaverResult } from '../../execution/saver';
import fs from 'fs';
import { randomId } from '../../utils/random';

export class SaveExecutionDataOnDisk extends Saver<any> {
    constructor(private prefix: string) {
        super();
        fs.mkdirSync(prefix, { recursive: true });
    }

    protected async saveRaw(value: any): Promise<SaverResult> {
        const data = JSON.stringify(value, null, 2);
        const path = `${this.prefix}/${value.id || randomId()}.json`;
        await fs.promises.writeFile(path, data);
        const absolutePath = 'file://' + fs.realpathSync(path);
        return { accessUrl: absolutePath };
    }
}
