import { Cache } from '../../execution/cache';

export class NoCache<T> extends Cache<T> {
    protected existsRaw(key: string): Promise<boolean> {
        return Promise.resolve(false);
    }
}
