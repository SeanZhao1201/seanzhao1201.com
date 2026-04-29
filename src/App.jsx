import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import aboutRaw from '../about.md?raw';

gsap.registerPlugin(ScrollTrigger);

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { content: raw };
  return { content: match[2] };
}

export default function App() {
  const rootRef = useRef(null);
  const { content } = parseFrontmatter(aboutRaw);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    let rafId = requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);

    const ctx = gsap.context(() => {
      gsap.from('.hero-line', {
        yPercent: 110,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.12,
      });

      gsap.to('.pin-content', {
        scale: 1.6,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.pin-section',
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.6,
        },
      });

      gsap.utils.toArray('.markdown > *').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });
    }, rootRef);

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main ref={rootRef}>
      <section className="hero">
        <div className="hero-mask">
          <h1 className="hero-line">Sean Zhao</h1>
        </div>
        <div className="hero-mask">
          <p className="hero-line subtitle">
            PhD candidate · Built Environment · University of Washington
          </p>
        </div>
        <div className="hero-mask">
          <p className="hero-line scroll-hint">Scroll ↓</p>
        </div>
      </section>

      <section className="pin-section">
        <div className="pin-content">
          <h2>LLMs meet construction.</h2>
          <p>From BIM and 4D scheduling to adaptive, knowledge-aware decision support.</p>
        </div>
      </section>

      <section className="content">
        <article className="markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Sean Zhao</p>
      </footer>
    </main>
  );
}
