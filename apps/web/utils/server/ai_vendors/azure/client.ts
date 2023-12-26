import {
    AZURE_OPENAI_API_URL,
    AZURE_OPENAI_API_VERSION,
} from '@/utils/app/const';
import { OpenAiClientOptions } from "@/types/ai-models";
import { getOpenAiClient } from '../openai';

export async function getClient(apiKey: string, modelId?: string) {
    let options: OpenAiClientOptions = {
        vendor: 'azure',
        apiUrl: AZURE_OPENAI_API_URL,
        modelId: modelId,
        apiVersion: AZURE_OPENAI_API_VERSION,
    }

    return await getOpenAiClient(apiKey, options);
}