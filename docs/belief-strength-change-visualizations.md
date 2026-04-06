# Belief strength change — visualization spec (UI Designer)

**Context:** Beliefs such as *“I should be honest, even when it is costly.”* (`honesty`) change strength across a scene. The app already renders Summary belief deltas in **`#beliefDeltaViz`** via **`renderBeliefDeltaViz()`** in `ui/gameUI.js`, with styles **`.belief-delta-*`** in `style.css`. Persona beliefs use **`.pill`** / **`.pill--focus`** in the header strip.

This document proposes **2–3 concepts**, picks **one primary recommendation**, and specifies **magnitude → visual intensity**, **placement**, **motion (ms)**, **states**, and **accessibility** (including **reduced motion**).

---

## Current implementation (reference)

| Piece | Location |
|-------|----------|
| Host | `#beliefDeltaViz.belief-delta-viz` (`index.html`) |
| Card | `.belief-delta-card` (JS-created) |
| Claim line | `.belief-delta-name` (short label: first sentence of `coreClaim`) |
| Track | `.belief-delta-track` |
| Fills | `.belief-delta-fill--before`, `.belief-delta-fill--after` (+ `.belief-delta-fill--down` when after < before) |
| Secondary numbers | `.summary-numeric-secondary` |
| Persona pills | `#personaTraits .pill`, `data-belief-id`, `.belief-pill--hit` (dissonance) |

---

## Concept A — **Dual-fill horizontal belief thermometer** (extend current pattern) — **RECOMMENDED**

**Idea:** One shared **0–100** track. **Ghost “before”** fill + **solid “after”** fill; optional **end caps** or **nudge line** at the after value. This already matches shipped code; the upgrade is **magnitude-aware motion + non-color cues**.

**Wireframe (320px-wide card):**

```
┌ belief-delta-card ─────────────────────────────┐
│ I should be honest, even when it is costly.   │  ← .belief-delta-name (2-line clamp)
│ ━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  ← track: before fill (faint) + after (solid)
│ ↑ before (82)      after (74) ↓               │  ← optional row: icons + sr-only / compact
│ 82% → 74%  ·  Shift: small                    │  ← .summary-numeric-secondary + bucket label
└──────────────────────────────────────────────┘
```

**Figma / component names**

- `BeliefDeltaCard`
- `BeliefDeltaClaim` (maps to `.belief-delta-name`)
- `BeliefDeltaTrack`
- `BeliefDeltaFillBefore` (`.belief-delta-fill--before`)
- `BeliefDeltaFillAfter` (`.belief-delta-fill--after`)
- `BeliefDeltaMetaRow` (new: icon + bucket text + optional `%`)
- `BeliefDeltaNumericSecondary` (`.summary-numeric-secondary`)

**States**

| State | Visual |
|-------|--------|
| **default** (no change this scene) | Card hidden or single-line “Steady” strip (spec product choice); no animated fills. |
| **changed** | Both fills visible; after animates in after before (stagger). |
| **emphasis** (large delta) | Slightly **thicker track** (e.g. 10px → 12px), **longer** ease duration, optional **one** pulse on card border (not repeating). |

**Motion timings (default motion)**

| Step | Duration | Delay | Easing |
|------|----------|-------|--------|
| Before fill grows to `before%` | **420ms** | 0ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| After fill grows to `after%` | **520ms** | **80ms** after before starts | same |
| Card border pulse (optional, large Δ only) | **280ms** | after fills complete | ease-out, **opacity only** |

*Aligns with existing CSS ~500–650ms; tighten or tie to magnitude per table below.*

**Reduced motion**

- Transitions **0ms**; show **final** before/after widths immediately (already partially in `prefers-reduced-motion`).
- **No** border pulse; optional **single** 120ms opacity tick on **after** fill only.

---

## Concept B — **Pill glow + directional chevron + S/M/L bucket**

**Idea:** Reuse the **persona pill** language: a **compact row** with belief short name, **↑ / ↓** (or `→` if &lt;1pt), **S / M / L** “shift” label, and a **short glow** on the pill or card edge.

**Wireframe:**

```
[ Honesty  ↑  Shift: medium ]  ← pill-like chip, chevron + text bucket
▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁  ← optional thin mini-track (4px) for those who want geometry
```

**Pros:** Very compact; strong **direction** without reading %.  
**Cons:** Less precise than Concept A; long claim text still needs truncation.

**Use:** Optional **secondary** row inside `BeliefDeltaCard` **under** the thermometer, or **persona-header flash** only (see Placement).

---

## Concept C — **Dot / handle sliding on a track (“sparkline-lite”)**

**Idea:** Two **vertical markers** or one **dot** that moves from before→after along a baseline (like a scrubber).

**320px caveat:** Track height **≤8px**, markers **≥44px tap** only if the whole card is interactive (usually **not** needed). Prefer **static markers** + **motion along x** only.

