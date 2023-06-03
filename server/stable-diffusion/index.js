const axios = require("axios");
const logger = require("../common/logger");
const fs = require("fs");
const path = require("path");
const errorImg = fs.readFileSync(
    path.resolve(__dirname, "./error-icon.png"),
    { encoding: "base64" }
);
const shuffle = require('shuffle-array');

const settings = require("./settings.json");

const host = "https://api.stability.ai";
const engineID = "stable-diffusion-xl-beta-v2-2-2";
const url = `${host}/v1/generation/${engineID}/text-to-image`;

const apikey = process.env.SD_API_KEY;
if(!apikey){
  logger.error("gpt api key is missing");
}

exports.generate = async (seed, prompt) => {
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apikey}`,
    };

    const data = {
        text_prompts: prompt,
        height: 512,
        width: 512,
        samples: 1,
        steps: 50,
        cfg_scale: 10,
        clip_guidance_preset: "FAST_BLUE",
        style_preset: "enhance",
        sampler: "DDIM",
        seed: seed
    }

    const res = await axios.post(
        url, data, {headers: headers}
    ).catch(error => logger.error("stable diffusion request is failed"));
    const base64 = res?.data?.artifacts?.[0]?.base64 ?? errorImg;
    return base64;
}

exports.randomSeed = (num) => {
    const length = num > 1 ? num : 1;
    const seeds = settings.seeds;
    const shuffled = shuffle(seeds);

    return shuffled.slice(0,length);
}

exports.composeBasicPrompt = () => {
    const positiveWords = settings.positive_prompt;
    const negativeWords = settings.negative_prompt;
    const positivePrompt = Object.values(positiveWords).map(words => words.join(", ")).join(", ");
    const negativePrompt = Object.values(negativeWords).map(words => words.join(", ")).join(", ");

    return [
        { text: positivePrompt, weight: 1.0 },
        { text: negativePrompt, weight: -1.0 }
    ];
}