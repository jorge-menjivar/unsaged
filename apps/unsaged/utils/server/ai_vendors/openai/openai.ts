import { ClientOptions, OpenAI } from "openai";
import {
    OPENAI_API_KEY,
    OPENAI_API_TYPE,
    OPENAI_API_URL,
    OPENAI_API_VERSION,
    OPENAI_ORGANIZATION,
} from '@/utils/app/const';

export function getOpenAi(apiKey?: string, modelId?: string) {
    if (OPENAI_API_TYPE === 'azure' && modelId)
        console.error('ModelId for Azure Deployment is not defined!')

    const configuration: ClientOptions = {
        apiKey: apiKey ? apiKey : OPENAI_API_KEY,
        organization: OPENAI_ORGANIZATION,
        ...(OPENAI_API_TYPE === 'azure' && {
            baseOptions: {
                headers: {
                    "api-key": apiKey ? apiKey : OPENAI_API_KEY,
                },
            },
            basePath: `${OPENAI_API_URL}/openai/deployments/${modelId}`,
            defaultQueryParams: new URLSearchParams({
                "api-version": OPENAI_API_VERSION,
            }),
        }),
    };

    return new OpenAI(configuration);
}