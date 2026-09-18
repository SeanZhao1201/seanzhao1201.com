# CLAUDE.md — seanzhao1201.com

> Sean (Xianxiang) Zhao 个人学术网站的协作手册。
> **维护规则**：每完成一轮迭代，更新「当前状态」和「待办」，并在「更新日志」顶部追加一条（日期 + commit + 一句话）。前四节只在架构真正变化时才动。

## 项目速览

- React 站点：Vite + React 18，GSAP ScrollTrigger + Lenis 滚动叙事，编辑风排版（Fraunces Variable + Inter，@fontsource 自托管）。
- 两个页面共用一套动效与导航：`src/shared/`（`useSiteMotion` hook、`SiteNav`、`Words`）。
  - `/` 个人主页：`index.html` → `src/App.jsx`，正文全部在根目录 **`about.md`**，构建期由 `vite.config.js` 内置插件（remark/rehype 管线）编译为 HTML —— 浏览器端零 markdown 解析。
  - `/jiuhengasia` 久桁广告会展公司页：`jiuhengasia.html` → `src/jiuhengasia/`（`App.jsx` 结构、`content.js` 全部文案与图片清单、`jiuhengasia.css` 页面专属样式），图片在 `public/jiuhengasia/`。Vite 多页构建（`vite.config.js` 的 `PAGES` 数组），Cloudflare 静态资产用 `<name>.html` 直接服务无扩展名路径（`/jiuhengasia/`、`/jiuhengasia.html` 会 307 到 `/jiuhengasia`）。
- 部署：Cloudflare Workers 静态资产。**push 到 main → Workers Builds 自动构建部署**；本地手动部署用 `npm run deploy`。
- 统计：Cloudflare Web Analytics（边缘自动注入 beacon，无需任何代码）。查看：dash.cloudflare.com → Analytics → Web analytics。

## 修改剧本（按场景）

- **改个人主页文案** → 只动 `about.md`。H2 自动获得编号（CSS counter）和 id（rehype-slug 由标题文本生成）。
- **改久桁页文案 / 案例 / 图片** → 只动 `src/jiuhengasia/content.js`（文案全部从久桁业务介绍 PDF 转录，勿凭空添加事实）。新图片放 `public/jiuhengasia/`（JPEG，宽 ≤1400，质量 80）并把尺寸写进 `DIMS`，`<img>` 才能预留占位防 CLS。案例 `layout` 可选：`one / two / two-small / three / feature / display / tiles / tiles4 / factory`。
- **再加一个子页面** → 根目录建 `<name>.html`，`src/<name>/main.jsx` 引入 `../index.css`，`vite.config.js` 的 `PAGES` 加名字；复用 `useSiteMotion` + `SiteNav`，保持 `.hero-line / .pin-section / .markdown / .scroll-progress` 类名即可自动获得全套动效。`.markdown` 的直接子元素整块淡入，标了 `data-stagger` 的直接子元素按子项错落 —— 别嵌套两层入场。
- **新增区块** → `about.md` 加 `## 标题`；要图标就在 `src/index.css` 按 id 加一条 `.markdown h2#<slug>::after`（内联 SVG data URL，风格：1.5px 线稿）；要进顶部导航就在 `src/App.jsx` 的 `NAV_LINKS` 加一项。
- **改样式** → 设计 token 集中在 `src/index.css` 的 `:root`（颜色 / 字体 / 间距 / 虚线规则）。
- **加静态资源** → 放 `public/`（构建时原样拷贝到站点根）。
- **hero 或大标题改动后** → 记得重新生成 `public/og.png`（1200×630：本地 build + 截图 hero，隐藏 .nav / .scroll-progress / .scroll-hint）。
- 联系方式卡片 = markdown 里**最后一个 ul**（`ul:last-of-type` 虚线网格）——别在它后面再添加其他列表（久桁页同理）。
- 久桁页的 OG 图由 `scripts/og-jiuhengasia.py` 用 PIL + Fraunces/Inter/Noto Sans SC 合成（非截图），改 hero 文案后运行它重生成 `public/jiuhengasia/og.png`。
- 久桁页的虚线网格（stats / 卡片 / 业务范围 / 品牌 / 城市 / 联系）都用**固定列数**且能整除条目数（或让余数跨列）——边框画在条目上，任何空格子都会让虚线框缺角。增删条目时同步检查 `jiuhengasia.css` 里的列数。
- `about.md` 里的 h1 会在构建期降级为 `.md-h1`（全页唯一 h1 是 hero 的名字），不需要手动处理。

## 红线（任何改动不得破坏）

- 不引入 Google Fonts / 第三方字体 CDN（大陆访客不可达 + 渲染阻塞）；新字重一律走 @fontsource。
- 不把 markdown 解析器带回运行时 bundle（构建期编译是刻意为之，JS 已从 458KB 减到 293KB）。
- 新动画必须放进 `gsap.context` 并尊重 `prefers-reduced-motion` —— `App.jsx` 的 useEffect 顶部有 early-return 模式，照抄即可。
- 移动端 ≤640px 用 MENU/CLOSE 下拉导航；nav 左右 padding 用 `max(16px, …)` 防负值贴边。
- `backdrop-filter` 过渡的两端 filter 列表必须逐项位置对应（saturate↔saturate、blur↔blur），否则浏览器退化为离散跳变（nav 和 nav-panel 的 `saturate(100%) blur(0px)` 基态是刻意的，勿简写成 `blur(0)`）。
- 小字灰色对比度不得低于 WCAG AA（`--dim` 当前 #86868b，勿调暗）。
- 正文链接保持常驻下划线（双层 background 技巧：淡蓝常驻 + hover 实蓝扫过）。

