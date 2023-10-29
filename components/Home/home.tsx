import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import {
  DEBUG_MODE,
  DEFAULT_ANTHROPIC_SYSTEM_PROMPT,
  DEFAULT_MODEL,
  DEFAULT_OLLAMA_SYSTEM_PROMPT,
  DEFAULT_OPENAI_SYSTEM_PROMPT,
  DEFAULT_PALM_SYSTEM_PROMPT,
  DEFAULT_TEMPERATURE,
} from '@/utils/app/const';
import { printEnvVariables } from '@/utils/app/debug/env-vars';
import { useAuth } from '@/utils/app/retrieval/auth';
import { useConversations } from '@/utils/app/retrieval/conversations';
import { useDatabase } from '@/utils/app/retrieval/database';
import { useMessages } from '@/utils/app/retrieval/messages';
import { useModels } from '@/utils/app/retrieval/models';
import { getSettings } from '@/utils/app/settings/getSettings';
import { setSettingChoices } from '@/utils/app/settings/settingChoices';
import {
  storageCreateConversation,
  storageUpdateConversation,
} from '@/utils/app/storage/conversation';
import { storageUpdateConversations } from '@/utils/app/storage/conversations';
import {
  storageCreateFolder,
  storageDeleteFolder,
  storageUpdateFolder,
} from '@/utils/app/storage/folder';
import { storageGetFolders } from '@/utils/app/storage/folders';
import {
  getSavedSettingValue,
  getSavedSettings,
  setSavedSettings,
} from '@/utils/app/storage/local/settings';
import {
  localGetShowPrimaryMenu,
  localGetShowSecondaryMenu,
} from '@/utils/app/storage/local/uiState';
import { storageDeleteMessages } from '@/utils/app/storage/messages';
import {
  storageGetPrompts,
  storageUpdatePrompts,
} from '@/utils/app/storage/prompts';
import { saveSelectedConversationId } from '@/utils/app/storage/selectedConversation';
import { storageGetSystemPrompts } from '@/utils/app/storage/systemPrompts';

import { AiModel, PossibleAiModels } from '@/types/ai-models';
import { Conversation, Message } from '@/types/chat';
import { KeyValuePair } from '@/types/data';
import { FolderInterface } from '@/types/folder';
import { Prompt } from '@/types/prompt';
import { SettingChoice } from '@/types/settings';
import { SystemPrompt } from '@/types/system-prompt';

import { ChatZone } from './components/ChatZone/ChatZone';
import { Navbar } from './components/Mobile/Navbar';
import { PrimaryMenu } from '@/components/Home/components/PrimaryMenu/PrimaryMenu';
import { SecondaryMenu } from '@/components/Home/components/SecondaryMenu/SecondaryMenu';

import HomeContext from './home.context';
import { HomeInitialState, initialState } from './home.state';

