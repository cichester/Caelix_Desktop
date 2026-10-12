# Changelog - Caelix Desktop

Tutte le modifiche rilevanti di questo progetto sono documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.0.0/)
e rispetta il [Semantic Versioning](https://semver.org/lang/it/).

## [1.0.3] - 2026-10-12

### Rimosso
- Rimossi tutti i file residui, script di firma e riferimenti legacy ad Alchemy dal codice e dalla documentazione.

## [1.0.2] - 2026-10-12

### Aggiunto
- Modalità di aggiornamento silenzioso **One-Click** NSIS: l'applicazione si chiude, si aggiorna e si riapre in background in 2 secondi senza mostrare procedure guidate o finestre di setup.

### Modificato
- La barra dei menu è a scomparsa automatica (`Alt` per mostrarla) per mantenere la finestra pulita a tutto schermo.

## [1.0.1] - 2026-10-12

### Aggiunto
- Controllo obbligatorio e forzato degli aggiornamenti all'avvio dell'applicazione.
- Voce di controllo aggiornamenti e selezione canale nel menu `Help` oltre che in `File`.

### Corretto
- Allineato il nome degli installer prodotti con i metadati di `latest.yml` su GitHub Releases (`Caelix-Setup-<version>.exe`).

## [1.0.0] - 2026-10-12

### Aggiunto
- Rilascio iniziale del client desktop Caelix.
- Shell Electron per l'applicazione web (`https://caelix.it`).
- Integrazione nativa Discord Rich Presence (stato attività e sessioni di gioco).
- Supporto al protocollo deep link `caelix://` per autenticazione.
- Gestione automatica dei download con `electron-dl`.
