import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "@/contexts/LanguageContext";
import GradientText from "./ui/gradient-text";

type CategoryType = "frontend" | "backend" | "devops" | "specialized";

interface TechItem {
  name: string;
  icon: string;
  color: string;
  category: CategoryType;
}

const TechStack = () => {
  const { t } = useLanguage();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hoveringItem, setHoveringItem] = useState<string | null>(null);

  const techItems: TechItem[] = [
    // Frontend
    { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", color: "#61DAFB", category: "frontend" },
    { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", color: "#000000", category: "frontend" },
    { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "#F7DF1E", category: "frontend" },
    { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", color: "#3178C6", category: "frontend" },
    { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", color: "#E34F26", category: "frontend" },
    { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", color: "#1572B6", category: "frontend" },
    { name: "Tailwind CSS", icon: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg", color: "#38B2AC", category: "frontend" },

    // Backend (including databases)
    { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", color: "#339933", category: "backend" },
    { name: ".NET", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg", color: "#512BD4", category: "backend" },
    { name: "Express", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", color: "#000000", category: "backend" },
    { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", color: "#3776AB", category: "backend" },
    { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", color: "#336791", category: "backend" },
    { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", color: "#47A248", category: "backend" },
    { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", color: "#4479A1", category: "backend" },

    // DevOps & Tools
    { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", color: "#F05032", category: "devops" },
    { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", color: "#181717", category: "devops" },
    { name: "Vercel", icon: "https://cdn.worldvectorlogo.com/logos/vercel.svg", color: "#000000", category: "devops" },
    { name: "Azure", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg", color: "#0078D4", category: "devops" },

    // Specialized (AI, APIs, Architecture)
    { name: "TensorFlow", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg", color: "#FF6F00", category: "specialized" },
    { name: "PyTorch", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg", color: "#EE4C2C", category: "specialized" },
    { name: "Scikit-learn", icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg", color: "#F7931E", category: "specialized" },
    { name: "REST API", icon: "https://cdn.worldvectorlogo.com/logos/rest-63.svg", color: "#005CA9", category: "specialized" },
    { name: "GraphQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg", color: "#E10098", category: "specialized" },
    { name: "WebSockets", icon: "https://cdn.worldvectorlogo.com/logos/websocket.svg", color: "#010101", category: "specialized" },
  ];

  // Get category color based on category ID
  const getCategoryColor = (categoryId: string): string => {
    switch (categoryId) {
      case 'frontend': return '#8B5CF6';    // Violet-500
      case 'backend': return '#10B981';     // Emerald-500
      case 'devops': return '#F59E0B';      // Amber-500
      case 'specialized': return '#EC4899'; // Pink-500
      default: return '#8B5CF6';
    }
  };

  // Get technologies in a specific category
  const getTechItemsByCategory = (categoryId: string): TechItem[] => {
    return techItems.filter(item => item.category === categoryId);
  };

  // Create a duplicate of tech items for continuous scrolling
  const allTechItems = [...techItems, ...techItems];

  // Handle logo mouse enter
  const handleLogoMouseEnter = (techName: string) => {
    setHoveringItem(techName);
  };

  // Handle logo mouse leave  
  const handleLogoMouseLeave = () => {
    setHoveringItem(null);
  };

  // Auto-scrolling effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !inView) return;

    let animationId: number;
    let scrollPosition = scrollContainer.scrollLeft;
    const scrollSpeed = 0.5; // pixels per frame, very slow
    const totalWidth = scrollContainer.scrollWidth / 2;

    const scroll = () => {
      if (!scrollContainer || isDragging || hoveringItem) return;

      scrollPosition += scrollSpeed;

      // Reset when we've scrolled through first set of items
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0;
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft = scrollPosition;
      }

      animationId = requestAnimationFrame(scroll);
    };

    // Start the animation
    animationId = requestAnimationFrame(scroll);

    // Pause animation on container hover or drag
    const handleMouseEnter = () => {
      if (!hoveringItem) {
        cancelAnimationFrame(animationId);
      }
    };

    const handleAutoScrollResume = () => {
      if (!isDragging && !hoveringItem) {
        // Update scroll position to current scroll position
        scrollPosition = scrollContainer.scrollLeft;
        animationId = requestAnimationFrame(scroll);
      }
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleAutoScrollResume);

    return () => {
      cancelAnimationFrame(animationId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleAutoScrollResume);
      }
    };
  }, [inView, isDragging, hoveringItem]);

  // Improved drag to scroll functionality
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    // Change cursor to grabbing
    if (scrollRef.current) scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Reset cursor
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
  };

  const handleMouseLeave = () => {
    if (isDragging && scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier

    // Update the scroll position
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const categories = [
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend & Databases" },
    { id: "devops", label: "DevOps & Cloud" },
    { id: "specialized", label: "AI & APIs" },
  ];

  // Helper function to convert hex to RGB for CSS variables
  const hexToRgb = (hex: string) => {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
  };

  // Get category name based on current language
  const getCategoryName = (category: CategoryType) => {
    switch (category) {
      case "frontend":
        return t.skills.categories.frontend;
      case "backend":
        return t.skills.categories.backend;
      case "devops":
        return t.skills.categories.cloud;
      case "specialized":
        return t.skills.categories.tools;
      default:
        return category;
    }
  };

  return (
    <section
      id="tech"
      ref={ref}
      className="py-20 md:py-28 relative overflow-hidden"
    >
      {/* Clean background - removed animated elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/10 -z-10"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText
                text={t.skills.title}
                from="from-blue-600"
                via="via-indigo-500"
                to="to-primary"
              />
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              {t.skills.description}
            </p>
          </div>

          <div className={`transition-all duration-700 ${inView ? "opacity-100" : "opacity-0"}`}>
            {/* Logo carousel - removed box container */}
            <div className="relative mb-16 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-16 before:bg-gradient-to-r before:from-background before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-16 after:bg-gradient-to-l after:from-background after:to-transparent">
              <div
                ref={scrollRef}
                className="flex overflow-x-hidden py-8 cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <div className="flex gap-8 md:gap-16 px-8">
                  {allTechItems.map((tech, index) => {
                    const categoryColor = getCategoryColor(tech.category);
                    const uniqueKey = `${tech.name}-${index}`;
                    const isHovering = hoveringItem === uniqueKey;

                    return (
                      <div
                        key={uniqueKey}
                        className="flex-shrink-0 group relative"
                        onMouseEnter={() => handleLogoMouseEnter(uniqueKey)}
                        onMouseLeave={handleLogoMouseLeave}
                      >
                        <div
                          className="w-16 h-16 flex items-center justify-center bg-white/90 rounded-full p-3 transition-all duration-300"
                          style={{
                            border: `2px solid ${categoryColor}30`,
                            boxShadow: isHovering
                              ? `0 0 20px ${categoryColor}40`
                              : `0 0 5px ${categoryColor}20`,
                            transform: isHovering ? 'scale(1.05)' : 'scale(1)'
                          }}
                        >
                          <img
                            src={tech.icon}
                            alt={tech.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div
                          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium bg-white shadow-sm"
                          style={{
                            backgroundColor: `${categoryColor}15`,
                            border: `1px solid ${categoryColor}30`,
                            color: categoryColor,
                            transform: isHovering ? 'translate(-50%, -2px)' : 'translate(-50%, 0)'
                          }}
                        >
                          {tech.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Categories with glassmorphism effect */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              {categories.map(category => {
                const categoryTechs = getTechItemsByCategory(category.id);
                const categoryColor = getCategoryColor(category.id);

                return (
                  <div key={category.id} className="flex items-center gap-2 group relative cursor-help">
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: categoryColor,
                        boxShadow: `0 0 8px ${categoryColor}60`
                      }}
                    ></span>
                    <span className="text-foreground/80 hover:text-foreground transition-colors">{category.label}</span>

                    {/* Category tooltip with glassmorphism effect */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-4 rounded-lg 
                          glassmorphism-card opacity-0 invisible transition-all duration-300 z-20
                          group-hover:opacity-100 group-hover:visible transform group-hover:translate-y-0 translate-y-1 backdrop-blur-md"
                      style={{
                        border: `2px solid ${categoryColor}40`,
                        boxShadow: `0 8px 32px ${categoryColor}20`
                      }}
                    >
                      <div className="text-xs font-medium mb-3 text-center" style={{ color: categoryColor }}>
                        {category.label} Technologies
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {categoryTechs.map(tech => (
                          <span
                            key={tech.name}
                            className="px-2.5 py-1.5 rounded-full text-xs whitespace-nowrap backdrop-blur-sm bg-white/10 border border-white/20 shadow-sm text-foreground"
                            style={{
                              borderColor: `${categoryColor}40`
                            }}
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>

                      {/* Glass effect pointer */}
                      <div
                        className="absolute w-4 h-4 bg-white/60 backdrop-blur-sm transform rotate-45 left-1/2 -bottom-2 -ml-2"
                        style={{
                          border: `2px solid ${categoryColor}40`,
                          borderTop: 'none',
                          borderLeft: 'none'
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fullstack statement with magic text effect */}
            <div className="mt-16 text-center">
              <p className="text-foreground/60 text-sm md:text-base max-w-lg mx-auto backdrop-blur-sm p-3 rounded-full bg-white/5">
                <span className="magic-text">Full-stack developer</span> connecting
                the dots between front-end, back-end, and the occasional existential crisis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