import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const [debugLogPrinted, setDebugLogPrinted] = useState(false);

  const contextValue = useCreateReducer<HomeInitialState>({
    initialState,
  });

  const {
    state: {
      builtInSystemPrompts,
      database,
      display,
      lightMode,
      folders,
      conversations,
      models,
      modelsLoaded,
      prompts,
      savedSettings,
      selectedConversation,
      settings,
      settingsLoaded,
      systemPrompts,
      user,
    },
    dispatch,
  } = contextValue;

  useEffect(() => {
    if (DEBUG_MODE) {
      if (!debugLogPrinted) {
        console.log('----------CLIENT-SIDE ENVIRONMENT VARIABLES----------');
        printEnvVariables();
        setDebugLogPrinted(true);
      }
    }
  }, [debugLogPrinted]);

  // AUTH --------------------------------------------------------------------
  useAuth(dispatch, user);

  // DATABASE ----------------------------------------------------------------
  useDatabase(dispatch, database);

  // MODELS ------------------------------------------------------------------
  useModels(dispatch, savedSettings, models, modelsLoaded);

  // CONVERSATIONS -----------------------------------------------------------
  useConversations(
    dispatch,
    database,
    user,
    conversations,
    systemPrompts,
    models,
    modelsLoaded,
  );

  // MESSAGES ----------------------------------------------------------------
  useMessages(dispatch, database, user);

  useEffect(() => {
    const _selectedConversation = conversations.find(
      (c) => c.id === selectedConversation?.id,
    );
    dispatch({ field: 'selectedConversation', value: _selectedConversation });
  }, [conversations, dispatch, selectedConversation?.id]);

  const handleSelectConversation = (conversation: Conversation) => {
    if (!database || !user) return;
    dispatch({
      field: 'selectedConversation',
      value: conversation,
    });

    dispatch({
      field: 'display',
      value: 'chat',
    });

    saveSelectedConversationId(user, conversation.id);
  };

  // FOLDER OPERATIONS  --------------------------------------------

  const handleCreateFolder = async (
    name: string,
    type: FolderInterface['type'],
  ) => {
    if (!database || !user) return;

    const updatedFolders = storageCreateFolder(
      database,
      user,
      name,
      type,
      folders,
    );

    dispatch({ field: 'folders', value: updatedFolders });
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!database || !user) return;

    const updatedFolders = folders.filter((f) => f.id !== folderId);
    dispatch({ field: 'folders', value: updatedFolders });

    const updatedConversations: Conversation[] = conversations.map((c) => {
      if (c.folderId === folderId) {
        return {
          ...c,
          folderId: null,
        };
      }

      return c;
    });

    dispatch({ field: 'conversations', value: updatedConversations });

    const updatedPrompts: Prompt[] = prompts.map((p) => {
      if (p.folderId === folderId) {
        return {
          ...p,
          folderId: null,
        };
      }

      return p;
    });

    dispatch({ field: 'prompts', value: updatedPrompts });

    await storageUpdateConversations(database, user, updatedConversations);
    await storageUpdatePrompts(database, user, updatedPrompts);
    storageDeleteFolder(database, user, folderId, folders);
  };

  const handleUpdateFolder = async (folderId: string, name: string) => {
    if (!database || !user) return;
    const updatedFolders = storageUpdateFolder(
      database,
      user,
      folderId,
      name,
      folders,
    );

    dispatch({ field: 'folders', value: updatedFolders });
  };

  // CONVERSATION OPERATIONS  --------------------------------------------

  // const autoUpdateConversations = useCallback(
  //   async (oldConversations: Conversation[]) => {
  //     if (!database || !user) return;
  //     for (const conversation of oldConversations) {
  //       if (conversation.systemPrompt) {
  //         const systemPrompt = systemPrompts.find(
  //           (p) => p.id === conversation.systemPrompt?.id,
  //         );

  //         if (systemPrompt) {
  //           conversation.systemPrompt = systemPrompt;
  //         } else {
  //           conversation.systemPrompt = null;
  //         }
  //       }
  //     }

  //     storageUpdateConversations(database, user, oldConversations);

  //     dispatch({ field: 'conversations', value: oldConversations });
  //   },
  //   [database, user, systemPrompts, dispatch],
  // );

  // useEffect(() => {
  //   if (conversations.length > 0) {
  //     autoUpdateConversations(conversations);
  //   }
  // }, [autoUpdateConversations, conversations, systemPrompts]);

  const handleNewConversation = async () => {
    if (!database || !user) return;
    if (savedSettings && settings) {
      const lastConversation = conversations[conversations.length - 1];

      const model = lastConversation?.model || PossibleAiModels[DEFAULT_MODEL];

      const newConversation: Conversation = {
        id: uuidv4(),
        name: 'New Conversation',
        model: model,
        systemPrompt: null,
        temperature: DEFAULT_TEMPERATURE,
        folderId: null,
        timestamp: new Date().toISOString(),
      };

      const updatedConversations = storageCreateConversation(
        database,
        user,
        newConversation,
        conversations,
      );
      dispatch({ field: 'selectedConversation', value: newConversation });
      dispatch({ field: 'conversations', value: updatedConversations });

      saveSelectedConversationId(user, newConversation.id);

      dispatch({ field: 'loading', value: false });
    }
  };

  const generateBuiltInSystemPrompts = useCallback(() => {
    const vendors: AiModel['vendor'][] = [
      'Anthropic',
      'OpenAI',
      'Google',
      'Ollama',
    ];

    const newSystemPrompts: SystemPrompt[] = [];
    for (const vendor of vendors) {
      let systemPrompt: SystemPrompt;
      const systemPromptId = uuidv4();
      if (vendor === 'Anthropic') {
        systemPrompt = {
          id: systemPromptId,
          name: `${vendor} Built-In`,
          content: DEFAULT_ANTHROPIC_SYSTEM_PROMPT,
          folderId: null,
          models: models
            .filter((m) => m.vendor === 'Anthropic')
            .map((m) => m.id),
        };
        newSystemPrompts.push(systemPrompt);
      } else if (vendor === 'OpenAI') {
        systemPrompt = {
          id: systemPromptId,
          name: `${vendor} Built-In`,
          content: DEFAULT_OPENAI_SYSTEM_PROMPT,
          folderId: null,
          models: models.filter((m) => m.vendor === 'OpenAI').map((m) => m.id),
        };
        newSystemPrompts.push(systemPrompt);
      } else if (vendor === 'Google') {
        systemPrompt = {
          id: systemPromptId,
          name: `${vendor} Built-In`,
          content: DEFAULT_PALM_SYSTEM_PROMPT,
          folderId: null,
          models: models.filter((m) => m.vendor === 'Google').map((m) => m.id),
        };
        newSystemPrompts.push(systemPrompt);
      } else if (vendor === 'Ollama') {
        systemPrompt = {
          id: systemPromptId,
          name: `${vendor} Built-In`,
          content: DEFAULT_OLLAMA_SYSTEM_PROMPT,
          folderId: null,
          models: models.filter((m) => m.vendor === 'Ollama').map((m) => m.id),
        };

        newSystemPrompts.push(systemPrompt);
      }
    }

    dispatch({ field: 'builtInSystemPrompts', value: newSystemPrompts });
  }, [dispatch, models]);

  useEffect(() => {
    if (builtInSystemPrompts.length === 0) {
      generateBuiltInSystemPrompts();
    }
  }, [builtInSystemPrompts, generateBuiltInSystemPrompts]);

  const handleUpdateConversation = (
    conversation: Conversation,
    data: KeyValuePair,
  ) => {
    if (!database || !user) return;

    const updatedConversation: Conversation = {
      ...conversation,
      [data.key]: data.value,
    };

    const updatedConversations = storageUpdateConversation(
      database,
      user,
      updatedConversation,
      conversations,
    );

    dispatch({ field: 'conversations', value: updatedConversations });
  };

  // EFFECTS  --------------------------------------------

  useEffect(() => {
    if (window.innerWidth < 640) {
      dispatch({ field: 'showPrimaryMenu', value: false });
      dispatch({ field: 'showSecondaryMenu', value: false });
    }
  }, [dispatch, display]);

  // ON LOAD --------------------------------------------

  useEffect(() => {
    if (!database || !user) return;

    if (window.innerWidth < 640) {
      dispatch({ field: 'showPrimaryMenu', value: false });
    }

    const showPrimaryMenu = localGetShowPrimaryMenu(user);
    if (showPrimaryMenu) {
      dispatch({ field: 'showPrimaryMenu', value: showPrimaryMenu });
    }

    const showSecondaryMenu = localGetShowSecondaryMenu(user);
    if (showSecondaryMenu) {
      dispatch({ field: 'showSecondaryMenu', value: showSecondaryMenu });
    }

    storageGetFolders(database, user).then((folders) => {
      if (folders) {
        dispatch({ field: 'folders', value: folders });
      }
    });

    storageGetPrompts(database, user).then((prompts) => {
      if (prompts) {
        dispatch({ field: 'prompts', value: prompts });
      }
    });
  }, [user, database, dispatch]);

  // SETTINGS --------------------------------------------

  useEffect(() => {
    if (!database || !user) return;

    const settings = getSettings();
    dispatch({ field: 'settings', value: settings });

    storageGetSystemPrompts(database, user).then((systemPrompts) => {
      const choices: SettingChoice[] = systemPrompts.map((sp) => {
        return { name: sp.name, value: sp.id };
      });
      choices.push({ name: 'Built-In', value: '0', default: true });
      const newSettings = setSettingChoices(
        settings,
        'general',
        'defaultSystemPromptId',
        choices,
      );

      dispatch({ field: 'settings', value: newSettings });
      dispatch({ field: 'systemPrompts', value: systemPrompts });
    });
  }, [dispatch, database, user]);

  useEffect(() => {
    if (!database || !user) return;

    if (!settingsLoaded) {
      const newSavedSettings = getSavedSettings(user);

      dispatch({
        field: 'savedSettings',
        value: newSavedSettings,
      });

      dispatch({
        field: 'settingsLoaded',
        value: true,
      });
    }
  }, [dispatch, savedSettings, user, settingsLoaded, database]);

  useEffect(() => {
    if (savedSettings && settings) {
      const lightMode = getSavedSettingValue(
        savedSettings,
        'personalization',
        'theme',
        settings,
      );

      dispatch({
        field: 'lightMode',
        value: lightMode,
      });
    }
  }, [savedSettings, settings, dispatch]);

  if (user && database && conversations.length > 0) {
    return (
      <HomeContext.Provider
        value={{
          ...contextValue,
          handleNewConversation,
          handleCreateFolder,
          handleDeleteFolder,
          handleUpdateFolder,
          handleSelectConversation,
          handleUpdateConversation,
        }}
      >
        {selectedConversation && (
          <div
            className={`relative flex-col text-sm overflow-y-hidden h-full max-h-full w-full
          text-black dark:text-white ${lightMode} m-0 p-0 overflow-hidden`}
          >
            <div className="absolute top-0 z-50 w-full sm:hidden">
              <Navbar
                selectedConversation={selectedConversation}
                onNewConversation={handleNewConversation}
              />
            </div>
            <div className="flex flex-shrink w-full h-full max-h-full pt-[50px] sm:pt-0 overflow-hidden overscroll-none">
              <PrimaryMenu />
              <ChatZone />
              <SecondaryMenu />
            </div>
          </div>
        )}
      </HomeContext.Provider>
    );
  } else {
    let text = '';

    if (!user) {
      text = 'Initializing Auth System...';
    } else if (!database) {
      text = 'Initializing Database...';
    } else if (conversations.length === 0) {
      text = 'Loading Conversations...';
    }

    return (
      <div
        className={`relative flex-col text-sm overflow-y-hidden h-full max-h-full w-full
          ${lightMode || 'dark'} m-0 p-0 overflow-hidden`}
      >
        <div
          className="flex flex-col items-center justify-center h-screen w-screen bg-[#ffffff]
        dark:bg-[#1f2428] dark:text-[#f0f0f0]"
        >
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row items-center justify-center">
              <Image
                className="animate-bounce"
                width={256}
                height={256}
                src="/icon-256.svg"
                alt="unSAGED Logo"
                priority
              />
            </div>
            <div className="flex flex-row items-center justify-center">
              <h2 className="text-xl font-bold text-primary-500">{text}</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default Home;
