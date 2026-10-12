# CAELIX — Brand system v2.5 (reference for development)

- Brand kit EN: https://claude.ai/artifact/Lvs6qJXWPyFD3unF2nmUP4
- Brand kit IT: https://claude.ai/artifact/FZ3Ef2zPvdf6zpYEXYTVkq
- Discord Kit canvas EN (bot, emoji, agents): https://claude.ai/artifact/ESe1Wejwn7TUNoCNB6Me2B
- Discord Kit canvas IT: https://claude.ai/artifact/UBE8mHAXjaAa4KoTh4ynom
- Asset pack: CAELIX_Discord_Assets.zip (105 emoji SVG + PNG 128, role icons PNG 64, 37 avatars SVG + PNG 1024/512, bilingual README). Stickers dropped (not needed).
- Rules source: https://daggerheart.org/reference (domains, weapons, armor, glossary…). Use it for every rules check.
- Languages: EN and IT. Code, tokens and emoji IDs stay English; UI labels are localized. Slash commands use Discord name_localizations (/roll = /tira).

## Strategy
- Metaphor: Cell = sheet · Drone bee = player · Orbit = session/social loop · Hive = community (API, Interstellar Protection Association / Associazione di Protezione Interstellare).
- Tagline: "You tell the story. We do the math."
- Two stations, one crew: web app = the workshop (create, edit, art, Seeds); Discord = the table (roll, track, react, NPCs). Same symbols, colors and words on both. Sync both ways, "Open on web" / "Send to table".

## Logo (vector system)
- Raster original = key art only. 4 levels: Full (≥160px, HUD frame) · Symbol (≥64px) · Compact (≥32px, app icon, bot avatar) · Glyph (16–31px, favicon, inline emoji).
- 5 color versions: cw-dark, cw-light, cw-honey, cw-mono-l, cw-mono-d. Department signature: ticks/nodes/orbit change, the cell stays Honey. Colors via --lg-* variables.

