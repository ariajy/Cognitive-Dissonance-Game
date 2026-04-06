# Tutorial — information architecture & trigger rules

**Game Design Agent deliverable.**  
**Audience:** UI, Dev, Scenario Generator.  
**Constraint:** Mobile-first; file:// compatible; no dedicated tutorial screens — use **contextual tooltips / overlays** pinned to existing screens.

---

## 0) What we're NOT teaching in tutorial

Tutorial teaches **how to play one beat**.  
It does **not** teach:

- Psychology theory ("what is cognitive dissonance")  
- All 6 belief types  
- Long-term justification streaks  
- How the strain math works internally  
- Morality judgments ("wrong choice")

---

## 1) Tutorial steps (max 4, contextual)

Each step is a **single-sentence tooltip + dismiss tap**. No modal walls.

| Step | Screen it appears on | What player learns | Copy budget | What is intentionally omitted |
|------|---------------------|-------------------|-------------|-------------------------------|
| **T1 — Strain bar** | **Scenario** (first load only, after top bar is visible) | The bar at the top tracks *inner tension*. It changes based on what you choose. | ≤ 60 chars | No mention of belief %, no math, no consequences |
| **T2 — Belief pill** | **Scenario** (same screen, 1–2 s after T1 dismisses) | The highlighted chip shows the belief most at stake in this scene. | ≤ 60 chars | No mention of other beliefs, no strength %, no "can change" |
| **T3 — Primary choice** | **Decision** (first time screen appears) | Pick what feels truest. There is no wrong answer—only different consequences. | ≤ 70 chars | No mention of dissonance engine, no spoiler of reduction step |
| **T4 — Reduction** | **Dissonance / Reduction** (first time screen appears) | This is how you make sense of what just happened. Each path leads somewhere different. | ≤ 80 chars | No mention of "belief change" vs "justification" labels; no outcome spoiler |

**Order is fixed (T1 → T2 → T3 → T4).** Each step auto-advances to next only after player dismisses with tap; they can also tap **Skip all** at any point.

---

## 2) Skip / dismiss logic

| Action | Behavior |
|--------|----------|
| **Tap tooltip** ("Got it" or anywhere on overlay) | Dismiss current step; mark seen in session state; advance to next step in sequence |
| **Skip all** (small text link at bottom of tooltip) | Mark all 4 steps seen; never show tutorial again this session; persist `tutorialSeen: true` in localStorage |
| **Tap outside / scroll past** | Same as "Got it" for that step |
| **"Don't show again"** | Same as "Skip all" — persistent across sessions |

> **Design note:** "Skip all" and "Don't show again" should be **one action** (same button), not two separate prompts. Cognitive overhead of confirming "are you sure" defeats the purpose.

---

## 3) Trigger rules (when tutorial fires)

### 3a) First-time player

| Condition | Rule |
|-----------|------|
| `tutorialSeen` flag absent from localStorage **AND** `onboardingDone === true` | Show T1 when Scenario screen first renders |
| T1 dismissed | Show T2 (same screen) |
| Player advances to Decision screen | Show T3 if not yet seen |
| Player advances to Dissonance/Reduction screen | Show T4 if not yet seen |

### 3b) Returning player (has `tutorialSeen: true`)

| Condition | Rule |
|-----------|------|
| `tutorialSeen === true` | **No tutorial shown.** No reminder banners. |

### 3c) Replay / Restart

| Condition | Rule |
|-----------|------|
| Player taps in-game **Restart** (clears localStorage) | Treat as first-time player: clear `tutorialSeen`, re-show T1–T4 on next run |
| Player manually clears browser storage | Same as Restart |

### 3d) Settings "Replay tutorial" (future feature)

If a Settings screen is added:

| Condition | Rule |
|-----------|------|
| Player taps "Replay tutorial" in Settings | Set `tutorialSeen = false` in localStorage; tutorial fires on next Scenario screen |

> For v1, Settings screen does not exist. This rule is reserved for future implementation. No in-game entry point is needed now.

---

## 4) Persistence schema (minimal addition)

Add one field to the existing `GamePersistence` snapshot (`dissonantChoices_v1`):

```
tutorialSeen: boolean  (default: false / absent = false)
```

- Set to `true` when player dismisses T4 OR taps "Skip all" at any step.  
- Cleared only on Restart (full storage clear) or "Replay tutorial" from Settings.  
- **Not** reset between scenarios within one session.

---

## 5) Success metric (first-time player)

**Primary:** First-time player completes **Scenario 1 in full** (reaches Summary screen) without tapping browser Back or abandoning at Decision screen.

**Proxy indicators:**
- T3 (Decision) and T4 (Reduction) are dismissed by player action (not skipped-all), suggesting they **read** before continuing.
- Player's Decision screen dwell time ≥ 4 s (they considered options, not panic-tapped).

**Not a success metric:**
- Which primary option they chose (no "correct" choice).
- Whether strain went up or down.

---

## 6) What onboarding already covers (do not duplicate)

The existing **onboarding screen** (Step 1: name, Step 2: 3 beliefs) already teaches:

- Identity setup / persona.  
- "Beliefs affect the game."

Tutorial **must not** repeat these. T1 and T2 extend from onboarding naturally without overlap.

---

## 7) Handoff

- **UI:** 4 tooltip-style overlays anchored to specific elements (strain bar, focal belief pill, choices list, reduction buttons). Define visual affordance for "Got it" / "Skip all." See `docs/summary-visual-first.md` for tone precedent.  
- **Dev:** Add `tutorialSeen` to `persistence.js` snapshot/apply; wire tooltip show/hide based on flag + screen transitions; see §4 for schema.  
- **Scenario / Copy:** No changes to scenario text needed for tutorial. T1–T4 copy is **system UI copy** (not authored per scenario).

---

*End of spec.*
