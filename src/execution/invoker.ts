import { Cache } from './cache';
import { hash } from '../utils/random'
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
        const key = hash(this.getName() + JSON.stringify(input))
        const exists = await this.cache.exists(key);

        if (exists) {
            execution.tasks.logTask(execution.rootTask, `Cache hit for invoke of '${this.getName()}'`);
            return await this.cache.get(key);
        } else {
            const result = await execution.tasks.runWithRetries(`Invoke of '${this.getName()}'`, 5, () =>
                this.onInvoke(input, execution)
            );
            await this.cache.set(key, result);
            return result;
        }
    }

    protected onInvoke(input: InputType, execution: HyperExecution): Promise<ResultType> {
        throw new Error('Not implemented');
    }
}
