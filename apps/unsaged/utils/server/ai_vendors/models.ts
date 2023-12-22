import { AiModel, GetAvailableAIModelResponse, vendors } from '@/types/ai-models';

export const config = {
    runtime: 'edge',
};

export async function getModelSettings(vendor?: string): Promise<GetAvailableAIModelResponse> {
    let url = `https://ai-services-web.vercel.app/api/models${vendor ? `?vendor=${vendor}` : ''}`;

    const res = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (res.status !== 200) {
        console.error('Error fetching available models', res.status, res.body);
        return { error: res.status, data: [] };
    }

    const json = await res.json();
    const responseData = json.data;

    const models: (AiModel | null)[] = responseData.filter((m: any) => m.params)
        .map((aiModel: any) => {
            if (vendors.indexOf(aiModel.vendor.name) >= 0) {
                const { maxLength, tokenLimit, requestLimit } = aiModel.params;
                const model: AiModel = {
                    id: aiModel.name,
                    name: aiModel.name,
                    ...(aiModel.type === 'text' && {
                        maxLength: maxLength,
                        tokenLimit: tokenLimit,
                        requestLimit: requestLimit,
                    }),
                    vendor: aiModel.vendor.name,
                    type: aiModel.type
                }

                return model;
            }

            return null;
        });

    // Drop null values
    const modelsWithoutNull = models.filter(Boolean);

    return { data: modelsWithoutNull };
}
