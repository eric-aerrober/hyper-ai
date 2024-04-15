# Stability AI Image to Image

The Stability AI Image Generator uses the stability stable diffusion model to generate images from images

## Usage

```js
new StabilityImageToImageAiImageGenerator({
    apiKey, // API key for the Anthropic API, uses the `STABILITY_AI_API_KEY` environment variable if not provided
    engineId, // Model ID for the Anthropic API, uses 'stable-diffusion-xl-1024-v1-0' if not provided
    cache, // cache for the chat-based LLM invokes, uses `CacheOnDisk` if not provided
    saver, // how to save the generated images, uses `SaveBase64ImgOnDisk` if not provided
})
```


```js
const hyper = new Hyper({
    using: {
        imageToImageGenerator: new StabilityImageToImageAiImageGenerator()
    }
})

const h = hyper.begin();

await h.generateImagesFromImage({ 
    imageUrl: anotherImage.accessUrl, 
    prompt: prompt,
    strength: 0.15 
})
```