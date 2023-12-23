export interface LearningFile {
  id: string;
  name: string;
  type: 'link' | 'document';
  url?: string;
  tags: string;
  folderId?: string;
  timestamp: string;
}

export interface Namespace {
  namespace: string;
}

export interface LearningResponse {
  message: string;
  metadata: LearningResponseMetadata[];
}

export interface LearningResponseMetadata {
  excerpt: string;
  metadata: {
    description: string;
    language: string;
    source: string;
    title: string;
  };
}
