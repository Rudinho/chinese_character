import { displayBt, inputEl, graphEl } from './dom.js';
import { displayNodes } from './actions.js';
import { network } from './visnet.js';
import { openContextDialog } from './contextDialog.js';
import { handleNodeClick } from './selection.js';

export function bindEvents() {
  displayBt.addEventListener('click', displayNodes);
  inputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') displayNodes(); });
  window.addEventListener('resize', () => network && network.redraw());

  graphEl.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (!network) return;
    const rect = graphEl.getBoundingClientRect();
    const dom = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const nodeId = network.getNodeAt(dom);
    if (!nodeId) { return; }
    openContextDialog(nodeId, dom.x, dom.y);
  }, { passive: false });

  network.on('click', async (params) => {
    if (params.nodes && params.nodes.length > 0) {
      await handleNodeClick(params.nodes[0]);
    }
  });
}
