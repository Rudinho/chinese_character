import { setStatus } from './dom.js';

export const validChars = new Set();
export let edgeIndex = null;
export let rawEdgesLoaded = false;

export let charInfo = {};
export let charRadicals = {};
export const charTypes = Object.create(null);

export async function loadCatalog() {
  try {
    const res = await fetch('nodes.json');
    if (!res.ok) throw new Error('Failed to load nodes.json');
    const list = await res.json();
    for (const n of list) {
      const id = String(n.Id || n.id || n.Label || n.label || '').trim();
      if (id){
        validChars.add(id);
        charRadicals[id] = (n.Radical && String(n.Radical).trim()) || '—';
        charTypes[id]    = n.Type || '';
      }
    }
    setStatus('Character catalog loaded.');
  } catch (err) {
    console.warn('nodes.json not available; allowing any character.', err);
    setStatus('nodes.json not found — any character allowed.');
  }
}

export async function ensureEdgesLoaded() {
  if (rawEdgesLoaded) return;
  edgeIndex = new Map();
  try {
    const res = await fetch('edges.json');
    if (!res.ok) throw new Error('Failed to load edges.json');
    const list = await res.json();
    const normalize = (e) => {
      let s = e.source || e.Source || e.from || e.From || e.start || e.Start || e.SourceId;
      let t = e.target || e.Target || e.to || e.To || e.end || e.End || e.TargetId;
      if (!s || !t) return null;
      s = String(s).trim();
      t = String(t).trim();
      return (s && t) ? { s, t } : null;
    };
    for (const e of list) {
      const nt = normalize(e);
      if (!nt) continue;
      const { s, t } = nt;
      if (!edgeIndex.has(s)) edgeIndex.set(s, new Set());
      if (!edgeIndex.has(t)) edgeIndex.set(t, new Set());
      edgeIndex.get(s).add(t);
      edgeIndex.get(t).add(s);
    }
    rawEdgesLoaded = true;
    setStatus('Edges loaded.');
  } catch (err) {
    console.warn('edges.json not found; edge expansion disabled.', err);
    setStatus('edges.json not found — cannot show edges.');
    edgeIndex = null;
    rawEdgesLoaded = true;
  }
}

export async function loadCharacterInfo() {
  try {
    const res = await fetch('character_frequencies.json');
    if (!res.ok) throw new Error('Failed to load character_frequencies.json');
    const data = await res.json();
    if (Array.isArray(data)) {
      const map = {};
      for (const row of data) {
        const key = String(row.char || row.Id || row.Label || '').trim();
        if (key) map[key] = row;
      }
      charInfo = map;
    } else {
      charInfo = data || {};
    }
    setStatus('Character info loaded.');
  } catch (err) {
    console.warn('character_frequencies.json not found; info panel limited.', err);
    charInfo = {};
  }
}
