import { Hyper } from '../src';
import { CacheOnDisk } from '../src/implementations/cache/cache-on-disk';
import { AnthropicChatBasedLLM } from '../src/implementations/chat-based-llm/anthropic';

it('should pass', async () => {
    const hyper = new Hyper({
        logs: {
            disabled: true,
        },
        using: {
            chatBasedLLM: new AnthropicChatBasedLLM({
                cache: new CacheOnDisk('.hyper/cache/anthropic'),
            }),
        },
    });

    const h = hyper.begin();
    await h.ask('what is 10 * 10?');
    console.log(h.state);
});
