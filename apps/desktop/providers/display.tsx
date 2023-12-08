import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  localGetShowPrimaryMenu,
  localGetShowSecondaryMenu,
} from '@/utils/app/storage/local/ui-state';
import { error } from '@/utils/logging';

export const DisplayContext = createContext<{
  display: 'chat' | 'settings';
  setDisplay: (display: 'chat' | 'settings') => void;
  showPrimaryMenu: boolean;
  setShowPrimaryMenu: (showPrimaryMenu: boolean) => void;
  showSecondaryMenu: boolean;
  setShowSecondaryMenu: (showSecondaryMenu: boolean) => void;
  messageIsStreaming: boolean;
  setMessageIsStreaming: (messageIsStreaming: boolean) => void;
}>({
  display: 'chat',
  setDisplay: () => {},
  showPrimaryMenu: true,
  setShowPrimaryMenu: () => {},
  showSecondaryMenu: true,
  setShowSecondaryMenu: () => {},
  messageIsStreaming: false,
  setMessageIsStreaming: () => {},
});

export const DisplayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [display, setDisplay] = useState<'chat' | 'settings'>('chat');
  const [showPrimaryMenu, setShowPrimaryMenu] = useState<boolean>(true);
  const [showSecondaryMenu, setShowSecondaryMenu] = useState<boolean>(true);
  const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth < 992) {
      setShowPrimaryMenu(false);
    }

    if (window.innerWidth < 1200) {
      setShowSecondaryMenu(false);
    }

    const showPrimaryMenu = localGetShowPrimaryMenu();
    if (showPrimaryMenu !== null) {
      setShowPrimaryMenu(showPrimaryMenu);
    }

    const showSecondaryMenu = localGetShowSecondaryMenu();
    if (showSecondaryMenu !== null) {
      setShowSecondaryMenu(showSecondaryMenu);
    }
  }, []);

  const contextValue = {
    display,
    setDisplay,
    showPrimaryMenu,
    setShowPrimaryMenu,
    showSecondaryMenu,
    setShowSecondaryMenu,
    messageIsStreaming,
    setMessageIsStreaming,
  };

  return (
    <DisplayContext.Provider value={contextValue}>
      {children}
    </DisplayContext.Provider>
  );
};

export const useDisplay = () => {
  const context = useContext(DisplayContext);
  if (!context) {
    error('useDisplay must be used within a DisplayProvider');
  }
  return context;
};
