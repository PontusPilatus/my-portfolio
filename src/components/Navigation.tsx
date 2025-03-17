import { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X, Code } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const isMobile = useIsMobile();
  const { language, setLanguage, t } = useLanguage();

  // Check for low-end devices on initial load - less aggressive detection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect very low-end devices or problematic browsers
    const isLowEndDevice = (
      window.innerWidth < 360 || // Only very small screens
      (/iPhone|iPod/.test(navigator.userAgent) &&
        (navigator.userAgent.includes('iPhone OS 9') ||
          navigator.userAgent.includes('iPhone OS 10')))
    );

    setSimplifiedMode(isLowEndDevice);

    // For iPhone SE and similar devices, set scrolled to true immediately
    // to provide a more stable header experience
    if (window.innerWidth < 390) {
      setScrolled(true);
    }
  }, []);

  // Throttled scroll handler to improve performance
  const handleScroll = useCallback(() => {
    if (typeof window !== 'undefined' && !simplifiedMode) {
      setScrolled(window.scrollY > 20);
    }
  }, [simplifiedMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // For low-end devices, just set a fixed header style without animation
    if (simplifiedMode) {
      setScrolled(true);
      return;
    }

    // Throttle scroll events for better performance
    let scrollTimeout: number;
    const onScroll = () => {
      if (!scrollTimeout) {
        scrollTimeout = window.setTimeout(() => {
          handleScroll();
          scrollTimeout = 0;
        }, 100); // Only process scroll events every 100ms
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Set initial state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }
    };
  }, [handleScroll, simplifiedMode]);

  // Close mobile menu when clicking outside or on a link
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        mobileMenuOpen &&
        !target.closest('.mobile-menu') &&
        !target.closest('.menu-button')
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "sv" : "en");
  };

  const navLinks = [
    { href: "#about", label: t.nav.about },
    { href: "#tech", label: t.nav.skills },
    { href: "#projects", label: t.nav.projects },
    { href: "#contact", label: t.nav.contact },
  ];

  // Safely close mobile menu when clicking on a link
  const handleNavLinkClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Use simplified header class for very low-end devices
  const headerClass = simplifiedMode || window.innerWidth < 390
    ? "fixed w-full z-50 py-3 bg-white/95 backdrop-blur-md border-b border-border shadow-md"
    : `fixed w-full z-50 transition-all duration-300 ${scrolled
      ? "py-3 bg-white/95 backdrop-blur-md border-b border-border shadow-md"
      : "py-6 bg-transparent"
    }`;

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo section - simplified for low-end devices */}
        <a href="#" className="group relative flex items-center gap-2 sm:gap-3">
          <div className={`relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${simplifiedMode || window.innerWidth < 390
            ? "bg-violet-500"
            : "bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 shadow-lg overflow-hidden transition-all duration-300"
            }`}>
            <Code size={isMobile ? 24 : 28} className="text-white relative z-10" />
            {!simplifiedMode && window.innerWidth >= 390 && (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute h-20 w-20 bg-white opacity-20 rotate-45 -translate-x-12 group-hover:translate-x-12 transition-all duration-700"></div>
              </>
            )}
          </div>
          <div>
            <h1 className={`text-lg sm:text-xl font-bold ${simplifiedMode || window.innerWidth < 390
              ? "text-gray-900 dark:text-white"
              : "bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 transition-all duration-300 relative"
              }`}>
              Pontus Paulsson
              {!simplifiedMode && window.innerWidth >= 390 && (
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 group-hover:w-full transition-all duration-500"></span>
              )}
            </h1>
            <div className="text-xs sm:text-sm font-medium text-foreground/70 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Software Developer
            </div>
          </div>
        </a>

        {isMobile ? (
          <>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleLanguage}
                className="relative px-2 sm:px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-md border border-secondary/30 hover:border-secondary/70 transition-all duration-300 overflow-hidden group"
                aria-label="Toggle language"
              >
                <span className={`relative z-10 ${language === "en" ? "text-foreground" : "text-foreground/50"}`}>
                  EN
                </span>
                <span className="mx-1 text-foreground/30">/</span>
                <span className={`relative z-10 ${language === "sv" ? "text-foreground" : "text-foreground/50"}`}>
                  SV
                </span>
                {!simplifiedMode && window.innerWidth >= 390 && (
                  <span className={`absolute bottom-0 left-0 h-full ${language === "en" ? "w-1/2 translate-x-0" : "w-1/2 translate-x-full"
                    } bg-secondary/20 transition-all duration-300`}></span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="block md:hidden focus:outline-none p-2 sm:p-2.5 rounded-full hover:bg-secondary/30 transition-colors duration-300 menu-button"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X size={22} className="text-foreground" />
                ) : (
                  <Menu size={22} className="text-foreground" />
                )}
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-border shadow-lg py-4 px-4 flex flex-col space-y-3 mobile-menu">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="nav-link py-2 px-4 rounded-md hover:bg-secondary/20 transition-all duration-300"
                    onClick={handleNavLinkClick}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center">
            <nav className="hidden md:flex items-center space-x-1 mr-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-link relative px-4 py-2 rounded-md hover:bg-secondary/20 transition-all duration-300 overflow-hidden group"
                >
                  <span className="relative z-10">{link.label}</span>
                  {!simplifiedMode && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  )}
                </a>
              ))}
            </nav>

            <button
              onClick={toggleLanguage}
              className="relative px-4 py-2 text-sm font-medium uppercase tracking-wider rounded-md border border-secondary/30 hover:border-secondary/70 transition-all duration-300 overflow-hidden group"
              aria-label="Toggle language"
            >
              <span className={`relative z-10 transition-all duration-300 ${language === "en" ? "text-foreground" : "text-foreground/50"}`}>
                EN
              </span>
              <span className="mx-1.5 text-foreground/30">/</span>
              <span className={`relative z-10 transition-all duration-300 ${language === "sv" ? "text-foreground" : "text-foreground/50"}`}>
                SV
              </span>
              {!simplifiedMode && (
                <span className={`absolute bottom-0 left-0 h-full ${language === "en" ? "w-1/2 translate-x-0" : "w-1/2 translate-x-full"
                  } bg-secondary/20 transition-all duration-300`}></span>
              )}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
