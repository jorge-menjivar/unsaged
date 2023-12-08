import { useEffect, useRef } from 'react';

import Image from 'next/image';

import { DEBUG_MODE } from '@/utils/app/const';
import { printEnvVariables } from '@/utils/app/debug/env-vars';
import { debug } from '@/utils/logging';

import { ChatZone } from './components/chat-zone/chat-zone';
import { Navbar } from './components/mobile/navbar';
import { PrimaryMenu } from './components/primary-menu/primary-menu';
import { SecondaryMenu } from '@/components/home/components/secondary-menu/secondary-menu';

import { useAuth } from '@/providers/auth';
import { ConversationsProvider } from '@/providers/conversations';
import { useDatabase } from '@/providers/database';
import { FoldersProvider } from '@/providers/folders';
import { MessagesProvider } from '@/providers/messages';
import { ModelsProvider } from '@/providers/models';
import { SystemPromptsProvider } from '@/providers/system_prompts';
import { TemplatesProvider } from '@/providers/templates';

const Home = () => {
  const { session } = useAuth();
  const { database } = useDatabase();

  const debugLogPrinted = useRef(false);

  useEffect(() => {
    if (DEBUG_MODE) {
      if (!debugLogPrinted.current) {
        debugLogPrinted.current = true;
        debug('----------CLIENT-SIDE ENVIRONMENT VARIABLES----------');
        printEnvVariables();
      }
    }
  }, [debugLogPrinted]);

  if (session && database) {
    return (
      <ModelsProvider>
        <SystemPromptsProvider>
          <TemplatesProvider>
            <ConversationsProvider>
              <FoldersProvider>
                <MessagesProvider>
                  <div
                    className={`relative flex-col text-sm overflow-y-hidden h-full max-h-full w-full
          text-black dark:text-white m-0 p-0 overflow-hidden`}
                  >
                    <div className="absolute top-0 z-50 w-full sm:hidden">
                      <Navbar />
                    </div>
                    <div className="flex flex-shrink w-full h-full max-h-full pt-[50px] sm:pt-0 overflow-hidden overscroll-none">
                      <PrimaryMenu />
                      <ChatZone />
                      <SecondaryMenu />
                    </div>
                  </div>
                </MessagesProvider>
              </FoldersProvider>
            </ConversationsProvider>
          </TemplatesProvider>
        </SystemPromptsProvider>
      </ModelsProvider>
    );
  } else {
    let text = '';

    if (!session) {
      text = 'Initializing Auth System...';
    } else if (!database) {
      text = 'Initializing Database...';
    }

    return (
      <div
        className="flex flex-col items-center justify-center h-screen w-screen bg-[#ffffff]
        dark:bg-[#1f2428] dark:text-[#f0f0f0]"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row items-center justify-center">
            <Image
              className="animate-bounce"
              width={256}
              height={256}
              src="/icon-256.svg"
              alt="unSAGED Logo"
              priority
            />
          </div>
          <div className="flex flex-row items-center justify-center">
            <h2 className="text-xl font-bold text-primary-500">{text}</h2>
          </div>
        </div>
      </div>
    );
  }
};
export default Home;
