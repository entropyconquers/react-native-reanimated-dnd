import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import { MessageCircleIcon } from 'lucide-react';
import './global.css';

export const metadata: Metadata = {
  title: {
    default: 'React Native Reanimated DnD',
    template: '%s | React Native Reanimated DnD',
  },
  description:
    'A powerful, performant drag-and-drop library built on React Native Reanimated and Gesture Handler.',
  icons: {
    icon: '/images/favicon.ico',
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          theme={{
            defaultTheme: 'dark',
          }}
        >
          <AISearch>
            {children}
            <AISearchPanel />
            <AISearchTrigger
              position="float"
              className="fixed bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-2xl border bg-fd-secondary text-fd-secondary-foreground shadow-lg px-4 py-2.5 text-sm font-medium hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors whitespace-nowrap"
            >
              <MessageCircleIcon className="size-4" />
              Ask AI
            </AISearchTrigger>
          </AISearch>
        </RootProvider>
      </body>
    </html>
  );
}
