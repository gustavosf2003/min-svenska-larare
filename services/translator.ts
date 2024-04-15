import { TranslationType } from "@/types/translation";
import axios from "axios";

async function translate(
  word: string,
  sourceLocale: string,
  targetLanguage: string,
): Promise<TranslationType> {
  try {
    const result = await axios.get("http://localhost:3030", {
      params: {
        text: word,
        sourceLang: sourceLocale,
        targetLang: targetLanguage,
      },
    });
    return result.data as TranslationType;
  } catch (error) {
    console.log(error);
  }
  return {} as TranslationType;
}

const translatorService = { translate };

export default translatorService;
