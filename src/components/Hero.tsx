import { useEffect, useRef } from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import HeroBg from "./HeroBg";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Animate elements sequentially with delay
    const elements = [headingRef.current, subtitleRef.current, ctaRef.current];

    elements.forEach((el, index) => {
      if (el) {
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, 300 * (index + 1));
      }
    });
  }, []);

  return (
    <section
      className="h-screen flex flex-col justify-center items-center text-center px-4 relative overflow-hidden"
    >
      <HeroBg />

      <div className="container max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        <h1
          ref={headingRef}
          className="text-4xl md:text-6xl font-bold mb-6 opacity-0 transform translate-y-8 transition-all duration-700"
        >
          {t.hero.titleStart} <span className="text-primary relative inline-block">
            {t.hero.highlight}
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
          </span> {t.hero.titleEnd}
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 opacity-0 transform translate-y-8 transition-all duration-700 delay-300"
        >
          {t.hero.subtitle}
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row justify-center gap-4 opacity-0 transform translate-y-8 transition-all duration-700 delay-500 mb-20"
        >
          <a
            href="#projects"
            className="group px-8 py-3 bg-primary text-primary-foreground rounded-lg relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          >
            <span className="relative z-10">{t.hero.viewWork}</span>
            <span className="absolute bottom-0 left-0 w-0 h-full bg-white/10 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a
            href="#contact"
            className="px-8 py-3 bg-secondary text-foreground rounded-lg border border-border transition-all duration-300 hover:bg-secondary/70 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2"
          >
            {t.hero.contactMe}
          </a>
        </div>
      </div>

      <div className="mt-16 mb-4 w-max animate-bounce-subtle z-10">
        <a href="#about" className="flex flex-col items-center justify-center group">
          <p className="text-sm font-medium text-foreground/80 mb-2 transition-transform duration-300 group-hover:-translate-y-1">{t.hero.scrollDown}</p>
          <ArrowDown size={22} className="text-foreground/80 transition-transform duration-300 group-hover:translate-y-1" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
