import { source } from '@/lib/source';
import { getLLMText } from '@/lib/get-llm-text';

export const revalidate = false;

export async function GET() {
  const pages = source.getPages();
  const texts = await Promise.all(pages.map(getLLMText));

  return new Response(texts.join('\n\n---\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
