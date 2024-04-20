import { Cache } from "../../execution/cache";

export class CacheInLocalStorage<T> extends Cache<T> { 
    
    constructor() {
        super();
    }

    protected async existsRaw(key: string): Promise<boolean> {
        return localStorage.getItem(key) !== null;
    }

    protected async getRaw(key: string): Promise<string> {
        return localStorage.getItem(key)!;
    }

    protected async setRaw(key: string, value: string): Promise<void> {
        localStorage.setItem(key, value);
    }
}