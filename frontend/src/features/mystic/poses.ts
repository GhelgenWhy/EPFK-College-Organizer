import cat01 from '../../assets/cheshire/cat-01-lying.png';
import cat02 from '../../assets/cheshire/cat-02-grin.png';
import cat03 from '../../assets/cheshire/cat-03-peek.png';
import cat04 from '../../assets/cheshire/cat-04-sleep.png';
import cat05 from '../../assets/cheshire/cat-05-calendar.png';
import cat06 from '../../assets/cheshire/cat-06-read.png';
import cat07 from '../../assets/cheshire/cat-07-yarn.png';
import cat08 from '../../assets/cheshire/cat-08-dissolve.png';
import cat09 from '../../assets/cheshire/cat-09-wave.png';
import cat10 from '../../assets/cheshire/cat-10-tea.png';
import cat11 from '../../assets/cheshire/cat-11-done.png';
import cat12 from '../../assets/cheshire/cat-12-notebook.png';

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
  tea: cat10,
  done: cat11,
  notebook: cat12,
} as const;

export type CheshirePose = keyof typeof CHESHIRE_POSES;
