import { OpenAiClientOptions } from "@/types/ai-models";
import { OPENAI_ORGANIZATION } from "@/utils/app/const";
import { ClientOptions, OpenAI } from "openai";

export function getOpenAiClient(apiKey: string, options?: OpenAiClientOptions) {
    if (options?.vendor === 'azure' && !options.modelId)
        console.error('ModelId for Azure Deployment is not defined!')

    const configuration: ClientOptions = {
        apiKey: apiKey,
        ...(!options && {
            organization: OPENAI_ORGANIZATION,
        }),
        ...(options?.vendor === 'openai' && {
            organisation: options.organisation,
            baseURL: options.apiUrl,
        }),
        ...(options?.vendor === 'azure' && {
            defaultHeaders: { 'api-key': apiKey },
            baseURL: `${options.apiUrl}/openai/deployments/${options.modelId}`,
            defaultQuery: { 'api-version': options.apiVersion },
        }),
        ...(options?.vendor === 'fireworks' && {
            baseURL: options.apiUrl,
        }),
    };

    return new OpenAI(configuration);
}
