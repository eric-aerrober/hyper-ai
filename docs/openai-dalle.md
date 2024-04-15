# OpenAI DALL-E

The `DalleImageGenerator` class is an integration for the Hyper instance that provides an interface to the OpenAI DALL-E API from OpenAI. It can be used to generate images from text prompts.

## Usage

```js
new DalleImageGenerator({
    apiKey, // API key for the Anthropic API, uses the `OPENAI_API_KEY` environment variable if not provided
    modelId, // Model ID for the Anthropic API, uses 'claude-3-opus-20240229' if not provided
    cache, // cache for the chat-based LLM invokes, uses `CacheOnDisk` if not provided
    saver, // how to save the generated images, uses `SaveBase64ImgOnDisk` if not provided
})
```