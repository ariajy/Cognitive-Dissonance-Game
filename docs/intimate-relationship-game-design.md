# Intimate Relationship — Game Design Fragment

**Agent:** Game Design (Cognitive Dissonance mobile serious game)  
**References:** `PROJECT_STATUS.md`, `TASK.md`  
**Note:** `TASKS.md` was not present in repo; alignment uses `TASK.md`.

**Design stance:** The game is **reflective, not punitive**. There is **no fail state** and **no “game over for wrong morality.”** Strain and belief meters describe **inner tension and shifting standards**, not a scoreboard. All three reduction paths are **valid to select** for learning; the summary invites **reflection**, not blame.

---

## 1) GDD fragment — scenario `intimate-relationship`

**Primary belief:** `beliefId: "safetyInLove"` — *Love should feel safe; fear in the relationship conflicts with that.*

**Committed behavior (decision step):** The player **confirms** the already-described pattern: **staying / minimizing / aligning with “keep the family”** despite fear and the wrist incident (exact line is Scenario Generator’s job). Narrative already encodes **belief–behavior gap** before mechanics run.

### Moment-by-moment sequence

| Step | Player experience (system) | Engine behavior |
|------|-----------------------------|-----------------|
| 1. Situation | Long setup: public image vs home volatility, fear, family advice, inner voices | Content only; optional `contextTags` if used elsewhere |
| 2. Inner voices | Honesty / Security / Social pressure / Attachment | `innerVoices[]` — copy only |
| 3. Decision screen | One clear “this is what I did / am doing” confirm | `decision` + `decisionAction` |
| 4. Commit | Tap to acknowledge committed action | `commitDecision()` → applies `decisionAction.beliefImpact`, `decisionAction.strainDelta`, then **`DissonanceEngine.evaluateDissonance()`** |
| 5. Dissonance (conditional) | If tags overlap + **negative** `beliefImpact` on a belief whose **strength ≥ threshold** (~60) → extra strain spike | `lastDissonance` populated; UI shows tension **without** moral judgment |
| 6. Reduction | Three strategies: **action change** (`behavior_change`), **belief change** (`belief_change`), **justification** (`justification`) | `applyRationalization(id)` → `strainDelta` + `beliefImpact` for chosen path |
| 7. Summary | Strain / belief deltas + optional `systemFeedback` + `reflectionPrompts` | Developer/UI reads `systemFeedback[reductionType]` keys |

### Mapping to engine fields

- **`beliefId`:** `safetyInLove` — scenario focus belief; `beliefFocusLabel` for UI string.
- **`decisionAction.actionTags`:** Must **intersect** `safetyInLove.tags` (e.g. `intimate-relationship`, `safety-in-love`) so dissonance **can** evaluate.
- **`decisionAction.beliefImpact`:** **Negative** on `safetyInLove` so the committed action is read as **against** the belief → enables dissonance spike when belief is strong enough.
- **`decisionAction.strainDelta`:** Small baseline tension from the moment (author separate from dissonance spike).
- **`decisionAction.tone`:** e.g. `heavy` / `uneasy` — for UI copy cadence, not mechanics.
- **Reduction entries:** Each of `behavior_change`, `belief_change`, `justification` supplies its own `actionTags`, `beliefImpact`, `strainDelta`, `tone`.
- **`systemFeedback`:** Optional keys `behavior_change`, `belief_change`, `justification` — each may include `dissonance`, `beliefStrength`, `longTerm` (authoring contract per `PROJECT_STATUS.md`).

---

## 2) Mechanics table

**Implementation reminders (for tuning):**

- **Decision:** `beliefImpact` runs through `applyBeliefDelta` (scaled in code); **then** strain from `decisionAction.strainDelta`; **then** extra strain if dissonance triggers (`negative` impact + tag overlap + strength ≥ `conflictThreshold`).
- **Reduction:** Only the chosen path’s `strainDelta` and `beliefImpact` apply.
- **DissonanceEngine** does **not** re-run on reduction unless code changes — “dissonance level” in **summary copy** is the **player-facing label** for net tension after decision + reduction, not a second engine pass.

| Path | `reductionType` key | Intended **strain** outcome | Intended **`safetyInLove` belief** outcome | Authoring direction (`strainDelta` / `beliefImpact`) | `tone` (suggested) | `systemFeedback` intent |
|------|---------------------|----------------------------|--------------------------------------------|------------------------------------------------------|--------------------|-------------------------|
| **Action change** | `behavior_change` | **Sharp drop** — realigning behavior with “love should feel safe” resolves acute tension | **Stronger** — belief reinforced | **Large negative** `strainDelta` (magnitude largest of the three); **positive** `beliefImpact.safetyInLove` | `hopeful` / `grounded` | `dissonance`: tension released; `beliefStrength`: clarity/safety standard intact or strengthened; `longTerm`: boundaries/help-seeking as ongoing practice |
| **Belief change** | `belief_change` | **Moderate drop** — tension eases by **moving the goalpost** | **Weaker** — harm threshold redefined; less future “resistance” to similar incidents | **Medium negative** `strainDelta`; **negative** `beliefImpact.safetyInLove` (smaller magnitude than justification if you want “moderate” belief shift vs deep erosion) | `conflicted` / `resigned` | `beliefStrength`: standard shifted; `longTerm`: future incidents may feel “less wrong” mechanically (lower strength → less/no dissonance spike) |
| **Justification** | `justification` | **Short-term relief** — strain drops **now** | **Erosion / instability** — verbally still “I believe in safe love” but internal alignment weakens | **Small–medium negative** `strainDelta` (less than behavior_change); **negative** `beliefImpact.safetyInLove` (can be smaller than belief_change **or** similar — tune for “dull” vs “sudden shift”) | `defensive` / `soothing` | `dissonance`: temporary ease; `longTerm`: pattern minimized; **sensitivity dulling** if you add persistence (below) |

### Cross-scenario “dulling” (optional)

- **Not required** for one playthrough of Intimate Relationship: single-episode **justification** already shows **belief erosion** via `beliefImpact`.
- **If** product adds **repeated justification across scenarios**, recommend a **persona-level counter** (e.g. `justificationCount` or `dissonanceSensitivity` 0–1) that slightly adjusts dissonance or inner-voice weighting — **design note for Developer**; reset on new game / optional per session.
- Until then, **describe dulling in `systemFeedback.longTerm` and reflection prompts**, not as a hidden penalty state.

---

## 3) Open questions (blocking)

**None** for defining this scenario’s loop and mechanics table.

**Non-blocking:** institutional **content warning** / **support resources** (course policy), and whether **v1** needs **localStorage** for justification streaks (`TASK.md` §9).

---

## 4) Suggested reflection prompts (for Scenario / UI)

- Did you redefine harm to protect the relationship?
- When did fear first become normalized?
- Are you staying because it feels safe, or because leaving feels costly?
- If a friend described this situation, would you interpret it the same way?
