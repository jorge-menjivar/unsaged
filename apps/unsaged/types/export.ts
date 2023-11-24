import { Conversation, Message } from './chat';
import { FolderInterface } from './folder';
import { Template } from './prompt';
import { SystemPrompt } from './system-prompt';

export type SupportedExportFormats = UnsagedExportFormatV1;
export type LatestExportFormat = UnsagedExportFormatV1;

export interface UnsagedExportFormatV1 {
  app: 'unSAGED';
  version: 1;
  conversations: Conversation[];
  messages: Message[];
  folders: FolderInterface[];
  message_templates: Template[];
  system_prompts: SystemPrompt[];
}
