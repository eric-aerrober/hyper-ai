import { Cache } from '../../execution/cache';
import fs from 'fs';

export class CacheOnDisk<T> extends Cache<T> {
    constructor(private prefix: string) {
        super();
        fs.mkdirSync(prefix, { recursive: true });
    }

    protected async existsRaw(key: string): Promise<boolean> {
        const path = `${this.prefix}/${key}`;
        return fs.promises
            .access(path)
            .then(() => true)
            .catch(() => false);
    }

    protected async getRaw(key: string): Promise<string> {
        const path = `${this.prefix}/${key}`;
        return fs.promises.readFile(path, 'utf8');
    }

    protected async setRaw(key: string, value: string): Promise<void> {
        const path = `${this.prefix}/${key}`;
        return fs.promises.writeFile(path, value, 'utf8');
    }
}
