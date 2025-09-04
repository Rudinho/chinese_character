import { initNetwork, nodes } from './visnet.js';
import { graphEl, showEmptyHintIfNeeded } from './dom.js';
import { loadCatalog, loadCharacterInfo } from './data.js';
import { bindEvents } from './events.js';
import { addRadicalsInRadialLayout } from './layout.js';

(function () {
  'use strict';
  (async function start() {
    initNetwork(graphEl);
    await loadCatalog();
    await loadCharacterInfo();
    addRadicalsInRadialLayout();
    bindEvents();
    showEmptyHintIfNeeded(nodes);
  })();
})();
