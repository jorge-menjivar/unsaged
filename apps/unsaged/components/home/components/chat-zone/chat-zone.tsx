import { useContext, useRef } from 'react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import HomeContext from '@/components/home/home.context';

import ChatZoneContext from './chat-zone.context';
import { ChatZoneInitialState, initialState } from './chat-zone.state';
import { Chat } from './screen/chat/chat';
import { Settings } from './screen/settings/settings';

export const ChatZone = () => {
  const chatBarContextValue = useCreateReducer<ChatZoneInitialState>({
    initialState,
  });

  const {
    state: { display, showPrimaryMenu, showSecondaryMenu },
  } = useContext(HomeContext);

  const stopConversationRef = useRef<boolean>(false);

  return (
    <ChatZoneContext.Provider value={chatBarContextValue}>
      <div
        className={`relative sm:flex flex-1 ${
          showPrimaryMenu || showSecondaryMenu ? 'hidden' : 'flex'
        }`}
      >
        {display == 'settings' && <Settings />}
        {display == 'chat' && (
          <Chat stopConversationRef={stopConversationRef} />
        )}
      </div>
    </ChatZoneContext.Provider>
  );
};
