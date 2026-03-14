import { docs } from 'collections';
import { loader } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx';

const mdxSource = createMDXSource(docs.docs, docs.meta);

// fumadocs-mdx returns files as a function, but fumadocs-core expects an array
const files = typeof mdxSource.files === 'function'
  ? (mdxSource.files as unknown as () => unknown[])()
  : mdxSource.files;

export const source = loader({
  baseUrl: '/docs',
  source: { files } as ReturnType<typeof createMDXSource>,
});
