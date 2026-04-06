# Project Status — Cognitive Dissonance (Mobile Web Game)

**Last updated:** For agent onboarding — sync this file when milestones change.  
**Coordinator:** Game Development Orchestrator (human + AI agents).

---

## 1. Elevator pitch

**Dissonant Choices** — A mobile-oriented, browser-based serious game: players move through narrative **scenarios** where actions conflict with stated **beliefs**; the game surfaces **strain** (tension) and lets players choose how to **reduce dissonance** (change behavior next time, change belief, or justify).

---

## 2. Tech stack

| Area | Choice |
|------|--------|
| Runtime | Plain HTML/CSS/JavaScript (no build step) |
| Modules | Classic scripts (compatible with `file://`) |
| Host | Static files; `index.html` as entry |

---

## 3. Repository layout

| Path | Role |
|------|------|
| `index.html` | App shell, screen regions, script load order |
| `style.css` | Layout, cards, strain meter, screens |
| `content/scenarios.js` | **`window.SCENARIOS`** — all episode content |
| `game/persistence.js` | `GamePersistence` — `localStorage` snapshot (strain, beliefs, justification habit, scenario index) |
| `game/gameLoop.js` | `GameLoop`, maps scenario → decision moment, commits decision & rationalizations |
| `core/beliefSystem.js` | `Persona`, `BeliefSystem`, default beliefs |
| `core/strainSystem.js` | Global strain, labels, decay between episodes |
| `core/dissonanceEngine.js` | Strain spike when action tags hit a **strong** conflicting belief |
| `ui/gameUI.js` | Screen flow, persona pills, dissonance & summary UI |
| `TASK.md` | Agent tasks and integration rules |
| `TASKS.md` | Pointer to `TASK.md` (alias for tooling that expects `TASKS.md`) |
| `PROJECT_STATUS.md` | This status document |

---

## 4. Implemented flow (current)

1. **Start** → **Scenario** (situation, inner voices, decision line).  
2. **Decision** — Player confirms the (already narrated) conflicting action → `commitDecision()`.  
3. **Dissonance** — Engine may add extra strain if belief tags overlap and belief strength ≥ threshold.  
4. **Reduction** — Player picks one of three strategies → `applyRationalization()`.  
5. **Summary** — Whole-scene strain delta, belief % changes after the scene; optional `systemFeedback` + labeled **Reflection** when `reflectionPrompts` exist; justification habit line when `justificationUses` > 0.  
6. **Next scenario** — Advance index; strain decay on last step; persistence updates `scenarioIndex`.

---

## 5. Scenario content status

| # | `id` | Theme (short) | Notes |
|---|------|----------------|-------|
| 1 | `missed-deadline` | Procrastination vs responsibility | Baseline schema |
| 2 | `helping-hand` | Kindness vs comfort | |
| 3 | `white-lie` | Honesty vs smooth social lie | |
| 4 | `diet-promise` | Self-control vs craving | |
| 5 | `identity-clash` | Fairness vs fitting in | |
| 6 | `intimate-relationship` | Safety in love vs staying / minimizing | `beliefFocusLabel`, `systemFeedback`, `reflectionPrompts` |
| 7 | `intimate-relationship-phone` | Privacy / monitoring vs peace | Same `safetyInLove` |
| 8 | `intimate-relationship-money` | Financial control vs hiding | Same belief |
| 9 | `intimate-relationship-isolation` | Shrinking support network | Same belief |
| 10 | `intimate-relationship-apology` | Apology cycle vs boundaries | Same belief |

**Beliefs in persona** (see `beliefSystem.js`): `responsibility`, `kindness`, `honesty`, `selfControl`, `fairness`, **`safetyInLove`** (for Intimate Relationship scenario).

---

## 6. Scenario schema (authoring contract)

Each scenario object typically includes:

- `id`, `episodeLabel`, `title`, `belief`, `beliefId`  
- Optional: `beliefFocusLabel` (display string for UI)  
- `situation` / `scenario`, `innerVoices[]`, `decision`  
- `decisionAction`: `actionTags`, `beliefImpact`, `strainDelta`, `tone`  
- `reductions`: `behavior_change`, `belief_change`, `justification` — each with `label`, `explanation`, `actionTags`, `beliefImpact`, `strainDelta`, `tone`  
- Optional: `systemFeedback` keyed by reduction type (`behavior_change`, etc.) with `dissonance`, `beliefStrength`, `longTerm`  
- Optional: `reflectionPrompts[]`  

`gameLoop.js` exposes these on the **decision moment** after `toDecisionMoment()`.

---

## 7. Persistence (cross-session, minimal)

- **Module:** `game/persistence.js` — key `dissonantChoices_v1` in `localStorage` (skipped if unavailable, e.g. some private modes).  
- **Stored fields:** `strain`, per-belief `strength`/`stability`, `justificationUses` (incremented when player picks reduction id `justification`). **Scenario index is not persisted** — each page load starts at **Scenario 1**; you still advance 1 → 10 in one playthrough.  
- **When saved:** After each rationalization applied and after each “next scenario” transition (persona stats only).  
- **Restart:** In-game **Restart** clears the storage key then reloads (fresh run).  
- **Note:** Old saves may still contain `scenarioIndex` in JSON; it is **ignored** on load.

---

## 8. Known limitations / open product gaps

- **Voice:** Player-facing copy uses **you** / the name from onboarding; legacy saves no longer inject a default display name.  
- **Cross-scenario memory:** Justification **count** persists; inner-voice weights / bespoke prompts by habit are not implemented.  
- **Dissonance engine:** Only fires when negative `beliefImpact` aligns with tagged beliefs above strength threshold — designers must keep `actionTags` in sync with belief `tags`.  
- **Accessibility:** No formal audit (screen reader, contrast) documented.  
- **i18n:** English only; no locale switch.

---

## 9. Suggested next milestones

1. **Game Design:** Lock mechanics for justification-over-time + content warnings if required.  
2. **Scenario:** Audit all six scenarios for tone, length on mobile, and consistent `decision` phrasing.  
3. **UI:** Pass on long-text scenario screen + summary density.  
4. **Developer:** Persistence or analytics (if course requires), plus device QA checklist.

---

## 10. How to run locally

Open `index.html` in a browser (desktop or mobile), or serve the folder with any static server. Scripts assume relative paths from the project root.

---

## 11. Related documents

- **`TASK.md`** — Full agent assignments, Intimate Relationship reference, integration plan, file pointers.  
- **`PROJECT_STATUS.md`** — Current build snapshot (keep updated when shipping changes).  
- **`docs/player-name-experience.md`** — Where `persona.name` appears (top bar, onboarding, Start, Reduction, Summary) and onboarding vs complete top-bar rules.  
- **`docs/focus-mode-belief-ui.md`** — Focus-mode belief pill display spec.  
- **`docs/summary-visual-first.md`** — Summary screen: visual-first layout, explicit vs implied, text budgets per state.  
- **`docs/belief-change-feedback.md`** — When to show belief Δ feedback, direction/tone (no moral color), max highlights, edge cases.  
- **`docs/tutorial-design.md`** — Tutorial IA (4 steps), skip/don't-show-again logic, trigger rules (first-time / replay / settings), success metric, persistence schema.  
- **`docs/help-question-mark-ia.md`** — 「?」帮助信息架构：教程/问号分工、分屏上下文帮助方案、全部条目大纲（概念+每屏）、P0/P1/P2 优先级、验收标准。

---

*End of project status.*
