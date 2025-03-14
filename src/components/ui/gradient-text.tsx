import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GradientTextProps {
  text: string;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
  duration?: number;
  children?: React.ReactNode;
  waveEffect?: boolean;
}

const GradientText = ({
  text,
  className,
  from = "from-primary",
  via = "via-purple-500",
  to = "to-blue-600",
  animate = true,
  duration = 3,
  children,
  waveEffect = true
}: GradientTextProps) => {
  const textRef = useRef<HTMLSpanElement>(null);

  // Standard gradient classes
  const gradientClasses = cn(
    "font-bold bg-clip-text text-transparent bg-gradient-to-r",
    from,
    via,
    to,
    animate && !waveEffect && "animate-gradient-x",
    className
  );

  // Add animation style to head if animate is true
  useEffect(() => {
    if (animate && !waveEffect) {
      const styleId = "gradient-animation-style";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
          @keyframes gradient-x {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          .animate-gradient-x {
            background-size: 200% 100%;
            animation: gradient-x ${duration}s ease infinite;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, [animate, duration, waveEffect]);

  // Wave effect 
  useEffect(() => {
    if (!waveEffect || !textRef.current) return;

    // Create wave animation style
    const styleId = "wave-animation-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        @keyframes wave-text {
          0% {
            mask-position: 0 0;
          }
          100% {
            mask-position: 100% 0;
          }
        }
        .wave-text {
          mask-image: linear-gradient(
            60deg,
            black 25%,
            rgba(0, 0, 0, 0.8) 50%,
            black 75%
          );
          mask-size: 400%;
          mask-clip: text;
          -webkit-mask-image: linear-gradient(
            60deg,
            black 25%,
            rgba(0, 0, 0, 0.8) 50%,
            black 75%
          );
          -webkit-mask-size: 400%;
          -webkit-mask-clip: text;
          animation: wave-text 5s linear infinite;
        }
      `;
      document.head.appendChild(style);
    }

    // Apply wave effect to text element
    if (textRef.current) {
      textRef.current.classList.add("wave-text");
    }

    return () => {
      if (textRef.current) {
        textRef.current.classList.remove("wave-text");
      }
    };
  }, [waveEffect]);

  return (
    <span ref={textRef} className={gradientClasses}>
      {children || text}
    </span>
  );
};

export default GradientText; 