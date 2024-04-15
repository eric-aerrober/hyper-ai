import { HyperExecution } from "../framework/hyper-execution";

export interface SaverResult {
    raw?: any;
    accessUrl: string;
}

export class Saver<SaverInput> {

    public async save(name: string, data: SaverInput, execution: HyperExecution): Promise<SaverResult> {
        return execution.log.jobWithRetries('Saving: ' + name, () => this.saveRaw(data));
    }

    protected saveRaw(_: SaverInput): Promise<SaverResult> {
        throw new Error('Not implemented');
    }
}
