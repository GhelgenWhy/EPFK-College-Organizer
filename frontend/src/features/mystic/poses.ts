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

// Cheshire Cat poses: one character, one image per situation.
export const CHESHIRE_POSES = {
  lying: cat01, // lies on a flat edge, tail hanging down
  grin: cat02, // only the grin and the eyes
  peek: cat03, // peeks from behind a vertical edge
  sleep: cat04, // sleeps curled up
  calendar: cat05, // holds a blank calendar page
  read: cat06, // reads a book
  yarn: cat07, // plays with yarn (loading)
  dissolve: cat08, // dissolving (errors, 404)
  wave: cat09, // waves hello
  tea: cat10, // relaxes in a striped cushion with a cup of tea
  done: cat11, // thumbs up next to finished books
  notebook: cat12, // waves with a notebook in the other paw (profile page)
} as const;

export type CheshirePose = keyof typeof CHESHIRE_POSES;