# Summary screen — visual-first spec (Game Design)

**Goal:** Replace dense bullet paragraphs with **visual-first** feedback and **minimal** copy. Summary should read in ~3–5 seconds on mobile, with optional depth on demand.

**Tone:** Reflective, not moral-shaming. No “wrong choice” framing.

---

## 1) Summary states (product)

| State | When | Player need |
|-------|------|-------------|
| **S1 — With coping** | Decision → Dissonance → Reduction → Summary | See **strain story**, **which belief moved**, **which coping path**, optional reflection |
| **S2 — No coping** | Decision aligned enough to skip Reduction | See **strain tick**, **belief delta** (if any), confirm **no coping step** |
| **S3 — Habit note** (optional) | `justificationUsesTotal > 0` after picking justification | One neutral line about **pattern**, not blame |
| **S4 — Reflection** | `reflectionPrompts[]` present | Prompts readable without walls of text |

---

## 2) Explicit vs implied (what must stay in words)

| Information | **Explicit (text or labeled UI)** | **Implied (visual / interaction)** |
|-------------|-----------------------------------|-------------------------------------|
| **Who this recap is for** | One short identity line when onboarding done (`This recap is for {name}.`) | — |
| **Primary choice** | **Optional 3–6 word label** *or* icon + label; full sentence not required | Long primary label can live in **expand** (“Details”) |
| **Belief conflict / “hit”** | **Not** a paragraph; at most a **2–3 word chip** (e.g. `Focus belief`) | **Pill highlight** on affected belief + **before→after bar** (existing delta viz direction) |
| **Belief % change** | **Numbers allowed** (small) next to the bar or pill | Trend arrow / color token (up/down/neutral), no essay |
| **Strain — scene total** | **One number + sign** (e.g. `Scene Δ +12`) | **Strain meter** + optional ripple (already present) |
| **Strain — coping-only** | **One number** (S1 only) or fold into “after coping” meter delta | Compare meter before/after as animation |
| **Reduction path** | **Strategy name only** (e.g. `Justification`) — **≤ 22 chars** | Icon per strategy; **explanation** in expandable or tappable sheet |
| **systemFeedback** | **Max 1 short sentence** *or* 3 micro-labels (`Tension` / `Belief` / `Pattern`) | Long copy → **“Read more”** (1 tap) |
| **Reflection prompts** | **Question text** (required for learning) | Collapse to **“Reflection (N)”** with expand; or carousel (1 prompt visible) |

**Rule of thumb:** If it already has a **chart, meter, pill, or highlight**, do **not** repeat it as a full sentence in the bullet list.

---

## 3) Layout priority (top → bottom)

1. **Strain outcome** (meter + scene Δ) — largest visual weight  
2. **Belief delta** (affected pill + mini bar) — second  
3. **Coping strategy** (icon + short name) — third  
4. **Identity line** — subtle, top or bottom (consistent with `player-name-experience.md`)  
5. **Reflection** — last, collapsible if over budget  

---

## 4) Text budget (hard caps for v1)

Budgets are **excluding** the scenario-authored `reflectionPrompts` body text (those are “content,” not system chrome). Cap prompts separately below.

### Global

- **Screen headline** (`#summaryText` or equivalent): **≤ 70 characters** OR **1 line** on a 360px-wide phone at default type size.  
- **All system chrome on Summary** (headline + labels + numeric captions + habit line + compressed systemFeedback): **≤ 280 characters total** *or* **≤ 6 short lines** (≤ 48 characters per line), whichever is stricter.

### Per state

| State | Headline | Secondary labels + numbers | Max bullet/list items **visible without expand** |
|-------|----------|----------------------------|--------------------------------------------------|
| **S1 With coping** | ≤ 70 chars | ≤ 4 lines total | **3** (e.g. Scene Δ, Coping Δ, Strategy) — belief row is **visual**, not a bullet paragraph |
| **S2 No coping** | ≤ 70 chars | ≤ 3 lines total | **2** (e.g. Scene Δ, Align note) |
| **S3 Habit** | — | **1 line ≤ 90 chars** | 0–1 (merge into footer) |
| **S4 Reflection** | — | section title ≤ 24 chars (e.g. `Reflect`) | **1 prompt visible** by default; **≤ 90 chars per prompt**; max **3 prompts** on screen without scroll, or carousel |

### `systemFeedback` (if shown on Summary)

- **Default:** **≤ 120 characters** combined across all keys shown, **or** 3 micro-rows of **≤ 40 characters** each.  
- **Overflow:** truncate with **Read more**; full text **≤ 320 characters** inside expand.

### Reduction explanation (from scenario data)

- On Summary, **do not** show the full `reductions.*.explanation` by default.  
- **Default:** strategy **label only** (≤ 22 chars).  
- **Expand:** full explanation (scenario can stay long for the Reduction screen itself).

---

## 5) Acceptance criteria (design QA)

- A player can answer **without reading a paragraph**:  
  - Did strain go **up or down** this scene?  
  - Did a **belief** move, and **which one**?  
  - If they coped, **which family** of coping (action / belief / justify)?  
- No single block of system text exceeds **90 characters** except inside an intentional **expand**.  
- “Belief hit” is recognizable from **pill state**, not from a bullet that restates the same fact.

---

## 6) Handoff

- **UI Designer:** Wireframe S1/S2 with the visual hierarchy in §3; specify icon set for coping strategies; define expand pattern.  
- **Developer:** Map existing `renderSummary` / `renderNoCopingSummary` fields into the compact components; keep long strings behind `details`.  
- **Scenario Generator:** Keep `reflectionPrompts` punchy (≤ 90 chars each when possible); long `systemFeedback` is OK if UI truncates + expands.

---

*End of spec.*
