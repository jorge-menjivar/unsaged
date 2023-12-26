import { MutableRefObject } from 'react';

import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';

import { storageCreateMessage } from '../../storage/message';

import { v4 as uuidv4 } from 'uuid';

export async function messageReceiver(
  user: User,
  database: Database,
  data: ReadableStream,
  controller: AbortController,
  conversation: Conversation,
  messages: Message[],
  stopConversationRef: MutableRefObject<boolean>,
  dispatch: React.Dispatch<any>,
) {
  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let text = '';

  const assistantMessageId = uuidv4();
  const responseMessage: Message = {
    id: assistantMessageId,
    role: 'assistant',
    content: '',
    timestamp: new Date().toISOString(),
    conversationId: conversation.id,
  };

  const updatedMessages = [...messages, responseMessage];
  dispatch({ field: 'messages', value: updatedMessages });
  const length = updatedMessages.length;
  while (!done) {
    if (stopConversationRef.current === true) {
      controller.abort();
      done = true;
      break;
    }
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);

    text += chunkValue;

    updatedMessages[length - 1].content = text;

    dispatch({ field: 'messages', value: updatedMessages });
  }

  stopConversationRef.current = false;

  updatedMessages.pop();

  responseMessage.content = text;

  dispatch({ field: 'loading', value: false });
  dispatch({ field: 'messageIsStreaming', value: false });

  // Saving the response message
  const finalUpdatedMessages = storageCreateMessage(
    database,
    user,
    responseMessage,
    messages,
  );

  dispatch({
    field: 'messages',
    value: finalUpdatedMessages,
  });
}
