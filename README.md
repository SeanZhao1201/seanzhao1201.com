# seanzhao1201.com

Personal site of **Sean (Xianxiang) Zhao** — PhD candidate in Built Environment at the University of Washington, working on LLM multi-agent systems for construction planning, scheduling, and supply-chain coordination.

**Live:** [seanzhao1201.com](https://seanzhao1201.com)

## How it works

- Single-page React app with editorial typography (Fraunces + Inter, self-hosted via [Fontsource](https://fontsource.org/)).
- Scroll experience built on GSAP ScrollTrigger + Lenis; respects `prefers-reduced-motion`.
- All content lives in [`about.md`](./about.md) and is compiled to HTML **at build time** by a small Vite plugin (remark/rehype), so no markdown parser ships to the browser.
- Deployed on Cloudflare Workers static assets (`wrangler deploy`).

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

Edit `about.md` — headings become numbered sections automatically, and section icons are mapped by heading id in `src/index.css`.
