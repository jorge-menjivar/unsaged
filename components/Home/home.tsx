import { useCallback, useEffect } from 'react';

import Head from 'next/head';
import Image from 'next/image';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import {
  cleanConversationHistory,
  cleanSelectedConversation,
} from '@/utils/app/clean';
import {
  DEFAULT_ANTHROPIC_SYSTEM_PROMPT,
  DEFAULT_MODEL,
  DEFAULT_OPENAI_SYSTEM_PROMPT,
  DEFAULT_PALM_SYSTEM_PROMPT,
  DEFAULT_TEMPERATURE,
} from '@/utils/app/const';
import { useAuth } from '@/utils/app/retrieval/auth';
import { useConversations } from '@/utils/app/retrieval/conversations';
import { useDatabase } from '@/utils/app/retrieval/database';
import { useModels } from '@/utils/app/retrieval/models';
import { getSettings } from '@/utils/app/settings/getSettings';
import { setSettingChoices } from '@/utils/app/settings/settingChoices';
import {
  storageCreateConversation,
  storageUpdateConversation,
} from '@/utils/app/storage/conversation';
import {
  storageGetConversations,
  storageUpdateConversations,
} from '@/utils/app/storage/conversations';
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
import {
  storageDeleteMessages,
  storageUpdateMessages,
} from '@/utils/app/storage/messages';
import {
  storageGetPrompts,
  storageUpdatePrompts,
} from '@/utils/app/storage/prompts';
import {
  getSelectedConversation,
  saveSelectedConversation,
} from '@/utils/app/storage/selectedConversation';
import { storageGetSystemPrompts } from '@/utils/app/storage/systemPrompts';
import { getTimestampWithTimezoneOffset } from '@/utils/app/time/time';

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
  const contextValue = useCreateReducer<HomeInitialState>({
    initialState,
  });

  const {
    state: {
      database,
      display,
      lightMode,
      folders,
      conversations,
      selectedConversation,
      prompts,
      systemPrompts,
      user,
      savedSettings,
      settings,
      models,
      builtInSystemPrompts,
      settingsLoaded,
    },
    dispatch,
  } = contextValue;

  // AUTH ---------------------------------------------------------
  useAuth(dispatch, user);

  // DATABASE ---------------------------------------------------------
  useDatabase(dispatch, database);

  // MODELS ----------------------------------------------
  useModels(dispatch, savedSettings, models);

  // CONVERSATIONS ---------------------------------------------------------
  useConversations(dispatch, database, user, conversations);

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

    saveSelectedConversation(user, conversation);
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

  const autoUpdateConversations = useCallback(
    async (oldConversations: Conversation[]) => {
      if (!database || !user) return;
      for (const conversation of oldConversations) {
        if (conversation.systemPrompt) {
          const systemPrompt = systemPrompts.find(
            (p) => p.id === conversation.systemPrompt?.id,
          );

          if (systemPrompt) {
            conversation.systemPrompt = systemPrompt;
          } else {
            conversation.systemPrompt = null;
          }
        }
      }

      storageUpdateConversations(database, user, oldConversations);

      dispatch({ field: 'conversations', value: oldConversations });
    },
    [database, user, systemPrompts, dispatch],
  );

  useEffect(() => {
    if (conversations.length > 0) {
      autoUpdateConversations(conversations);
    }
  }, [autoUpdateConversations, conversations, systemPrompts]);

  const handleNewConversation = async () => {
    if (!database || !user) return;
    if (savedSettings && settings) {
      const lastConversation = conversations[conversations.length - 1];

      const model = lastConversation?.model || PossibleAiModels[DEFAULT_MODEL];
      // const sectionId = model.vendor.toLowerCase();
      // const settingId = `${model.id}_default_system_prompt`;
      // const systemPromptId = getSavedSettingValue(
      //   savedSettings,
      //   sectionId,
      //   settingId,
      //   settings,
      // );

      // const systemPrompt = systemPrompts.find((p) => p.id === systemPromptId);

      const newConversation: Conversation = {
        id: uuidv4(),
        name: 'New Conversation',
        messages: [],
        model: model,
        systemPrompt: null,
        temperature: DEFAULT_TEMPERATURE,
        folderId: null,
        timestamp: getTimestampWithTimezoneOffset(),
      };

      const updatedConversations = storageCreateConversation(
        database,
        user,
        newConversation,
        conversations,
      );
      dispatch({ field: 'selectedConversation', value: newConversation });
      dispatch({ field: 'conversations', value: updatedConversations });

      saveSelectedConversation(user, newConversation);

      dispatch({ field: 'loading', value: false });
    }
  };

  const generateBuiltInSystemPrompts = useCallback(() => {
    const vendors: AiModel['vendor'][] = ['Anthropic', 'OpenAI', 'Google'];

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

    const updatedConversation = {
      ...conversation,
      [data.key]: data.value,
    };

    let update: {
      single: Conversation;
      all: Conversation[];
    };

    if (data.key === 'messages') {
      const messages = conversation.messages;
      const updatedMessageList = data.value as Message[];

      const deletedMessages = messages.filter(
        (m) => !updatedMessageList.includes(m),
      );

      const updatedMessages = messages.filter((m) =>
        updatedMessageList.includes(m),
      );

      const deletedMessageIds = deletedMessages.map((m) => m.id);

      const cleaned = storageDeleteMessages(
        database,
        user,
        deletedMessageIds,
        conversation,
        messages,
        conversations,
      );

      const cleanConversation = cleaned.single;
      const cleanConversations = cleaned.all;

      update = storageUpdateMessages(
        database,
        user,
        cleanConversation,
        updatedMessages,
        cleanConversations,
      );
    } else {
      update = storageUpdateConversation(
        database,
        user,
        updatedConversation,
        conversations,
      );
    }

    dispatch({ field: 'selectedConversation', value: update.single });
    dispatch({ field: 'conversations', value: update.all });
    saveSelectedConversation(user, update.single);
  };

  // EFFECTS  --------------------------------------------

  useEffect(() => {
    if (window.innerWidth < 640) {
      dispatch({ field: 'showPrimaryMenu', value: false });
      dispatch({ field: 'showSecondaryMenu', value: false });
    }
  }, [dispatch, selectedConversation, display]);

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
