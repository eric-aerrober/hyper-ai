# Hyper

A quick and easy AI library for Typescript

## Integrations

Support for the following integrations:

- OpenAI DALL-E-3
- Anthropic Claude

## Example

```js
const hyper = new Hyper({
    using: {
        chatBasedLLM: new AnthropicChatBasedLLM(),
        imageGenerator: new DalleImageGenerator(),
    },
});

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

const results = await h.save()

```

Saves output as json blob for easy access

```js
{
  "start": "2024-04-14T17:38:40.290Z",
  "end": "2024-04-14T17:38:40.296Z",
  "state": {
    "prompt1": "A majestic tabby cat perched on a high branch of an ancient oak tree, surveying its lush green surroundings with a regal gaze.",
    "prompt2": "A curious Siamese kitten playfully climbing the trunk of a blossoming cherry tree, pink petals fluttering around its adorable face."
  },
  "messages": [
    {
      "text": "Generate me two image prompts for cats in trees\nPlease respond as a valid JSON string matching this format: {\"prompt1\":\"prompt1\",\"prompt2\":\"prompt2\"}",
      "from": "user"
    },
    {
      "text": "{\"prompt1\":\"A majestic tabby cat perched on a high branch of an ancient oak tree, surveying its lush green surroundings with a regal gaze.\",\"prompt2\":\"A curious Siamese kitten playfully climbing the trunk of a blossoming cherry tree, pink petals fluttering around its adorable face.\"}",
      "from": "bot"
    }
  ],
  "assets": {
    "cat1": {
      "type": "image",
      "access": "file:///Users/xxxx/hyper-ai/.hyper/results/images/7gnnq66oxpcfbs1953rao.png"
    },
    "cat2": {
      "type": "image",
      "access": "file:///Users/xxxx/.hyper/results/images/ym6f33s1ufbxj7rnxyskr.png"
    }
  }
}
```