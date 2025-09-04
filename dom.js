export const inputEl   = document.getElementById('charInput');
export const displayBt = document.getElementById('displayBtn');
export const graphEl   = document.getElementById('graph');
export const emptyEl   = document.getElementById('emptyHint');
export const statusEl  = document.getElementById('status');

export const panelEl   = document.getElementById('infoPanel');
export const infoChar  = document.getElementById('infoChar');
export const infoRadical  = document.getElementById('infoRadical');
export const infoRank  = document.getElementById('infoRank');
export const infoPy    = document.getElementById('infoPinyin');
export const infoEn    = document.getElementById('infoEnglish');

export function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg || '';
}

export function showEmptyHintIfNeeded(nodes) {
  const isEmpty = nodes.length === 0;
  if (emptyEl) emptyEl.style.display = isEmpty ? 'block' : 'none';
}
