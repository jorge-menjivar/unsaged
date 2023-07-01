import { MutableRefObject } from 'react';

import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';

import { storageCreateMessage } from '../../storage/message';
import { saveSelectedConversation } from '../../storage/selectedConversation';
import { getTimestampWithTimezoneOffset } from '../../time/time';

import { v4 as uuidv4 } from 'uuid';

export async function messageReceiver(
  user: User,
  database: Database,
  data: ReadableStream,
  controller: AbortController,
  conversation: Conversation,
  conversations: Conversation[],
  stopConversationRef: MutableRefObject<boolean>,
  homeDispatch: React.Dispatch<any>,
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
    timestamp: getTimestampWithTimezoneOffset(),
  };
  conversation.messages.push(responseMessage);
  const length = conversation.messages.length;
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

    conversation.messages[length - 1].content = text;

    homeDispatch({
      field: 'selectedConversation',
      value: conversation,
    });
  }

  conversation.messages.pop();

  responseMessage.content = text;

  homeDispatch({ field: 'loading', value: false });
  homeDispatch({ field: 'messageIsStreaming', value: false });

  // Saving the response message
  const { single, all } = storageCreateMessage(
    database,
    user,
    conversation,
    responseMessage,
    conversations,
  );

  homeDispatch({
    field: 'selectedConversation',
    value: single,
  });

  homeDispatch({ field: 'conversations', value: all });
  saveSelectedConversation(user, single);
}
