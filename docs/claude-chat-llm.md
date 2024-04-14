# Anthropic Chat-Based LLM

The Anthropic Chat-Based LLM is a chat-based language model that uses the Anthropic API. It is an instance of the `ChatBasedLLM` class from the `hyper` package.

## Usage

```js
new AnthropicChatBasedLLM({
    apiKey, // API key for the Anthropic API, uses the `ANTHROPIC_API_KEY` environment variable if not provided
    modelId, // Model ID for the Anthropic API, uses 'claude-3-opus-20240229' if not provided
    cache, // cache for the chat-based LLM invokes, uses `CacheOnDisk` if not provided
}
```