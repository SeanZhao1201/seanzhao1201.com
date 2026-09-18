# seanzhao1201.com

Personal site of **Sean (Xianxiang) Zhao** — PhD candidate in Built Environment at the University of Washington, working on LLM multi-agent systems for construction planning, scheduling, and supply-chain coordination.

**Live:** [seanzhao1201.com](https://seanzhao1201.com)

## How it works

- Single-page React app with editorial typography (Fraunces + Inter, self-hosted via [Fontsource](https://fontsource.org/)).
- Scroll experience built on GSAP ScrollTrigger + Lenis; respects `prefers-reduced-motion`.
- All content lives in [`about.md`](./about.md) and is compiled to HTML **at build time** by a small Vite plugin (remark/rehype), so no markdown parser ships to the browser.
- Deployed on Cloudflare Workers static assets (`wrangler deploy`).

## Pages

- `/` — the personal site above (`index.html` → `src/App.jsx`, content from `about.md`).
- `/jiuhengasia` — company page for Jiuheng Advertising & Exhibition (Shanghai), built in the same design system (`jiuhengasia.html` → `src/jiuhengasia/`, copy and image manifest in `content.js`, photos in `public/jiuhengasia/`). Both pages share the nav and scroll choreography in `src/shared/`.

## Develop

```sh
npm install
npm run dev
```

## Deploy

```sh
npm run deploy
```

## Editing content

Edit `about.md` — headings become numbered sections automatically, and section icons are mapped by heading id in `src/index.css`. For the company page, edit `src/jiuhengasia/content.js`.
