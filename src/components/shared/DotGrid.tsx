import { useDotGrid } from '@/hooks/useDotGrid';

// Fixed to the viewport, under the character (-z-10): the grid reads as the
// screen surface the character leans on, so it never scrolls with the page.
export function DotGrid() {
  const canvasRef = useDotGrid();

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 -z-20 h-lvh w-full"
    />
  );
}
