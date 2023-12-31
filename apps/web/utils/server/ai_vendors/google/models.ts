import { GetAvailableAIModelResponse } from '@/types/ai-models';
import { getModelSettings } from '../models';
import { DEBUG_MODE, GOOGLE_API_KEY, GOOGLE_API_URL } from '@/utils/app/const';

export const config = {
  runtime: 'edge',
};

export async function getAvailableGoogleModels(apiKey: string): Promise<GetAvailableAIModelResponse> {
  if (GOOGLE_API_URL == '') {
    return { data: [] };
  }

  if (!apiKey) {
    if (!GOOGLE_API_KEY) {
      return { data: [] };
    } else {
      apiKey = GOOGLE_API_KEY;
    }
  }

  try {
    const url = `${GOOGLE_API_URL}/models?key=${GOOGLE_API_KEY}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      const error = await response.text();
      console.error('Error fetching Google models', response.status, error);
      return { data: [] };
    }

    const json = await response.json();
    const { data: modelSettings } = await getModelSettings('Google');

    const models = json.models.map((googleModel: any) => {
      const model_name = googleModel.name;
      const model = modelSettings.find(m => m.name === model_name);

      if (!model) {
        if (DEBUG_MODE)
          console.warn('Google model not implemented:', model_name);

        return null;
      }

      return model;
    });

    // Drop null values
    const modelsWithoutNull = models.filter(Boolean);

    return { data: modelsWithoutNull };
  } catch (error) {
    console.error('Error fetching Google models ' + error);
    return { data: [] };
  }
}
