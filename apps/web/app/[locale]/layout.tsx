import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '@/utils/app/const';

import { Analytics } from '@vercel/analytics/react';
import { AxiomWebVitals } from 'next-axiom';

import { Metadata, Viewport } from 'next';

import { ThemeProvider } from '@ui/components/ui/theme-provider';

import '@/styles/globals.css';
import NextIntlProvider from './NextIntlProvider';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
};

export const viewport: Viewport = {
  height: 'device-height',
  width: 'device-width',
  initialScale: 1,
}

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <Analytics />
      <AxiomWebVitals />
      <body className="absolute inset-0 overflow-hidden overscroll-none h-full w-full">
        <NextIntlProvider
          locale={locale}
          messages={messages}
          timeZone="Europe/Berlin"
          now={new Date()}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlProvider>
      </body>
    </html>
  );
}
