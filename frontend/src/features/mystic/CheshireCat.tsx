import { CHESHIRE_POSES, type CheshirePose } from './poses';

interface CheshireCatProps {
  pose: CheshirePose;
  height?: number;
  className?: string;
}

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
