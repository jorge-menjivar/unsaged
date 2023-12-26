import { useCreateReducer } from '@/hooks/useCreateReducer';

import ChatZoneContext from './chat-zone.context';
import { ChatZoneInitialState, initialState } from './chat-zone.state';
import { Chat } from './screen/chat/chat';
import { Settings } from './screen/settings/settings';

import { useDisplay } from '@/providers/display';

export const ChatZone = () => {
  const chatBarContextValue = useCreateReducer<ChatZoneInitialState>({
    initialState,
  });

  const { showPrimaryMenu, showSecondaryMenu, display } = useDisplay();

  return (
    <ChatZoneContext.Provider value={chatBarContextValue}>
      <div
        className={`relative sm:flex flex-1 w-full overflow-hidden ${
          showPrimaryMenu || showSecondaryMenu ? 'hidden' : 'flex'
        }`}
      >
        {display == 'settings' && <Settings />}
        {display == 'chat' && <Chat />}
      </div>
    </ChatZoneContext.Provider>
  );
};
