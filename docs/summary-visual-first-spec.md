# Summary screen — visual-first layout (micro charts + minimal text)

**Goal:** Replace dense bullet paragraphs with **graphics-first** communication. Players should grasp **choice → tension → belief** in **under 3 seconds** on a small phone, with **at most three short text labels** visible **above the fold** (no paragraph copy in that region).

**Non-goal:** This is not a performance scoreboard. Avoid language or color that implies **moral failure** or “wrong answer.”

**Related implementation (reference):** `index.html` `#screen-summary`, `#beliefDeltaViz`, `#tensionRippleHost`; `ui/gameUI.js` `renderSummary` / `renderBeliefDeltaViz` / `playSummaryTensionRipple`; `style.css` belief delta + ripple styles.

---

## 1) Above-the-fold layout (target: ~320×568 first viewport inside `.screen`)

**Order (top → bottom):**

1. **Optional identity chip** (1 line, tiny): e.g. “You” / committed name — *not* counted in the 3-label budget if styled as a chip; if it competes with the triad, move it to the persona strip only.
2. **Three-column or three-stacked “insight strips”** — each strip is **one label + one micro chart + one icon**. **No sentences.**

| Strip | Label (max 1 word + optional 4-char hint) | Primary visual | Icon role |
|------|-------------------------------------------|----------------|-----------|
| **Choice** | `Choice` | **Decision chip** or **path glyph** (not a paragraph): show `primaryChoice.label` as a **single-line pill** (truncate with ellipsis; full string in `title`). Optional tiny tone dot (aligned / mixed / conflict) — **no words** for tone. | ✓ / → / ≋ (neutral metaphors for “path taken”) |
| **Tension** | `Tension` | **Scene strain micro-chart**: horizontal **before→after** bar for **global strain %** (start of scene vs end of scene), **or** a **signed delta bar** (center baseline) for `episodeStrainDelta` with magnitude as length. Prefer **paired markers** (ghost “before”, solid “after”) over a sentence like “+12 pts”. | wave / ripple / breath (calm vs active) |
| **Belief** | `Belief` | **Belief delta cards** (existing pattern): one **mini track** per changed belief; **before** (muted fill) + **after** (accent fill). If **no belief change**, show a **neutral “steady”** state (flat double tick or equal markers) — not “nothing happened” as a paragraph. | spark / balance / link |

**Hard rule — above the fold:**  
- **≤ 3 visible labels:** exactly **`Choice`**, **`Tension`**, **`Belief`** (English UI).  
- **No bullet list** and **no multi-sentence** blocks in this region.

---

## 2) Micro-chart specifications

### A) Choice strip

- **Component:** `summary-choice-chip` (pill, max 1 line, `text-overflow: ellipsis`).
- **Content source:** `event.primaryChoice.label` (fallback: em dash).
- **Secondary:** optional 6px **tone dot** with color from semantics (§4), **no text**.

### B) Tension strip (scene-level)

**Preferred (clearest):** **Strain % before vs after this scene** (two markers on one 0–100 track).

- **Before:** `strainStart` = persona strain at episode snapshot start (from `GameLoop` episode snapshot; same basis as `episodeStrainDelta` math).
- **After:** `strainEnd` = current strain after decision + dissonance + coping.
- **Visual:** same as belief thermometer semantics: ghost bar to `before`, solid bar to `after`, direction obvious without “+” copy.

**Alternative (more compact):** **Signed delta bar** from a midline:

- Magnitude ∝ `abs(episodeStrainDelta)` capped visually.
- Direction: right = net increase, left = net relief.
- **Numeric** `±N` allowed **only** as subscript under the chart (10–11px, muted), not as the primary read.

**Motion:** on enter, animate marker positions **300–500ms** ease-out; ripple overlay (`tension-ripple`) may fire once at **low–medium opacity** scaled to magnitude (see §5).

### C) Belief strip

- **Component:** stack of `belief-delta-card` (one row per changed belief in `episodeBeliefChanges`).
- **Track:** 0–100; **before** marker ghost fill; **after** solid fill; optional small **arrow** between markers (SVG or CSS) — **icon-first**.
- **If >2 beliefs changed:** show **top 2 by largest absolute delta** above fold; remainder under **“More beliefs”** disclosure (below fold).

---

## 3) Below the fold (optional detail — not counted in 3 labels)

- **Details** `<details>`: “Numbers” or “Full recap” — contains legacy list items, pts copy, `systemFeedback`, habit line — **collapsed by default** on mobile.
- **Reflection** prompts: keep as **short list** or **single prompt carousel**; never above the fold if it competes with the triad.

---

## 4) Color semantics (non-punitive)

**Principle:** Color communicates **activation / energy / direction**, not **virtue**.

| Semantic | Use | Avoid |
|----------|-----|--------|
| **Neutral / baseline** | Track background, before-marker ghost | — |
| **Ease / settling** | Cool teal–mint (`--success` family) for net relief, calmer ripple | Calling it “good” in UI copy |
| **Activation / pull** | Warm amber–coral gradient (`--accent` → soft `--danger` tint) for increased tension | Full-screen red, angry icons |
| **Ambiguous / mixed** | Split gradient or neutral violet-gray | “Bad choice” red on choice chip |

**Choice tone dot (optional):**

- Aligned: soft green or neutral blue-green **dot** (small).
- Mixed: amber dot.
- Conflict: coral dot — **still not** a skull/X/fail icon.

**Belief change direction:**

- Strength **up**: slightly warmer end of accent.
- Strength **down**: slightly cooler; **not** labeled “weakened morally” — optional neutral “Adjusted.”

---

## 5) Reduced motion (`prefers-reduced-motion: reduce`)

- **Belief bars / strain markers:** transition **duration → 0**; show **final state immediately**.
- **Tension ripple:** disable keyframe expansion; optional **single 200ms opacity flash** or **static ring** at final radius.
- **Screen enter:** keep **opacity** fade **≤120ms** or none; **no** parallax, **no** large sliding panels.

**Accessibility:** charts must remain understandable **without** animation (final frames + `title` tooltips for exact % if implemented).

---

## 6) Data mapping (for developers)

| Visual | Suggested fields |
|--------|------------------|
| Choice chip | `event.primaryChoice.label`, `event.primaryChoice.tone` |
| Tension strip | `event.episodeStrainDelta`; strain before/after from episode snapshot + `strainAfter` (or recompute from persona) |
| Belief cards | `event.episodeBeliefChanges[].beliefId`, `.beforeStrength`, `.afterStrength` |
| Ripple intensity | `event.episodeStrainDelta` (magnitude), sign for palette (§4) |

---

## 7) Acceptance criteria (QA)

1. On a **small phone**, the **first viewport** of Summary shows **only** the **Choice / Tension / Belief** labels (plus their charts/icons) — **no paragraph bullets** above the fold.
2. A player can state **direction of tension change** and **which belief moved** without reading a sentence (charts/icons sufficient).
3. **No** UI element uses **failure/shame** metaphors; high tension reads as **“more pull”**, not **“you lost”**.
4. With **reduced motion** on, Summary is still readable; animations do not gate understanding.

---

*End of spec.*