## Colors (tokens)
Neutrals: --hull #0C0B10 · --carbon #15141B · --plate #1D1C25 · --line #2C2A36 · --line-2 #3B3847 · --wax #F2EEE4 · --wax-2 #BFBAAD · --smoke #8E8A9A (tier 1 equipment) · graphite #4A4658 (values and moments emoji plate) · parchment #E3CFA8 (custom item plate)
Accents: --honey #E8A20C (primary, Hope, Seeds) · --nectar #FFD23F (focus, critical, tier 5 equipment) · --propolis #9A5A04 · --chlorophyll #7CCB6B (healing, success, bonus, tier 2 equipment) · --sting #FF5B4A (HP, damage)
Ultraviolet: --uv #8F6BFF (Stress, tier 4 equipment) · --fear #5E3FD6 (Fear die, GM Fear) · --fear-ink #A48CFF (Fear as text on dark, @Game Master) · --uv-mist #EDE7FF (glyphs on deep UV)
Domain colors (card emoji only): Arcana #C9A0FF · Blade #E36A4F · Bone #D6D0C2 · Codex #6FA3F5 · Grace #FF8FC8 · Midnight #43B3AC · Sage #8CCB5E · Splendor #E8CB4A · Valor #F28C38
Tier colors (equipment, items, consumables — user's choice): Tier 1 Smoke / Fumo #8E8A9A (level 1) · Tier 2 Chlorophyll / Clorofilla #7CCB6B (levels 2–4) · Tier 3 Cobalt / Cobalto #7DA8FF (5–7) · Tier 4 Ultraviolet / Ultravioletto #8F6BFF (8–10) · Tier 5 Nectar / Nettare #FFD23F (hypothetical CAELIX tier)
Resources: HP Sting · Stress UV · Armor Wax 2 · Hope Honey · Fear deep UV · Credits Wax.

## Type
Chakra Petch (display, numbers) · Atkinson Hyperlegible Next (text) · Atkinson Hyperlegible Mono (labels). Chamfer --cut 10px. Motion 160–220ms, cubic-bezier(.2,.7,.2,1).

## Departments (13) — emoji id · EN code/name · IT code/name · role color
Network / Rete: opr OPR Operators · CEN Centralinisti #FFD23F (entry) · dip DIP Diplomats · DIP Diplomatici #FFAE5C · med MED Medics · MED Medici #FF8A80 · the THE Theologians · TEO Teologi #FFE7A8
Greenhouse / Serra: gen GEN Geneticists · GEN Genetisti #7CCB6B · bio BIO Biologists · BIO Biologi #C4E86B · arc ARC Arcanists · ARC Arcanisti #5FD6C2 · eng ENG Engineers · ING Ingegneri #58B8F0
Expedition / Spedizione: hun HUN Hunters · CAC Cacciatori #D8C59A · inv INV Investigators · INV Investigatori #AEB6FF · see SEE Seekers · CER Cercatesori #C8935A · van VAN Vanguard · ASS Assalitori #9FB2C8 · car CAR Cartographers · MAP Mappatori #8FE0FF
Server roles EN/IT: @Crew Lead / @Capo Equipaggio #E8A20C · @Game Master #A48CFF · @Worldbuilder #D6C9FF · @Recruit / @Recluta #BFBAAD · @AI Crew / @Equipaggio AI #F2EEE4
Reserved (never a department): UV family, Sting. List is open: new department = family + free color from its range + glyph (24 grid, 2.3 stroke) + 3-letter code (IT code for the site, English emoji id).

## Emoji (Discord) — 128×128 PNG, cx_ prefix, English IDs for both languages (105 total)
- Outcomes: cx_crit, cx_success_hope, cx_success_fear, cx_failure_hope, cx_failure_fear (solid plate = success, hollow = failure; Honey = Hope, deep UV = Fear).
- Resources: cx_hp(_empty), cx_stress(_empty), cx_armor(_empty), cx_hope(_empty), cx_fear(_empty), cx_credit.
- Values and moments (graphite hex, glyph colored by meaning, no empty version): cx_evasion (Wax) · cx_proficiency (Wax, double chevron) · cx_experience (Honey) · cx_spotlight (Nectar, stage lamp + pool of light) · cx_rest (Chlorophyll, moon) · cx_thresholds Damage Thresholds / Soglie di Danno (light Sting, three rising steps = 1/2/3 HP) · cx_xp Experience Points / Punti Esperienza ("XP" + Nectar progress bar; the SRD has no XP track, it's for a CAELIX progress track).
- Domains (card silhouette, not hex, domain color, dark original glyph — not the official symbols): cx_arcana (spiral) · cx_blade (sword) · cx_bone (bone) · cx_codex (closed tome with sigil) · cx_grace (mask) · cx_midnight (keyhole + star) · cx_sage (branching antler) · cx_splendor (sun) · cx_valor (banner). IT names used for now: Arcano, Lama, Osso, Codice, Grazia, Mezzanotte, Saggezza, Splendore, Valore (to align with the Acheron edition).
- Equipment and gear (31, folder equipment/), N = 1–5, same hex and dark glyph, only the plate color changes with the tier (no pips, no rim); tier 1 is the original grey design; no tier-less ids:
  - cx_weapon_primary_tN (sword) · cx_weapon_secondary_tN (round shield + off-hand blade) · cx_armor_gear_tN (breastplate = the armor item; cx_armor stays the slot) · cx_wheelchair_tN (combat wheelchair)
  - cx_item_tN Item / Oggetto (ring with a gem; usually rings or gems) · cx_consumable_tN Consumable / Consumabile (round potion flask with liquid line)
  - cx_custom_item Custom item / Oggetto personale (keepsake tag on a cord: matters to the story, not valuable; no tier, Parchment #E3CFA8 plate)
- Conditions (dark plate + colored rim): cx_hidden (Nascosto) · cx_restrained (Trattenuto) · cx_vulnerable (Vulnerabile).
- Dice: cx_hope_1..12, cx_fear_1..12 on the pentagon; numbers enlarged (1 digit 74 px, 2 digits 58 px on the 128 grid) and outlined as paths in the SVGs. Logo: cx_logo (Glyph), cx_caelix (Compact). Departments: cx_opr … cx_car.
- Bot emoji uploaded as application emoji (not server slots). Server emoji: logo + departments. Role icons 64px (Boost level 2).

## Bot & AI (proposals)
- Bot: D-12 "Dee"/"Didì" recommended (the logo's drone bee, named after 2d12, same in both languages). Alternatives: Waggle (IT Danza), Comb (IT Favo, clashes with Favi currency in IT). Deterministic, the only one touching dice/numbers. Commands EN/IT: /roll /tira · /sheet /scheda · /mark /segna · /clear /libera · /rest · /fear /paura (GM) · /pause /pausa · /rewind /riavvolgi.
- Sheet card: components v2 container, accent = department color, portrait with artist credit, trait chips, emoji slot trackers (no ANSI), buttons Roll/Mark/Rest/Open on web (IT Tira / Segna PF / Segna Stress / Riposo / Apri sul sito), View menu (Vista).
- Roll card: outcome emoji + "23 · Success with Hope" first (IT "23 · Successo con Speranza"), dice faces row, Crew Voice line, auto-updates. Accent ints: crit 0xFFD23F · with Hope 0xE8A20C · failure with Hope 0x9A5A04 · with Fear 0x8F6BFF · failure with Fear 0x5E3FD6 · reaction 0x4E5058.
- Player assistant: Vega recommended. Alternatives: Hum (IT Ronzio), Beacon (IT Faro).
- Lore Keeper: The Keeper / Il Custode (alt. The Archive / L'Archivio, Old Comb / Vecchio Favo). Answers from canon with sources, marks drafts.
- Other agents: NPC agents (webhooks, hex avatar frame in department color, "NPC · AI" / "PNG · AI" tag), Chronicler / Cronista (session recap, proposal).
- Trust rules: always labeled as AI; never roll dice or edit sheets (prepare → player confirms → D-12 executes); step out of character on Pause/Rewind; NPCs never start DMs; GM can pause agents and read logs; teen-appropriate filtering.
- Avatars in the zip: bots d12, d12_simple, waggle_danza, comb_favo · agents vega, hum_ronzio, beacon_faro, keeper_custode, chronicler_cronista · npc_frame_<dep>, npc_frame_template, npc_frame_overlay · departments dep_<id>.

## Currencies — never in the same panel
- Cell Credits (character money, sheet + bot): Credit ₵ / Credito (= Handful) · Comb / Favo 10 ₵ (= Bag) · Apiary / Arnia 10 Combs (= Chest). Auto-convert, Wax color, never purchasable.
- Seeds / Semi (app currency, web app only): 1000 Seeds = 1 sunflower (Girasole) = 1 session. Bundles: Bud/Bocciolo €10 = 1000 · Bloom/Fioritura €25 = 2600 (100 bonus, most popular) · Harvest/Raccolto €50 = 5500 (500 bonus, best value).
- Check before launch (EU CPC virtual-currency principles): euro price always shown; bundles aligned to prices (600/500 leftovers → add 100–500 Seed items or multiples of 1000); 14-day withdrawal; minors protections.

## Crew Voice
Warm · radio-short · on your side · of the ship (never military). Lexicon: Hangar, Boarding pass (Tessera d'imbarco), Comms, Log (Diario di bordo), Table (Tavolo), Engines on, Docking, Below deck, Standing by…, Copy that. Avoid: user, invalid, error code, you must, you failed, obviously, military jargon. Line library keys: roll.critical / success_hope / success_fear / failure_hope / failure_fear, resource.*, rest.*, system.* (3+ variants, ≤60 chars, shared by web and bot, per language). Safety messages: plain, no flavor.

## Glossary
- EN: SRD terms exactly. Short labels: AGI STR FIN INS PRE KNO · HP · Prof · Exp · Loadout 2/5 · Vault · Thresholds · GM Fear 5/12 · Tier 1–4 (+ CAELIX tier 5) · Item · Consumable · Custom item.
- IT decided: Dotazione (Loadout) · Riserva (Vault) · Astuzia (Finesse) · Speranza / Paura (Hope / Fear) · Ascendenza (Ancestry). Short labels AGI FOR AST IST PRE CON · PF (Punti Ferita) · Nascosto / Trattenuto / Vulnerabile · Arma primaria / secondaria · Soglie di Danno · Grado 1–5 (Tier) · Oggetto · Consumabile · Oggetto personale.
- IT still to align with the Italian edition (Acheron Books) before launch: domain, class, subclass and community names, "Grado" for Tier, and the remaining SRD terms in the IT kit glossary.

## Legal
Daggerheart is a trademark of Darrington Press: check names and content against the Darrington Press Community Gaming License (DPCGL). Domain emoji use original CAELIX glyphs, not the official domain icons.