import { useEffect, useRef } from 'react';
import './animated-hero.css';

interface AnimatedHeroProps {
  imageSrc: string;
  cellSize?: number;
  cellGap?: number;
  totalDuration?: number;
  noise?: number;
  staticInterval?: number;
  staticAmount?: number;
  staticMinGroupSize?: number;
  staticMaxGroupSize?: number;
}

export function AnimatedHero({
  imageSrc,
  cellSize = 4,
  cellGap = 12,
  totalDuration = 3000,
  noise = 0.5,
  staticInterval = 250,
  staticAmount = 16,
  staticMinGroupSize = 8,
  staticMaxGroupSize = 16,
}: AnimatedHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;

    let animationFrameId: number;
    let active = true;

    img.onload = () => {
      if (!active) return;

      const width = img.naturalWidth;
      const height = img.naturalHeight;

      canvas.width = width;
      canvas.height = height;

      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      const offCtx = offscreenCanvas.getContext('2d');
      if (!offCtx) return;
      offCtx.drawImage(img, 0, 0, width, height);

      const step = cellSize + cellGap;
      const cols = Math.max(1, Math.floor((width + cellGap) / step));
      const rows = Math.max(1, Math.floor((height + cellGap) / step));

      const offsetX = (width - (cols * step - cellGap)) / 2;
      const offsetY = (height - (rows * step - cellGap)) / 2;

      const cellColors: [number, number, number][][] = [];
      const cellNoise: number[][] = [];
      for (let r = 0; r < rows; r++) {
        const colorRow: [number, number, number][] = [];
        const noiseRow: number[] = [];
        for (let c = 0; c < cols; c++) {
          const px = Math.min(
            Math.floor(offsetX + c * step + cellSize / 2),
            width - 1
          );
          const py = Math.min(
            Math.floor(offsetY + r * step + cellSize / 2),
            height - 1
          );
          const d = offCtx.getImageData(px, py, 1, 1).data;
          const luma = Math.round(0.299 * d[0] + 0.587 * d[1] + 0.114 * d[2]);
          colorRow.push([luma, luma, luma]);
          noiseRow.push((Math.random() * 2 - 1) * noise * rows);
        }
        cellColors.push(colorRow);
        cellNoise.push(noiseRow);
      }

      interface StaticGlitch {
        row: number;
        startCol: number;
        length: number;
        shiftX: number;
      }

      let activeGlitches: StaticGlitch[] = [];
      let lastStaticTime = 0;

      const clamp = (val: number, min: number, max: number) =>
        Math.max(min, Math.min(max, val));

      const randomGlitch = (): StaticGlitch | null => {
        const row = Math.floor(Math.random() * rows);
        const sizeRange = staticMaxGroupSize - staticMinGroupSize + 1;
        const length = clamp(
          Math.floor(Math.random() * sizeRange) + staticMinGroupSize,
          1,
          cols
        );
        const startCol = Math.floor(Math.random() * (cols - length + 1));
        const direction = Math.random() < 0.5 ? -1 : 1;
        const shiftCells = Math.floor(Math.random() * staticMaxGroupSize) + 1;
        const shiftX = shiftCells * direction * step;
        return { row, startCol, length, shiftX };
      };

      const respawnGlitches = () => {
        activeGlitches = [];
        if (staticAmount <= 0) return;

        const count = Math.floor(Math.random() * staticAmount) + 1;
        for (let i = 0; i < count; i++) {
          const glitch = randomGlitch();
          if (glitch) activeGlitches.push(glitch);
        }
      };

      const getGlitchOffset = (row: number, col: number): number => {
        for (const g of activeGlitches) {
          if (row === g.row && col >= g.startCol && col < g.startCol + g.length) {
            return g.shiftX;
          }
        }
        return 0;
      };

      const waveBand = 15;
      const fadeInTime = totalDuration * 0.35;
      const holdTime = totalDuration * 0.2;
      const fadeOutTime = totalDuration * 0.35;

      // noisyRow ranges from roughly -noise*rows to rows + noise*rows.
      // Make the wavefront sweep across that entire range so every cell
      // gets a full fade-in and fade-out.
      const noisyMin = -noise * rows;
      const noisyMax = rows + noise * rows;
      const waveFrontStart = noisyMin - waveBand;
      const waveFrontEnd = noisyMax + waveBand;
      const waveFrontRange = waveFrontEnd - waveFrontStart;

      const smoothstep = (t: number) => t * t * (3 - 2 * t);

      const cellAlpha = (waveFront: number, noisyRow: number) => {
        const t = clamp((waveFront - noisyRow) / waveBand, 0, 1);
        return smoothstep(t);
      };

      let startTime: number | null = null;

      const drawGrid = (cellAlphaFn: (row: number, col: number) => number) => {
        ctx.clearRect(0, 0, width, height);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const alpha = cellAlphaFn(r, c);
            if (alpha <= 0) continue;
            const [cr, cg, cb] = cellColors[r][c];
            const glitchX = getGlitchOffset(r, c);
            ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
            ctx.fillRect(
              offsetX + c * step + glitchX,
              offsetY + r * step,
              cellSize,
              cellSize
            );
          }
        }
      };

      const animate = (timestamp: number) => {
        if (!active) return;

        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) % totalDuration;

        if (staticInterval > 0) {
          if (timestamp - lastStaticTime >= staticInterval) {
            respawnGlitches();
            lastStaticTime = timestamp;
          }
        }

        if (elapsed < fadeInTime) {
          const progress = elapsed / fadeInTime;
          const waveFront = waveFrontStart + progress * waveFrontRange;
          drawGrid((r, c) => cellAlpha(waveFront, r + cellNoise[r][c]));
        } else if (elapsed < fadeInTime + holdTime) {
          drawGrid(() => 1);
        } else if (elapsed < fadeInTime + holdTime + fadeOutTime) {
          const progress = (elapsed - fadeInTime - holdTime) / fadeOutTime;
          const waveFront = waveFrontStart + progress * waveFrontRange;
          drawGrid((r, c) => 1 - cellAlpha(waveFront, r + cellNoise[r][c]));
        } else {
          ctx.clearRect(0, 0, width, height);
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    return () => {
      active = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    imageSrc,
    cellSize,
    cellGap,
    totalDuration,
    noise,
    staticInterval,
    staticAmount,
    staticMinGroupSize,
    staticMaxGroupSize,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="animated-hero"
    />
  );
}
