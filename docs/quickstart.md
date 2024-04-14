# Get started with this template

Install wth NPM

```bash
npm i hyper-ai
```

Then import and use it in your code:

```js
import { Hyper, AnthropicChatBasedLLM, DalleImageGenerator } from 'hyper-ai';

// Setup a new hyper instance
const hyper = new Hyper({
    using: {
        chatBasedLLM: new AnthropicChatBasedLLM(),
        imageGenerator: new DalleImageGenerator(),
    },
});
```

# Example Usage

```js
// Start a new session with hyper
const h = hyper.begin();

// Interact with the session
// Interactions implicitly use the integrations specified in the hyper instance
await h.ask({
    prompt: 'Generate me two image prompts for cats in trees',
    format: {
        prompt1: 'prompt1',
        prompt2: 'prompt2',
    },
});

// The 'state' of the session is updated with the responses
// You can access the state at any time for follow-up interactions
await h.generateImage('cat1', h.state.prompt1);

// When you are done, save the session, which will result in a JSON blob
const results = await h.save()
```