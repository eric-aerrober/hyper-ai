export class Cache<T> {
    public async exists(key: string): Promise<boolean> {
        return await this.existsRaw(key);
    }
    protected existsRaw(_: string): Promise<boolean> {
        throw new Error('Not implemented');
    }

    public async get(key: string): Promise<T> {
        const data = await this.getRaw(key);
        return JSON.parse(data) as T;
    }
    protected getRaw(_: string): Promise<string> {
        throw new Error('Not implemented');
    }

    public async set(key: string, value: T): Promise<void> {
        const data = JSON.stringify(value, null, 2);
        await this.setRaw(key, data);
    }
    protected setRaw(_: string, __: string): Promise<void> {
        throw new Error('Not implemented');
    }
}
