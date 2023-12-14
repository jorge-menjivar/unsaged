import { REPLICATE_API_URL } from '@/utils/app/const';
import Replicate from 'replicate';

export function getReplicateClient(apiKey: string) {
    const configuration = {
        auth: apiKey,
        baseUrl: REPLICATE_API_URL,
    };

    return new Replicate(configuration);
}