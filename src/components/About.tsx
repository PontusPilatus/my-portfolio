import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "@/contexts/LanguageContext";
import GradientText from "./ui/gradient-text";

const About = () => {
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [paragraphRefs, setParagraphRefs] = useState<(HTMLParagraphElement | null)[]>([]);
  const { t, language } = useLanguage();

  // Set up refs for paragraphs
  useEffect(() => {
    if (textRef.current) {
      setParagraphRefs(Array.from(textRef.current.querySelectorAll('p')));
    }
  }, [inView, t.about.content]);

  useEffect(() => {
    if (inView) {
      // Animate pill with a slight bounce
      if (pillRef.current) {
        pillRef.current.classList.add('translate-y-0', 'opacity-100');
        pillRef.current.classList.remove('-translate-y-4', 'opacity-0');
      }

      // Animate title with a slight bounce
      if (titleRef.current) {
        setTimeout(() => {
          titleRef.current?.classList.add('translate-y-0', 'opacity-100');
          titleRef.current?.classList.remove('-translate-y-8', 'opacity-0');
        }, 200);
      }

      // Animate text container
      if (textRef.current) {
        setTimeout(() => {
          textRef.current?.classList.add('translate-x-0', 'opacity-100');
          textRef.current?.classList.remove('-translate-x-16', 'opacity-0');
        }, 400);
      }

      // Animate image with a 3D reveal effect
      if (imageRef.current) {
        setTimeout(() => {
          imageRef.current?.classList.add('translate-x-0', 'translate-y-0', 'rotate-0', 'opacity-100');
          imageRef.current?.classList.remove('translate-x-8', 'translate-y-8', 'rotate-6', 'opacity-0');
        }, 600);
      }

      // Animate paragraphs with staggered delay
      paragraphRefs.forEach((p, index) => {
        if (p) {
          setTimeout(() => {
            p.classList.add('translate-y-0', 'opacity-100');
            p.classList.remove('translate-y-4', 'opacity-0');
          }, 600 + (index * 200));
        }
      });

      // Animate buttons
      if (buttonContainerRef.current) {
        setTimeout(() => {
          buttonContainerRef.current?.classList.add('translate-y-0', 'opacity-100');
          buttonContainerRef.current?.classList.remove('translate-y-4', 'opacity-0');
        }, 1000 + (paragraphRefs.length * 200));
      }
    }
  }, [inView, paragraphRefs]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 md:py-28 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div
            ref={pillRef}
            className="inline-block mb-2 px-3 py-1 bg-secondary rounded-full transition-all duration-700 -translate-y-4 opacity-0"
          >
            <p className="text-sm font-medium text-foreground/80">{t.nav.about}</p>
          </div>

          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold mb-8 transition-all duration-700 ease-out -translate-y-8 opacity-0"
          >
            <GradientText
              text={t.about.title}
              from="from-primary"
              via="via-indigo-500"
              to="to-blue-600"
              animate={true}
              duration={5}
              waveEffect={true}
            />
          </h2>

          <div className="grid md:grid-cols-5 gap-10 items-center">
            <div
              ref={textRef}
              className="md:col-span-3 space-y-6 transition-all duration-1000 ease-out -translate-x-16 opacity-0"
            >
              {t.about.content.split('\n\n').map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg text-foreground/80 leading-relaxed transition-all duration-700 ease-out translate-y-4 opacity-0"
                >
                  {paragraph}
                </p>
              ))}

              <div
                ref={buttonContainerRef}
                className="flex flex-col sm:flex-row gap-4 mt-8 transition-all duration-700 ease-out translate-y-4 opacity-0"
              >
                <a
                  href={`#${t.nav.contact}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg transition-all duration-300 hover:bg-primary/90 hover:scale-[1.05] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transform hover:-translate-y-1"
                >
                  {t.contact.title}
                </a>

                <a
                  href={language === "en" ? "/files/Pontus_Paulsson_CV_english.pdf" : "/files/Pontus_Paulsson_CV.pdf"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-foreground rounded-lg border border-border transition-all duration-300 hover:bg-secondary/70 hover:scale-[1.05] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transform hover:-translate-y-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {t.cv.download}
                </a>
              </div>
            </div>

            <div
              ref={imageRef}
              className="md:col-span-2 aspect-square rounded-xl overflow-hidden relative border border-border shadow-md transition-all duration-1000 ease-out translate-x-8 translate-y-8 rotate-6 opacity-0 hover:scale-[1.05] hover:shadow-lg group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-primary/20 opacity-0 transition-all duration-500 group-hover:opacity-100"></div>
              <img
                src="/images/profile.jpg"
                alt="Professional portrait of me"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 will-change-transform group-hover:saturate-150 group-hover:contrast-110"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
