import {
    OPENAI_API_URL,
    OPENAI_ORGANIZATION,
} from '@/utils/app/const';
import { OpenAiClientOptions } from "@/types/ai-models";
import { getOpenAiClient } from '../openai';

export async function getClient(apiKey: string) {
    let options: OpenAiClientOptions | undefined = undefined;
    if (OPENAI_API_URL) {
        options = {
            vendor: 'openai',
            organisation: OPENAI_ORGANIZATION,
            apiUrl: OPENAI_API_URL
        }
    }

    return await getOpenAiClient(apiKey, options);
}