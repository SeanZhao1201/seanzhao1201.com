import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import aboutHtml from '../about.md';

gsap.registerPlugin(ScrollTrigger);

const Words = ({ text }) =>
  text.split(' ').map((w, i) => (
    <span className="word" key={i}>
      <span className="word-inner">{w}</span>
    </span>
  ));

const NAV_LINKS = [
  { label: 'Research', target: '#research' },
  { label: 'Publications', target: '#publications' },
  { label: 'Teaching', target: '#teaching' },
  { label: 'Side Projects', target: '#side-projects' },
  { label: 'Contact', target: '#get-in-touch' },
];

export default function App() {
  const rootRef = useRef(null);
  const lenisRef = useRef(null);
  const toggleRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const sectionEls = NAV_LINKS.map(({ target }) =>
      document.querySelector(target),
    ).filter(Boolean);
    const updateActive = () => {
      let current = '';
      for (const el of sectionEls) {
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          current = `#${el.id}`;
        }
      }
      setActiveSection(current);
    };

    // Respect reduced-motion: no smooth-scroll hijack, no scroll-driven
    // animation — content renders in its natural, fully visible state.
    // The progress bar and scrollspy are status feedback, not motion,
    // so they stay live here too.
    if (reduceMotion) {
      const bar = rootRef.current?.querySelector('.scroll-progress');
      const onScroll = () => {
        setScrolled(window.scrollY > 24);
        updateActive();
        if (bar) {
          const max =
            document.documentElement.scrollHeight - window.innerHeight;
          bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
        }
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      };
    }

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    lenis.on('scroll', ({ scroll }) => {
      ScrollTrigger.update();
      setScrolled(scroll > 24);
      updateActive();
    });
    updateActive();

    const ctx = gsap.context(() => {
      gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      gsap.from('.hero-line', {
        yPercent: 110,
        opacity: 0,
        duration: 1.4,
        ease: 'power4.out',
        stagger: 0.12,
        delay: 0.1,
      });

      gsap.to('.hero-inner', {
        yPercent: -25,
        opacity: 0,
        scale: 0.96,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.4,
        },
      });

      gsap.fromTo(
        '.pin-section .word-inner',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.pin-section',
            start: 'top top',
            end: '+=90%',
            pin: true,
            scrub: 0.6,
          },
        },
      );

      // Lists are excluded here — their li stagger below is their only
      // entrance, so items don't double-fade through two easings.
      gsap.utils.toArray('.markdown > *:not(ul)').forEach((el) => {
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        });
      });

      gsap.utils.toArray('.markdown ul').forEach((ul) => {
        gsap.from(ul.children, {
          y: 18,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: ul, start: 'top 88%' },
        });
      });
    }, rootRef);

    // Fraunces/Inter load after first layout; pinned-section trigger
    // positions depend on final metrics, so refresh once fonts settle.
    document.fonts?.ready?.then(() => ScrollTrigger.refresh());

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const scrollToTarget = (el) => {
    if (lenisRef.current) {
      // Distance-scaled duration: nearby sections arrive quickly, full-page
      // jumps stretch out so peak velocity stays below the strobing range.
      const distance = Math.abs(el.getBoundingClientRect().top - 56);
      lenisRef.current.scrollTo(el, {
        offset: -56,
        duration: gsap.utils.clamp(0.65, 1.6, distance / 3000),
      });
    } else {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 56,
      });
    }
  };

  const handleNavClick = (e, target) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(target);
    if (el) {
      scrollToTarget(el);
      // Move keyboard focus with the visual scroll; preventScroll keeps the
      // browser's instant scroll-into-view from fighting Lenis.
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  };

  const handleScrollTop = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, {
        duration: gsap.utils.clamp(0.65, 1.6, lenisRef.current.scroll / 3000),
      });
    } else {
      window.scrollTo({ top: 0 });
    }
  };

  const handleSkip = (e) => {
    e.preventDefault();
    const el = document.getElementById('main-content');
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { immediate: true });
    else {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY });
    }
    el.focus({ preventScroll: true });
  };

  return (
    <main ref={rootRef}>
      <a className="skip-link" href="#main-content" onClick={handleSkip}>
        Skip to content
      </a>
      <div className="grain" aria-hidden />
      <div className="frame" aria-hidden />
      <nav
        className={`nav${scrolled || menuOpen ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}
        aria-label="Primary"
      >
        <a href="#top" className="nav-brand" onClick={handleScrollTop}>
          Sean Zhao
        </a>
        <ul className="nav-links">
          {NAV_LINKS.map(({ label, target }) => (
            <li key={target}>
              <a
                href={target}
                className="nav-link"
                aria-current={activeSection === target ? 'location' : undefined}
                onClick={(e) => handleNavClick(e, target)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </nav>

      <div
        className={`nav-scrim${menuOpen ? ' is-open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />
      <div id="mobile-menu" className={`nav-panel${menuOpen ? ' is-open' : ''}`}>
        <ul>
          {NAV_LINKS.map(({ label, target }) => (
            <li key={target}>
              <a
                href={target}
                aria-current={activeSection === target ? 'location' : undefined}
                onClick={(e) => handleNavClick(e, target)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

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
        <a href="#top" className="footer-top" onClick={handleScrollTop}>
          Back to top ↑
        </a>
      </footer>
    </main>
  );
}
