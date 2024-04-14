import { Hyper } from '../src';
import { AnthropicChatBasedLLM } from '../src/implementations/chat-based-llm/anthropic';
import { DalleImageGenerator } from '../src/implementations/image-generator/dalle';

const hyper = new Hyper({
    using: {
        chatBasedLLM: new AnthropicChatBasedLLM(),
        imageGenerator: new DalleImageGenerator(),
    },
});

async function main() {
    const h = hyper.begin();

    await h.ask({
        prompt: 'Generate me two image prompts for cats in trees',
        format: {
            prompt1: 'prompt1',
            prompt2: 'prompt2',
        },
    });

    await h.generateImage('cat1', h.state.prompt1);
    await h.generateImage('cat2', h.state.prompt2);

    console.log(await h.save());
}

main();
