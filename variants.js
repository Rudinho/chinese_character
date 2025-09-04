// src/variants.js
import { nodes, edges, network } from './visnet.js';
import { setStatus } from './dom.js';

// Safe one-to-one positional/graphic variants
export const VARIANT_CANON = {
    // yours
    '扌':'手','氵':'水','纟':'糸','讠':'言','饣':'食','钅':'金',
    '牜':'牛','礻':'示','忄':'心','艹':'艸','辶':'辵',
  
    // very common additions
    '亻':'人',
    '犭':'犬',
    '攵':'攴',
    '刂':'刀',
    '灬':'火',
    '衤':'衣',
    '爫':'爪',
    '丬':'爿',
    '氺':'水',
    '巛':'川',
  
    // “net” forms – normalize to the 4-stroke component
    '罓':'罒',
    '⺲':'罒',
  
    // traditional side-forms (normalize to full form)
    '釒':'金',
    '飠':'食',
    '糹':'糸',
    '訁':'言'
  };


// Only map these when you know placement (left/right/top/bottom)
export function canonicalForm(ch, placement /* 'left'|'right'|'top'|'bottom'|undefined */) {
  if (ch === '阝') {
    if (placement === 'left')  return '阜'; // mound
    if (placement === 'right') return '邑'; // city
    return ch; // unknown side: leave as-is
  }
  if (ch === '⺼') return '肉'; // flesh radical, often moon-shaped
  return VARIANT_CANON[ch] || ch;
}

export const areVariantForms = (a, b) => a !== b && canonicalForm(a) === canonicalForm(b);

export function linkVariantPair(a, b) {
  const idAB = `≡${a}__${b}`;
  const idBA = `≡${b}__${a}`;
  if (!edges.get(idAB) && !edges.get(idBA)) {
    edges.add({
      id: idAB, from: a, to: b,
      dashes: true, width: 2,
      color: { color: '#9bb1ff', highlight: '#9bb1ff' }
    });
  }
  nodes.update([
    { id: a, color: { background: '#2a3260', border: '#9bb1ff',
      highlight: { background: '#2a3260', border: '#9bb1ff' } } },
    { id: b, color: { background: '#2a3260', border: '#9bb1ff',
      highlight: { background: '#2a3260', border: '#9bb1ff' } } }
  ]);
  try { network.fit({ animation: { duration: 300, easingFunction: 'easeInOutQuad' } }); } catch {}
  setStatus(`Linked variant forms “${a}” ≡ “${b}”.`);
}