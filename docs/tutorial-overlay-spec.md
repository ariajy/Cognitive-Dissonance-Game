# Tutorial overlay — spotlight + callout (design spec)

**Recommended pattern:** **Semi-transparent full-screen mask** + **cutout / elevated “hole”** over the target region + **tooltip / callout card** (title + one line + primary CTA). Works on mobile without relying on hover.

**Anchors (current DOM):**

| Step | Screen | Anchor element | Notes |
|------|--------|----------------|--------|
| 1 | `#screen-decision` | `#decisionOptions` | Primary choice cards |
| 2 | `#screen-dissonance` | `#dissonanceTensionVisual` | Tension bar + level read |
| 3 | `#screen-reduction` | `#reductionButtons` | **Conflict path only** (skip if aligned / no coping) |
| 4 | `#screen-summary` | `#beliefDeltaViz` (and/or first “change” block) | Belief / scene change visuals |

---

## 1) Visual pattern (high-level)

```
┌─────────────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← dim layer (rgba ~0.45–0.65)
│ ░░░ ┌───────────────────┐ ░░░░░░░ │
│ ░░░ │  HIGHLIGHT HOLE   │ ░░░░░░░ │  ← “window” = rounded rect match target
│ ░░░ │  (target UI live) │ ░░░░░░░ │     pointer-events: none on mask OVER hole
│ ░░░ └───────────────────┘ ░░░░░░░ │     so taps pass through to real controls
│ ░░░░░░░  ┌──────────────┐ ░░░░░░░ │
│ ░░░░░░░  │ Callout card │ ░░░░░░░ │  ← tooltip: Next / Skip / Done
│ ░░░░░░░  └──────────────┘ ░░░░░░░ │
└─────────────────────────────────────┘
```

- **Mask:** dark scrim; **does not** use pure black (`rgba(5,8,22,.55)`–`.65` suggested).
- **Hole:** **8–16px padding** around `getBoundingClientRect()` of anchor (visual breathing room); **corner radius** matches target (e.g. 14px).
- **Callout:** sits **below** hole when space allows; if overlap, **flip above** hole (measure `visualViewport` / safe area).

---

## 2) Wireframes by step (mobile, ~360px wide)

### Step 1 — Decision options (`#decisionOptions`)

```
     [ Strain strip — dimmed ]
┌────────────────────────────────┐
│ Decision                       │
│ Choose one action              │
│ ╭────────────────────────────╮ │
│ │ ○ Option A          (hole) │ │
│ │ ○ Option B                 │ │
│ ╰────────────────────────────╯ │
│   ┌──────────────────────────┐ │
│   │ Your choice drives strain│ │
│   │ [ Next ]      Skip tour  │ │
│   └──────────────────────────┘ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└────────────────────────────────┘
```

### Step 2 — Dissonance visual (`#dissonanceTensionVisual`)

```
│ Strain                         │
│ (body copy dimmed)             │
│ ╭────────────────────────────╮ │
│ │ ○ Calm  [====····]  (hole) │ │
│ │ Inner pull…                │ │
│ ╰────────────────────────────╯ │
│   ┌──────────────────────────┐ │
│   │ This bar shows tension   │ │
│   │ [ Next ]      Skip tour  │ │
│   └──────────────────────────┘ │
```

### Step 3 — Coping (`#reductionButtons`) — **conflict path only**

```
│ How do you make sense…         │
│ ╭────────────────────────────╮ │
│ │ [ Strategy 1 ]             │ │
│ │ [ Strategy 2 ]   (hole)    │ │
│ │ [ Strategy 3 ]             │ │
│ ╰────────────────────────────╯ │
│   ┌──────────────────────────┐ │
│   │ Pick one way to cope     │ │
│   │ [ Next ]      Skip tour  │ │
│   └──────────────────────────┘ │
```

### Step 4 — Summary change (`#beliefDeltaViz`)

```
│ What changed?                  │
│ ╭────────────────────────────╮ │
│ │ Honesty … [bars]  (hole)   │ │
│ ╰────────────────────────────╯ │
│   ┌──────────────────────────┐ │
│   │ See how beliefs moved    │ │
│   │ [ Done ]     Skip tour   │ │
│   └──────────────────────────┘ │
```

---

## 3) State diagram (step flow, skip, done)

**Linear default:** `1 → 2 → 3? → 4 → done`

