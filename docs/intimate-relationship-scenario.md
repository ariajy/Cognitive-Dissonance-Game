# Intimate Relationship — Scenario content (English)

**Source:** Scenario Generator Agent deliverable. Align numeric `strainDelta` / `beliefImpact` with Game Design mechanics table when locked.  
**Reads:** `TASK.md`, `PROJECT_STATUS.md`.

---

## Metadata (for `content/scenarios.js`)

| Field | Value |
|--------|--------|
| **`id`** | `intimate-relationship` |
| **`episodeLabel`** | `Scenario 2` *(or match your episode order)* |
| **`title`** | `At Home — "It Wasn't That Bad"` |
| **`belief`** | `"Love should feel safe—and I won't live in fear."` |
| **`beliefId`** | `safetyInLove` *(per `PROJECT_STATUS.md`; ensure persona + tags match in `beliefSystem.js`)* |
| **`beliefFocusLabel`** *(optional UI)* | `Safety in love` |

---

## `situation` / `scenario` (scene prose — mobile length)

You’ve been together for years. In public, your partner is warm and funny—people say you’re lucky. At home, the mood can flip fast: sharp words, doors, the sense that you’re walking on eggshells. Nothing you’d call “that bad” in front of anyone. Your family likes them; they’ve hinted you should be grateful and not “dramatic.”

Tonight, after a small disagreement about the mess in the kitchen, they grab your wrist—harder than before. Your child is in the next room; you hear them go quiet, listening. Your heart pounds. You pull free, smooth your voice, and say it’s fine so nobody escalates. Later, you tell yourself you overreacted and that you need to keep the peace.

---

## `innerVoices` (four lines — Honesty, Security, Social pressure, Attachment)

1. **Honesty:** `"That wasn't nothing. My body knew it before I said 'fine.'"`
2. **Security:** `"I need calm tonight—no scenes, not with my child here."`
3. **Social pressure:** `"If I make this a 'thing,' everyone will say I'm the problem."`
4. **Attachment:** `"We've built a life together. Good days still happen—this can't be who they really are."`

---

## `decision` (one sentence — committed behavior before dissonance; matches GDD)

**You minimize what happened, reassure your child that everything is okay, and stay—telling yourself it wasn't serious enough to name or change.**

---

## `reductions`

### `behavior_change` (Action change — help-seeking, temporary leave, or firm boundaries; realign with safety)

- **`label`:** `Reach out for real support and set a boundary you can keep.`
- **`explanation`:** `You text a trusted friend or a helpline, or you name one concrete limit out loud—because acting on safety matters more than keeping the story tidy. You’re choosing alignment over silence, even if it’s scary.`

### `belief_change` (Redefine harm threshold to justify staying)

- **`label`:** `Redefine what "counts" as harm so staying still feels responsible.`
- **`explanation`:** `You tell yourself that as long as there's no hitting, it's stress—not a pattern. The line moves: fear becomes "normal relationship friction" so you don't have to face what crossing it would mean.`

### `justification` (Rewrite event — stress, your tone, isolated incident)

- **`label`:** `Blame stress and your own tone; call it a one-off.`
- **`explanation`:** `You replay the moment and decide you were too sensitive, too tired, too sharp. You frame it as a bad night, not a signal—so the fear feels like a mistake, not information.`

---

## `systemFeedback` (qualitative — matches `TASK.md` §5 intent; no numbers)

```text
behavior_change:
  dissonance: "drops sharply"
  beliefStrength: "belief in emotional safety / not living in fear strengthens"
belief_change:
  dissonance: "eases moderately"
  beliefStrength: "safety threshold shifts; 'harm' is redefined smaller"
justification:
  dissonance: "drops short-term"
  longTerm: "words may look stable, but sensitivity to conflict can erode over time if this becomes habitual"
```

---

## `reflectionPrompts` (5)

1. Did you redefine harm to protect the relationship?
2. When did fear first feel “normal” instead of urgent?
3. Are you staying because it feels safe—or because leaving feels too costly?
4. If a friend described this night, would you call it “not serious”?
5. What would “safety” need to look like tomorrow—not as a fantasy, but as one observable change?

---

## Mechanics note (developer)

GDD mechanics table is not present in repo files. When Game Design locks **`strainDelta`**, **`beliefImpact`**, **`tone`**, and **`actionTags`** per path, map them into each reduction object and ensure `actionTags` overlap the `safetyInLove` belief tags in `beliefSystem.js` so `dissonanceEngine.js` behaves as intended.

---

## Content / safety note (team only — optional in-game)

This scenario references **emotional volatility**, **intimidation**, **physical control (wrist grabbed)**, and **a child present**. It is **not** a substitute for professional support. Consider an institutional line such as: *If you or someone you know may be unsafe, confidential help exists (e.g., local domestic-violence hotlines / crisis lines in your region).* Keep tone **non-alarmist** and **resource-forward** if your product policy requires it.

---

*End of scenario document.*
