import { Analytics } from '@vercel/analytics/react';

import { Metadata } from 'next';

import { ThemeProvider } from '@/components/common/ui/theme-provider';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'unSAGED',
  description:
    'Open source chat kit engineered for seamless interaction with AI models',
  viewport:
    'height=device-height, width=device-width, initial-scale=1, user-scalable=no',
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Analytics />
      <body className="absolute inset-0 overflow-hidden overscroll-none h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
