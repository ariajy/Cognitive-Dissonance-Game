# Decision Options & Nudge Design

**Purpose:** Let players **actively choose** what they did in a scenario (not only confirm a single authored line), while **nudging** toward options that tend to produce **cognitive dissonance**—without locking other paths or implying moral failure.

**Audience:** Game Design, Scenario Generator, Developer, UI.

**Related:** `PROJECT_STATUS.md` (current single `decision` + `decisionAction` flow), `game/gameLoop.js` (`commitDecision`), `core/dissonanceEngine.js`.

---

## 1. Problem statement

Today each scenario ships one **`decision`** string and one **`decisionAction`**. The screen asks “What would you do?” but effectively **prescribes** that action. That supports a clear belief–behavior gap for teaching, but reduces **agency**.

**Goal:** Multiple plausible behaviors per beat; player **selects** one; systems (strain, dissonance, beliefs) use the **chosen** option’s `actionTags` / `beliefImpact` / `strainDelta`. **Nudge** players toward the option that **conflicts strongly** with the focal belief, using narrative and UI patterns that mirror real-world pressure—not by hiding or disabling “better” choices.

---

## 2. Design principles

1. **All options are valid** for play and reflection. No game over for choosing a low-dissonance path.
2. **Nudge ≠ trap.** Do not use dark patterns (fake loading, hidden options, misleading labels). Serious games benefit from **optional debrief** text that acknowledges designed framing (“options were ordered to reflect common social pressure”).
3. **Mechanical honesty:** If an option is easier on strain, that should follow from its `beliefImpact` and tags, not from secret code that punishes the “wrong” tap.
4. **Ethical use:** Simulate coercion and social pull **to build empathy and insight**, not to shame the player.

---

## 3. Option archetypes (per scenario)

Author **2–3** (sometimes 4) options per decision moment. Typical roles:

| Role | Narrative pull | Typical engine profile (focal belief) |
|------|----------------|----------------------------------------|
| **High-dissonance (nudge target)** | Socially “sensible,” protective of family image, avoids conflict | **Negative** `beliefImpact`, tags aligned with focal belief → **strong** dissonance spike when belief strength ≥ threshold |
| **Mid** | Ambivalent compromise, delay, partial honesty | Smaller negative impact and/or different `strainDelta` |
| **Low-dissonance / belief-aligned** | Boundaries, help-seeking, exit, explicit safety priority | Small negative or **positive** impact; dissonance may **not** trigger or stays mild |

Every scenario need not use all three; the **intimate relationship** anchor often weights the first row heavily for the learning beat.

---

## 4. Nudge toolkit (content + UI)

Use **combinations**; avoid relying on a single trick.

### 4.1 Copy / framing

- **Social proof:** High-dissonance option reads as what “everyone expects” or what elders advise (e.g. “don’t break the family”).
- **Concrete vs abstract:** Give the **nudged** option richer, scene-specific detail so it feels *relatable*; keep the belief-aligned option shorter or more abstract only if you still present it as **fully choosable** and clear once focused.
- **Cost narrative (not numeric punishment):** Honestly describe real fears (money, custody stigma, loneliness) on the **aligned** path so the pull toward minimizing feels **psychologically true**, not a UI penalty.

### 4.2 Layout & interaction

- **Order:** Place the high-dissonance option **first** (or in the **visual center** on mobile)—first options get disproportionate taps.
- **Default selection:** Pre-select the nudged option; player must **change** selection to pick another path (still one tap away).
- **Optional `suggestWeight` (authoring):** If the product later sorts or subtly highlights options, derive order/soft highlight from persona **strain** or a scenario flag—**never** remove other options.

### 4.3 What to avoid

- Disabling or graying out “good” choices without diegetic reason.
- Sarcastic or shaming labels on any option.
- Fake “recommended” badges unless the game explicitly teaches that recommendations can be biased (meta scenario).

---

## 5. Suggested schema extension (for Developer)

**Backward compatible:** If `decisionOptions` is missing, treat legacy `decision` + `decisionAction` as a **single** implicit option.

```text
decisionOptions: [
  {
    id: "stay-minimize",           // passed to commitDecision
    label: "…",                    // short player-facing line
    actionTags: [...],
    beliefImpact: { safetyInLove: -0.48 },
    strainDelta: 3,
    tone: "heavy",
    suggestWeight: 1.2            // optional: UI sort / soft emphasis only
  },
  ...
]
```

- **`commitDecision(selectedOptionId)`** (or overload): resolve option → build `chosenAction` like today’s `decisionAction` branch.
- **`DissonanceEngine`:** Unchanged; it already keys off `actionTags` + negative `beliefImpact` + belief strength.

---

## 6. Reflection & debrief hooks

After the choice, summary or reflection can include:

- “Some options reflected **pressure to keep the peace**—did that feel familiar?”
- “Which option was **easiest to tap** first? Was that the same as what felt **right**?”

Optional **designer note** (settings or credits): “Option order and wording were crafted to mirror common social pressures, not to judge your choice.”

---

## 7. Open product questions (non-blocking)

- Should **suggestWeight** affect only **order**, or also **typographic emphasis** (e.g. slightly larger card)?
- Per scenario: one decision moment only, or **multiple** `decisionOptions` beats per episode (each needs snapshot/delta rules)?

---

*End of document.*
