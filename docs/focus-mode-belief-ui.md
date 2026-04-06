# Focus Mode — Belief Display Spec

**Purpose:** Reduce cognitive load by highlighting only the scenario’s **focal belief**, so players stay oriented around the core loop (primary choice → dissonance/strain → reduction → reflection).

**Non-goal:** This is not a “scoreboard.” Belief/strain feedback must remain **reflective**, not moral-shaming.

**Applies to:** Persona/belief display (the “belief pills” area) across screens: Scenario, Decision, Dissonance, Summary.

---

## 1) Problem we’re solving

Right now the UI shows **all beliefs** (responsibility/kindness/honesty/self-control/fairness/safety-in-love) at once. In a single focused scenario (e.g. intimate relationship), this feels **noisy** and thematically inconsistent: players wonder why unrelated beliefs appear “in play.”

---

## 2) Focus Mode — default behavior

### A. Highlighted beliefs (collapsed view)

Show at most **2 belief pills** by default:

1) **Focal belief (required)**: `moment.beliefId` (e.g. `safetyInLove`)
2) **Support belief (optional)**: one additional belief chosen by relevance rules below

All other beliefs are hidden behind a disclosure row:

- **UI row label:** `Other beliefs (N)`
- Tap expands/collapses the full list

### B. Expanded view (optional)

When expanded, show **all** beliefs with their current % values (same as today), but keep the focal belief visually marked (e.g., “Focus” badge).

---

## 3) How to choose the “support belief”

Use the first available rule in this order:

1) **Explicit override (preferred if authored):**
   - If the scenario provides `beliefsToHighlight: string[]`, use it as the ordered list to show (cap at 2 in collapsed view).
2) **Simple fallback (recommended for v1):**
   - Show focal belief + **highest-strength** belief among the remaining beliefs.

> Rationale: This fallback is predictable, lightweight, and avoids needing tag heuristics or additional authored metadata.

---

## 4) Optional scenario field (content-side)

Scenario objects *may* include:

- `beliefsToHighlight: ["safetyInLove", "honesty"]`

Guidelines:

- Keep length to **1–3**.
- First entry should usually match `beliefId`.
- Only use a second belief when it truly supports the psychological frame (e.g., “honesty with self,” “security,” etc.), not just because it exists.

---

## 5) Dissonance screen semantics (avoid confusion)

The Dissonance screen should clearly communicate that:

- **Discomfort / +X strain** is the *extra strain from belief conflict* (`dissonance.strainDelta`).
- The Summary screen shows *total scene change* (decision + dissonance + reduction).

For “Belief hit”:

- Prefer showing the **actual hit belief** when available (from engine conflicts).
- Still keep the **focal belief** visible (Focus pill) so the player remains oriented to the scenario theme.

---

## 6) Tone constraints

- No “correct/wrong” labels on beliefs.
- Focus Mode is about clarity, not hiding consequences.

---

## 7) Acceptance criteria (quick QA)

- Each scenario shows **1–2** beliefs by default.
- Expanded view remains available via `Other beliefs (N)`.
- Focal belief is always visible in collapsed view.
- The player can still inspect full persona beliefs if they want.

