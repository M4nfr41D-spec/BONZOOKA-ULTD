// Copyright (c) Manfred Foissner. All rights reserved.
// License: See LICENSE.txt in the project root.

// ============================================================
// Input.js - Desktop Input (WASD + Mouse)
// ============================================================
// v2.5.2 - ADDED: H key for Hub return, improved interact handling

import { State } from './State.js';

export const Input = {
  canvas: null,
  canvasRect: null,
  
  init(canvas) {
    this.canvas = canvas;
    this.updateRect();
    
    // Keyboard
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('keyup', (e) => this.onKeyUp(e));
    
    // Mouse
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Track canvas position for resize
    window.addEventListener('resize', () => this.updateRect());
    
    // Prevent space scrolling
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
      }
    });
  },
  
  updateRect() {
    if (this.canvas) {
      this.canvasRect = this.canvas.getBoundingClientRect();
    }
  },
  
  onKeyDown(e) {
    const input = State.input;
    
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        input.up = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        input.down = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        input.left = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        input.right = true;
        break;
      case 'Space':
        input.fire = true;
        break;
      case 'KeyE':
        // Edge-trigger (pressed) + level-trigger (held)
        if (!input.interact) input.interactPressed = true;
        input.interact = true;
        break;
      case 'KeyH':
        // H = Return to Hub (edge-triggered)
        if (!input.hub) input.hubPressed = true;
        input.hub = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        input.shift = true;
        break;
      case 'Escape':
        // Toggle pause
        if (!input.escape) input.escapePressed = true;
        input.escape = true;
        break;
    }
  },
  
  onKeyUp(e) {
    const input = State.input;
    
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        input.up = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        input.down = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        input.left = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        input.right = false;
        break;
      case 'Space':
        input.fire = false;
        break;
      case 'KeyE':
        input.interact = false;
        break;
      case 'KeyH':
        input.hub = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        input.shift = false;
        break;
      case 'Escape':
        input.escape = false;
        break;
    }
  },
  
  onMouseMove(e) {
    this.updateRect();
    
    // Convert to canvas coordinates
    State.input.mouseX = e.clientX - this.canvasRect.left;
    State.input.mouseY = e.clientY - this.canvasRect.top;
  },
  
  onMouseDown(e) {
    if (e.button === 0) { // Left click
      State.input.fire = true;
    }
  },
  
  onMouseUp(e) {
    if (e.button === 0) {
      State.input.fire = false;
    }
  },
  
  // Get movement vector from WASD
  getMovement() {
    const input = State.input;
    let dx = 0, dy = 0;
    
    if (input.up) dy -= 1;
    if (input.down) dy += 1;
    if (input.left) dx -= 1;
    if (input.right) dx += 1;
    
    // Normalize diagonal movement
    if (dx !== 0 && dy !== 0) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;
    }
    
    return { dx, dy };
  },
  
  // Get angle from player to mouse
  getAimAngle(playerX, playerY) {
    const mx = State.input.mouseX;
    const my = State.input.mouseY;
    return Math.atan2(my - playerY, mx - playerX);
  },
  
  // Clear edge-triggered flags (call at end of frame)
  clearEdgeTriggers() {
    State.input.interactPressed = false;
    State.input.hubPressed = false;
    State.input.escapePressed = false;
  }
};

export default Input;
