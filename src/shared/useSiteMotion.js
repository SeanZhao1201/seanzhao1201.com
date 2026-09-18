import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const NAV_OFFSET = 56;

/**
 * Shared scroll experience for every page on the site: Lenis smooth
 * scroll, GSAP ScrollTrigger choreography (progress bar, hero entrance
 * and parallax, pinned word reveal, content entrances), scrollspy for
 * the nav, and the mobile menu's keyboard behaviour.
 *
 * Pages opt in by using the same class names (.hero-line, .pin-section,
 * .markdown, .scroll-progress). Elements marked `data-stagger` (and every
 * `ul`) get a per-child stagger instead of the block-level fade, so items
 * never double-fade through two easings.
 *
 * `extra(ctx)` runs inside the gsap.context for page-specific tweens; it is
 * skipped under prefers-reduced-motion like everything else here.
 */
export function useSiteMotion({ rootRef, navLinks, extra }) {
  const lenisRef = useRef(null);
  const toggleRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const sectionEls = navLinks
      .map(({ target }) => document.querySelector(target))
      .filter(Boolean);
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

      // Lists and data-stagger blocks are excluded here — their child
      // stagger below is their only entrance, so items don't double-fade
      // through two easings. Both selectors are direct children only, so
      // a list nested inside a staggered group is carried by its parent.
      gsap.utils
        .toArray('.markdown > *:not(ul):not([data-stagger])')
        .forEach((el) => {
          gsap.from(el, {
            y: 32,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
          });
        });

      gsap.utils
        .toArray('.markdown > ul, .markdown > [data-stagger]')
        .forEach((group) => {
          gsap.from(group.children, {
            y: 18,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: group, start: 'top 88%' },
          });
        });

      extra?.({ gsap, ScrollTrigger });
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
    // navLinks/extra are stable module-level values on every page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const distance = Math.abs(el.getBoundingClientRect().top - NAV_OFFSET);
      lenisRef.current.scrollTo(el, {
        offset: -NAV_OFFSET,
        duration: gsap.utils.clamp(0.65, 1.6, distance / 3000),
      });
    } else {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
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

  return {
    scrolled,
    menuOpen,
    setMenuOpen,
    activeSection,
    toggleRef,
    handleNavClick,
    handleScrollTop,
    handleSkip,
  };
}
