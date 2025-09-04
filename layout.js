import { nodes } from './visnet.js';
import { getFrequencyColor } from './colors.js';
import { RADICALS_214, SORT_MODE, NODE_BORDER } from './constants.js';
import { charInfo } from './data.js';
import { setStatus } from './dom.js';

export function addRadicalsInRadialLayout() {
  let radicalsSorted;
  if (SORT_MODE === 'frequency') {
    radicalsSorted = [...RADICALS_214].sort((a,b) => {
      const fa = charInfo[a]?.count || 0;
      const fb = charInfo[b]?.count || 0;
      return fb - fa;
    });
  } else {
    radicalsSorted = [...RADICALS_214];
  }

  const centerX = 0, centerY = 0, radius = 1300;
  const count = radicalsSorted.length;

  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    nodes.add({
      id: radicalsSorted[i],
      label: radicalsSorted[i],
      x, y,
      fixed: { x: false, y: false },
      color: { background: getFrequencyColor(radicalsSorted[i]), border: NODE_BORDER }
    });
  }
  setStatus(`Displayed ${count} radicals in radial layout.`);
}
