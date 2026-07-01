import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Info, Rocket, ShoppingBag, Store, Wand2, Settings, Bell, LifeBuoy, FileText, HelpCircle,
  ChevronDown, ArrowUp, Search, Menu, X, Lightbulb, AlertTriangle,
} from 'lucide-react';
import docsData from './docsData';
import './Docs.css';

const ICON_MAP = {
  Info, Rocket, ShoppingBag, Store, Wand2, Settings, Bell, LifeBuoy, FileText, HelpCircle,
};

const Docs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState(() => {
    const init = {};
    docsData.forEach(s => { init[s.id] = true; });
    return init;
  });
  const [activeId, setActiveId] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState({});

  // IntersectionObserver — highlights which heading is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { threshold: 0.1, rootMargin: '-80px 0px -70% 0px' }
    );
    document.querySelectorAll('[data-docs-heading]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-expand the sidebar section that contains the active heading
  useEffect(() => {
    if (!activeId) return;
    for (const section of docsData) {
      if (section.id === activeId || section.subsections.some(sub => sub.id === activeId)) {
        setExpandedSections(prev => ({ ...prev, [section.id]: true }));
        break;
      }
    }
  }, [activeId]);

  // Show/hide scroll-to-top button
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Filter sections/subsections by search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return docsData;
    const q = searchQuery.toLowerCase();
    return docsData.reduce((acc, section) => {
      const sectionMatch = section.title.toLowerCase().includes(q);
      const matchedSubs = section.subsections.filter(sub => {
        if (sub.title.toLowerCase().includes(q)) return true;
        return sub.blocks.some(block => {
          if (block.content?.toLowerCase().includes(q)) return true;
          if (block.title?.toLowerCase().includes(q)) return true;
          if (block.items) {
            return block.items.some(item =>
              typeof item === 'string'
                ? item.toLowerCase().includes(q)
                : Object.values(item).some(v => typeof v === 'string' && v.toLowerCase().includes(q))
            );
          }
          return false;
        });
      });
      if (sectionMatch || matchedSubs.length > 0) {
        acc.push({ ...section, subsections: sectionMatch ? section.subsections : matchedSubs });
      }
      return acc;
    }, []);
  }, [searchQuery]);

  // Auto-expand all matching sections when searching
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const expanded = {};
    filteredData.forEach(s => { expanded[s.id] = true; });
    setExpandedSections(expanded);
  }, [filteredData, searchQuery]);

  const toggleSection = useCallback((id) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const scrollToSection = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileSidebarOpen(false);
  }, []);

  const handleSectionClick = useCallback((id) => {
    toggleSection(id);
    scrollToSection(id);
  }, [toggleSection, scrollToSection]);

  const toggleFaq = useCallback((key) => {
    setOpenFaqs(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // ── Block renderers ──────────────────────────────────────────────────────────

  const renderBlock = (block, bIdx, subsectionId) => {
    switch (block.type) {
      case 'text':
        return (
          <p
            key={bIdx}
            className="wmx-docs-text"
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        );

      case 'steps':
        return (
          <div key={bIdx}>
            {block.title && <p className="wmx-docs-steps-title">{block.title}</p>}
            <ol className="wmx-docs-steps">
              {block.items.map((item, i) => (
                <li key={i}>
                  <span className="wmx-docs-step-number">{i + 1}</span>
                  <span
                    className="wmx-docs-step-content"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                </li>
              ))}
            </ol>
          </div>
        );

      case 'list':
        return (
          <div key={bIdx} className="wmx-docs-list">
            {block.title && <p className="wmx-docs-list-title">{block.title}</p>}
            {block.items.map((item, i) => (
              <div key={i} className="wmx-docs-list-item">
                <strong className="wmx-docs-list-item-label">{item.label}</strong>
                <span className="wmx-docs-list-item-text">{item.text}</span>
              </div>
            ))}
          </div>
        );

      case 'note':
        return (
          <div key={bIdx} className="wmx-docs-note">
            <Info size={16} className="wmx-docs-note-icon" />
            <span
              className="wmx-docs-callout-content"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          </div>
        );

      case 'tip':
        return (
          <div key={bIdx} className="wmx-docs-tip">
            <Lightbulb size={16} className="wmx-docs-tip-icon" />
            <span
              className="wmx-docs-callout-content"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          </div>
        );

      case 'warning':
        return (
          <div key={bIdx} className="wmx-docs-warning">
            <AlertTriangle size={16} className="wmx-docs-warning-icon" />
            <span
              className="wmx-docs-callout-content"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          </div>
        );

      case 'faq':
        return (
          <div key={bIdx} className="wmx-docs-faq">
            {block.items.map((item, i) => {
              const faqKey = `${subsectionId}-${i}`;
              const isOpen = !!openFaqs[faqKey];
              return (
                <div key={i} className={`wmx-docs-faq-item${isOpen ? ' open' : ''}`}>
                  <button
                    className="wmx-docs-faq-question"
                    onClick={() => toggleFaq(faqKey)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={16} className="wmx-docs-faq-chevron" />
                  </button>
                  <div className="wmx-docs-faq-answer">
                    <div className="wmx-docs-faq-answer-content">{item.a}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="wmx-docs">

      {/* Mobile sidebar toggle */}
      <button
        className="wmx-docs-mobile-toggle"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open documentation sidebar"
      >
        <Menu size={20} className="wmx-docs-mobile-toggle-icon" />
      </button>

      {/* Mobile backdrop — always rendered, toggled via class */}
      <div
        className={`wmx-docs-backdrop${mobileSidebarOpen ? ' visible' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className={`wmx-docs-sidebar${mobileSidebarOpen ? ' open' : ''}`}>
        <div className="wmx-docs-sidebar-header">
          <span className="wmx-docs-sidebar-title"><span>WMX</span> Docs</span>
          <button
            className="wmx-docs-sidebar-close"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="wmx-docs-search">
          <div className="wmx-docs-search-wrapper">
            <Search size={14} className="wmx-docs-search-icon" />
            <input
              type="text"
              className="wmx-docs-search-input"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="wmx-docs-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <nav className="wmx-docs-nav">
          {filteredData.length === 0 ? (
            <div className="wmx-docs-no-results">
              <Search size={48} className="wmx-docs-no-results-icon" />
              <p className="wmx-docs-no-results-title">No results found</p>
              <p className="wmx-docs-no-results-text">
                Try a different search term.
              </p>
            </div>
          ) : (
            filteredData.map(section => {
              const Icon = ICON_MAP[section.icon];
              const isExpanded = !!expandedSections[section.id];
              const isActive =
                activeId === section.id ||
                section.subsections.some(sub => sub.id === activeId);

              return (
                <div key={section.id} className="wmx-docs-nav-section">
                  <button
                    className={`wmx-docs-nav-section-btn${isActive ? ' active' : ''}`}
                    onClick={() => handleSectionClick(section.id)}
                  >
                    {Icon && <Icon size={15} className="wmx-docs-nav-section-icon" />}
                    <span>{section.title}</span>
                    <ChevronDown
                      size={13}
                      className={`wmx-docs-nav-section-chevron${isExpanded ? ' expanded' : ''}`}
                    />
                  </button>

                  {/* Always rendered — CSS max-height transition handles show/hide */}
                  <ul className={`wmx-docs-nav-subsections${isExpanded ? ' expanded' : ''}`}>
                    {section.subsections.map(sub => (
                      <li key={sub.id}>
                        <button
                          className={`wmx-docs-nav-sub-btn${activeId === sub.id ? ' active' : ''}`}
                          onClick={() => scrollToSection(sub.id)}
                        >
                          {sub.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </nav>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <main className="wmx-docs-content">
        {docsData.map((section, sIdx) => {
          const Icon = ICON_MAP[section.icon];
          return (
            <section
              key={section.id}
              className={`wmx-docs-section${sIdx === 0 ? ' wmx-docs-section--intro' : ''}`}
            >
              <div
                id={section.id}
                data-docs-heading=""
                className="wmx-docs-section-heading"
              >
                {Icon && <Icon size={22} className="wmx-docs-section-heading-icon" />}
                <h2 className="wmx-docs-section-title">{section.title}</h2>
              </div>

              {section.subsections.map(sub => (
                <div key={sub.id} className="wmx-docs-subsection">
                  <h3
                    id={sub.id}
                    data-docs-heading=""
                    className="wmx-docs-subsection-heading"
                  >
                    {sub.title}
                  </h3>
                  <div className="wmx-docs-blocks">
                    {sub.blocks.map((block, bIdx) => renderBlock(block, bIdx, sub.id))}
                  </div>
                </div>
              ))}

              {sIdx < docsData.length - 1 && <hr className="wmx-docs-divider" />}
            </section>
          );
        })}
      </main>

      {/* Scroll to top — always rendered, toggled via class */}
      <button
        className={`wmx-docs-scroll-top${showScrollTop ? ' visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <ArrowUp size={18} className="wmx-docs-scroll-top-icon" />
      </button>
    </div>
  );
};

export default Docs;
