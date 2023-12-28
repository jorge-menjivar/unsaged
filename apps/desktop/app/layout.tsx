import { Metadata, Viewport } from 'next';
import { AxiomWebVitals } from 'next-axiom';

import '@/styles/globals.css';

import { ThemeProvider } from '@/components/common/ui/theme-provider';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '@/utils/app/const';

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
};

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      <AxiomWebVitals />
      <body className="absolute inset-0 overflow-hidden overscroll-none h-full w-full">
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
