import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';

import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { useCreateReducer } from '@/hooks/useCreateReducer';

import useErrorService from '@/services/errorService';
import useApiService from '@/services/useApiService';

import {
  cleanConversationHistory,
  cleanSelectedConversation,
} from '@/utils/app/clean';
import {
  DEFAULT_ANTHROPIC_SYSTEM_PROMPT,
  DEFAULT_OPENAI_SYSTEM_PROMPT,
  DEFAULT_TEMPERATURE,
} from '@/utils/app/const';
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
import { Namespace } from '@/types/learning';
import { Prompt } from '@/types/prompt';
import { SettingChoice } from '@/types/settings';
import { SystemPrompt } from '@/types/system-prompt';

import { ChatZone } from '@/components/ChatZone/ChatZone';
import { Navbar } from '@/components/Mobile/Navbar';
import { PrimaryMenu } from '@/components/PrimaryMenu/PrimaryMenu';
import { SecondaryMenu } from '@/components/SecondaryMenu/SecondaryMenu';

import HomeContext from './home.context';
import { HomeInitialState, initialState } from './home.state';

import { v4 as uuidv4 } from 'uuid';

interface Props {
  serverSideApiKeyIsSet: boolean;
  defaultModelId: string;
}

const Home = ({ serverSideApiKeyIsSet, defaultModelId }: Props) => {
  const { t } = useTranslation('chat');
  const { getModels } = useApiService();
  const { getModelsError } = useErrorService();

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
      fetchComplete,
      models,
      builtInSystemPrompts,
      settingsLoaded,
    },
    dispatch,
  } = contextValue;

  const { data, error, refetch } = useQuery(
    [
      'GetModels',
      settingsLoaded,
      savedSettings,
      serverSideApiKeyIsSet,
      dispatch,
    ],
    ({ signal }) => {
      const openAiApiKey = getSavedSettingValue(
        savedSettings,
        'openai',
        'api_key',
      );

      const anthropicApiKey = getSavedSettingValue(
        savedSettings,
        'anthropic',
        'api_key',
      );

      dispatch({ field: 'apiKey', value: openAiApiKey || anthropicApiKey });

      if (!openAiApiKey && !anthropicApiKey && !serverSideApiKeyIsSet)
        return null;

      return getModels(
        {
          openai_key: openAiApiKey,
          anthropic_key: anthropicApiKey,
        },
        signal,
      );
    },
    { enabled: true, refetchOnMount: false },
  );

  useEffect(() => {
    if (data) dispatch({ field: 'models', value: data });
  }, [data, dispatch]);

  useEffect(() => {
    dispatch({ field: 'modelError', value: getModelsError(error) });
  }, [dispatch, error, getModelsError]);

  // FETCH MODELS ----------------------------------------------

  const handleSelectConversation = (conversation: Conversation) => {
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
    if (savedSettings && settings) {
      const lastConversation = conversations[conversations.length - 1];

      const model = lastConversation?.model || PossibleAiModels[defaultModelId];
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
        name: `${t('New Conversation')}`,
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

  const autogenerateConversation = useCallback(async () => {
    const model = PossibleAiModels[defaultModelId];
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
      name: `${t('New Conversation')}`,
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
      [],
    );
    dispatch({ field: 'selectedConversation', value: newConversation });
    dispatch({ field: 'conversations', value: updatedConversations });

    saveSelectedConversation(user, newConversation);
  }, [database, defaultModelId, dispatch, t, user]);

  useEffect(() => {
    if (conversations.length === 0 && fetchComplete) {
      autogenerateConversation();
    }
  }, [conversations, fetchComplete, autogenerateConversation]);

  const generateBuiltInSystemPrompts = useCallback(() => {
    const vendors: AiModel['vendor'][] = ['Anthropic', 'OpenAI'];

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

  useEffect(() => {
    defaultModelId &&
      dispatch({ field: 'defaultModelId', value: defaultModelId });
    database && dispatch({ field: 'database', value: database });
    serverSideApiKeyIsSet &&
      dispatch({
        field: 'serverSideApiKeyIsSet',
        value: serverSideApiKeyIsSet,
      });
  }, [defaultModelId, database, serverSideApiKeyIsSet, dispatch]);

  // ON LOAD --------------------------------------------

  useEffect(() => {
    if (serverSideApiKeyIsSet) {
      dispatch({ field: 'apiKey', value: true });
    }

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

    storageGetConversations(database, user)
      .then((conversationHistory) => {
        if (conversationHistory) {
          const parsedConversationHistory: Conversation[] = conversationHistory;
          const cleanedConversations = cleanConversationHistory(
            parsedConversationHistory,
          );

          const selectedConversation = getSelectedConversation(user);

          if (selectedConversation) {
            const parsedSelectedConversation: Conversation =
              JSON.parse(selectedConversation);
            const cleanedSelectedConversation = cleanSelectedConversation(
              parsedSelectedConversation,
            );

            dispatch({
              field: 'selectedConversation',
              value: cleanedSelectedConversation,
            });
          } else if (cleanedConversations.length > 0) {
            dispatch({
              field: 'selectedConversation',
              value: cleanedConversations[0],
            });
          }

          dispatch({
            field: 'conversations',
            value: cleanedConversations,
          });
        }
      })
      .then(() => {
        dispatch({ field: 'fetchComplete', value: true });
      });
  }, [user, defaultModelId, database, dispatch, serverSideApiKeyIsSet]);

  // SETTINGS --------------------------------------------

  useEffect(() => {
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
  }, [dispatch, savedSettings, user, settingsLoaded]);

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
      <Head>
        <title>unSAGED</title>
        <meta
          name="description"
          content="The singular space for Generative AI"
        />
        <meta
          name="viewport"
          content="height=device-height, width=device-width, initial-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {selectedConversation && (
        <main
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
        </main>
      )}
    </HomeContext.Provider>
  );
};
export default Home;
