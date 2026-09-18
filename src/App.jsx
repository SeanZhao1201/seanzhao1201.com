import { useRef } from 'react';
import aboutHtml from '../about.md';
import { useSiteMotion } from './shared/useSiteMotion';
import SiteNav from './shared/SiteNav';
import Words from './shared/Words';

const NAV_LINKS = [
  { label: 'Research', target: '#research' },
  { label: 'Publications', target: '#publications' },
  { label: 'Teaching', target: '#teaching' },
  { label: 'Side Projects', target: '#side-projects' },
  { label: 'Contact', target: '#get-in-touch' },
];

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
    <main ref={rootRef}>
      <a className="skip-link" href="#main-content" onClick={handleSkip}>
        Skip to content
      </a>
      <div className="grain" aria-hidden />
      <div className="frame" aria-hidden />
      <SiteNav
        brand="Sean Zhao"
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
            <p className="hero-line eyebrow">Personal Site — Seattle, WA</p>
          </div>
          <h1 className="hero-title">
            <span className="hero-mask">
              <span className="hero-line">Sean</span>
            </span>
            <span className="hero-mask">
              <span className="hero-line">Zhao</span>
            </span>
          </h1>
          <div className="hero-meta">
            <div className="hero-mask">
              <p className="hero-line subtitle">
                PhD candidate · Built Environment · University of Washington
              </p>
            </div>
            <div className="hero-mask">
              <p className="hero-line tagline">
                Building LLM multi-agent systems for construction planning,
                scheduling, and supply-chain coordination.
              </p>
            </div>
          </div>
          <div className="hero-mask">
            <p className="hero-line scroll-hint">Scroll ↓</p>
          </div>
        </div>
        <div className="hero-coords" aria-hidden>
          <span>47.66° N</span>
          <span>122.31° W</span>
          <span>Est. 2026</span>
        </div>
      </section>

      <section className="pin-section">
        <div className="pin-content">
          <p className="pin-kicker">The Work</p>
          <h2 className="pin-title">
            <Words text="LLMs meet construction." />
          </h2>
          <p className="pin-sub">
            <Words text="From BIM and 4D scheduling to adaptive, knowledge-aware decision support." />
          </p>
        </div>
      </section>

      <section className="content" id="main-content" tabIndex={-1}>
        <article
          className="markdown"
          dangerouslySetInnerHTML={{ __html: aboutHtml }}
        />
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Sean Zhao · Seattle, WA</p>
        <a href="/jiuhengasia" className="footer-link">
          Jiuheng Asia →
        </a>
        <a href="#top" className="footer-top" onClick={handleScrollTop}>
          Back to top ↑
        </a>
      </footer>
    </main>
  );
}
