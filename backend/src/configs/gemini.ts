import { ai } from "../lib/gemini.js";




export async function ai_call(data: string) {
  const response = await ai.models.generateContent({
    model:process.env.MODEL_ID as string,
    contents: data,
  });

  // console.log(response.text);
  return response;
}

