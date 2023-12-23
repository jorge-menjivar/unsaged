import {
    OPENAI_API_KEY,
} from '@/utils/app/const';

import { AiModel, ModelParams } from '@/types/ai-models';

import { getOpenAiApi } from './openai';
import { ImageGenerateParams } from 'openai/resources';
import OpenAI from 'openai';

export async function imageOpenAI(
    model: AiModel,
    params: ModelParams,
    apiKey: string | undefined,
    prompt: string,
): Promise<{ error?: any, images?: any[] }> {
    if (model.type != 'image') {
        return { error: 'Image generation is only available for model type image' };
    }

    if (!apiKey) {
        if (!OPENAI_API_KEY) {
            return { error: 'Missing API key' };
        } else {
            apiKey = OPENAI_API_KEY;
        }
    }

    const openai = await getOpenAiApi(apiKey, model.id);

    const body: ImageGenerateParams = {
        model: model.id,
        prompt,
        size: params.size,
        response_format: params.response_format || "url",
        n: params.n || 1,
    }

    if (model.id !== 'dall-e-3') {
        body.quality = params.quality || "standard";
        body.style = params.style || 'natural';
    }

    return openai.images.generate(body).then(({ data }) => {
        return { images: data };
    }).catch((err) => {
        if (err instanceof OpenAI.APIError) {
            console.error(err.status, err.error);
            return { error: err.error };
        } else {
            throw err;
        }
    });
}
