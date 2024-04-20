import { randomId } from "../utils/random";

export enum TaskType {
    start = 'start',
    log = 'log',
    error = 'error',
    pause = 'pause',
    resume = 'resume',
    end = 'end',
}

export interface TaskEvent {
    id: string;
    type: TaskType;
    relativeTime?: number;
    message: string;
}

export interface TaskItem {
    id: string;
    name: string;
    start: number;
    events: TaskEvent[];
}

export type TaskProps = {
    onTaskEvent: (taskEvent: TaskEvent) => void;
};

export class Tasks {

    // Tasks
    private tasks: Record<string, TaskItem> = {};

    // Handlers    
    private onTaskEvent : (taskEvent: TaskEvent) => void;

    constructor (props: TaskProps) {
        this.onTaskEvent = props.onTaskEvent;
    }
    
    private recordTaskEvent(taskId: string, type: TaskType, message: string) {
        const task = this.tasks[taskId];
        const event: TaskEvent = {
            id: taskId,
            type,
            message,
            relativeTime: Date.now() - task.start,
        };
        task.events.push(event);
        this.onTaskEvent(event);
    }

    public startTask(name: string): string {
        const id = randomId();
        this.tasks[id] = {
            id,
            name,
            start: Date.now(),
            events: [],
        };
        this.recordTaskEvent(id, TaskType.start, name);
        return id;
    }

    public logTask(taskId: string, message: string) {
        this.recordTaskEvent(taskId, TaskType.log, message);
    }

    public errorTask(taskId: string, message: string) {
        this.recordTaskEvent(taskId, TaskType.error, message);
    }

    public pauseTask(taskId: string, timeout: number) {
        this.recordTaskEvent(taskId, TaskType.pause, `Delayed for ${timeout} milliseconds`);
    }

    public resumeTask(taskId: string) {
        this.recordTaskEvent(taskId, TaskType.resume, 'Retrying execution');
    }

    public endTask(taskId: string) {
        this.recordTaskEvent(taskId, TaskType.end, 'Completed');
    }

    public getTask(taskId: string) {
        return this.tasks[taskId];
    }

    public async runWithRetries (name: string, retries: number, fn: () => Promise<any>) {
        const taskId = this.startTask(name);
        for (let i = 0; i <= retries; i++) {
            try {
                const result = await fn();
                this.endTask(taskId);
                return result;
            } catch (e: any) {
                this.errorTask(taskId, e.message);
                if (i < retries) {
                    const delayTime = 1000 * Math.pow(2, i);
                    this.pauseTask(taskId, delayTime);
                    await new Promise(resolve => setTimeout(resolve, delayTime));
                    this.resumeTask(taskId);
                } else {
                    this.endTask(taskId);
                    throw e;
                }
            }
        }
    }
    
}