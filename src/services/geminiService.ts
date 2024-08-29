import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

import dotenv from 'dotenv';
import { determineFileFormat } from "../routes/imageRoutes";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);


const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  }
];

function fileToGenerativePart(filePart: any) {

  const fileFormat = determineFileFormat(filePart);

  return {
    inlineData: {
      data: filePart,
      mimeType: `image/${fileFormat}`,
    },
  };

}
// Find the text 
export async function findText(filePart: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
  const prompt = `
You are supposed to read the numbers from the image.

Images are gas/water meters, and the numbers are the current usage.

Reply ONLY with the numbers you see in the image. If none, reply with "-1".
`;
  const image = fileToGenerativePart(filePart);
  const generatedContent = await model.generateContent([prompt, image as any]);

  return generatedContent.response.text()
}
