import { FC, memo } from 'react';

import { ChatMessage, Props } from './chat-message';

export const MemoizedChatMessage: FC<Props> = memo(
  ChatMessage,
  (prevProps, nextProps) =>
    prevProps.message.content === nextProps.message.content,
);
