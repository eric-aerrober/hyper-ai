import { FlameLogger } from 'flame-logs';
import { HyperExecution } from './hyper-execution';
import { ChatBasedLLMInterface } from '../interfaces/chat-based-llm';
import { ImageGeneratorAIInterface } from '../interfaces/image-generator';
import { Saver } from '../execution/saver';
import { ChatContext } from './chat-context';
import { SaveExecutionDataOnDisk } from '../implementations/saver/save-chat-on-disk';

export interface HyperProps {
    logs?: any;
    using?: {
        chatBasedLLM?: ChatBasedLLMInterface;
        imageGenerator?: ImageGeneratorAIInterface;
    };
    saving?: {
        executionData?: Saver<any>;
    };
}

export class Hyper {
    private logger: FlameLogger;

    // Invokers
    public readonly chatBasedLLMInvoker: ChatBasedLLMInterface;
    public readonly imageGeneratorInvoker: ImageGeneratorAIInterface;

    // Savers
    public readonly executionDataSaver: Saver<any>;

    constructor(props: HyperProps) {
        this.logger = new FlameLogger(props.logs);
        this.chatBasedLLMInvoker = props.using?.chatBasedLLM as any;
        this.imageGeneratorInvoker = props.using?.imageGenerator as any;
        this.executionDataSaver =
            props.saving?.executionData || new SaveExecutionDataOnDisk('.hyper/results/execution');
    }

    public begin(): HyperExecution {
        this.logger.log('Starting new Hyper execution');
        return new HyperExecution(this, this.logger);
    }
}
