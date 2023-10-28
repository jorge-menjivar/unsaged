import { DEFAULT_MODEL } from '@/utils/app/const';

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
  builtInSystemPrompts: SystemPrompt[];
  conversations: Conversation[];
  currentFolder: FolderInterface | undefined;
  currentMessage: Message | undefined;
  database: Database | null;
  defaultModelId: string | undefined;
  display: 'chat' | 'settings';
  fetchComplete: boolean;
  folders: FolderInterface[];
  lightMode: 'light' | 'dark';
  loading: boolean;
  messageError: boolean;
  messageIsStreaming: boolean;
  messages: Message[];
  modelError: ErrorMessage | null;
  models: AiModel[];
  modelsLoaded: boolean;
  prompts: Prompt[];
  savedSettings: SavedSetting[];
  searchTerm: string;
  selectedConversation: Conversation | null;
  serverSideApiKeyIsSet: boolean;
  settings: SettingsSection[];
  settingsLoaded: boolean;
  showPrimaryMenu: boolean;
  showSecondaryMenu: boolean;
  systemPrompts: SystemPrompt[];
  temperature: number;
  user: User | null;
}

export const initialState: HomeInitialState = {
  builtInSystemPrompts: [],
  conversations: [],
  currentFolder: undefined,
  currentMessage: undefined,
  database: null,
  defaultModelId: DEFAULT_MODEL,
  display: 'chat',
  fetchComplete: false,
  folders: [],
  lightMode: 'dark',
  loading: false,
  messageError: false,
  messageIsStreaming: false,
  messages: [],
  modelError: null,
  models: [],
  modelsLoaded: false,
  prompts: [],
  savedSettings: [],
  searchTerm: '',
  selectedConversation: null,
  serverSideApiKeyIsSet: false,
  settings: [],
  settingsLoaded: false,
  showPrimaryMenu: true,
  showSecondaryMenu: true,
  systemPrompts: [],
  temperature: 1,
  user: null,
};
