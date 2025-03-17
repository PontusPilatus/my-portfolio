import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import HeroBg from "./HeroBg";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [useSimpleMode, setUseSimpleMode] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if we're on a low-end device - be less aggressive with detection
    const isLowEndDevice = (
      typeof window !== 'undefined' &&
      (
        window.innerWidth < 360 || // Only very small screens
        (/iPhone|iPod/.test(navigator.userAgent) &&
          (navigator.userAgent.includes('iPhone OS 9') ||
            navigator.userAgent.includes('iPhone OS 10')))
      )
    );

    // Use simple animation mode for low-end devices
    setUseSimpleMode(isLowEndDevice);

    // Mark as loaded first to prevent animations from running before hydration
    setIsLoaded(true);

    // Safety check to make sure DOM is ready
    if (typeof window === 'undefined') return;

    try {
      // For low-end devices, show content immediately without animations
      if (isLowEndDevice) {
        const elements = [headingRef.current, subtitleRef.current, ctaRef.current];
        elements.forEach(el => {
          if (el) {
            el.classList.add("opacity-100", "translate-y-0");
            el.classList.remove("opacity-0", "translate-y-8");
          }
        });
        return;
      }

      // Normal animation for better devices
      const animateElements = () => {
        const elements = [headingRef.current, subtitleRef.current, ctaRef.current];

        elements.forEach((el, index) => {
          if (el) {
            // Use a timeout for sequential animation
            setTimeout(() => {
              // Use classList for better performance
              el.classList.add("opacity-100", "translate-y-0");
              el.classList.remove("opacity-0", "translate-y-8");
            }, 300 * (index + 1));
          }
        });
      };

      // Use a single short timeout to avoid immediate animation
      const timer = setTimeout(() => {
        animateElements();
      }, 100);

      return () => clearTimeout(timer);
    } catch (error) {
      // If something goes wrong, make everything visible
      console.error("Animation error:", error);
      setUseSimpleMode(true);

      const elements = [headingRef.current, subtitleRef.current, ctaRef.current];
      elements.forEach(el => {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }
      });
    }
  }, []);

  // Use simpler classes for low-end devices but keep animations for most
  const baseHeroClass = "min-h-[100svh] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden";
  const headingClass = useSimpleMode
    ? "text-4xl md:text-6xl font-bold mb-6 pt-16 md:pt-0"
    : `text-4xl md:text-6xl font-bold mb-6 opacity-0 transform translate-y-8 transition-all duration-700 pt-16 md:pt-0 ${isLoaded ? '' : 'no-js-visible'}`;
  const subtitleClass = useSimpleMode
    ? "text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-8"
    : `text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-8 opacity-0 transform translate-y-8 transition-all duration-700 ${isLoaded ? '' : 'no-js-visible'}`;
  const ctaClass = useSimpleMode
    ? "flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-16 sm:mb-20"
    : `flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 opacity-0 transform translate-y-8 transition-all duration-700 mb-16 sm:mb-20 ${isLoaded ? '' : 'no-js-visible'}`;

  return (
    <section className={baseHeroClass}>
      <HeroBg />

      <div className="container max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        <h1
          ref={headingRef}
          className={headingClass}
        >
          {t.hero.titleStart} <span className="text-primary relative inline-block">
            {t.hero.highlight}
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 rounded-full"></span>
          </span> {t.hero.titleEnd}
        </h1>

        <p
          ref={subtitleRef}
          className={subtitleClass}
        >
          {t.hero.subtitle}
        </p>

        <div
          ref={ctaRef}
          className={ctaClass}
        >
          <a
            href="#projects"
            className="group px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 text-sm sm:text-base"
          >
            <span className="relative z-10">{t.hero.viewWork}</span>
            <span className="absolute bottom-0 left-0 w-0 h-full bg-white/10 transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a
            href="#contact"
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-secondary text-foreground rounded-lg border border-border transition-all duration-300 hover:bg-secondary/70 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 text-sm sm:text-base"
          >
            {t.hero.contactMe}
          </a>
        </div>
      </div>

      <div className="mt-8 sm:mt-16 mb-4 w-max animate-bounce-subtle z-10">
        <a href="#about" className="flex flex-col items-center justify-center group">
          <p className="text-xs sm:text-sm font-medium text-foreground/80 mb-2 transition-transform duration-300 group-hover:-translate-y-1">{t.hero.scrollDown}</p>
          <ArrowDown size={18} className="text-foreground/80 transition-transform duration-300 group-hover:translate-y-1" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
