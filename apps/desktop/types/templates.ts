export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  models: string[];
  folderId: string | null;
}
