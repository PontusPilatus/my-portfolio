
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload critical images for better performance
    const preloadImages = [
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80"
    ];

    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    // Simulate a short loading time for the page transition effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LanguageProvider>
      <main className={`min-h-screen transition-opacity duration-1000 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-secondary z-50"></div>
        <Navigation />
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </LanguageProvider>
  );
};

export default Index;
