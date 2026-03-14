import fs from 'node:fs/promises';
import path from 'node:path';
import { source } from '@/lib/source';

type Page = ReturnType<typeof source.getPages>[number];

/**
 * Reads the raw markdown content of a documentation page
 * and prepends it with the page title and URL for LLM consumption.
 */
export async function getLLMText(page: Page): Promise<string> {
  const slugPath = page.slugs.join('/');
  const docsDir = path.join(process.cwd(), 'docs');

  // Try .md then .mdx extensions
  for (const ext of ['.md', '.mdx']) {
    const filePath = path.join(docsDir, slugPath + ext);
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      // Strip frontmatter
      const content = raw.replace(/^---[\s\S]*?---\n*/, '');
      return `# ${page.data.title} (${page.url})\n\n${content.trim()}`;
    } catch {
      // Try next extension
    }
  }

  // Fallback: try as directory with index file
  for (const ext of ['.md', '.mdx']) {
    const filePath = path.join(docsDir, slugPath, 'index' + ext);
    try {
      const raw = await fs.readFile(filePath, 'utf-8');
      const content = raw.replace(/^---[\s\S]*?---\n*/, '');
      return `# ${page.data.title} (${page.url})\n\n${content.trim()}`;
    } catch {
      // Try next
    }
  }

  return `# ${page.data.title} (${page.url})\n\nNo content available.`;
}
