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
          model_id: string | null;
          name: string;
          params: Json;
          system_prompt_id: string | null;
          temperature: number | null;
          timestamp: string;
          user_id: string;
        };
        Insert: {
          folder_id?: string | null;
          id?: string;
          model_id?: string | null;
          name: string;
          params?: Json;
          system_prompt_id?: string | null;
          temperature?: number | null;
          timestamp: string;
          user_id?: string;
        };
        Update: {
          folder_id?: string | null;
          id?: string;
          model_id?: string | null;
          name?: string;
          params?: Json;
          system_prompt_id?: string | null;
          temperature?: number | null;
          timestamp?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'conversation_owner';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'conversation_owner_folder';
            columns: ['folder_id'];
            isOneToOne: false;
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
            isOneToOne: false;
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
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'message_owner_convo';
            columns: ['conversation_id'];
            isOneToOne: false;
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
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'prompt_owner_folder';
            columns: ['folder_id'];
            isOneToOne: false;
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
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'system_prompt_owner_folder';
            columns: ['folder_id'];
            isOneToOne: false;
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (SupaDatabase['public']['Tables'] & SupaDatabase['public']['Views'])
    | { schema: keyof SupaDatabase },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof SupaDatabase;
  }
    ? keyof (SupaDatabase[PublicTableNameOrOptions['schema']]['Tables'] &
        SupaDatabase[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof SupaDatabase }
  ? (SupaDatabase[PublicTableNameOrOptions['schema']]['Tables'] &
      SupaDatabase[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (SupaDatabase['public']['Tables'] &
      SupaDatabase['public']['Views'])
  ? (SupaDatabase['public']['Tables'] &
      SupaDatabase['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof SupaDatabase['public']['Tables']
    | { schema: keyof SupaDatabase },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof SupaDatabase;
  }
    ? keyof SupaDatabase[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof SupaDatabase }
  ? SupaDatabase[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof SupaDatabase['public']['Tables']
  ? SupaDatabase['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof SupaDatabase['public']['Tables']
    | { schema: keyof SupaDatabase },
  TableName extends PublicTableNameOrOptions extends {
    schema: keyof SupaDatabase;
  }
    ? keyof SupaDatabase[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof SupaDatabase }
  ? SupaDatabase[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof SupaDatabase['public']['Tables']
  ? SupaDatabase['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof SupaDatabase['public']['Enums']
    | { schema: keyof SupaDatabase },
  EnumName extends PublicEnumNameOrOptions extends {
    schema: keyof SupaDatabase;
  }
    ? keyof SupaDatabase[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof SupaDatabase }
  ? SupaDatabase[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof SupaDatabase['public']['Enums']
  ? SupaDatabase['public']['Enums'][PublicEnumNameOrOptions]
  : never;
