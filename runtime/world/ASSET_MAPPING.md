# ASSET MAPPING - M4NFROID GALACTICA v2.5.2

## PROBLEM
Der Code erwartet Assets in **Unterordnern** (`./assets/...`), aber die tatsächlichen Dateien liegen **flach im Wurzelverzeichnis**.

---

## AKTUELLER STAND (IST)

### Vorhandene Bild-Assets im Root:
```
/m4nfroid/
├── asteroid_1.png
├── asteroid_2.png
├── asteroid_deco_1.png
├── asteroid_deco_2.png
├── asteroid_deco_3.png
├── asteroid_deco_4.png
├── asteroid_deco_big.png
├── asteroid_deco_cluster.png
├── deco_rock.png
├── enemy_corrupted_spawn.png
├── enemy_sniper.png
├── fog_1.png
├── fog_5.png
├── fog_14.png
├── player_ship.png
├── player_ship_jpeg.jpeg
├── tile_city_ruins.webp
├── tile_toxicity.webp
├── tile_void.webp
└── (diverses Reference Material)
```

---

## CODE REFERENZEN (SOLL laut altem Code)

### config.json (ORIGINAL)
```json
"spritePaths": [
  "./assets/asteroids/asteroid_1.png",        ❌ NICHT VORHANDEN
  "./assets/asteroids/asteroid_2.png"         ❌ NICHT VORHANDEN
],
"tileByAct": {
  "act1": "./assets/backgrounds/tile_city_ruins.webp",  ❌
  "act2": "./assets/backgrounds/tile_toxicity.webp",    ❌
  "act3": "./assets/backgrounds/tile_void.webp"         ❌
},
"deco.spritePaths": [
  "./assets/asteroids_deco/asteroid_deco_1.png",  ❌
  ...
],
"fog.paths": [
  "./assets/fog/fog_1.png",   ❌
  ...
]
```

### Background.js (Hardcoded Fallbacks)
```javascript
// ORIGINAL (falsch):
'./assets/backgrounds/tile_void.webp'
'./assets/backgrounds/tile_toxicity.webp'
'./assets/backgrounds/tile_city_ruins.webp'
'./assets/fog/fog_1.png'
'./assets/asteroids_deco/asteroid_deco_1.png'
```

### Enemies.js (Hardcoded)
```javascript
// ORIGINAL (falsch):
enemy.spritePath = './assets/enemies/enemy_sniper.png';
enemy.spritePath = './assets/enemies/enemy_corrupted_spawn.png';
```

---

## FIX-OPTIONEN

### Option A: Ordnerstruktur erstellen (EMPFOHLEN für langfristige Wartbarkeit)
```bash
mkdir -p assets/asteroids assets/asteroids_deco assets/backgrounds assets/enemies assets/fog

# Verschieben
mv asteroid_1.png asteroid_2.png assets/asteroids/
mv asteroid_deco_*.png assets/asteroids_deco/
mv tile_*.webp assets/backgrounds/
mv enemy_*.png assets/enemies/
mv fog_*.png assets/fog/
mv player_ship.png assets/player/
```

### Option B: Code auf FLAT-Pfade umstellen (SCHNELLFIX)
Alle Asset-Pfade in config.json und Background.js auf `./filename.png` ändern.
→ **Die _FIXED.js/_FIXED.json Dateien implementieren diese Option.**

---

## FIX-DATEIEN (v2.5.2)

| Original | Fixed | Änderungen |
|----------|-------|------------|
| World.js | World_FIXED.js | Syntax-Fix (fehlende Kommas), Portal-Interaktion E/H |
| Camera.js | Camera_FIXED.js | Inner-1/3 Deadzone, Spieler kann bis Rand fliegen |
| Input.js | Input_FIXED.js | H-Taste für Hub-Return hinzugefügt |
| State.js | State_FIXED.js | hub/escape Input-Flags hinzugefügt |
| Player.js | Player_FIXED.js | Duplizierte DOT-Blöcke entfernt |
| Background.js | Background_FIXED.js | FLAT Asset-Pfade als Fallback |
| config.json | config_FIXED.json | Alle Asset-Pfade auf FLAT |

---

## ENEMIES.JS - NOCH ZU FIXEN

Die Sprite-Pfade für Sniper und Corrupted sind noch hardcoded:
```javascript
// Zeile 80:
enemy.spritePath = './assets/enemies/enemy_sniper.png';
// → FIX: './enemy_sniper.png'

// Zeile 85:
enemy.spritePath = './assets/enemies/enemy_corrupted_spawn.png';
// → FIX: './enemy_corrupted_spawn.png'
```

Oder via config.json laden:
```javascript
const cfg = State.data.config?.enemies?.spritePaths || {};
enemy.spritePath = cfg.sniper || './enemy_sniper.png';
```

---

## APPLY FIXES

```bash
# Backup erstellen
cp World.js World_BACKUP.js
cp Camera.js Camera_BACKUP.js
cp Input.js Input_BACKUP.js
cp State.js State_BACKUP.js
cp Player.js Player_BACKUP.js
cp Background.js Background_BACKUP.js
cp config.json config_BACKUP.json

# Fixes anwenden
cp World_FIXED.js World.js
cp Camera_FIXED.js Camera.js
cp Input_FIXED.js Input.js
cp State_FIXED.js State.js
cp Player_FIXED.js Player.js
cp Background_FIXED.js Background.js
cp config_FIXED.json config.json

# Enemies.js manuell fixen (2 Zeilen)
```
