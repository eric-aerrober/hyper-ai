# Configure Hyper

The hyper instance supports a few configuration options

```js
const hyper = new Hyper({

    // Log object provides configuration to underlying flame-logs instance
    logs: {
        disabled: false, // disable all logging
    }

    // The integrations to use with the hyper instance
    using: {

        // an instance of a chat-based LLM
        chatBasedLLM: new AnthropicChatBasedLLM({
            apiKey:, // API key for the Anthropic API
            modelId:, // Model ID for the Anthropic API
            cache: new CacheOnDisk('./hyper/cache/chatBasedLLM'), // cache for the chat-based LLM invokes
        }),

        // an instance of an image generator
        imageGenerator: new DalleImageGenerator({
            apiKey:, // API key for the DALL-E-3 API\
            modelId:, // Model ID for the DALL-E-3 API
            cache: new CacheOnDisk('./hyper/cache/imageGenerator'), // cache for the image generator invokes
            saver: new SaveBase64ImgOnDisk('./hyper/results/images'), // how to save the generated images
        }),
    },
    
    // How output should be saved
    save: {
        // how to save the execution data
        executionData: new SaveExecutionDataOnDisk('./hyper/results/executionData'),
    },

})

```

Integrations each include a `cache` option, which can be set to cache invokes of that model.