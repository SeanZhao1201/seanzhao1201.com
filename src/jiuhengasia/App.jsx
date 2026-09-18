import { Fragment, useRef } from 'react';
import { useSiteMotion } from '../shared/useSiteMotion';
import SiteNav from '../shared/SiteNav';
import Words from '../shared/Words';
import {
  NAV_LINKS,
  STATS,
  CORE_BUSINESS,
  SERVICES,
  CASE_GROUPS,
  BRANDS,
  CITIES,
  FACTORY_IMAGES,
} from './content';

const Figure = ({ image, className = '', eager = false }) => (
  <figure className={`jh-figure ${className}`.trim()}>
    <img
      src={image.src}
      width={image.w}
      height={image.h}
      alt={image.caption === image.alt ? '' : image.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
    {image.caption && <figcaption>{image.caption}</figcaption>}
  </figure>
);

const Gallery = ({ images, layout }) => (
  <div className={`jh-grid jh-grid--${layout}`} data-stagger>
    {images.map((image) => (
      <Figure key={image.src} image={image} />
    ))}
  </div>
);

const Heading = ({ id, zh, en }) => (
  <h2 id={id}>
    <span lang="zh-CN">{zh}</span>
    <span className="jh-en" lang="en">
      {en}
    </span>
  </h2>
);

export default function App() {
  const rootRef = useRef(null);
  const {
    scrolled,
    menuOpen,
    setMenuOpen,
    activeSection,
    toggleRef,
    handleNavClick,
    handleScrollTop,
    handleSkip,
  } = useSiteMotion({ rootRef, navLinks: NAV_LINKS });

  return (
    <main ref={rootRef} className="jh">
      <a
        className="skip-link"
        href="#main-content"
        onClick={handleSkip}
        lang="en"
      >
        Skip to content
      </a>
      <div className="grain" aria-hidden />
      <div className="frame" aria-hidden />
      <SiteNav
        lang="en"
        brand={
          <>
            <img
              className="jh-brand-mark"
              src="/jiuhengasia/mark-66.png"
              width="66"
              height="66"
              alt=""
              aria-hidden
              decoding="async"
            />
            Jiuheng
          </>
        }
        links={NAV_LINKS}
        scrolled={scrolled}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        activeSection={activeSection}
        toggleRef={toggleRef}
        onNavClick={handleNavClick}
        onScrollTop={handleScrollTop}
      />

      <div className="scroll-progress" aria-hidden />

      <section className="hero">
        <div className="hero-bg" aria-hidden />
        <div className="hero-inner">
          <div className="hero-mask">
            <p className="hero-line eyebrow">
              <span lang="zh-CN">久桁广告会展（上海）有限公司</span>
              <span lang="en"> — Shanghai</span>
            </p>
          </div>
          <h1 className="hero-title">
            <span className="hero-mask">
              <span className="hero-line">Jiuheng</span>
            </span>
            <span className="hero-mask">
              <span className="hero-line">Asia</span>
            </span>
          </h1>
          <div className="hero-meta">
            <div className="hero-mask">
              <p className="hero-line subtitle">
                久桁广告会展 ·{' '}
                <span lang="en">Live Communication · a new dimension</span>
              </p>
            </div>
            <div className="hero-mask">
              <p className="hero-line tagline">
                我们热衷于打造美观、智慧且富有灵感的作品，专注于在多个触点助力实现您的商业目标。
              </p>
            </div>
          </div>
          <div className="hero-mask">
            <p className="hero-line scroll-hint">Scroll ↓</p>
          </div>
        </div>
        <div className="hero-coords" aria-hidden>
          <span>31.23° N</span>
          <span>121.47° E</span>
          <span>8 Cities · APAC</span>
        </div>
      </section>

      <section className="pin-section">
        <div className="pin-content">
          <p className="pin-kicker" lang="en">
            Journey Far, Move the Future
          </p>
          <h2 className="pin-title" lang="en">
            <Words text="Live communication." />
          </h2>
          <p className="pin-sub" lang="zh-CN">
            <Words text="专注车企，不止于车企。从策略与品牌，到活动、展厅与主题特展。" />
          </p>
        </div>
      </section>

      <section className="content" id="main-content" tabIndex={-1}>
        <article className="markdown">
          {/* 01 About */}
          <Heading id="about" zh="关于久桁" en="About" />
          <p>
            久桁广告会展（上海）有限公司是一家立足上海、覆盖亚太的
            Live Communication 机构。我们提供创意咨询与项目执行：以主题内容产品协助企业、文旅与产业园进行整合营销与空间解决方案，以独特的
            IP 产品和服务支撑商业赋能与社会创新。
          </p>
          <p>
            四条核心业务——营销活动、企业展厅与室内、广告营销、主题特展——覆盖从策略、品牌与内容到现场落地的完整链路；常熟自有工厂负责展具与物料的生产制造。
          </p>
          <div className="jh-stats" data-stagger>
            {STATS.map((s) => (
              <div className="jh-stat" key={s.label}>
                <span className="jh-stat-value">
                  {s.value}
                  {s.unit && <small>{s.unit}</small>}
                </span>
                <span className="jh-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* 02 Core business */}
          <Heading id="core-business" zh="核心业务" en="Core Business" />
          <div className="jh-cards" data-stagger>
            {CORE_BUSINESS.map((b, i) => (
              <div className="jh-card" key={b.en}>
                <span className="jh-card-index">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="jh-card-zh">{b.zh}</span>
                <span className="jh-card-en" lang="en">
                  {b.en}
                </span>
                <p className="jh-card-desc">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* 03 Services */}
          <Heading id="services" zh="业务范围" en="Services" />
          <p>从策略到执行的一站式能力，五个板块，覆盖品牌传播的每一个触点。</p>
          <div className="jh-services" data-stagger>
            {SERVICES.map((col) => (
              <div className="jh-service" key={col.en}>
                <h3>
                  {col.zh}
                  <span className="jh-en" lang="en">
                    {col.en}
                  </span>
                </h3>
                <ul>
                  {col.items.map(([zh, en]) => (
                    <li key={en}>
                      <span>{zh}</span>
                      <span className="jh-service-en" lang="en">
                        {en}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 04 Work */}
          <Heading id="cases" zh="业务案例" en="Selected Work" />
          {/* Every piece is a direct child of .markdown on purpose: the
              shared motion hook block-fades direct children and staggers
              data-stagger groups, so nothing nests two entrances. */}
          {CASE_GROUPS.map((group) => (
            <Fragment key={group.en}>
              <h3 className="jh-group-title">
                <span>{group.zh}</span>
                <span className="jh-en" lang="en">
                  {group.en}
                </span>
              </h3>
              {group.intro && <Gallery images={group.intro} layout="three" />}
              {group.cases.map((c) => (
                <Fragment key={c.title}>
                  <h4 className="jh-case-title">{c.title}</h4>
                  <p className="jh-case-meta">{c.meta}</p>
                  {c.body && <p className="jh-case-body">{c.body}</p>}
                  {c.stats && (
                    <div className="jh-stats jh-stats--case" data-stagger>
                      {c.stats.map((s) => (
                        <div className="jh-stat" key={s.label}>
                          <span className="jh-stat-value">{s.value}</span>
                          <span className="jh-stat-label">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <Gallery images={c.images} layout={c.layout} />
                </Fragment>
              ))}
            </Fragment>
          ))}

          {/* 05 Clients */}
          <Heading id="clients" zh="服务品牌" en="Clients" />
          <p>专注车企，不止于车企。</p>
          <div className="jh-brands" data-stagger>
            {BRANDS.map(([zh, en]) => (
              <div className="jh-brand" key={en}>
                <span className="jh-brand-en" lang="en">
                  {en}
                </span>
                {zh !== en && <span className="jh-brand-zh">{zh}</span>}
              </div>
            ))}
          </div>

          {/* 06 Presence */}
          <Heading id="presence" zh="区域分布" en="Regional Presence" />
          <p>以上海为总部，服务网络覆盖亚太八座城市。</p>
          <div className="jh-cities" data-stagger>
            {CITIES.map((c) => (
              <div className={`jh-city${c.hq ? ' is-hq' : ''}`} key={c.en}>
                <span className="jh-city-zh">{c.zh}</span>
                <span className="jh-city-en" lang="en">
                  {c.en}
                  {c.hq && <span className="jh-city-hq">HQ</span>}
                </span>
                <span className="jh-city-coords">
                  {c.lat} · {c.lng}
                </span>
              </div>
            ))}
          </div>

          {/* 07 Factory */}
          <Heading id="factory" zh="我们的工厂" en="Our Factory" />
          <p>
            常熟 JA 科技有限公司注册资本 5000 万元，占地面积 20,000
            平方米，采用自动化设备以提高工艺精度和生产效率——展具、展台与物料从设计到制造、安装一体完成。
          </p>
          <Gallery images={FACTORY_IMAGES} layout="factory" />

          {/* 08 Contact */}
          <Heading id="contact" zh="联系我们" en="Contact" />
          <p className="jh-closing" lang="en">
            Journey far, move the future.
          </p>
          <ul>
            <li>
              <strong>Email</strong>
              <a href="mailto:jorson@jiuheng.asia">jorson@jiuheng.asia</a>
            </li>
            <li>
              <strong>电话 · Phone</strong>
              <a href="tel:+8618116297149">+86 181 1629 7149</a>
            </li>
            <li className="jh-contact-static">
              <strong>总部 · Base</strong>
              <span className="jh-contact-plain">上海 Shanghai, China</span>
            </li>
          </ul>
        </article>
      </section>

      <footer className="footer jh-footer">
        <p>
          © {new Date().getFullYear()} 久桁广告会展（上海）有限公司 · Jiuheng
          Advertising &amp; Exhibition (Shanghai) Co., Ltd
        </p>
        <a href="/" className="footer-link" lang="en">
          Site by Sean Zhao →
        </a>
        <a
          href="#top"
          className="footer-top"
          onClick={handleScrollTop}
          lang="en"
        >
          Back to top ↑
        </a>
      </footer>
    </main>
  );
}