**Pros:** Clear **from → to** story.  
**Cons:** Busy with **multiple beliefs**; easy to clutter on narrow screens.

**Verdict:** **Defer** unless paired with **Concept A** as a **small** pair of ticks on the same track (before tick, after tick) — avoids a second chart language.

---

## Final recommendation

**Primary:** **Concept A (dual-fill thermometer)** — extend the existing `#beliefDeltaViz` / `.belief-delta-*` pattern.

**Add-ons (lightweight):**

1. **Meta row** (from Concept B): **chevron + “Shift: small | medium | large”** derived from \(|\Delta|\) (see below), **not** replacing the chart.
2. **Optional tick marks** at `before%` and `after%` on the same track (Concept C minimal) — 2px vertical lines, **high contrast** neutral, **labeled in `aria-label`** on the card.

---

## Map visual intensity → delta magnitude (not only color)

Let \(\Delta = |\text{afterStrength} - \text{beforeStrength}|\) (percentage points on 0–100 scale).

| Bucket | Δ range (tunable) | Non-color intensity | Color (supporting only) |
|--------|-------------------|---------------------|-------------------------|
| **Small** | 1–3 | Shorter motion (e.g. before **320ms**, after **400ms**); track **10px**; no border pulse | Slight hue shift on after fill only |
| **Medium** | 4–7 | Default timings above; track **10px** | Existing gradient (teal → accent / accent → coral for down) |
| **Large** | ≥8 | Longer after phase (**600ms**), track **12px**, **one** 280ms border pulse (opacity) | Slightly higher saturation **on after fill only**; **no** full-card red |

**Direction (orthogonal to magnitude):**

- **Up** (after &gt; before): chevron **↑** + label “Stronger” or neutral “Higher” (product copy).
- **Down** (after &lt; before): chevron **↓** + “Lower” / “Softer” — avoid “weaker character.”
- **Flat** (Δ &lt; 1): **→** + “Steady”.

Icons must **repeat** direction (not only green/red).

---

## Layout placement

### 1) Summary (after choice / coping path)

- **Position:** Directly under **“What changed?”** / `card-title`, **before** long `summary-list` bullets — matches `#beliefDeltaViz` in `index.html`.
- **Order:** Tension summary strip (if any) → **Belief delta stack** → optional collapsed “Details”.
- **Multiple beliefs:** Cap **2 cards** above the fold; rest behind **“More beliefs (N)”** `<details>` (see `summary-visual-first-spec.md`).

### 2) Optional — persona header **quick flash** when returning to scenario flow

- **Trigger:** On **`showScenario()`** (or after **`btnNextScenario`** → next scene), if `episodeBeliefChanges` from **previous** scene included `beliefId`, apply **one-shot** class e.g. `.pill--belief-updated` on matching `.pill[data-belief-id="honesty"]` for **600ms max**.
- **Effect:** **Border + soft glow** (same language as `.belief-pill--hit` but **cooler** palette or **neutral** gold to avoid “error”).
- **Motion:** **Opacity 0→1→0** over **400ms** total, or **static** thicker border for reduced motion (**120ms** appear, hold **400ms**, **120ms** fade).
- **Do not** repeat on every `renderPersona()` tick — only when transitioning from Summary → Scenario with a **fresh** delta flag from game layer (developer hook).

---

## Accessibility

- **Color is not the only signal:** always show **↑ / ↓ / →** (text or SVG with `aria-hidden` on decorative SVG + visible text), plus **numeric** line in `.summary-numeric-secondary` or `sr-only`.
- **Card `aria-label`:** e.g. `Honesty, 82 percent before, 74 percent after, down 8 points, medium shift.`
- **Track:** `role="img"` with concise label **or** `aria-hidden="true"` on track if the card label is sufficient.
- **Reduced motion:** follow § Concept A reduced-motion rules; respect `prefers-reduced-motion: reduce` globally.

---

## State summary (mobile — no hover)

| State | Description |
|-------|-------------|
| **default** | No change: hide card or show steady strip. |
| **changed** | Thermometer + optional meta row; staggered fill animation. |
| **changed-large** | Thicker track, longer after animation, single border pulse (motion OK only). |
| **persona-flash** | One-shot pill highlight when entering scenario after a belief update. |

---

## Handoff checklist for developers

- [ ] Add `BeliefDeltaMetaRow` (chevron + bucket) in `renderBeliefDeltaViz` using \(|\Delta|\) buckets.
- [ ] Bind motion durations to bucket (small/medium/large).
- [ ] Optional: tick marks at before/after on `.belief-delta-track`.
- [ ] Optional: `pill--belief-updated` + game event flag Summary → Scenario.
- [ ] Verify `aria-label` on `.belief-delta-card` and reduced-motion CSS.

---

*End of spec.*
