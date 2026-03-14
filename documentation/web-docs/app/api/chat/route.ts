import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from 'ai';
import { z } from 'zod/v4';
import { source } from '@/lib/source';
import { Document, type DocumentData } from 'flexsearch';
import fs from 'node:fs/promises';
import path from 'node:path';

interface CustomDocument extends DocumentData {
  url: string;
  title: string;
  description: string;
  content: string;
}

const searchServer = createSearchServer();

async function createSearchServer() {
  const search = new Document<CustomDocument>({
    document: {
      id: 'url',
      index: ['title', 'description', 'content'],
      store: true,
    },
  });

  const docsDir = path.join(process.cwd(), 'docs');
  const pages = source.getPages();

  const docs = await Promise.all(
    pages.map(async (page) => {
      const slugPath = page.slugs.join('/');

      // Try to read the raw markdown file
      for (const ext of ['.md', '.mdx']) {
        const filePath = path.join(docsDir, slugPath + ext);
        try {
          const raw = await fs.readFile(filePath, 'utf-8');
          const content = raw.replace(/^---[\s\S]*?---\n*/, '');
          return {
            title: page.data.title,
            description: page.data.description ?? '',
            url: page.url,
            content,
          } as CustomDocument;
        } catch {
          // Try next extension
        }
      }

      return null;
    }),
  );

  for (const doc of docs) {
    if (doc) search.add(doc);
  }

  return search;
}

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const systemPrompt = [
  'You are an AI assistant for the React Native Reanimated DnD documentation site.',
  'This library provides drag-and-drop functionality for React Native apps, built on Reanimated 4 and Gesture Handler.',
  'Use the `search` tool to retrieve relevant docs context before answering when needed.',
  'The `search` tool returns raw JSON results from documentation. Use those results to ground your answer and cite sources as markdown links using the document `url` field when available.',
  'If you cannot find the answer in search results, say you do not know and suggest a better search query.',
  'Be concise and provide code examples when helpful.',
].join('\n');

export async function POST(req: Request) {
  const reqJson: { messages?: UIMessage[] } = await req.json();

  const result = streamText({
    model: openrouter.chat(process.env.OPENROUTER_MODEL ?? 'google/gemini-3-flash-preview-20251217'),
    maxOutputTokens: 2048,
    stopWhen: stepCountIs(5),
    tools: {
      search: searchTool,
    },
    messages: [
      { role: 'system', content: systemPrompt },
      ...(await convertToModelMessages(reqJson.messages ?? [])),
    ],
    toolChoice: 'auto',
  });

  return result.toUIMessageStreamResponse();
}

const searchTool = tool({
  description: 'Search the docs content and return raw JSON results.',
  inputSchema: z.object({
    query: z.string(),
    limit: z.number().int().min(1).max(100).default(10),
  }),
  async execute({ query, limit }) {
    const search = await searchServer;
    return await search.searchAsync(query, { limit, merge: true, enrich: true });
  },
});

export type SearchTool = typeof searchTool;
