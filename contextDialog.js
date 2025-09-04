import { graphEl } from './dom.js';
import { expandEdgesFor, deleteEdgesAndNeighbors, showInfoFor } from './actions.js';
import { highlightComponentsOf, resetAllStyles } from './highlight.js';

export function openContextDialog(char, x, y) {
  closeContextDialog();

  const dlg = document.createElement('div');
  dlg.className = 'context-dialog';
  dlg.style.left = Math.round(x) + 'px';
  dlg.style.top = Math.round(y) + 'px';
  dlg.id = 'context-dialog';

  const title = document.createElement('div');
  title.className = 'context-title';
  title.textContent = `Actions for “${char}”`;

  const list = document.createElement('div');
  list.className = 'menu-list';

  const mkBtn = (label, onClick) => {
    const b = document.createElement('button');
    b.className = 'menu-item';
    b.textContent = label;
    b.addEventListener('click', () => { onClick(); closeContextDialog(); });
    return b;
  };

  list.appendChild(mkBtn('Show edges', () => expandEdgesFor(char)));
  list.appendChild(mkBtn('Delete edges', () => deleteEdgesAndNeighbors(char)));
  list.appendChild(mkBtn('Show info', () => showInfoFor(char)));
  list.appendChild(mkBtn('Highlight components', () => highlightComponentsOf(char)));
  list.appendChild(mkBtn('Clear highlights', () => resetAllStyles()));
  list.appendChild(mkBtn('Cancel', () => {}));

  dlg.appendChild(title);
  dlg.appendChild(list);
  graphEl.appendChild(dlg);

  setTimeout(() => {
    const onDocClick = (ev) => { if (!dlg.contains(ev.target)) closeContextDialog(); };
    document.addEventListener('mousedown', onDocClick, { once: true });
  }, 0);

  const onEsc = (ev) => { if (ev.key === 'Escape') { closeContextDialog(); document.removeEventListener('keydown', onEsc); } };
  document.addEventListener('keydown', onEsc);
}

export function closeContextDialog() {
  const existing = document.getElementById('context-dialog');
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
}
