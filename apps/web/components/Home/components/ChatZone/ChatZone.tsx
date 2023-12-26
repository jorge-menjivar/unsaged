import { useContext, useRef } from 'react';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import HomeContext from '@/components/Home/home.context';

import ChatZoneContext from './ChatZone.context';
import { ChatZoneInitialState, initialState } from './ChatZone.state';
import { Chat } from './Screens/Chat/Chat';

export const ChatZone = () => {
  const chatBarContextValue = useCreateReducer<ChatZoneInitialState>({
    initialState,
  });

  const {
    state: { showPrimaryMenu, showSecondaryMenu },
  } = useContext(HomeContext);

  const stopConversationRef = useRef<boolean>(false);

  return (
    <ChatZoneContext.Provider value={chatBarContextValue}>
      <div
        className={`relative sm:flex flex-1 ${showPrimaryMenu || showSecondaryMenu ? 'hidden' : 'flex'
          }`}
      >
        <Chat stopConversationRef={stopConversationRef} />
      </div>
    </ChatZoneContext.Provider>
  );
};
