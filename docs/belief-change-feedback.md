# Belief-change feedback — player-facing rules (Game Design)

**Audience:** UI, motion, copy. **Not** implementation math (engine may use finer deltas).

**Principle:** Belief strength is a **descriptive** state (“how strongly you hold this standard *right now*”), not a virtue score. **Weakening** can mean *standards shifted*, *coping reframed harm*, or *alignment improved*—never “you became worse.”

---

## 1) When visualization should trigger

| Trigger moment | Rule | Rationale |
|----------------|------|-----------|
| **After decision commit** | Show feedback only if **rounded display Δ ≥ 3 percentage points** on at least one belief. | Avoid flicker from sub-point engine noise; 1–2% is hard to read on mobile. |
| **After coping (reduction)** | Same: **|Δ| ≥ 3** on the belief row for **that beat’s** change (episode delta). | Coping is the teaching beat; motion should match a **noticeable** shift. |
| **Summary / recap** | If **no** belief crossed ±3 in the beat, **no** belief-change animation; optional static “no shift this scene” only if you already use such a pattern elsewhere (default: **silence = stable**). | Reduces noise; players trust motion = meaningful. |

**Optional micro-nudge (product decision):** If **2 ≤ |Δ| < 3** and the scenario’s **focal belief** (`beliefId`) moved, you may show a **subtle** pulse (no number emphasis)—use sparingly, once per session max, or skip for v1.

---

## 2) Direction: strengthen vs weaken (tone + color)

**Words (labels / tooltips / VO):**

- **Strengthen:** “**Firmer here**,” “**Clearer standard**,” “**This belief feels stronger after this moment.**”
- **Weaken:** “**Softer here**,” “**Standard shifted**,” “**This belief feels less absolute right now.**”  
  - When tied to **belief-change / justification** coping, prefer **“standard shifted”** over “weaker” in primary copy.

**Color / semantics:**

- **Do not** map belief change to **red = bad / green = good**.
- **Recommended:**  
  - **Direction** = two **neutral** tokens (e.g. **cool** for “firmer,” **warm** for “shifted/softer”) *or* **single accent** + **arrow only** (↑ firmer, ↓ shifted).  
  - **Red** reserved for **strain / discomfort**, not for “your belief dropped.”

**Moral judgment:** Never copy like “You damaged your values.” Use observational: “**What you’re willing to call acceptable moved.**”

---

## 3) Maximum simultaneous highlights (one beat)

| Situation | Rule |
|-----------|------|
| **1 belief** | Full treatment: highlight pill + bar delta + short directional cue. |
| **2 beliefs** | Both may show **compact** indicators (e.g. small arrow on pill + shared strip). |
| **3+ beliefs** | **Cap at 2** simultaneous full highlights. Priority: (1) scenario **focal** `beliefId`, (2) largest **|Δ|**, then (3) others in a **collapsed** “+2 more” or a **single** “Several beliefs shifted” with **expand**—no three competing hero animations. |

**Rationale:** One second of attention; avoid carnival lighting.

---

## 4) Design intent for UI (what the player should get in ~1 second)

> **In one glance, the player should feel *whether* a belief moved *meaningfully*, *which* belief (if any), and *whether their standard felt firmer or more flexible*—without being told they are good or bad.** The motion is a **mirror**, not a grade.

---

## 5) Edge cases

| Case | Behavior |
|------|----------|
| **No belief change (all \|Δ\| < 3)** | No belief-change animation; strain-only feedback may still run. Copy optional: none or one neutral line (“Beliefs unchanged this scene”). |
| **Multiple beliefs, similar \|Δ\|** | Tie-break: focal `beliefId` first, then alphabetical id if needed—**predictable** for QA. |
| **First scene / cold start** | First time a belief crosses ±3, allow a **slightly longer** (≤1.5s) intro motion **once** (“Beliefs can move as you play”) or rely on onboarding copy elsewhere; do **not** repeat every scene. |
| **Weakening after “aligned” action** | Rare; if it happens, use **neutral** “shifted” language—frame as **recalibration**, not failure. |

---

## 6) One-line summary for engineers (mapping only)

- **Show player-facing belief delta animation** when **display rounding** yields **≥ 3** points change for that belief in the beat; **≤ 2** points: no animation (except optional focal micro-pulse if product enables).

---

*End of spec — ~1 page.*
