import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Github, Linkedin, Instagram, ArrowUp, Mail } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Social media links
  const socialLinks = [
    { icon: <Github size={20} />, url: "https://github.com/PontusPilatus", label: "GitHub" },
    { icon: <Mail size={20} />, url: "mailto:paulsson.pontus@gmail.com", label: "Email" },
    { icon: <Linkedin size={20} />, url: "https://www.linkedin.com/in/paulssonpontus/", label: "LinkedIn" },
    { icon: <Instagram size={20} />, url: "https://www.instagram.com/pontuspilatus/", label: "Instagram" }
  ];

  // Navigation links
  const navLinks = [
    { href: "#", label: t.nav.home || "Home" },
    { href: "#about", label: t.nav.about },
    { href: "#projects", label: t.nav.projects },
    { href: "#tech", label: t.nav.skills },
    { href: "#contact", label: t.nav.contact }
  ];

  return (
    <footer className="bg-secondary/10 py-12 border-t border-border">
      <div className="container mx-auto px-4 md:px-8 flex flex-col items-center">
        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center mb-8 hover:shadow-lg transition-shadow duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} className="text-primary" />
        </button>

        {/* Logo */}
        <div className="mb-6">
          <a href="#" className="text-xl text-primary font-bold">
            Pontus Paulsson
          </a>
        </div>

        {/* Social links */}
        <div className="flex gap-4 mb-8">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:scale-110 hover:shadow-md transition-all duration-300"
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-foreground/70 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-foreground/60">
          <p className="mb-1">
            &copy; {currentYear} Pontus Paulsson. {t.footer.rights}
          </p>
          <p>
            {t.footer.designed || "Designed and built with passion and precision."}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
