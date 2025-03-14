import { useEffect, useRef } from 'react';

const HeroBg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Grid properties
    const gridSpacing = 40;
    const dotSize = 1.5;
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

      // Offset for centered grid
      const offsetX = (canvas.width % gridSpacing) / 2;
      const offsetY = (canvas.height % gridSpacing) / 2;

      // Draw grid
      for (let y = -1; y < rows; y++) {
        for (let x = -1; x < cols; x++) {
          // 3D wave effect
          const posX = x * gridSpacing + offsetX;
          const posY = y * gridSpacing + offsetY;

          // Create wave motion
          const distanceToCenter = Math.sqrt(
            Math.pow((posX - canvas.width / 2) / canvas.width, 2) +
            Math.pow((posY - canvas.height / 2) / canvas.height, 2)
          );

          const waveAmplitude = 15;
          const waveFrequency = 2;
          const z = Math.sin(distanceToCenter * waveFrequency * Math.PI + now) * waveAmplitude;

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

          // Connect dots with lines (only to right and bottom neighbors)
          if (x < cols - 1) {
            // Connect to right neighbor
            ctx.beginPath();
            ctx.moveTo(posX, posY);

            const nextX = (x + 1) * gridSpacing + offsetX;
            const nextY = posY;
            const nextZ = Math.sin(
              Math.sqrt(
                Math.pow((nextX - canvas.width / 2) / canvas.width, 2) +
                Math.pow((nextY - canvas.height / 2) / canvas.height, 2)
              ) * waveFrequency * Math.PI + now
            ) * waveAmplitude;

            ctx.lineTo(nextX, nextY);

            // Line opacity based on distance
            const lineDistance = Math.abs(z - nextZ) / waveAmplitude;
            ctx.strokeStyle = getRGBA(primaryColor, 0.05 * (1 - lineDistance));
            ctx.stroke();
          }

          if (y < rows - 1) {
            // Connect to bottom neighbor
            ctx.beginPath();
            ctx.moveTo(posX, posY);

            const nextX = posX;
            const nextY = (y + 1) * gridSpacing + offsetY;
            const nextZ = Math.sin(
              Math.sqrt(
                Math.pow((nextX - canvas.width / 2) / canvas.width, 2) +
                Math.pow((nextY - canvas.height / 2) / canvas.height, 2)
              ) * waveFrequency * Math.PI + now
            ) * waveAmplitude;

            ctx.lineTo(nextX, nextY);

            const lineDistance = Math.abs(z - nextZ) / waveAmplitude;
            ctx.strokeStyle = getRGBA(primaryColor, 0.05 * (1 - lineDistance));
            ctx.stroke();
          }
        }
      }
    }

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Animation loop
    let animationFrame: number;
    const animate = () => {
      draw();
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10 opacity-70"
    />
  );
};

export default HeroBg; 