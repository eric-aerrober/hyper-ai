import { FlameLogger } from 'flame-logs';
import { HyperExecution } from './hyper-execution';
import { ChatBasedLLMInterface } from '../interfaces/chat-based-llm';
import { ImageGeneratorAIInterface } from '../interfaces/image-generator';
import { Saver } from '../execution/saver';
import { SaveExecutionDataOnDisk } from '../implementations/saver/save-chat-on-disk';
import { ImageToImageGeneratorAIInterface } from '../interfaces/image-to-image-generator';

export interface HyperProps {
    logs?: any;
    using?: {
        chatBasedLLM?: ChatBasedLLMInterface;
        imageGenerator?: ImageGeneratorAIInterface;
        imageToImageGenerator?: ImageToImageGeneratorAIInterface;
    };
    saving?: {
        executionData?: Saver<any>;
    };
    publishing?: {
        executionData?: Saver<any>;
    };
}

export class Hyper {
    private logger: FlameLogger;

    // Invokers
    public readonly chatBasedLLMInvoker: ChatBasedLLMInterface;
    public readonly imageGeneratorInvoker: ImageGeneratorAIInterface;
    public readonly imageToImageGeneratorInvoker: ImageToImageGeneratorAIInterface;

    // Savers
    public readonly executionDataSaver: Saver<any>;
    public readonly executionDataPublisher: Saver<any>;

    constructor(props: HyperProps) {
        this.logger = new FlameLogger({
            defaultRetries: 0,
            ...props.logs,
        });
        this.chatBasedLLMInvoker = props.using?.chatBasedLLM as any;
        this.imageGeneratorInvoker = props.using?.imageGenerator as any;
        this.imageToImageGeneratorInvoker = props.using?.imageToImageGenerator as any;
        this.executionDataSaver =
            props.saving?.executionData || new SaveExecutionDataOnDisk('.hyper/results/execution');
        this.executionDataPublisher = props.publishing?.executionData as any;
    }

    public begin(): HyperExecution {
        this.logger.log('Starting new Hyper execution');
        return new HyperExecution(this, this.logger);
    }
}
