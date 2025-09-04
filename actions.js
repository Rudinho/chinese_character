import { inputEl, setStatus, showEmptyHintIfNeeded, infoChar, infoRank, infoRadical, infoPy, infoEn } from './dom.js';
import { nodes, edges, network } from './visnet.js';
import { validChars, ensureEdgesLoaded, edgeIndex, charInfo, charRadicals } from './data.js';
import { getFrequencyColor } from './colors.js';
import { NODE_BORDER } from './constants.js';

function uniqueCharsFromInput(str) {
  const out = [];
  const seen = new Set();
  for (const ch of Array.from(str)) {
    if (!seen.has(ch)) {
      seen.add(ch);
      out.push(ch);
    }
  }
  return out;
}

export function displayNodes() {
  const raw = (inputEl.value || '').trim();
  if (raw.length === 0) {
    setStatus('Nothing to display.');
    return;
  }
  if (raw.length > 300) {
    setStatus('Please limit to 300 characters.');
    return;
  }
  const chars = uniqueCharsFromInput(raw);
  let added = 0;
  for (const ch of chars) {
    if (validChars.size > 0 && !validChars.has(ch)) continue;
    if (!nodes.get(ch)) {
      nodes.add({ id: ch, label: ch, color: { background: getFrequencyColor(ch), border: NODE_BORDER } });
      added++;
    }
  }
  setStatus(`Displayed ${added} new node(s).`);
  showEmptyHintIfNeeded(nodes);
}

export async function expandEdgesFor(char) {
  await ensureEdgesLoaded();
  if (!edgeIndex) { setStatus('Edge data unavailable.'); return; }
  const neighbors = edgeIndex.get(char);
  if (!neighbors || neighbors.size === 0) {
    setStatus(`No edges for “${char}”.`);
    return;
  }
  const createdNodes = [];
  const createdEdges = [];
  for (const nb of neighbors) {
    if (!nodes.get(nb)) {
      if (validChars.size === 0 || validChars.has(nb)) {
        nodes.add({ id: nb, label: nb, color: { background: getFrequencyColor(nb), border: NODE_BORDER } });
        createdNodes.push(nb);
      } else {
        continue;
      }
    }
    const edgeIdA = `${char}__${nb}`;
    const edgeIdB = `${nb}__${char}`;
    if (!edges.get(edgeIdA) && !edges.get(edgeIdB)) {
      edges.add({ id: edgeIdA, from: char, to: nb });
      createdEdges.push([char, nb]);
    }
  }
  try { network.fit({ animation: { duration: 400, easingFunction: 'easeInOutQuad' } }); } catch {}

  
  setStatus(`Expanded “${char}”: +${createdNodes.length} nodes, +${createdEdges.length} edges.`);
  showEmptyHintIfNeeded(nodes);
}

export function deleteEdgesAndNeighbors(char) {
  const connected = network.getConnectedNodes(char) || [];
  const incidentEdges = network.getConnectedEdges(char) || [];
  if (incidentEdges.length) edges.remove(incidentEdges);
  const toRemoveNodes = [];
  for (const nb of connected) {
    const nbEdges = network.getConnectedEdges(nb) || [];
    if (nbEdges.length) edges.remove(nbEdges);
    toRemoveNodes.push(nb);
  }
  if (toRemoveNodes.length) nodes.remove(toRemoveNodes);
  setStatus(`Deleted ${incidentEdges.length} edges and ${toRemoveNodes.length} neighbor node(s) of “${char}”.`);
  showEmptyHintIfNeeded(nodes);
}

export function showInfoFor(char) {
  const row = charInfo[char] || null;
  const radical = charRadicals[char] || '—';
  const rank = row && typeof row.rank !== 'undefined' ? row.rank : '—';
  const pinyinArr = row && Array.isArray(row.pinyin) ? row.pinyin : null;
  const pinyin = pinyinArr ? pinyinArr.join(', ') : '—';
  const english = row && (row.definition || row.english || row.meaning || row.gloss) ?
    (row.definition || row.english || row.meaning || row.gloss) : '—';

  if (infoChar)   infoChar.textContent = char || '—';
  if (infoRank)   infoRank.textContent = String(rank);
  if (infoRadical)infoRadical.textContent = radical;
  if (infoPy)     infoPy.textContent = pinyin;
  if (infoEn)     infoEn.textContent = english;

  const panelEl = document.getElementById('infoPanel');
  if (panelEl) panelEl.hidden = false;
}
