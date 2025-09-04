import { nodes, edges, network } from './visnet.js';
import { ensureEdgesLoaded, edgeIndex, validChars } from './data.js';
import { getFrequencyColor } from './colors.js';
import { setStatus } from './dom.js';
import { COMP_EDGE, NODE_BORDER } from './constants.js';
import { areVariantForms, linkVariantPair } from './variants.js';

let selectionBuffer = [];

export async function handleNodeClick(clickedId) {
  if (!selectionBuffer.includes(clickedId)) selectionBuffer.push(clickedId);
  if (selectionBuffer.length > 2) selectionBuffer.shift();
  if (selectionBuffer.length === 2) {
    const [a, b] = selectionBuffer;
    const found = await findAndDisplayCommonParents(a, b);
    // reset buffer after an attempt
    if (found) {
      selectionBuffer = [];
      if (typeof network.unselectAll === 'function') network.unselectAll();
      else network.setSelection({ nodes: [], edges: [] });
    } else {
      // keep last clicked as the new starting point
      selectionBuffer = [b];
    }
  }
}

export async function findAndDisplayCommonParents(nodeA, nodeB) {
  await ensureEdgesLoaded();
  if (!edgeIndex) { setStatus('Edge data unavailable.'); return false; }

  // ✅ Variant fast-path: only link the pair, do NOT expand
  if (areVariantForms(nodeA, nodeB)) {
    linkVariantPair(nodeA, nodeB);
    try { network.unselectAll(); } catch {}
    return true;
  }

  // Compute common parents (original logic retained)
  const results = [];
  for (const [candidate, neighbors] of edgeIndex.entries()) {
    if (neighbors.has(nodeA) && neighbors.has(nodeB)) results.push(candidate);
  }

  if (results.length === 0) {
    setStatus(`No common parent for “${nodeA}” and “${nodeB}”.`);
    try { network.unselectAll(); } catch {}
    return false;
  }

  // Sort by frequency (desc) and cap to keep the UI responsive
  const MAX_COMMON_PARENTS = 40; // tweak as you like
  const sorted = results.slice().sort((a, b) => (charInfo[b]?.count || 0) - (charInfo[a]?.count || 0));
  const limited = sorted.slice(0, MAX_COMMON_PARENTS);
  const over = results.length - limited.length;

  let added = 0;
  for (const parent of limited) {
    if (!nodes.get(parent) && (validChars.size === 0 || validChars.has(parent))) {
      nodes.add({ id: parent, label: parent, color: { background: getFrequencyColor(parent), border: NODE_BORDER } });
      added++;
    }
    const edge1Id = `${parent}__${nodeA}`;
    const edge2Id = `${parent}__${nodeB}`;
    if (!edges.get(edge1Id) && !edges.get(`${nodeA}__${parent}`)) edges.add({ id: edge1Id, from: parent, to: nodeA });
    if (!edges.get(edge2Id) && !edges.get(`${nodeB}__${parent}`)) edges.add({ id: edge2Id, from: parent, to: nodeB });

    // Keep your existing highlight styling
    const highlightColor = COMP_EDGE;
    nodes.update([
      { id: parent, color: { background: getFrequencyColor(parent), border: '#9bb1ff',
          highlight: { background: getFrequencyColor(parent), border: '#9bb1ff' } } },
      { id: nodeA,  color: { background: getFrequencyColor(nodeA), border: highlightColor,
          highlight: { background: getFrequencyColor(nodeA), border: highlightColor } } },
      { id: nodeB,  color: { background: getFrequencyColor(nodeB), border: highlightColor,
          highlight: { background: getFrequencyColor(nodeB), border: highlightColor } } },
    ]);

    edges.update([
      { id: edge1Id, color: { color: highlightColor, highlight: highlightColor }, width: 3, dashes: false },
      { id: edge2Id, color: { color: highlightColor, highlight: highlightColor }, width: 3, dashes: false }
    ]);
  }

  if (added > 0) {
    try { network.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } }); } catch {}
  }

  // Status: preserve original message when not capped
  if (over > 0) {
    setStatus(`Found ${results.length} common parent(s), showing ${limited.length} (+${over} hidden).`);
  } else {
    setStatus(`Found ${results.length} common parent(s): ${results.join(', ')}`);
  }

  // UX: clear selection after a successful match
  try { network.unselectAll(); } catch {}

  return true;
}


