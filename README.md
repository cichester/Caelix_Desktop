# Caelix Desktop

> Client desktop ufficiale per Caelix. Racchiude la web app in una shell Electron con supporto nativo per Discord Rich Presence e aggiornamenti automatici in background.

### Script di sviluppo

```bash
# Avvia l'applicazione desktop insieme al frontend locale
npm run dev

# Avvia solo l'applicazione desktop
npm run dev:desktop-only

# Compila il codice sorgente (TypeScript / Vite)
npm run build

# Crea l'installer Windows (One-Click NSIS)
npm run package

# Compila e pubblica direttamente la release su GitHub (richiede GH_TOKEN)
npm run package:publish
```

### Log

- **Windows:** `%USERPROFILE%\AppData\Roaming\Caelix\logs\main.log`
- **macOS:** `~/Library/Logs/Caelix/main.log`
- **Linux:** `~/.config/Caelix/logs/main.log`

### Auto-aggiornamenti

L'applicazione utilizza `electron-updater` collegato a **GitHub Releases** (`cichester/Caelix_Desktop`):
1. A ogni avvio, l'app verifica se è presente una nuova versione su GitHub Releases.
2. In caso di aggiornamento disponibile, ne forza il download in background.
3. Al termine del download, mostra il prompt per riavviare e applica l'aggiornamento in modalità silenziosa (*One-Click*), riavviandosi istantaneamente senza finestre di setup.

### Rilascio di una nuova versione

1. Incrementa la versione in `package.json` (es. `1.0.3`).
2. Esegui `npm run package`.
3. Crea una release su GitHub con tag `v<versione>` e carica i file da `dist-package/`:
   - `Caelix-Setup-<versione>.exe`
   - `latest.yml`
   - `Caelix-Setup-<versione>.exe.blockmap`
