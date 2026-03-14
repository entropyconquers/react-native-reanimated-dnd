import { source } from '@/lib/source';

export const revalidate = false;

const SITE_URL = 'https://react-native-reanimated-dnd.vercel.app';

export function GET() {
  const pages = source.getPages();

  const lines = [
    '# React Native Reanimated DnD',
    '',
    '> A powerful, performant drag-and-drop library built on React Native Reanimated and Gesture Handler.',
    '',
    'This file contains an index of all documentation pages.',
    'Each page is available as markdown by appending .mdx to its URL.',
    '',
    '## Pages',
    '',
    ...pages.map(
      (page) => `- [${page.data.title}](${SITE_URL}${page.url}): ${page.data.description || page.data.title}`
    ),
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
