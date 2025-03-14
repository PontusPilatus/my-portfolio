import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, FileCode, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import TiltCard from "./ui/tilt-card";
import GradientText from "./ui/gradient-text";

interface Project {
  id: number;
  key: string;
  image: string;
  tags: string[];
  githubLink?: string;
  liveLink?: string;
  readmeLink?: string;
  featured?: boolean;
}

const Projects = () => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // State to track which project is being hovered
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const projects: Project[] = [
    {
      id: 1,
      key: "filmFinder",
      image: "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?auto=format&fit=crop&q=80",
      tags: ["React", "Node.js", "Express", "PostgreSQL", "AI", "Responsive Design"],
      githubLink: "#",
      liveLink: "https://www.filmfinder.se/",
      featured: true,
    },
    {
      id: 2,
      key: "aiDetection",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80",
      tags: ["Python", "TensorFlow", "OpenCV", "Computer Vision", "AI"],
      githubLink: "https://github.com/PontusPilatus/real-time-ai-detection",
      featured: true,
    },
    {
      id: 3,
      key: "weatherDashboard",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&q=80",
      tags: ["Next.js", "ASP.NET Core", "C#", "TypeScript", "Mapbox", "Chart.js"],
      githubLink: "https://github.com/PontusPilatus/weather-dashboard",
      featured: true,
    },
    {
      id: 4,
      key: "portfolio",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "React", "Responsive Design", "Intersection Observer API"],
      githubLink: "https://github.com/PontusPilatus/my-portfolio",
      liveLink: "/",
      featured: true,
    }
  ];

  // Get all unique tags from all projects
  const visibleTags = Array.from(
    new Set(projects.flatMap(project => project.tags))
  ).sort();

  // Filter projects by the active tag if one is selected
  const filteredProjects = projects
    .filter(project => activeFilter ? project.tags.includes(activeFilter) : true);

  // When tag filter changes, no need to reset based on featured status
  useEffect(() => {
    if (activeFilter && !visibleTags.includes(activeFilter)) {
      setActiveFilter(null);
    }
  }, [activeFilter, visibleTags]);

  return (
    <section
      id="projects"
      ref={ref}
      className="py-20 md:py-28 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <GradientText text={t.projects.title} from="from-violet-600" via="via-fuchsia-500" to="to-purple-600" />
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              {t.projects.description}
            </p>
          </div>

          {/* Tag filters - only show tags from visible projects */}
          {visibleTags.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              <button
                onClick={() => setActiveFilter(null)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm transition-colors ${activeFilter === null
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 hover:bg-secondary/70"
                  }`}
              >
                {t.projects.allTechnologies}
              </button>

              {visibleTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveFilter(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 
                    ${activeFilter === tag
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/70'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Projects grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
            {filteredProjects.map((project, index) => (
              <TiltCard
                key={project.id}
                className={`project-card transition-all transform ${inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
                  }`}
                style={{
                  transitionDelay: `${150 * index}ms`,
                  transitionDuration: "700ms",
                  height: "auto",
                  maxHeight: "550px",
                  display: "flex",
                  flexDirection: "column"
                }}
                tiltMaxAngle={3}
                glareOpacity={0.1}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="h-40 sm:h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={t.projects[project.key]?.title || `Project ${project.id}`}
                    className={`w-full h-full object-cover transition-all duration-500 ${hoveredProject === project.id
                      ? "scale-110 brightness-110"
                      : ""
                      }`}
                  />
                </div>

                {/* Content - fixed height */}
                <div className="p-6 h-[235px] overflow-hidden">
                  <h3 className="text-xl font-bold mb-2">{t.projects[project.key]?.title}</h3>
                  <p className="text-foreground/70 text-sm">{t.projects[project.key]?.description}</p>
                </div>

                <div className="px-4 sm:px-6 pb-4 sm:pb-6 mt-auto">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="tech-pill text-xs cursor-pointer transition-colors hover:bg-primary/20 py-1 px-2 sm:px-2.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFilter(tag);
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-between items-center pt-3 border-t border-border">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-foreground/70 hover:text-primary transition-colors"
                      >
                        <Github size={14} className="mr-1" />
                        <span className="text-xs">{t.projects.sourceCode}</span>
                      </a>
                    )}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-foreground/70 hover:text-primary transition-colors"
                      >
                        <span className="text-xs">{t.projects.liveProject}</span>
                        <ExternalLink size={12} className="ml-1" />
                      </a>
                    )}
                    {project.readmeLink && (
                      <a
                        href={project.readmeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-foreground/70 hover:text-primary transition-colors"
                      >
                        <BookOpen size={12} className="mr-1" />
                        <span className="text-xs">{t.projects.readMore}</span>
                      </a>
                    )}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* Display no matches message if filtered projects is empty */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-10">
              <p className="text-foreground/70">{t.projects.noProjects}</p>
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-foreground/50 text-sm">
              {t.projects.findMore}
              <a
                href="https://github.com/PontusPilatus"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -ml-10 w-20 h-56 bg-primary/5 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute top-1/3 right-0 -mr-10 w-20 h-56 bg-primary/5 rounded-full opacity-50 blur-3xl"></div>
    </section>
  );
};

export default Projects;
