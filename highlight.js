import { nodes, edges, network } from './visnet.js';
import { setStatus } from './dom.js';
import { NODE_BG, NODE_BORDER, NODE_BG_HI, NODE_BORDER_HI, EDGE_COLOR, EDGE_HILITE, COMP_EDGE, DIM_EDGE } from './constants.js';
import { charTypes, charRadicals } from './data.js';
import { getFrequencyColor } from './colors.js';

export function resetAllStyles() {
  const currentNodes = nodes.getIds();
  nodes.update(currentNodes.map(id => ({
    id,
    color: {
      background: getFrequencyColor(id),
      border: NODE_BORDER,
      highlight: { background: getFrequencyColor(id), border: NODE_BORDER_HI }
    }
  })));

  const currentEdges = edges.getIds();
  edges.update(currentEdges.map(id => ({
    id,
    color: { color: EDGE_COLOR, highlight: EDGE_HILITE },
    width: 1.5,
    dashes: false
  })));
  setStatus('Cleared highlights.');
}

export function highlightComponentsOf(char) {
  const neighbors = network.getConnectedNodes(char) || [];
  const edgeIds   = network.getConnectedEdges(char) || [];

  if (!neighbors.length || !edgeIds.length) {
    setStatus(`No edges in view for “${char}” to highlight.`);
    return;
  }

  const compSet = new Set();
  for (const nb of neighbors) {
    const t = (charTypes[nb] || '').toLowerCase();
    const isPrimOrComp = (t === 'primitive' || t === 'component');
    const isRadical    = (charRadicals[char] && charRadicals[char] === nb);
    if (isPrimOrComp || isRadical) compSet.add(nb);
  }

  const updates = [];
  for (const eid of edgeIds) {
    const e = edges.get(eid);
    if (!e) continue;
    const nb = (e.from === char) ? e.to : (e.to === char ? e.from : null);
    if (nb && compSet.has(nb)) {
      updates.push({ id: eid, color: { color: COMP_EDGE, highlight: COMP_EDGE }, width: 3, dashes: false });
      nodes.update({
        id: nb,
        color: { background: getFrequencyColor(nb), border: COMP_EDGE,
          highlight: { background: getFrequencyColor(nb), border: COMP_EDGE } }
      });
    } else {
      updates.push({ id: eid, color: { color: DIM_EDGE, highlight: DIM_EDGE }, width: 1, dashes: true });
    }
  }
  edges.update(updates);

  nodes.update({
    id: char,
    color: { background: getFrequencyColor(char), border: '#9bb1ff',
      highlight: { background: getFrequencyColor(char), border: '#9bb1ff' } }
  });

  setStatus(`Highlighted component edges of “${char}”.`);
}
