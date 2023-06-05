const sd = require("../stable-diffusion");

exports.generateImage = async (req, res) => {
    const blends = req?.body?.blends ?? [];
    const blendPrompts = blends.map(info => {
        const feature = info?.bean?.feature ?? {};
        const prompt = Object.values(feature).map(words => words.join(", ")).join(", ");

        return {prompt: prompt, ratio: info?.ratio ?? 0};
    });

    const prompt = sd.composeBasicPrompt();
    blendPrompts.forEach( bp => {
        prompt.push({text: bp.prompt, weight: 1+bp.ratio});
    });

    const seeds = sd.randomSeed(4);
    const requests = seeds.map( seed => sd.generate(seed, prompt));

    const base64 = await Promise.all(requests);
    res.status(200).json({base64: base64});
}