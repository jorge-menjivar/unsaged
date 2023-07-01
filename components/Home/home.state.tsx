import { getUser } from '@/utils/app/auth/helpers';
import { getDatabase } from '@/utils/app/extensions/database';

import { AiModel } from '@/types/ai-models';
import { User } from '@/types/auth';
import { Conversation, Message } from '@/types/chat';
import { Database } from '@/types/database';
import { ErrorMessage } from '@/types/error';
import { FolderInterface } from '@/types/folder';
import { Prompt } from '@/types/prompt';
import { SavedSetting, SettingsSection } from '@/types/settings';
import { SystemPrompt } from '@/types/system-prompt';

export interface HomeInitialState {
  apiKey: boolean;
  database: Database;
  loading: boolean;
  lightMode: 'light' | 'dark';
  messageIsStreaming: boolean;
  modelError: ErrorMessage | null;
  models: AiModel[];
  folders: FolderInterface[];
  conversations: Conversation[];
  selectedConversation: Conversation | undefined;
  currentMessage: Message | undefined;
  prompts: Prompt[];
  temperature: number;
  showPrimaryMenu: boolean;
  showSecondaryMenu: boolean;
  currentFolder: FolderInterface | undefined;
  messageError: boolean;
  searchTerm: string;
  defaultModelId: string | undefined;
  serverSideApiKeyIsSet: boolean;
  systemPrompts: SystemPrompt[];
  builtInSystemPrompts: SystemPrompt[];
  user: User;
  display: 'chat' | 'settings';
  savedSettings: SavedSetting[];
  settings: SettingsSection[];
  fetchComplete: boolean;
  settingsLoaded: boolean;
}

export const initialState: HomeInitialState = {
  apiKey: true,
  database: await getDatabase(),
  loading: false,
  lightMode: 'dark',
  messageIsStreaming: false,
  modelError: null,
  models: [],
  folders: [],
  conversations: [],
  selectedConversation: undefined,
  currentMessage: undefined,
  prompts: [],
  temperature: 1,
  showPrimaryMenu: true,
  showSecondaryMenu: true,
  currentFolder: undefined,
  messageError: false,
  searchTerm: '',
  defaultModelId: undefined,
  serverSideApiKeyIsSet: false,
  systemPrompts: [],
  builtInSystemPrompts: [],
  user: await getUser(),
  display: 'chat',
  savedSettings: [],
  settings: [],
  fetchComplete: false,
  settingsLoaded: false,
};
