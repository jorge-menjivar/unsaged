import { Conversation } from '@/types/chat';

import { ConversationComponent } from './conversation-component';

interface Props {
  conversations: Conversation[];
}

export const ConversationList = ({ conversations }: Props) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {conversations
        .filter((conversation) => !conversation.folderId)
        .slice()
        .reverse()
        .map((conversation, index) => (
          <ConversationComponent key={index} conversation={conversation} />
        ))}
    </div>
  );
};
