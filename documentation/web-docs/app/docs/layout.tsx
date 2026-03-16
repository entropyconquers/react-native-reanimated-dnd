import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        tabs: [
          {
            title: 'Documentation',
            url: '/docs/intro',
          },
          {
            title: 'API Reference',
            url: '/docs/api/overview',
          },
        ],
      }}
    >
      {children}
    </DocsLayout>
  );
}
