# Image Collage workflow

Take in a prompt and build out a collection of images from that initial prompt idea. Gives 7 to 10 images that are related to the prompt which form a single cohesive image collage.

```js
const hyper = new Hyper({
    using: {
        imageGenerator: new StabilityAiImageGenerator(),
        chatBasedLLM: new AnthropicChatBasedLLM(),
        imageToImageGenerator: new StabilityImageToImageAiImageGenerator()
    },
    publishing: {
        executionData: new SaveToOutputDirectory('./out')
    }
})

GenerateImageCollage(hyper, "Countries as food")
```