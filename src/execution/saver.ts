export interface SaverResult {
    accessUrl: string;
}

export class Saver<SaverInput> {
    public async save(data: SaverInput): Promise<SaverResult> {
        return await this.saveRaw(data);
    }

    protected saveRaw(_: SaverInput): Promise<SaverResult> {
        throw new Error('Not implemented');
    }
}
