export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface SupaDatabase {
  public: {
    Tables: {
      conversations: {
        Row: {
          folder_id: string | null;
          id: string;
          model_id: string;
          name: string;
          system_prompt_id: string | null;
          temperature: number;
          timestamp: string;
          user_id: string;
        };
        Insert: {
          folder_id?: string | null;
          id?: string;
          model_id: string;
          name: string;
          system_prompt_id?: string | null;
          temperature: number;
          timestamp: string;
          user_id?: string;
        };
        Update: {
          folder_id?: string | null;
          id?: string;
          model_id?: string;
          name?: string;
          system_prompt_id?: string | null;
          temperature?: number;
          timestamp?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'conversation_owner';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'conversation_owner_folder';
            columns: ['folder_id'];
            referencedRelation: 'folders';
            referencedColumns: ['id'];
          },
        ];
      };
      folders: {
        Row: {
          folder_type: string;
          id: string;
          name: string;
          user_id: string;
        };
        Insert: {
          folder_type: string;
          id?: string;
          name: string;
          user_id?: string;
        };
        Update: {
          folder_type?: string;
          id?: string;
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'folder_owner';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          conversation_id: string;
          id: string;
          role: string;
          timestamp: string;
          user_id: string;
        };
        Insert: {
          content: string;
          conversation_id: string;
          id?: string;
          role: string;
          timestamp: string;
          user_id?: string;
        };
        Update: {
          content?: string;
          conversation_id?: string;
          id?: string;
          role?: string;
          timestamp?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'message_owner';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'message_owner_convo';
            columns: ['conversation_id'];
            referencedRelation: 'conversations';
            referencedColumns: ['id'];
          },
        ];
      };
      prompts: {
        Row: {
          content: string;
          description: string;
          folder_id: string | null;
          id: string;
          models: string[];
          name: string;
          user_id: string;
        };
        Insert: {
          content: string;
          description: string;
          folder_id?: string | null;
          id?: string;
          models: string[];
          name: string;
          user_id?: string;
        };
        Update: {
          content?: string;
          description?: string;
          folder_id?: string | null;
          id?: string;
          models?: string[];
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'prompt_owner';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'prompt_owner_folder';
            columns: ['folder_id'];
            referencedRelation: 'folders';
            referencedColumns: ['id'];
          },
        ];
      };
      system_prompts: {
        Row: {
          content: string;
          folder_id: string | null;
          id: string;
          models: string[];
          name: string;
          user_id: string;
        };
        Insert: {
          content: string;
          folder_id?: string | null;
          id?: string;
          models: string[];
          name: string;
          user_id?: string;
        };
        Update: {
          content?: string;
          folder_id?: string | null;
          id?: string;
          models?: string[];
          name?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'system_prompt_owner';
            columns: ['user_id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'system_prompt_owner_folder';
            columns: ['folder_id'];
            referencedRelation: 'folders';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
