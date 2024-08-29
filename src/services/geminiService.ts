import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);


function fileToGenerativePart(filePart: any) {
  return {
    inlineData: {
      data: filePart,
      mimeType: "image/*",
    },
  };

}
// Find the text 
export async function findText(filePart: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = "This image contains an water or gas meter, extract the value of the meter, return only the numbers.";
  const image = fileToGenerativePart(filePart);
  const generatedContent = await model.generateContent([prompt, image as any]);
  return generatedContent.response.text()
}
