import cat01 from '../../assets/cheshire/cat-01-lying.png';
import cat02 from '../../assets/cheshire/cat-02-grin.png';
import cat03 from '../../assets/cheshire/cat-03-peek.png';
import cat04 from '../../assets/cheshire/cat-04-sleep.png';
import cat05 from '../../assets/cheshire/cat-05-calendar.png';
import cat06 from '../../assets/cheshire/cat-06-read.png';
import cat07 from '../../assets/cheshire/cat-07-yarn.png';
import cat08 from '../../assets/cheshire/cat-08-dissolve.png';
import cat09 from '../../assets/cheshire/cat-09-wave.png';

// Позы Чеширского кота: один персонаж, девять состояний для разных пустых мест интерфейса.
export const CHESHIRE_POSES = {
  lying: cat01,
  grin: cat02,
  peek: cat03,
  sleep: cat04,
  calendar: cat05,
  read: cat06,
  yarn: cat07,
  dissolve: cat08,
  wave: cat09,
} as const;

export type CheshirePose = keyof typeof CHESHIRE_POSES;

interface CheshireCatProps {
  pose: CheshirePose;
  /** Высота в пикселях; ширина пропорциональна. */
  height?: number;
  className?: string;
}

/**
 * Декоративный кот. aria-hidden: текст состояния рядом уже объясняет пустоту.
 * pointer-events отключены, чтобы кот не мешал кликам.
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
