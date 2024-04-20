import { Saver, SaverResult } from '../../execution/saver';
import { randomId } from '../../utils/random';

export class SaveExecutionDataInBrowser extends Saver<any> {

    constructor(private prefix: string) {
        super();
    }

    protected async saveRaw(value: any): Promise<SaverResult> {

        // Save data to browser
        const data = JSON.stringify(value, null, 2);
        const id = randomId();
        const url = `local::${this.prefix}/${id}`;
        localStorage.setItem(url, data);

        // Save execution to list
        const executionList = localStorage.getItem('executions');
        const executions = executionList ? JSON.parse(executionList) : [];
        executions.push(url);
        localStorage.setItem('executions', JSON.stringify(executions));

        return { accessUrl: url };
    }
}
