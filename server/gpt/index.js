const { Configuration, OpenAIApi } = require("openai");
const logger = require("../common/logger");

const apikey = process.env.GPT_API_KEY;
if(!apikey){
  logger.error("gpt api key is missing");
}
const configuration = new Configuration({ apiKey: apikey });
const openai = new OpenAIApi(configuration);

exports.ask = async (prompt) => {
  if(apikey){
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: prompt}],
    }).catch( error => { logger.error("chat gpt completion failed"); });

    const message = completion?.data?.choices?.[0]?.message?.content ?? "error";
    return message;
  }
  else{
    return "error";
  }
}