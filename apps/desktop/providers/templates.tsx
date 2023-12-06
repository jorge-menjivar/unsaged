import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  storageCreateTemplate,
  storageDeleteTemplate,
  storageUpdateTemplate,
} from '@/utils/app/storage/template';
import { storageGetTemplates } from '@/utils/app/storage/templates';
import { error } from '@/utils/logging';

import { Template } from '@/types/templates';

import { useAuth } from './auth';
import { useDatabase } from './database';

import { v4 as uuidv4 } from 'uuid';

export const TemplatesContext = createContext<{
  templates: Template[];
  setTemplates: React.Dispatch<React.SetStateAction<Template[]>>;
  createTemplate: () => void;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (template: Template) => void;
}>({
  templates: [],
  setTemplates: () => {},
  createTemplate: () => {},
  updateTemplate: () => {},
  deleteTemplate: () => {},
});

export const TemplatesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session } = useAuth();
  const { database } = useDatabase();

  const [templates, setTemplates] = useState<Template[]>([]);
  const isInitialized = useRef(false);

  const fetchTemplates = useCallback(async () => {
    if (isInitialized.current || !database || !session) {
      return;
    }

    isInitialized.current = true;

    const _templates = await storageGetTemplates(database, session.user!);

    setTemplates(_templates);
  }, [database, session]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const createTemplate = () => {
    const newTemplate: Template = {
      id: uuidv4(),
      name: `Template ${templates.length + 1}`,
      description: '',
      content: '',
      models: [],
      folderId: null,
    };

    const updatedTemplates = storageCreateTemplate(
      database!,
      session!.user!,
      newTemplate,
      templates,
    );
    setTemplates(updatedTemplates);
  };

  const deleteTemplate = (template: Template) => {
    const updatedTemplates = storageDeleteTemplate(
      database!,
      session!.user!,
      template.id,
      templates,
    );
    setTemplates(updatedTemplates);
  };

  const updateTemplate = (template: Template) => {
    const updated = storageUpdateTemplate(
      database!,
      session!.user!,
      template,
      templates,
    );

    setTemplates(updated);
  };

  const contextValue = {
    templates,
    setTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
  return (
    <TemplatesContext.Provider value={contextValue}>
      {children}
    </TemplatesContext.Provider>
  );
};

export const useTemplates = () => {
  const context = useContext(TemplatesContext);
  if (!context) {
    error('useTemplates must be used within a TemplatesProvider');
  }
  return context;
};
