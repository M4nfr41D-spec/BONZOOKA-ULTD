// Copyright (c) Manfred Foissner. All rights reserved.
// License: See LICENSE.txt in the project root.

// ============================================================
// Camera.js - Player-Centered Camera System
// ============================================================
// v2.5.2 - FIXED: Inner 1/3 deadzone, player can reach map edges
// Follows player with smooth lerp, handles map boundaries

import { State } from '../State.js';

export const Camera = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  
  // Config (can be overridden from config.json)
  smoothing: 0.06,        // Lower = smoother/slower follow (was 0.08)
  innerZoneFactor: 0.33,  // Player stays in inner 1/3 of screen
  lookahead: 0.15,        // Look ahead in movement direction (% of speed)
  shake: { x: 0, y: 0, intensity: 0, duration: 0 },
  
  // Initialize camera
  init(startX = 0, startY = 0) {
    this.x = startX;
    this.y = startY;
    this.targetX = startX;
    this.targetY = startY;
    this.shake = { x: 0, y: 0, intensity: 0, duration: 0 };
  },
  
  // Update camera position - REWORKED for inner-1/3 behavior
  update(dt, screenWidth, screenHeight) {
    const player = State.player;
    const map = State.world?.currentZone;
    
    if (!player) return;
    
    // Calculate inner zone boundaries (1/3 of screen centered)
    const innerMarginX = screenWidth * this.innerZoneFactor;
    const innerMarginY = screenHeight * this.innerZoneFactor;
    
    // Player position in screen space
    const playerScreenX = player.x - this.x;
    const playerScreenY = player.y - this.y;
    
    // Inner zone boundaries
    const innerLeft = innerMarginX;
    const innerRight = screenWidth - innerMarginX;
    const innerTop = innerMarginY;
    const innerBottom = screenHeight - innerMarginY;
    
    // Only move camera if player is outside inner zone
    let needsMoveX = false;
    let needsMoveY = false;
    let targetOffsetX = 0;
    let targetOffsetY = 0;
    
    if (playerScreenX < innerLeft) {
      targetOffsetX = playerScreenX - innerLeft;
      needsMoveX = true;
    } else if (playerScreenX > innerRight) {
      targetOffsetX = playerScreenX - innerRight;
      needsMoveX = true;
    }
    
    if (playerScreenY < innerTop) {
      targetOffsetY = playerScreenY - innerTop;
      needsMoveY = true;
    } else if (playerScreenY > innerBottom) {
      targetOffsetY = playerScreenY - innerBottom;
      needsMoveY = true;
    }
    
    // Apply lookahead based on velocity (helps with edge navigation)
    const lookaheadX = player.vx * this.lookahead;
    const lookaheadY = player.vy * this.lookahead;
    
    // Calculate target camera position
    this.targetX = this.x + targetOffsetX + lookaheadX * dt * 2;
    this.targetY = this.y + targetOffsetY + lookaheadY * dt * 2;
    
    // Clamp to map boundaries if map exists
    // This ensures player can ALWAYS reach the edge of the map
    if (map) {
      const mapW = map.width || 2000;
      const mapH = map.height || 2000;
      
      // Camera cannot go negative
      this.targetX = Math.max(0, this.targetX);
      this.targetY = Math.max(0, this.targetY);
      
      // Camera cannot show beyond map edges
      // BUT: if map is smaller than screen, center it
      if (mapW <= screenWidth) {
        this.targetX = (mapW - screenWidth) / 2;
      } else {
        this.targetX = Math.min(mapW - screenWidth, this.targetX);
      }
      
      if (mapH <= screenHeight) {
        this.targetY = (mapH - screenHeight) / 2;
      } else {
        this.targetY = Math.min(mapH - screenHeight, this.targetY);
      }
    }
    
    // Smooth interpolation toward target
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    
    // Faster catch-up when player is moving fast (prevents "sticky" feeling)
    const playerSpeed = Math.hypot(player.vx, player.vy);
    const dynamicSmoothing = this.smoothing * (1 + playerSpeed / 500);
    
    if (needsMoveX || Math.abs(dx) > 2) {
      this.x += dx * Math.min(1, dynamicSmoothing + dt * 3);
    }
    if (needsMoveY || Math.abs(dy) > 2) {
      this.y += dy * Math.min(1, dynamicSmoothing + dt * 3);
    }
    
    // Screen shake
    if (this.shake.duration > 0) {
      this.shake.duration -= dt;
      const intensity = this.shake.intensity * (this.shake.duration / this.shake.maxDuration);
      this.shake.x = (Math.random() - 0.5) * intensity * 2;
      this.shake.y = (Math.random() - 0.5) * intensity * 2;
    } else {
      this.shake.x = 0;
      this.shake.y = 0;
    }
  },
  
  // Get final camera position (with shake)
  getX() {
    return Math.round(this.x + this.shake.x);
  },
  
  getY() {
    return Math.round(this.y + this.shake.y);
  },
  
  // Apply camera transform to context
  applyTransform(ctx) {
    ctx.translate(-this.getX(), -this.getY());
  },
  
  // Reset transform
  resetTransform(ctx) {
    ctx.translate(this.getX(), this.getY());
  },
  
  // Trigger screen shake
  triggerShake(intensity = 5, duration = 0.2) {
    // Only override if stronger
    if (intensity > this.shake.intensity || this.shake.duration <= 0) {
      this.shake.intensity = intensity;
      this.shake.duration = duration;
      this.shake.maxDuration = duration;
    }
  },
  
  // Convert screen coords to world coords
  screenToWorld(screenX, screenY) {
    return {
      x: screenX + this.getX(),
      y: screenY + this.getY()
    };
  },
  
  // Convert world coords to screen coords
  worldToScreen(worldX, worldY) {
    return {
      x: worldX - this.getX(),
      y: worldY - this.getY()
    };
  },
  
  // Check if world position is visible on screen
  isVisible(worldX, worldY, margin = 100, screenW = 800, screenH = 600) {
    const screen = this.worldToScreen(worldX, worldY);
    return screen.x > -margin && 
           screen.x < screenW + margin &&
           screen.y > -margin && 
           screen.y < screenH + margin;
  },
  
  // Snap camera instantly (no lerp)
  snapTo(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
  },
  
  // Center on player instantly
  centerOnPlayer(screenWidth, screenHeight) {
    const player = State.player;
    if (player) {
      this.snapTo(
        player.x - screenWidth / 2,
        player.y - screenHeight / 2
      );
    }
  }
};

export default Camera;
