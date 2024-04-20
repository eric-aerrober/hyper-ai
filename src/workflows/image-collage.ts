import { Hyper } from "../framework/hyper";

export async function GenerateImageCollage (hyper: Hyper, idea: string) {

    const h = hyper.begin();
    h.updateState({ idea });

    h.tell(`
        We will be generating a collection of related images for a given idea provided by the user.
        These images will form a coherent set of images that are related to the idea.

        The initial idea is: ${h.state.idea}
    `)

    await h.ask({
        prompt: `
            First we will work to explore the idea and try to turn it into a general concept for the images.
            Some examples of this below for what concepts could be created for various ideas:
            
            Idea: "Countries represented as monsters"
            Concept1: 
                - For each country, we create a mythical creature that represents that country's culture and history. 
                - Each creature is perceved as scarry and powerful, but also beautiful and unique. 
                - The collection focuses on making each picture hyper-realistic, mysterious, we ask the user which one they could beat in a fight.
            Concept2:
                - For each country, we choose the countries national animal and draw it as a very cute and friendly cartoon character.
                - We then add in a few changes to make the animal look more like a monster, such as adding extra eyes or teeth or horns. Staying cute is key.
                - Each image has a blank background and is drawn in a simple, cartoonish style. We ask the users which country monster they would want as a pet.

            Idea: $1 vs $1 Million meals
            Concept1:
                - We start with increasing orders of money, from $1 to $1 million ($1, $10, $100, $1000, $10000, $100000, $1000000) . . .
                - For each amount, we describe a meal that could be bought with that amount of money.
                - We then draw a picture of each meal, each one getting more and more extravagant as the amount of money increases. We ask the user which one is the best value.

            When considering the concept, also consider the style of the images and how they should be formatted. Here are some unique styles that could inspire you. Feel free to use these or come up with your own:
            - Drawn in a cartoonish style with bright colors
            - Shot from a low angle with a wide lens on a cannon camera
            - Hand drawn by a japenese calligrapher with ink and brush
            - Superimposed on a background of a starry night sky
            - Surreal and dreamlike made by paper machet and photographed in a dark room with a single light source
            - Cave paintings made with chalk on a blackboard
            - Stainless steel sculptures of each subject, photographed in a white room with a single light source
            - Sudio ghilbi style, with soft pastel colors and a focus on nature and the environment
            - Die cut stickers of each subject, photographed on a white background
                
            Each concept should give rise to a generation function of some sort. IE: "for each x, do y". This makes it easy to generate a collection of images that are related to the idea.
            Each concept should also include a description of how the images should be formated and what the whole collection should feel like.
            Each concept should include a call to action for the user to engage with the images in some way. Make the user want to see the images and interact with them. Options here are like "Which dish are you eating?", "Who is winning the fight", "Which monster would you want as a pet?", etc.
        `,
        format: `
            {
                idea: string // re-state the idea in your own words
                concept1: {
                    description: string // describe the concept in your own words, write a few sentences
                    generationFunction: string // describe the generation function in your own words
                    styleDescription: string // describe the style of the images in your own words
                    callToAction: string // describe how the user should engage with the images in your own words
                },
                concept2: {
                    description: string // describe the concept in your own words, write a few sentences
                    generationFunction: string // describe the generation function in your own words
                    styleDescription: string // describe the style of the images in your own words
                    callToAction: string // describe how the user should engage with the images in your own words
                },
                concept3: {
                    description: string // describe the concept in your own words, write a few sentences
                    generationFunction: string // describe the generation function in your own words
                    styleDescription: string // describe the style of the images in your own words
                    callToAction: string // describe how the user should engage with the images in your own words
                }
            }
        `
    });

    await h.ask({
        prompt: `
            Choose which concept you think is the most interesting. Interesting here means a few things:

            - The concept feels unique and soemthing that does not feel generic or overdone.
            - The concept ties into its call strongly and makes the user want to engage with the images.
            - The concept has a clear generation function that can be used to create a collection of images.

            Once the concept is chosen, we are going to use the generation function to create a collection of subjects.
            For the subjects you generate, make sure they are each unique and interesting in their own way.
            Aim for 7-14 subjects in the collection.

            Additionally, we are going to lock down the "style" of the image. 
            Each image in the collection should be styialized in the same way, layong out the same way, and have the same feel to them.

        `,
        format: `
            {
                chosenConcept: string // the name of the chosen concept,
                subjects: {
                    [subject-short-name: string]: {
                        description: string // a short name for the subject and a longer detailed description of the subject
                        keywords: string[] // a list of keywords that describe the subject and why it is different from other subjects
                    }
                },
                style: {
                    description: string // describe the style of the images in your own words,
                    properties: {
                        [property: string]: string // properties that should be the same for each image
                        // IE: background: pure white if all images have a white background. If the background changes, dont include it here.
                        // IE: lighting: 'soft and warm with realistic shadows'
                        // IE: style: 'shot from a low angle with a wide lens on a cannon camera' or 'drawn in a cartoonish style with bright colors'
                        // IE: perspective: 'shot from a low angle with a wide lens on a cannon camera', 'first person perspective', 'front-on 2D perspective', 'top-down strategy game perspective'
                        // atleast 8 properties should be included here, consider these: 'perspective', 'lighting', 'style', 'background', 'color scheme', 'medium', 'composition', or others if you prefer.
                    },
                    detailedProperties: {
                        // Properties like "drawn in a cartoonish style" can be interpreted in many ways.
                        // Since each image should be the same, we need to be very specific about what this means.
                        // For each property above, abstract it into a detailed description of what it means.
                        // IE: style: 'drawn in a cartoonish style' -> style: 'drawn in 2D vector art with bright primary colors and thick black outlines around each object. No shadows or gradients are used. Sharp, clean lines are used to define the shapes of objects.'
                    }
                },
                title: string // the title of the collection, this should be a short, catchy title that makes use of the call to action from the concept to help engage with users. IE: "Which monster would you want as a pet?"
            }
        `})

    await h.ask({
        prompt: `
            Now we will build a "base image" for the generation. The base image will be used as additional input into the image generation process. This image, in addition to a prompt per subject, will be used to generate the final images.

            The goal for this image is to capture a shared "feeling" or "vibe" that all the images in the collection should have. This could be a color scheme, a texture, a pattern, or a general feel that the images should have.

            Use the 'detailed properties' and properties from above as the image prompt. Make sure the base image captures the feeling of the collection as it will be used to generate the future images. Describe an image with key symbols, colors, and shapes that will be used in the collection.
        `,
        format: `
            {
                baseImagePrompt: string 
            }
        `
    })

    const baseImage = await h.generateImage('base-style-image', h.state.baseImagePrompt)

    await h.ask({
        prompt: `
            Now that we have the subjects and the style locked down, we can begin generating the images.

            For each subject, we will generate an image that fits the style and concept we have chosen.

            Include the following in order for your prompts:
                - The subject of the image
                - The attributes of the subject that make it unique
                - The detailed style properties to make sure the image fits the collection, this is most important and should be highly detailed.
                - The overarching style of the image and its feel

            Let's start generating the images!
        `,
        format: `
            {
                prompts: {
                    [subject-short-name: string]: string // the prompt to generate this image
                }
            }
        `
    })

    await h.generateImagesFromImages(Object.values(h.state.prompts).map( a=> (
        { imageUrl: baseImage.accessUrl, prompt: a as string, strength: 0.15 }
    )))
}