import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  tiltMaxAngle?: number; // Maximum tilt angle in degrees
  glareOpacity?: number; // Opacity of the glare effect (0-1)
  scale?: number; // Hover scale factor
  perspective?: number; // Perspective in pixels
  children: React.ReactNode;
}

const TiltCard = ({
  tiltMaxAngle = 10,
  glareOpacity = 0.15,
  scale = 1.02,
  perspective = 1000,
  className,
  children,
  ...props
}: TiltCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    // Calculate cursor position on the card (0 to 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Calculate tilt angle based on cursor position (-1 to 1, then scaled by max angle)
    const tiltX = (y - 0.5) * 2 * tiltMaxAngle;
    const tiltY = (0.5 - x) * 2 * tiltMaxAngle;

    // Update state
    setPosition({ x: tiltX, y: tiltY });
    setGlarePosition({ x: x * 100, y: y * 100 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative transition-transform duration-200 ease-out overflow-hidden",
        className
      )}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${position.x}deg) rotateY(${position.y}deg) scale(${scale})`
            : "rotateX(0deg) rotateY(0deg) scale(1)",
          transition: "transform 0.2s ease-out",
          transformStyle: "preserve-3d",
        }}
      >
        {children}

        {/* Glare effect */}
        {glareOpacity > 0 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: isHovered ? glareOpacity : 0,
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 80%)`,
              transition: "opacity 0.2s ease-out",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TiltCard; 