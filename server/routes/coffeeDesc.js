const gpt = require("../gpt");

const composePrompt = (beanRatio, onlyBean) =>{
    return `I plan to blend ${beanRatio} to make an original blend of coffees.
    Please predict the taste and aroma of that blend using the characteristics of ${onlyBean} coffees.
    In your predictions, please describe the taste and aroma of the coffee blend by comparing it to other ingredients.
    The description of the characteristics of each coffee should be no more than 200 characters, and the total length of the prediction should be no more than 300 characters.
    Please output only the taste prediction and nothing else.`;
}

exports.generateDesc = async (req, res) => {
    const blends = req?.body?.blends ?? [];

    let beanRatioText;
    let onlyBeanText;
    if(blends.length === 0){
        res.status(400).json({msg: "blend is not specified"});
    }else if(blends.length === 1){
        const name = blends[0].bean?.name ?? "";
        beanRatioText = `${name} coffee`;
        onlyBeanText = `${name} coffee`;

        const prompt = composePrompt(beanRatioText,onlyBeanText);
        const reply = await gpt.ask(prompt);
        res.status(200).json({desc: reply});
    }else{
        const lastBean = blends.at(-1);
        beanRatioText = blends.map(info =>`${info?.ratio ?? 0}}% ${info?.bean?.name ?? ""}`)
                            .slice(0,-1).join(" coffee, ");
        beanRatioText += `, ${lastBean.ratio ?? 0}% ${lastBean.bean?.name ?? ""} coffee`;
        onlyBeanText = blends.map(info => info?.bean?.name ?? "").slice(0,-1).join(" coffee, ");
        onlyBeanText += `, ${lastBean.bean?.name ?? ""} coffee`;

        const prompt = composePrompt(beanRatioText,onlyBeanText);
        const reply = await gpt.ask(prompt);
        res.status(200).json({desc: reply});
    }
}