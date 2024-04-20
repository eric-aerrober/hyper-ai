import { HyperExecution } from './hyper-execution';
import { ChatBasedLLMInterface } from '../interfaces/chat-based-llm';
import { ImageGeneratorAIInterface } from '../interfaces/image-generator';
import { Saver } from '../execution/saver';
import { ImageToImageGeneratorAIInterface } from '../interfaces/image-to-image-generator';
import { Tasks } from './tasks';

export interface HyperProps {
    using?: {
        chatBasedLLM?: ChatBasedLLMInterface;
        imageGenerator?: ImageGeneratorAIInterface;
        imageToImageGenerator?: ImageToImageGeneratorAIInterface;
    };
    saving?: {
        executionData?: Saver<any>;
    };
    events?: {
        onTaskEvent?: (taskEvent: any) => void;
    };
}

export class Hyper {

    // Invokers
    public readonly chatBasedLLMInvoker: ChatBasedLLMInterface;
    public readonly imageGeneratorInvoker: ImageGeneratorAIInterface;
    public readonly imageToImageGeneratorInvoker: ImageToImageGeneratorAIInterface;

    // Savers
    public readonly executionDataSaver: Saver<any>;

    // Task listening
    public readonly tasks: Tasks

    constructor(props: HyperProps) {
        this.chatBasedLLMInvoker = props.using?.chatBasedLLM as any;
        this.imageGeneratorInvoker = props.using?.imageGenerator as any;
        this.imageToImageGeneratorInvoker = props.using?.imageToImageGenerator as any;
        this.executionDataSaver = props.saving?.executionData as any
        this.tasks = new Tasks({
            onTaskEvent: props.events?.onTaskEvent as any || (() => {}),
        });
    }

    public begin(): HyperExecution {
        return new HyperExecution(this);
    }
}
