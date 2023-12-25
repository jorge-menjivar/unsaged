import { GoogleGenerativeAI } from '@google/generative-ai';

export async function getClient(apiKey: string) {
    return new GoogleGenerativeAI(apiKey);;
}