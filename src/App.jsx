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

const Words = ({ text }) =>
  text.split(' ').map((w, i) => (
    <span className="word" key={i}>
      <span className="word-inner">{w}</span>
    </span>
  ));

export default function App() {
  const rootRef = useRef(null);
  const { content } = parseFrontmatter(aboutRaw);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);

    const ctx = gsap.context(() => {
      gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
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

      gsap.utils.toArray('.markdown > *').forEach((el) => {
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

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main ref={rootRef}>
      <div className="scroll-progress" aria-hidden />

      <section className="hero">
        <div className="hero-bg" aria-hidden />
        <div className="hero-inner">
          <div className="hero-mask">
            <p className="hero-line eyebrow">Personal Website</p>
          </div>
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
        </div>
      </section>

      <section className="pin-section">
        <div className="pin-content">
          <h2 className="pin-title">
            <Words text="LLMs meet construction." />
          </h2>
          <p className="pin-sub">
            <Words text="From BIM and 4D scheduling to adaptive, knowledge-aware decision support." />
          </p>
        </div>
      </section>

      <section className="content">
        <article className="markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Sean Zhao · Seattle, WA</p>
      </footer>
    </main>
  );
}
