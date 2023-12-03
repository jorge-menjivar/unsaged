import { getImage } from '@/utils/server/ai_vendors/image';

import { ImageBody } from '@/types/chat';

export const runtime = 'edge';

const handler = async (req: Request): Promise<Response> => {
  const { model, prompt, apiKey, params } =
    (await req.json()) as ImageBody;

  const { error: streamError, images } = await getImage(
    model,
    params,
    apiKey,
    prompt
  );

  // if (streamError) {
  //   let message = streamError;

  //   if (message.message) {
  //     message = message.message;
  //   }

  //   console.error(message);

  //   return new Response('Error', {
  //     status: 500,
  //     statusText: message,
  //   });
  // }

  return new Response(JSON.stringify(images), { status: 200 });
};

export { handler as GET, handler as POST };