```
        ┌─────────┐
        │  idle   │  (tutorial never started or completed)
        └────┬────┘
             │ start (first visit or “?” in header)
             ▼
        ┌─────────┐
        │ step 1  │  anchor: decisionOptions
        └────┬────┘
     skip    │ next
        │     ▼
        │  ┌─────────┐
        └─►│ skipped │──► persist dismiss, no more prompts this run / ever (product)
           └─────────┘

        ┌─────────┐
        │ step 2  │  anchor: dissonanceTensionVisual
        └────┬────┘
             │ next
             ▼
        ┌─────────┐     conflict path
        │ step 3  │◄──── (DecisionCommitted + coping shown)
        └────┬────┘
             │ next (or AUTO-SKIP if no reduction screen)
             ▼
        ┌─────────┐     aligned / no-coping: jump 2 → 4
        │ step 4  │
        └────┬────┘
             │ done
             ▼
        ┌─────────┐
        │  done   │  persist flag; remove overlay
        └─────────┘
```

**Rules:**

- **Skip** from **any** step → `skipped` (same as “don’t show again” if product requires).
- **Step 3** only if player is on `#screen-reduction` (conflict / coping path). If flow goes Decision → Summary, **step 3 is omitted** and indices can be **re-labeled** in UI as “2 of 3” or use **dynamic total** (e.g. “Step 2 of 3” when 3 steps only).
- **Done** after step 4 (or step 3 if Summary skipped for MVP — product choice).

**Recommended UX copy on buttons:**

- Primary: **Next** (steps 1–3), **Done** (step 4).
- Secondary: **Skip tour** (text button, not ghosted into invisibility).
- Optional: **Back** (if you allow rewind; increases complexity).

---

## 4) Mobile mask & hit-area specification

### Layers (z-index suggestion)

| Layer | z-index | pointer-events | Role |
|-------|---------|----------------|------|
| App shell (header, persona) | auto | auto | Optionally **dimmed** but tutorial may **exclude** header from cutout (keep identity visible). |
| **Tutorial mask (scrim)** | `1000` | `auto` on scrim only | Fills viewport; **blocks** taps outside allowed regions. |
| **Hole region** | — | **`none` on overlay above hole** | Real DOM underneath receives taps. |
| **Callout card** | `1001` | `auto` | Contains **Next / Skip** (min 44×44pt targets). |
| Modal / system | higher | — | Rare |

### Cutout implementation options (handoff)

1. **Four divs** (top/left/right/bottom) around rect — reliable, no SVG.
2. **SVG mask** or `clip-path: polygon(...)` — one element; test on older WebViews.
3. **`box-shadow: 0 0 0 9999px`** on a pseudo “ring” — simple; watch performance.

### Hit targets (iOS HIG / Material)

- **Next / Done / Skip:** minimum **44×48 CSS px** height, full-width secondary acceptable for Skip.
- **Scrim tap:** either **ignored** (only buttons advance) **or** opens “Skip tour?” confirm — avoid accidental dismiss.
- **Hole:** user taps **real** options; do not place transparent capture layer over hole.

### Safe areas

- Respect `env(safe-area-inset-*)` for callout bottom on notched devices.
- On keyboard open, **re-run** anchor `getBoundingClientRect()` and reposition callout.

### Reduced motion

- **No** spotlight “pulse”; cutout appears in **≤120ms** opacity fade or instant.
- Callout **slide** distance **≤8px** or none.

### Accessibility

- **`aria-modal="true"`** on tutorial root when focus management is used; **focus trap** on callout OR allow focus in hole (harder) — recommend **trap on callout** + **Escape** = Skip with confirmation.
- **Screen reader:** `role="dialog"` + `aria-labelledby` for step title; announce step “1 of 4”.
- **Contrast:** callout text on solid card (not on scrim alone).

---

## 5) Content guidelines (English UI)

- **One idea per step:** title ≤6 words, body ≤1 sentence.
- **Non-punitive:** describe **what the UI shows**, not “you must choose correctly.”

Example strings:

1. **Decision:** “Your choice shapes tension.”  
2. **Dissonance:** “The bar shows inner pull.”  
3. **Coping:** “Pick how you make sense of it.”  
4. **Summary:** “Beliefs can shift after each scene.”

---

## 6) Persistence (product)

- `localStorage` key e.g. `tutorial_coachmarks_v1_completed` or `skipped`.
- Re-show via Settings **“Show tips again”** if needed.

---

*End of spec.*
