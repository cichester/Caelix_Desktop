# CAELIX · Discord Assets

Kit IT: https://claude.ai/artifact/UBE8mHAXjaAa4KoTh4ynom · Kit EN: https://claude.ai/artifact/ESe1Wejwn7TUNoCNB6Me2B

---

## Italiano

### Contenuto

| Cartella | Cosa c'è | Formato |
|---|---|---|
| `emoji/svg/` · `emoji/png/` | 105 emoji: 5 esiti, 11 risorse, 7 valori e momenti, 9 domini, 31 equipaggiamento (6 tipi × 5 gradi + oggetto personale), 3 condizioni, 24 dadi, 2 logo, 13 reparti | SVG vettoriale + PNG 128×128 trasparente |
| `role_icons/` | icone dei ruoli dei 13 reparti | PNG 64×64 |
| `avatars/svg/` · `avatars/png_1024/` · `avatars/png_512/` | foto profilo di bot, agenti AI, cornici PNG e reparti | SVG + PNG 1024 e 512 |
| `anteprima.png` | tutti i file in un colpo d'occhio | PNG |

### Emoji (ID in inglese, uguali per entrambe le lingue)

- **Esiti:** `cx_crit` Successo Critico · `cx_success_hope` Successo con Speranza · `cx_success_fear` Successo con Paura · `cx_failure_hope` Fallimento con Speranza · `cx_failure_fear` Fallimento con Paura
- **Risorse (pieno / vuoto):** `cx_hp` / `cx_hp_empty` PF · `cx_stress` / `cx_stress_empty` Stress · `cx_armor` / `cx_armor_empty` Armatura · `cx_hope` / `cx_hope_empty` Speranza · `cx_fear` / `cx_fear_empty` Paura (GM) · `cx_credit` Crediti
- **Valori e momenti:** `cx_evasion` Evasione · `cx_proficiency` Competenza · `cx_experience` Esperienza · `cx_spotlight` Riflettori · `cx_rest` Riposo · `cx_thresholds` Soglie di Danno · `cx_xp` Punti Esperienza
- **Domini (sagoma di carta):** `cx_arcana` Arcano · `cx_blade` Lama · `cx_bone` Osso · `cx_codex` Codice · `cx_grace` Grazia · `cx_midnight` Mezzanotte · `cx_sage` Saggezza · `cx_splendor` Splendore · `cx_valor` Valore (nomi IT da allineare all'edizione Acheron)
- **Equipaggiamento** (cartella `equipment/`): `cx_weapon_primary_tN` Arma primaria · `cx_weapon_secondary_tN` Arma secondaria · `cx_armor_gear_tN` Armatura (oggetto; `cx_armor` resta lo slot) · `cx_wheelchair_tN` Sedia a rotelle da combattimento · `cx_item_tN` Oggetto (anelli e gemme) · `cx_consumable_tN` Consumabile (pozioni), con N da 1 a 5 · `cx_custom_item` Oggetto personale (piastrina, senza grado, Pergamena #E3CFA8). Grado 1 Fumo #8E8A9A (livello 1) · Grado 2 Clorofilla #7CCB6B (livelli 2–4) · Grado 3 Cobalto #7DA8FF (5–7) · Grado 4 Ultravioletto #8F6BFF (8–10) · Grado 5 Nettare #FFD23F (ipotetico, homebrew).
- **Condizioni:** `cx_hidden` Nascosto · `cx_restrained` Trattenuto · `cx_vulnerable` Vulnerabile
- **Dadi della Dualità:** `cx_hope_1` … `cx_hope_12`, `cx_fear_1` … `cx_fear_12`
- **Logo:** `cx_logo` (Glifo, in linea) · `cx_caelix` (Compatto, reazioni ed emoji giganti)
- **Reparti:** `cx_opr` Centralinisti (CEN) · `cx_dip` Diplomatici (DIP) · `cx_med` Medici (MED) · `cx_the` Teologi (TEO) · `cx_gen` Genetisti (GEN) · `cx_bio` Biologi (BIO) · `cx_arc` Arcanisti (ARC) · `cx_eng` Ingegneri (ING) · `cx_hun` Cacciatori (CAC) · `cx_inv` Investigatori (INV) · `cx_see` Cercatesori (CER) · `cx_van` Assalitori (ASS) · `cx_car` Mappatori (MAP)

### Avatar

- **Bot:** `bots/d12` (consigliato, con targhetta) · `bots/d12_simple` (senza targhetta, per le dimensioni piccole) · `bots/waggle_danza` · `bots/comb_favo`
- **Agenti AI:** `agents/vega` · `agents/hum_ronzio` · `agents/beacon_faro` · `agents/keeper_custode` · `agents/chronicler_cronista`
- **PNG:** `agents/npc/npc_frame_<reparto>` (segnaposto con la cornice del reparto) · `npc_frame_template` (grigio) · `npc_frame_overlay` (solo cornice, centro trasparente: mettici sotto il ritratto del PNG)
- **Reparti:** `departments/dep_<id>`, per canali, webhook e annunci di reparto

### Come caricarli

1. **Emoji del bot** (esiti, risorse, valori, domini, equipaggiamento, condizioni, dadi): caricale come *emoji dell'applicazione* nel Developer Portal (App › Emojis). Il bot le usa in ogni server senza occupare gli slot del server. Limite: 2000 per app.
2. **Emoji del server** (logo e reparti): Impostazioni server › Emoji. Usa i PNG 128.
3. **Icone dei ruoli:** Impostazioni server › Ruoli › Icona del ruolo (serve il livello Boost 2). Usa `role_icons/`.
4. **Avatar del bot:** Developer Portal › Bot › Icona, PNG 1024. Discord ritaglia a cerchio: gli avatar sono già disegnati per il cerchio.
5. **Agenti e PNG via webhook:** passa l'URL del PNG 512 come `avatar_url`.

Tutte le emoji e le icone PNG sono sotto i 256 KB. I numeri dei dadi e la targhetta "D-12" sono convertiti in tracciati, quindi gli SVG non hanno bisogno del font.

---

## English

### Contents

| Folder | What's inside | Format |
|---|---|---|
| `emoji/svg/` · `emoji/png/` | 105 emoji: 5 outcomes, 11 resources, 7 values and moments, 9 domains, 31 equipment (6 kinds × 5 tiers + custom item), 3 conditions, 24 dice, 2 logo, 13 departments | vector SVG + transparent 128×128 PNG |
| `role_icons/` | role icons for the 13 departments | 64×64 PNG |
| `avatars/svg/` · `avatars/png_1024/` · `avatars/png_512/` | profile pictures for bots, AI agents, NPC frames and departments | SVG + 1024 and 512 PNG |
| `anteprima.png` | every file at a glance | PNG |

Emoji IDs are English and shared by both languages (see the list above). Values and moments: cx_evasion Evasion · cx_proficiency Proficiency · cx_experience Experience · cx_spotlight Spotlight · cx_rest Rest · cx_thresholds Damage Thresholds · cx_xp Experience Points. Domains: cx_arcana, cx_blade, cx_bone, cx_codex, cx_grace, cx_midnight, cx_sage, cx_splendor, cx_valor. Equipment (`equipment/`): cx_weapon_primary_tN, cx_weapon_secondary_tN, cx_armor_gear_tN (the item; cx_armor stays the slot), cx_wheelchair_tN, cx_item_tN (rings and gems), cx_consumable_tN (potions), N = 1–5 · cx_custom_item (keepsake tag, no tier, Parchment #E3CFA8). Tier 1 Smoke #8E8A9A (level 1) · Tier 2 Chlorophyll #7CCB6B (2–4) · Tier 3 Cobalt #7DA8FF (5–7) · Tier 4 Ultraviolet #8F6BFF (8–10) · Tier 5 Nectar #FFD23F (hypothetical, homebrew). Department names in English: Operators, Diplomats, Medics, Theologians, Geneticists, Biologists, Arcanists, Engineers, Hunters, Investigators, Seekers, Vanguard, Cartographers.

### Uploading

1. **Bot emoji** (outcomes, resources, values, domains, equipment, conditions, dice): upload as *application emoji* in the Developer Portal (App › Emojis). The bot can use them in every server without taking server slots. Limit: 2000 per app.
2. **Server emoji** (logo, departments): Server Settings › Emoji, 128 PNG.
3. **Role icons:** Server Settings › Roles › Role Icon (needs Boost level 2), from `role_icons/`.
4. **Bot avatar:** Developer Portal › Bot › Icon, 1024 PNG. Discord crops to a circle; the avatars are drawn for it.
5. **Agents and NPCs via webhook:** pass the 512 PNG URL as `avatar_url`.

All emoji and icon PNGs are under 256 KB. Dice numbers and the "D-12" tag are converted to paths, so the SVGs don't need the font.
