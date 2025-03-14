import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X, Code } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "sv" : "en");
  };

  const navLinks = [
    { href: "#about", label: t.nav.about },
    { href: "#tech", label: t.nav.skills },
    { href: "#projects", label: t.nav.projects },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 
      ${scrolled
          ? "py-3 bg-white/95 backdrop-blur-md border-b border-border shadow-md"
          : "py-6 bg-transparent"}`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <a href="#" className="group relative flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 shadow-lg overflow-hidden transition-all duration-300">
            <Code size={28} className="text-white relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="absolute h-20 w-20 bg-white opacity-20 rotate-45 -translate-x-12 group-hover:translate-x-12 transition-all duration-700"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 transition-all duration-300 relative">
              Pontus Paulsson
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 group-hover:w-full transition-all duration-500"></span>
            </h1>
            <div className="text-sm font-medium text-foreground/70 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Software Developer
            </div>
          </div>
        </a>

        {isMobile ? (
          <>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleLanguage}
                className="relative px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-md border border-secondary/30 hover:border-secondary/70 transition-all duration-300 overflow-hidden group"
                aria-label="Toggle language"
              >
                <span
                  className={`relative z-10 transition-all duration-300 ${language === "en" ? "text-foreground" : "text-foreground/50"}`}
                >
                  EN
                </span>
                <span className="mx-1 text-foreground/30">/</span>
                <span
                  className={`relative z-10 transition-all duration-300 ${language === "sv" ? "text-foreground" : "text-foreground/50"}`}
                >
                  SV
                </span>
                <span className={`absolute bottom-0 left-0 h-full ${language === "en" ? "w-1/2 translate-x-0" : "w-1/2 translate-x-full"} bg-secondary/20 transition-all duration-300`}></span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="block md:hidden focus:outline-none p-2 rounded-full hover:bg-secondary/30 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X size={24} className="text-foreground" />
                ) : (
                  <Menu size={24} className="text-foreground" />
                )}
              </button>
            </div>

            {mobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-border shadow-lg py-4 px-4 flex flex-col space-y-4 animate-fade-in">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="nav-link py-2 px-4 rounded-md hover:bg-secondary/20 transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
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
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </a>
              ))}
            </nav>

            <button
              onClick={toggleLanguage}
              className="relative px-4 py-2 text-sm font-medium uppercase tracking-wider rounded-md border border-secondary/30 hover:border-secondary/70 transition-all duration-300 overflow-hidden group"
              aria-label="Toggle language"
            >
              <span
                className={`relative z-10 transition-all duration-300 ${language === "en" ? "text-foreground" : "text-foreground/50"}`}
              >
                EN
              </span>
              <span className="mx-1.5 text-foreground/30">/</span>
              <span
                className={`relative z-10 transition-all duration-300 ${language === "sv" ? "text-foreground" : "text-foreground/50"}`}
              >
                SV
              </span>
              <span className={`absolute bottom-0 left-0 h-full ${language === "en" ? "w-1/2 translate-x-0" : "w-1/2 translate-x-full"} bg-secondary/20 transition-all duration-300`}></span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
