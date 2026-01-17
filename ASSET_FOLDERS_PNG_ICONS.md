# PNG Icon Assets - Directory Structure

## Overview
The game now supports PNG-based inventory and dropped item icons with automatic fallback to emoji if images are missing.

## Asset Directory Structure

```
assets/
├── items/                              # Item icons directory
│   ├── weapons/                        # Weapon icons
│   │   ├── laser_cannon.png
│   │   ├── plasma_spreader.png
│   │   ├── railgun.png
│   │   ├── gatling_laser.png
│   │   ├── nova_emitter.png
│   │   ├── beam_laser.png
│   │   ├── scatter_cannon.png
│   │   ├── homing_launcher.png
│   │   ├── void_cannon.png
│   │   ├── pulse_rifle.png
│   │   ├── cryo_blaster.png
│   │   └── flame_thrower.png
│   │
│   ├── secondary/                     # Secondary weapons
│   │   ├── missile_pod.png
│   │   ├── mine_layer.png
│   │   ├── emp_burst.png
│   │   ├── repair_field.png
│   │   └── gravity_bomb.png
│   │
│   ├── shields/                       # Shield generators
│   │   ├── energy_barrier.png
│   │   ├── deflector.png
│   │   ├── phase_shield.png
│   │   ├── regenerative_shield.png
│   │   ├── overcharge_barrier.png
│   │   └── absorb_matrix.png
│   │
│   ├── engines/                       # Engines
│   │   ├── ion_thruster.png
│   │   ├── quantum_drive.png
│   │   ├── warp_core.png
│   │   ├── afterburner.png
│   │   └── stealth_drive.png
│   │
│   ├── reactors/                      # Reactor cores
│   │   ├── fusion_core.png
│   │   ├── antimatter_cell.png
│   │   ├── solar_array.png
│   │   └── void_siphon.png
│   │
│   ├── modules/                       # Module upgrades
│   │   ├── damage_amp.png
│   │   ├── targeting_cpu.png
│   │   ├── scrap_magnet.png
│   │   ├── lucky_charm.png
│   │   ├── armor_plating.png
│   │   ├── vampiric_core.png
│   │   ├── glass_cannon.png
│   │   ├── xp_booster.png
│   │   ├── drop_finder.png
│   │   ├── berserker_chip.png
│   │   ├── shield_booster.png
│   │   └── cooldown_reducer.png
│   │
│   ├── drones/                        # Drone companions
│   │   ├── attack_drone.png
│   │   ├── repair_drone.png
│   │   ├── shield_drone.png
│   │   ├── scavenger_drone.png
│   │   ├── decoy_drone.png
│   │   └── missile_drone.png
│   │
│   └── ui/                            # UI-specific icons
│       ├── dropped_item_common.png
│       ├── dropped_item_uncommon.png
│       ├── dropped_item_rare.png
│       ├── dropped_item_epic.png
│       ├── dropped_item_legendary.png
│       └── dropped_item_mythic.png
│
└── (existing folders remain unchanged)
    ├── asteroids/
    ├── enemies/
    ├── backgrounds/
    ├── fog/
    └── sprites/
```

## Icon Specifications

### Inventory Item Icons
- **Format**: PNG with transparency
- **Size**: 64x64 pixels (will be scaled to 30px in UI)
- **Recommended**: Design with 8px padding for safety
- **Background**: Transparent
- **Style**: Match the sci-fi aesthetic with cyan/gold accents

### Dropped Item Icons (World)
- **Format**: PNG with transparency
- **Size**: 32x32 pixels
- **Recommended**: Center icon with clear silhouette
- **Glow**: Handled automatically by code (rarity-based)

## How It Works

### Data Configuration (items.json)
Each item now has an `iconPath` field:
```json
{
  "laser_cannon": {
    "name": "Laser Cannon",
    "slot": "weapon",
    "icon": "🔫",                    // Emoji fallback
    "iconPath": "./assets/items/weapons/laser_cannon.png",
    "description": "...",
    ...
  }
}
```

### Automatic Loading & Fallback
1. If PNG exists at `iconPath` → Use PNG image
2. If PNG missing → Use emoji fallback
3. On-demand loading for dropped items
4. No performance impact (async loading)

### Rarity Glow Effects

**Dropped Items** automatically get rarity-based glow:
- **Common**: Gray/white glow
- **Uncommon**: Green glow
- **Rare**: Blue glow
- **Epic**: Purple glow
- **Legendary**: Gold glow + intense shadow
- **Mythic**: Pink/red glow + pulsing effect

**Inventory UI** uses rarity color borders and text coloring (no changes needed).

## Implementation Details

### Files Modified
- `data/items.json` - Added `iconPath` fields
- `runtime/AssetLoader.js` - Added item icon loader
- `runtime/UI.js` - PNG rendering with emoji fallback
- `runtime/Pickups.js` - Dropped item PNG rendering
- `index.html` - Added CSS for image display

### Key Functions
- `Assets.loadItemIcon(path)` - Load single item icon on demand
- `Assets.getItemIcon(item)` - Get loaded icon or null
- UI automatically uses fallback emojis if images unavailable

## Migration Path

1. **Phase 1** (Current): PNG-ready system with emoji fallback ✓
2. **Phase 2**: Add PNG icons gradually (no rush)
3. **Phase 3**: Complete icon set migration
4. **Fallback**: Emoji always available if PNG missing

## Optimization Notes

- Icons load **on-demand** when first encountered
- No preloading overhead (unlike sprite sheets)
- Memory efficient: Only loaded icons stay in memory
- Emoji fallback ensures game always playable

## Future Enhancements

1. **Icon editor tool** - Create icons inline
2. **Color variants** - Rarity-specific icon colors
3. **Animated icons** - Sprite animation for special items
4. **Icon scaling** - Responsive to UI zoom levels
