import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';

// Shim components for Mintlify-specific MDX elements

function Tip({ children }: { children: ReactNode }) {
  return (
    <div className="fd-callout fd-callout-info rounded-lg border border-fd-border bg-fd-card p-4 my-4">
      <p className="text-sm">{children}</p>
    </div>
  );
}

function Tabs({ children }: { children: ReactNode }) {
  return <div className="my-4">{children}</div>;
}

function Tab({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="border border-fd-border rounded-lg p-4 my-2">
      <summary className="cursor-pointer font-medium">{title}</summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="border border-fd-border rounded-lg p-4 my-2">
      {children}
    </div>
  );
}

function CardGroup({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">{children}</div>;
}

function CodeGroup({ children }: { children: ReactNode }) {
  return <div className="my-4">{children}</div>;
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tip,
    Tabs,
    Tab,
    Card,
    CardGroup,
    CodeGroup,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
