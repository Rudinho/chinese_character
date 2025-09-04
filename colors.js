import { charInfo } from './data.js';

function lerpColor(a, b, t) {
  const ar = parseInt(a.substr(1,2),16), ag = parseInt(a.substr(3,2),16), ab = parseInt(a.substr(5,2),16);
  const br = parseInt(b.substr(1,2),16), bg = parseInt(b.substr(3,2),16), bb = parseInt(b.substr(5,2),16);
  const rr = Math.round(ar + t * (br - ar));
  const rg = Math.round(ag + t * (bg - ag));
  const rb = Math.round(ab + t * (bb - ab));
  return `rgb(${rr},${rg},${rb})`;
}

// add (or reuse any existing palette token)
export const GOLD = '#E6B800';

export function getFrequencyColor(char) {
  const row = charInfo[char];
  if (!row || typeof row.count !== 'number') return '#b0b0b0';
  const maxCount = 8000000;
  const norm = Math.min(1, Math.max(0, Math.log(row.count) / Math.log(maxCount)));
  const lowColor = '#C91C95';
  const midColor = '#1196D9';
  const highColor = '#1EBA2E';
  if (norm < 0.5) {
    return lerpColor(lowColor, midColor, norm * 2);
  } else {
    return lerpColor(midColor, highColor, (norm - 0.5) * 2);
  }
}
