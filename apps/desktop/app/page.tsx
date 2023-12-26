'use client';

import Home from '@/components/home';

import { AuthProvider } from '@/providers/auth';
import { DatabaseProvider } from '@/providers/database';
import { DisplayProvider } from '@/providers/display';
import { SettingsProvider } from '@/providers/settings';

export default function HomePage() {
  return (
    <main className="relative flex-col text-sm overflow-y-hidden h-full max-h-full w-full m-0 p-0 overflow-hidden">
      <DisplayProvider>
        <AuthProvider>
          <SettingsProvider>
            <DatabaseProvider>
              <Home />
            </DatabaseProvider>
          </SettingsProvider>
        </AuthProvider>
      </DisplayProvider>
    </main>
  );
}
