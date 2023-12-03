import {
    OPENAI_API_KEY,
} from '@/utils/app/const';

import { AiModel, ModelParams } from '@/types/ai-models';

import { getOpenAi } from './openai';
import { ImageGenerateParams } from 'openai/resources';

export async function imageOpenAI(
    model: AiModel,
    params: ModelParams,
    apiKey: string | undefined,
    prompt: string,
) {
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

    const openai = await getOpenAi(apiKey);

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

    const res = await openai.images.generate(body);

    return { images: res.data };
}
