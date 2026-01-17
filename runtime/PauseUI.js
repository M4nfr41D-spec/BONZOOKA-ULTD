// Copyright (c) Manfred Foissner. All rights reserved.
// License: See LICENSE.txt in the project root.

// ============================================================
// PauseUI.js - In-run overlay toggle (Inventory/Skills)
//
// Goals:
// - Keep the game viewport clean during combat
// - Show left/right panels only when paused (overlay)
// - Deterministic, minimal surface area change
// ============================================================

import { State } from './State.js';
import { UI } from './UI.js';

export const PauseUI = {
  apply() {
    // Toggle visibility
    const paused = !!State.ui.paused;
    document.body.classList.toggle('paused-ui', paused);
    
    // Show/hide left and right panels
    const leftPanel = document.getElementById('leftPanel');
    const rightPanel = document.getElementById('rightPanel');
    if (leftPanel) leftPanel.style.display = paused ? 'flex' : 'none';
    if (rightPanel) rightPanel.style.display = paused ? 'flex' : 'none';
    
    // Re-render content when opening
    if (paused && UI && UI.renderAll) {
      UI.renderAll();
    }
  },

  toggle() {
    State.ui.paused = !State.ui.paused;
    this.apply();
  },

  open() {
    State.ui.paused = true;
    this.apply();
  },

  close() {
    State.ui.paused = false;
    this.apply();
  }
};

// In your portal/door entity update:
if (State.input.interactPressed) {
  // Portal was just pressed
  this.interact();
  State.input.interactPressed = false; // Consume the input
}
