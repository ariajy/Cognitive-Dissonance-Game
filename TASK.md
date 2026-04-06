# Task Brief — Cognitive Dissonance Mobile Serious Game

**Audience:** Game Design Agent, Scenario Generator Agent, Mobile UI Design Agent, Mobile Game Developer Agent  
**Product language:** All player-facing copy (scenarios, UI, prompts) must be **English**.  
**Coordinator notes:** 团队内部可用中文沟通；交付给游戏的文本与界面为英文。

---

## 1. Project goal

Build and refine a **mobile-first interactive serious game** where players experience and reflect on **cognitive dissonance** through short narrative scenarios, belief/strain feedback, and three resolution paths: **action change**, **belief change**, and **justification**.

---

## 2. Agents and responsibilities

| Agent | Responsibility |
|--------|----------------|
| **Game Design Agent** | Core loops, mechanics, mapping psychology → systems (strain, beliefs, dissonance triggers). |
| **Scenario Generator Agent** | Situations, inner voices, decision moments, branching copy, reflection prompts (English). |
| **Mobile UI Design Agent** | Layouts, typography, touch targets, tension feedback without shaming; accessibility on small screens. |
| **Mobile Game Developer Agent** | Implementation: data schema, game loop, persona/belief updates, integration with UI, mobile testing. |

---

## 3. Orchestrator workflow (how you should hand off work)

1. **Analyze** — Split requests into design / narrative / UI / code.  
2. **Delegate** — Use the task sections below.  
3. **Review** — Check: mechanics ↔ narrative ↔ UI ↔ implementation align.  
4. **Integrate** — One source of truth for scenario schema and numeric rules (see `PROJECT_STATUS.md`).

---

## 4. Design principles (non-negotiable)

- Mobile-friendly: large tap targets, readable type, minimal horizontal scroll.  
- Simple, intuitive flow: scenario → acknowledge decision → dissonance feedback → choose reduction → summary.  
- Dissonance is felt through **choices**, not lectures.  
- Feedback (visual / motion / copy) can reinforce **psychological tension** without implying “game over = moral failure.”  
- Support **multiple scenarios** with a consistent data shape.

---

## 5. Reference scenario — “Intimate Relationship” (content intent)

Use this as a **design and writing anchor** (finalize wording in English in deliverables).

**Premise:** Long-term relationship, child; partner looks “good” in public but is volatile at home; fear without physical hit; family pressure to stay; core beliefs: *love should feel safe* / *I will not live in fear* — yet the protagonist stays and minimizes.

**Inner voices (roles):** Honesty, Security, Social pressure, Attachment.

**Crossroads:** Later incident — wrist grabbed harder, child hears; player resolves dissonance via:

1. **Action change** — Help-seeking, temporary leave, or firm boundaries; realign with safety.  
2. **Belief change** — Redefine harm threshold (“as long as he doesn’t hit me…”) to justify staying.  
3. **Justification** — Rewrite event (stress, your tone, isolated incident); fear framed as not a pattern.

**System intent (for Game Design + Developer):**

- Action change → strain/dissonance **drops sharply**; core belief in safety **strengthens**.  
- Belief change → strain **eases moderately**; safety belief **weakens** (threshold shifts).  
- Justification → strain **drops short-term**; belief may look stable in words but **erodes inside**; repeated use may **reduce sensitivity** to conflict over time (if product scope includes persistence).

**Reflection prompts (English, for Scenario + UI):**

- Did you redefine harm to protect the relationship?  
- When did fear first become normalized?  
- Are you staying because it feels safe, or because leaving feels costly?  
- If a friend described this situation, would you interpret it the same way?

---

## 6. Tasks by agent

### 6.1 Game Design Agent

- [ ] Document the **core loop** for one scenario end-to-end (trigger belief → decision commit → dissonance → reduction → summary).  
- [ ] Specify how **strain** (“dissonance tension”) and **belief strength** change for each path; align with three reduction types: `behavior_change`, `belief_change`, `justification`.  
- [ ] Decide whether **justification streaks** or history affect future prompts (cross-scenario); if yes, define state variables and reset rules.  
- [ ] Clarify **framing**: no “win/lose”; reflection-first outcomes.  
- **Deliverable:** Short GDD section + **mechanics table** mapping paths → `strainDelta`, `beliefImpact`, optional tags.

### 6.2 Scenario Generator Agent

- [ ] Produce **final English** scene text: setup, inner voices, and **one clear decision sentence** that matches the engineering “committed decision” step.  
- [ ] Write three reduction options (titles + explanations) consistent with Game Design’s path definitions.  
- [ ] Add **content warning** line if required by course/product policy.  
- [ ] Supply **reflection prompts** (3–5) and optional **system feedback** copy (dissonance / belief / long-term) if not owned by Game Design.  
- **Deliverable:** `scenarios`-ready Markdown or JSON-shaped outline (ids, `beliefId`, `innerVoices`, `decision`, `reductions`).

### 6.3 Mobile UI Design Agent

- [ ] Wireframes or specs for: **Start**, **Scenario** (long text + inner voices), **Decision**, **Dissonance**, **Reduction** (3 buttons), **Summary** (strain + belief deltas + reflections).  
- [ ] Define **thumb zone**, spacing, typography scale, and scroll vs “read more” for long scenarios.  
- [ ] Specify **non-alarming** visual language for high strain (tension yes, punishment no).  
- **Deliverable:** Figma or annotated screenshots + interaction notes for Developer.

### 6.4 Mobile Game Developer Agent

- [ ] Implement or update scenario data in `content/scenarios.js` (or agreed format); register beliefs in `core/beliefSystem.js` when adding `beliefId`s.  
- [ ] Ensure `game/gameLoop.js` passes through optional fields (`beliefFocusLabel`, `systemFeedback`, `reflectionPrompts`) if UI displays them.  
- [ ] Verify **tag overlap** with `core/dissonanceEngine.js` so dissonance triggers when belief strength is above threshold.  
- [ ] Test on **mobile viewport** and touch devices; confirm `click` + `touchstart` where needed.  
- **Deliverable:** Short changelog + test notes (browser/device).

---

## 7. Integration plan

1. Game Design locks **mechanics table** first.  
2. Scenario Generator writes English copy against that table.  
3. UI Design lays out screens using real copy length from Scenario.  
4. Developer wires data and events; numeric mismatches are resolved against Game Design’s table.  
5. Joint check: one full playthrough per scenario; belief/strain bars and summary text match intent.

---

## 8. Files agents should read first

| File | Why |
|------|-----|
| `PROJECT_STATUS.md` | Current implementation and gaps. |
| `content/scenarios.js` | Scenario schema and examples. |
| `game/gameLoop.js` | Flow and field mapping. |
| `core/beliefSystem.js` | Persona and beliefs. |
| `core/dissonanceEngine.js` | When dissonance fires. |
| `ui/gameUI.js` | Screens and summary behavior. |
| `index.html` + `style.css` | Structure and styling hooks. |

---

## 9. Questions to resolve together

- Should the game support scenario-specific protagonists in copy, or always **you** + optional `{playerName}` from onboarding?  
- Is **persistence** required between sessions (localStorage) for justification streaks?  
- Any **institutional** requirements (warnings, resources, age gating)?

---

*End of task brief.*
