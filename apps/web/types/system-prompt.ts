export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  folderId: string | null;
  models: string[];
}
