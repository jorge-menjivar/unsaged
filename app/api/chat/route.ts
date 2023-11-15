import { getStream } from '@/utils/server/ai_vendors/stream';
import { getTokenCount } from '@/utils/server/ai_vendors/token-count';

import { ChatBody } from '@/types/chat';

export const runtime = 'edge';

const handler = async (req: Request): Promise<Response> => {
  const { model, messages, apiKey, systemPrompt, params } =
    (await req.json()) as ChatBody;

  const { error: tokenCountError, count } = await getTokenCount(
    model,
    systemPrompt.content,
    messages,
  );

  if (tokenCountError) {
    console.error(tokenCountError);
    return new Response('Error', {
      status: 500,
      statusText: tokenCountError,
    });
  }

  const { error: streamError, stream } = await getStream(
    model,
    systemPrompt.content,
    params,
    apiKey,
    messages,
    count!,
  );

  if (streamError) {
    let message = streamError;

    if (message.message) {
      message = message.message;
    }

    console.error(message);

    return new Response('Error', {
      status: 500,
      statusText: message,
    });
  }

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream; charset=utf-8' },
  });
};

export { handler as GET, handler as POST };
