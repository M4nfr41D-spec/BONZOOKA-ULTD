# Fix Implementation Guide - Issue #2 (Looping Sound Cleanup)

## Status: Implementation Requires Manual Ability Updates

Audio.js has been updated with cleanup infrastructure. Now **Enemies.js** needs to be updated to use it.

### What Was Added to Audio.js
1. `Audio.activeSoundInstances` - Tracks all looping sounds
2. `Audio.stopSoundById(id)` - Stop a specific looping sound
3. `Audio.stopAllLoopingSounds()` - Emergency cleanup
4. Automatic tracking of looping sounds (those with `loop: true`)

### Where Ability Sounds Are Played (Enemies.js)

**Example: Corruption DOT ability**
```javascript
// Current (line ~xxx in Enemies.js):
State.modules?.Audio?.play('corruption_dot', { x, y });
```

**After fix, it should store the sound:**
```javascript
// Keep sound reference on enemy object
if (enemy.abilities.includes('corruptDot')) {
  enemy.dotSound = State.modules?.Audio?.play('corruption_dot', { x, y });
}
```

**Then clean up when ability ends:**
```javascript
// When corruption DOT timer expires or enemy dies
if (enemy.dotSound) {
  Audio.stopSoundById('corruption_dot');
  enemy.dotSound = null;
}
```

### Same for Repair Tether

Find where `repair_tether` is played in Enemies.js and apply same pattern:

```javascript
// On ability start:
enemy.tetherSound = State.modules?.Audio?.play('repair_tether', { x, y });

// On ability end (tether disconnected or target dies):
if (enemy.tetherSound) {
  Audio.stopSoundById('repair_tether');
  enemy.tetherSound = null;
}
```

### Emergency Nuclear Option

If an ability never ends properly, calling `Audio.stopAllLoopingSounds()` will kill ALL looping sounds:

```javascript
// In Player.takeDamage() or death sequence:
if (Player.isDead()) {
  State.modules?.Audio?.stopAllLoopingSounds();
}
```

---

## Search for These Lines in Enemies.js to Add Cleanup

```bash
# Find lines that play these sounds:
- corruption_dot
- repair_tether
```

Then wrap with tracking as shown above.

---

**Note:** Since Enemies.js contains the actual ability logic, I can't fully automate Issue #2 without potentially breaking ability mechanics. Please update manually following the pattern above, or share the exact ability implementation code and I'll add the cleanup calls.
