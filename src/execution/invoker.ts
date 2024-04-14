import crypto from 'crypto';
import { Cache } from './cache';
import { HyperExecution } from '../framework/hyper-execution';
import { NoCache } from '../implementations/cache/no-cache';

export interface InvokerProps<ResultType> {
    cache?: Cache<ResultType>;
}

export class Invoker<InputType, ResultType> {
    private cache: Cache<ResultType>;

    constructor(props: InvokerProps<ResultType> = {}) {
        this.cache = props.cache || new NoCache();
    }

    protected getName(): string {
        throw new Error('Not implemented');
    }

    public async invoke(input: InputType, execution: HyperExecution): Promise<ResultType> {
        const key = crypto
            .createHash('sha256')
            .update(this.getName())
            .update(JSON.stringify(input))
            .digest('hex');

        const exists = await this.cache.exists(key);

        if (exists) {
            execution.log.log(`Cache hit for invoke of '${this.getName()}'`);
            return await this.cache.get(key);
        } else {
            const result = await execution.log.jobWithRetries(`Invoke of '${this.getName()}'`, () =>
                this.onInvoke(input)
            );
            await this.cache.set(key, result);
            return result;
        }
    }

    protected onInvoke(input: InputType): Promise<ResultType> {
        throw new Error('Not implemented');
    }
}
