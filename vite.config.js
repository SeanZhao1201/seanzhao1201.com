import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';

// The page's <h1> is the hero name; demote the markdown h1 ("About Me")
// to a styled heading of level 2 so the document has a single h1.
function rehypeDemoteH1() {
  return (tree) => {
    const visit = (node) => {
      if (node.tagName === 'h1') {
        node.tagName = 'div';
        node.properties = {
          ...node.properties,
          className: ['md-h1'],
          role: 'heading',
          'aria-level': '2',
        };
      }
      (node.children || []).forEach(visit);
    };
    visit(tree);
  };
}

// Compile .md imports to an HTML string at build time so the markdown
// parser (react-markdown + remark/rehype) never ships to the client.
function markdownToHtml() {
  return {
    name: 'markdown-to-html',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md')) return null;
      const content = code.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
      const html = String(
        await unified()
          .use(remarkParse)
          .use(remarkGfm)
          .use(remarkRehype)
          .use(rehypeSlug)
          .use(rehypeDemoteH1)
          .use(rehypeStringify)
          .process(content),
      );
      return { code: `export default ${JSON.stringify(html)};`, map: null };
    },
  };
}

export default defineConfig({
  plugins: [markdownToHtml(), react(), cloudflare()],
});