## 常用命令

```sh
npm install        # 首次或依赖变更后
npm run dev        # http://localhost:5173
npm run build      # 产物在 dist/
npm run deploy     # 手动部署（一般不需要，push 即部署）
```

## 当前状态

**2026-09-17** · 本地分支 `jiuhengasia`（待 Sean push 上线）· 新增 `/jiuhengasia` 久桁广告会展公司页：内容全部转录自 40 页业务介绍 PDF（8 个区块：关于 / 核心业务 / 业务范围 / 业务案例 22 组 / 服务品牌 14 家 / 区域分布 8 城 / 工厂 / 联系），93 张案例图（按各自在任意视口下的最大渲染宽度导出，手机 3 倍屏也清晰，共 6.7MB，全部懒加载 + 预留尺寸），独立 OG 图、favicon、JSON-LD Organization，sitemap 已收录。主站入口：Side Projects 一句 + 页脚「Jiuheng Asia →」。顺带把导航 / 滚动动效抽成 `src/shared/` 供两页共用。无头浏览器在 390 / 768 / 1280 三档走查通过（无控制台错误、无横向溢出）。线上仍是 main `87f6ae6`。

## 待办

- [ ] 久桁页：PDF 里部分原图只有 200–400px（2026 MG HS 发布、MIAS 小图、工厂小图），如有高清原片替换 `public/jiuhengasia/` 同名文件并更新 `DIMS`
- [ ] 久桁页：14 家服务品牌目前是文字墙（PDF 内 logo 仅几十像素），拿到矢量 logo 后可换成 logo 墙
- [ ] 久桁页：联系区仅邮箱 + 电话（PDF 只有这两项），可补地址 / 微信 / 官网
- [ ] 头像放进 hero 右侧留白（等 Sean 提供照片）
- [ ] CV PDF 下载入口（等 Sean 提供文件；建议放 `public/cv.pdf` + Contact 区加卡片）
- [ ] Research 区块配图：多智能体架构图 / Synchro 4D 截图（等素材）
- [ ] 1–2 周后复查 Web Analytics 的 CLS Poor 占比（疑似字体交换或 hero 入场动画引起）
- [ ] （可选）Publications 每条加 BibTeX 一键复制
- [ ] 视觉走查（本轮实施时浏览器面板不渲染帧，只做了 DOM/计算样式验证）：桌面端 scrollspy 虚线下划线位置、641–760px 五个导航项不换行、125% 浏览器字号下 pinned 区结束位置

## 更新日志

- **2026-09-17** · `jiuhengasia` 分支：新增 `/jiuhengasia` 公司页（Vite 多页入口 + 共享动效模块），素材由 PyMuPDF 从 PDF 抽取、PIL 压缩；OG 图脚本合成；多 agent 评审（内容准确性 / 重构回归 / CSS+a11y / 构建路由 SEO / 性能 5 维度，约一半发现经 3 票对抗核实，其余因额度中断改为人工逐条核对）后修复约 30 项；无头 Edge（puppeteer-core）三档视口走查。主站改动仅限：页脚加链接、about.md 加一句、`App.jsx` 改为调用共享模块（行为不变）。
- **2026-08-11** · `apple-design-polish` 分支：按 Apple 设计原则（WWDC fluid interfaces / materials / typography）做 6 维度多 agent 评审（31 项发现 → 去重核实后 25 项落地）：§1 响应（全站 :active、去 tap-highlight）、§16 寻路（scrollspy aria-current + 虚线下划线、Side Projects 改名、footer 返回顶部）、§12 材质（filter 列表匹配使 blur 真正过渡、nav 0.72 加重、开菜单时 nav 与面板合为一块 0.88 玻璃、scrim、面板 blur 材质化 + 镜像缓动）、§10 触控目标 48px、§15 排版（px→rem 支持浏览器字号、字距三级 token、hero -0.035em）、§14 适配（skip-link、focus-visible、Escape 焦点返还、reduced-motion 下进度条/温和渐隐、reduced-transparency、contrast: more）、动效清理（列表双重入场合一、进度条去二级平滑、链接下划线 expo-out、删非交互 h2 图标 hover 动画、nav 滚动距离自适应时长）。
- **2026-07-18** · `fb543fb` 上线：移动端导航 + 贴边修复、reduced-motion、@fontsource 自托管、构建期 markdown（-36% JS）、SEO/分享全家桶（favicon、OG 图、JSON-LD Person、canonical、robots、sitemap）、链接常驻下划线、单 h1、AA 对比度、README 补全；确认 Web Analytics 三个月前已自动启用。
- **2026-07-17** · 全站审查：代码 + 桌面/移动截图走查，产出 12 项改进清单（详见 claude.ai 项目文档 site-improvements-2026-07-17.md）。
- **2026-04 前后** · 初版上线：编辑风重设计、内容自 resume 同步、接入 Cloudflare Workers 与 Workers Builds。
