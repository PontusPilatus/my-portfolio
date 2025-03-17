import { useEffect, useRef, useState } from 'react';

const HeroBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isMobile, setIsMobile] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Safety check for server-side rendering
    if (typeof window === 'undefined') return;

    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Detect low-end devices based on screen size and devicePixelRatio
    // Less aggressive detection to ensure more devices get animations
    const isLowEndDevice = (
      typeof window !== 'undefined' &&
      (
        window.innerWidth < 360 || // Only very small devices
        (/iPhone|iPod/.test(navigator.userAgent) && !window.MSStream &&
          (navigator.userAgent.includes('iPhone OS 9') ||
            navigator.userAgent.includes('iPhone OS 10')))  // Only target very old iOS versions
      )
    );

    // Only use fallback for extremely low-end devices
    setUseFallback(isLowEndDevice);

    if (useFallback) return; // Skip canvas setup if using fallback

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Grid properties - use smaller grid for mobile
    const gridSpacing = isMobile ? 60 : 40;
    const dotSize = isMobile ? 1 : 1.5;
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

    // Convert CSS color variables to rgba
    const getRGBA = (colorVar: string, alpha: number) => {
      // Default fallback colors if CSS vars aren't available
      const defaultColors = {
        '--primary': '221.2 83.2% 53.3%',
        '--accent': '210 40% 96.1%'
      };

      const hsl = colorVar || defaultColors['--primary'];
      // Parse HSL values (format: "h s% l%")
      const [h, s, l] = hsl.split(' ').map(val => parseFloat(val.replace('%', '')));

      // Convert HSL to RGB (simplified version)
      const getRGBFromHSL = (h: number, s: number, l: number) => {
        s /= 100;
        l /= 100;
        const k = (n: number) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        return [255 * f(0), 255 * f(8), 255 * f(4)];
      };

      const [r, g, b] = getRGBFromHSL(h, s, l);
      return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
    };

    // Create the 3D grid effect
    function draw() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now() / 1000;
      const rows = Math.ceil(canvas.height / gridSpacing) + 2;
      const cols = Math.ceil(canvas.width / gridSpacing) + 2;

      // Fewer rows/columns for mobile to improve performance
      const rowsToRender = isMobile ? Math.min(rows, 20) : rows;
      const colsToRender = isMobile ? Math.min(cols, 20) : cols;

      // Offset for centered grid
      const offsetX = (canvas.width % gridSpacing) / 2;
      const offsetY = (canvas.height % gridSpacing) / 2;

      // Draw grid
      for (let y = -1; y < rowsToRender; y++) {
        for (let x = -1; x < colsToRender; x++) {
          // 3D wave effect
          const posX = x * gridSpacing + offsetX;
          const posY = y * gridSpacing + offsetY;

          // Create wave motion
          const distanceToCenter = Math.sqrt(
            Math.pow((posX - canvas.width / 2) / canvas.width, 2) +
            Math.pow((posY - canvas.height / 2) / canvas.height, 2)
          );

          // Slower wave for mobile
          const waveAmplitude = 15;
          const waveFrequency = isMobile ? 1.5 : 2;
          const z = Math.sin(distanceToCenter * waveFrequency * Math.PI + now * (isMobile ? 0.5 : 1)) * waveAmplitude;

          // Calculate size based on z position (perspective)
          const perspective = 400;
          const perspectiveFactor = 1 - z / perspective;
          const size = dotSize * perspectiveFactor;

          // Draw dot
          ctx.beginPath();
          ctx.arc(posX, posY, Math.max(0.5, size), 0, Math.PI * 2);

          // Color based on position and time
          const mixFactor = Math.sin(distanceToCenter * 3 + now * 0.5) * 0.5 + 0.5;
          ctx.fillStyle = mixFactor > 0.7
            ? getRGBA(primaryColor, 0.3 * perspectiveFactor)
            : getRGBA(accentColor, 0.15 * perspectiveFactor);

          ctx.fill();

          // Skip drawing some lines on mobile for better performance
          if (isMobile && (x % 2 !== 0 || y % 2 !== 0)) continue;

          // Connect dots with lines (only to right and bottom neighbors)
          if (x < colsToRender - 1) {
            // Connect to right neighbor
            ctx.beginPath();
            ctx.moveTo(posX, posY);

            const nextX = (x + 1) * gridSpacing + offsetX;
            const nextY = posY;
            const nextZ = Math.sin(
              Math.sqrt(
                Math.pow((nextX - canvas.width / 2) / canvas.width, 2) +
                Math.pow((nextY - canvas.height / 2) / canvas.height, 2)
              ) * waveFrequency * Math.PI + now * (isMobile ? 0.5 : 1)
            ) * waveAmplitude;

            ctx.lineTo(nextX, nextY);

            // Line opacity based on distance
            const lineDistance = Math.abs(z - nextZ) / waveAmplitude;
            ctx.strokeStyle = getRGBA(primaryColor, 0.05 * (1 - lineDistance));
            ctx.stroke();
          }

          if (y < rowsToRender - 1) {
            // Connect to bottom neighbor
            ctx.beginPath();
            ctx.moveTo(posX, posY);

            const nextX = posX;
            const nextY = (y + 1) * gridSpacing + offsetY;
            const nextZ = Math.sin(
              Math.sqrt(
                Math.pow((nextX - canvas.width / 2) / canvas.width, 2) +
                Math.pow((nextY - canvas.height / 2) / canvas.height, 2)
              ) * waveFrequency * Math.PI + now * (isMobile ? 0.5 : 1)
            ) * waveAmplitude;

            ctx.lineTo(nextX, nextY);

            const lineDistance = Math.abs(z - nextZ) / waveAmplitude;
            ctx.strokeStyle = getRGBA(primaryColor, 0.05 * (1 - lineDistance));
            ctx.stroke();
          }
        }
      }
    }

    // Set canvas to full screen with performance optimizations for mobile
    const handleResize = () => {
      // Use lower resolution for mobile
      const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 1) : window.devicePixelRatio;
      canvas.width = window.innerWidth * (isMobile ? 0.8 : 1);
      canvas.height = window.innerHeight * (isMobile ? 0.8 : 1);
      canvas.style.width = '100%';
      canvas.style.height = '100%';

      if (ctx) {
        ctx.scale(pixelRatio, pixelRatio);
      }

      draw();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Animation loop with error handling
    const animate = () => {
      try {
        draw();
        animationRef.current = requestAnimationFrame(animate);
      } catch (error) {
        console.error("Animation error:", error);
        // Fall back to static if animation fails
        setUseFallback(true);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMobile, useFallback]);

  // For very low-end devices, use a simple gradient div instead of canvas
  if (useFallback) {
    return (
      <div
        className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-b from-indigo-50/30 to-purple-50/30"
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>
    );
  }

  // For better devices, use the canvas
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10 opacity-70"
      aria-hidden="true"
    />
  );
};

export default HeroBg; 