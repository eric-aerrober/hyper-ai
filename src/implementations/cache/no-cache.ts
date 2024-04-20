import { Cache } from '../../execution/cache';

export class NoCache<T> extends Cache<T> {
    protected existsRaw(key: string): Promise<boolean> {
        return Promise.resolve(false);
    }
    protected setRaw(_: string, __: string): Promise<void> {
        return Promise.resolve();
    }
}
