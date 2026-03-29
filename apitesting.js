import OpenAI from "openai";

/*const client = new OpenAI({
  apiKey: "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"
});*/

async function askGPT() {
  const response = await client.responses.create({
    model: "gpt-5.2",
    input: "Explain promises in JavaScript in simple words"
  });

  console.log(response.output_text);
}

askGPT();