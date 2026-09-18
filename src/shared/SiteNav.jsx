/**
 * Fixed top bar + mobile menu shared by every page. Purely presentational:
 * state and handlers come from useSiteMotion so both stay in lockstep.
 */
export default function SiteNav({
  lang,
  brand,
  links,
  scrolled,
  menuOpen,
  setMenuOpen,
  activeSection,
  toggleRef,
  onNavClick,
  onScrollTop,
}) {
  return (
    <>
      <nav
        className={`nav${scrolled || menuOpen ? ' is-scrolled' : ''}${menuOpen ? ' is-open' : ''}`}
        aria-label="Primary"
        lang={lang}
      >
        <a href="#top" className="nav-brand" onClick={onScrollTop}>
          {brand}
        </a>
        <ul className="nav-links">
          {links.map(({ label, target }) => (
            <li key={target}>
              <a
                href={target}
                className="nav-link"
                aria-current={activeSection === target ? 'location' : undefined}
                onClick={(e) => onNavClick(e, target)}
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
      <div
        id="mobile-menu"
        className={`nav-panel${menuOpen ? ' is-open' : ''}`}
        lang={lang}
      >
        <ul>
          {links.map(({ label, target }) => (
            <li key={target}>
              <a
                href={target}
                aria-current={activeSection === target ? 'location' : undefined}
                onClick={(e) => onNavClick(e, target)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
