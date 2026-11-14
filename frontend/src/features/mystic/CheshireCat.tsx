import { CHESHIRE_POSES, type CheshirePose } from './poses';

interface CheshireCatProps {
  pose: CheshirePose;
  /** Height in pixels; the width follows the image proportions. */
  height?: number;
  className?: string;
}

/**
 * Decorative cat. aria-hidden: the text next to it carries the meaning.
 * pointer-events are off so the cat never blocks clicks on the UI under it.
 */
export function CheshireCat({ pose, height = 120, className = '' }: CheshireCatProps) {
  return (
    <img
      src={CHESHIRE_POSES[pose]}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{ height, width: 'auto' }}
      className={`pointer-events-none select-none ${className}`}
    />
  );
}