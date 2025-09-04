// visnet.js
import { NODE_BG, NODE_BORDER, NODE_BG_HI, NODE_BORDER_HI, EDGE_COLOR, EDGE_HILITE } from './constants.js';

export const nodes = new vis.DataSet([]);
export const edges = new vis.DataSet([]);
export let network = null;

// local token to avoid extra imports; feel free to move to colors.js
const GOLD = '#E6B800';

export function initNetwork(graphEl) {
  const data = { nodes, edges };
  const options = {
    autoResize: true,
    physics: { enabled: true, stabilization: true },
    nodes: {
      shape: 'circle',

      color: {
        background: NODE_BG,
        border: NODE_BORDER,
        // keep highlight equal to base; chosen() will handle the ring
        highlight: { background: NODE_BG, border: NODE_BORDER },
        hover:     { background: NODE_BG, border: NODE_BORDER }
      },

      borderWidth: 1,

      // Selection override: gold ring, never blue fill.
      chosen: {
        node(values, id, selected /*, hovering */) {
          // 🔧 Normalize when vis gives us a string like 'rgb(…)'.
          if (typeof values.color === 'string') {
            values.color = { background: values.color };
          } else if (!values.color || typeof values.color !== 'object') {
            values.color = {};
          }

          // Preserve whatever background we already had.
          const bg = values.color.background || NODE_BG;
          values.color.background = bg;

          // Also make sure "highlight" background can’t flip to blue.
          values.color.highlight = { background: bg, border: values.color.border || NODE_BORDER };

          if (selected) {
            values.borderWidth = 4;
            values.color.border = GOLD;
            values.shadow = true;
            values.shadowColor = GOLD;
            values.shadowSize = 8;
            values.shadowX = 0;
            values.shadowY = 0;
          } else {
            values.borderWidth = 1;
            values.shadow = false;
          }
        }
      },

      font: { color: '#e5e9f0', size: 28, face: 'system-ui' }
    },

    edges: {
      color: { color: EDGE_COLOR, highlight: EDGE_HILITE },
      width: 1.5,
      smooth: { type: 'dynamic' }
    },

    // hover effects off; selection stays on to show the ring
    interaction: { hover: false, selectable: true }
  };
 
  network = new vis.Network(graphEl, data, options);
  network.setOptions({ physics: { solver: 'barnesHut', maxVelocity: 30, minVelocity: 0.5 } });
}

