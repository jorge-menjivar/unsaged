import Anthropic from '@anthropic-ai/sdk';

export function getAnthropicClient(apiKey: string) {
    const configuration = {
        apiKey: apiKey,
    };

    return new Anthropic(configuration);
}