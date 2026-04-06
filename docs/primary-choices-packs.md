# Primary Choices Packs

Each scenario includes a `primaryChoices[]` array. For every reduction option, provide:
- `label` (button text)
- `description` (player internal reasoning, 1 sentence)
- `immediateConsequence` (what happens right away, 1 sentence; no option is framed as “obviously correct”)

> Source labels/descriptions come from each scenario’s `reductions.*.label` and `reductions.*.explanation`.

---

## `missed-deadline`

```js
primaryChoices: [
  {
    label: "Change behavior next time",
    description: "If I start for just 20 minutes, I can still be the kind of person who follows through.",
    immediateConsequence: "You start the task and the timer gives you momentum and a clearer sense of control."
  },
  {
    label: "Adjust belief",
    description: "Maybe responsibility is about good intentions, not forcing myself when I’m drained.",
    immediateConsequence: "You feel less pressured to force yourself and may plan to begin when motivation returns, but the task still waits."
  },
  {
    label: "Justify behavior",
    description: "Today was too much—this delay doesn’t say anything real about me.",
    immediateConsequence: "You feel momentarily relieved, yet the task remains undone and the night tightens around you."
  }
]
```

---

## `helping-hand`

```js
primaryChoices: [
  {
    label: "Change behavior next time",
    description: "It’s inconvenient, but showing up is what kind people do.",
    immediateConsequence: "You stand up and help, making the neighbor feel supported even if your rest time shrinks."
  },
  {
    label: "Adjust belief",
    description: "I can still be kind inside, even if I don’t have energy to act right now.",
    immediateConsequence: "You keep kindness inside but delay the help, so your rest feels restored while the request goes unresolved."
  },
  {
    label: "Justify behavior",
    description: "They’re asking too much—protecting my rest is reasonable.",
    immediateConsequence: "You mute the pressure and protect your downtime, but guilt and worry about appearing selfish linger."
  }
]
```

---

## `white-lie`

```js
primaryChoices: [
  {
    label: "Change behavior next time",
    description: "I can be honest and still be supportive if I follow through afterward.",
    immediateConsequence: "You admit you haven’t finished it, offer a follow-up, and feel relief as the relationship feels steadier."
  },
  {
    label: "Adjust belief",
    description: "Avoiding conflict is its own kind of honesty, because I’m protecting the relationship.",
    immediateConsequence: "You avoid direct conflict in your reply, but the truth corners you later as you wonder if you’re drifting."
  },
  {
    label: "Justify behavior",
    description: "A small lie is kinder than a truth that would hurt them right now.",
    immediateConsequence: "You smooth things over with a compliment, but you brace for the moment the lie is noticed."
  }
]
```

---

## `diet-promise`

```js
primaryChoices: [
  {
    label: "Change behavior next time",
    description: "If I pause and step away, the craving will pass and I’ll stay on track.",
    immediateConsequence: "You put the cake back and the craving eases, leaving you steadier for the next step."
  },
  {
    label: "Adjust belief",
    description: "This doesn’t count—real self-control is about the major decisions, not one snack.",
    immediateConsequence: "You tell yourself it’s only a small issue, so guilt drops, but the urge keeps tugging at the plan."
  },
  {
    label: "Justify behavior",
    description: "I’ve earned this—stress means normal rules don’t apply tonight.",
    immediateConsequence: "You give in to stress relief, and the moment feels good while future discipline feels farther away."
  }
]
```

---

## `identity-clash`

```js
primaryChoices: [
  {
    label: "Change behavior next time",
    description: "If I say something now, I’ll be acting like the fair person I claim to be.",
    immediateConsequence: "You speak up and the chat gets tense, but you feel more aligned with your values."
  },
  {
    label: "Adjust belief",
    description: "Maybe being open-minded means letting people joke without policing them.",
    immediateConsequence: "You let the jokes land without pushing back, keeping peace now while fairness discomfort stays underneath."
  },
  {
    label: "Justify behavior",
    description: "It’s not my job to fight every battle—this is just how the group talks.",
    immediateConsequence: "You laugh and scroll away, blending in smoothly while you question yourself later."
  }
]
```

---

## `intimate-relationship`

```js
primaryChoices: [
  {
    label: "Action change",
    description: "You seek help, leave temporarily, or set firm boundaries—so your life matches the belief that love should not feel frightening.",
    immediateConsequence: "You seek support or set a boundary and the atmosphere shifts—less hiding, more uncertainty, but a stronger sense of safety."
  },
  {
    label: "Belief change",
    description: "You narrow your standard: “As long as he doesn’t really hit me, it’s not abuse,” redefining harm so staying feels consistent.",
    immediateConsequence: "You stay feeling justified in the moment, yet your fear quiets by redefining what “harm” means."
  },
  {
    label: "Justification",
    description: "You tell yourself it was your tone, he’s just stressed, or he can be gentle too—classifying fear as a one-off, not a pattern.",
    immediateConsequence: "You feel short-term calm as you frame it as stress or a one-off, but the unease may return."
  }
]
```

---

## `intimate-relationship-phone`

```js
primaryChoices: [
  {
    label: "Action change",
    description: "You name the boundary: your phone is private; you offer reassurance without surrendering access—because safety includes your autonomy.",
    immediateConsequence: "You refuse access and offer reassurance, and you protect your privacy even if the night stays tense."
  },
  {
    label: "Belief change",
    description: "You tell yourself that real intimacy means no secrets—so giving access feels like love, not fear.",
    immediateConsequence: "You convince yourself giving access is love, so tension eases—while you feel your sense of autonomy shrink."
  },
  {
    label: "Justification",
    description: "You decide it’s easier to comply than to fight; you call it “not a big deal” so you don’t have to feel what it costs you.",
    immediateConsequence: "You comply to avoid a fight, and the immediate pressure drops even though you later feel uneasy about what you swallowed."
  }
]
```

---

## `intimate-relationship-money`

```js
primaryChoices: [
  {
    label: "Action change",
    description: "You propose a clear, fair budget you both agree on—and keep a private essentials line—so control doesn’t masquerade as care.",
    immediateConsequence: "You propose shared rules and regain control of the conversation, with fewer arguments about who’s “right.”"
  },
  {
    label: "Belief change",
    description: "You decide that in a serious relationship, oversight is normal—so discomfort with scrutiny means you’re “not mature enough yet.”",
    immediateConsequence: "You accept oversight as normal and the conflict cools, but your safety feels more conditional than before."
  },
  {
    label: "Justification",
    description: "You tell yourself the lie protected the peace and that you’ll “make it up” later—framing fear as temporary stress, not a pattern.",
    immediateConsequence: "You keep the peace with a lie, and the room relaxes—yet secrecy quietly builds tension."
  }
]
```

---

## `intimate-relationship-isolation`

```js
primaryChoices: [
  {
    label: "Action change",
    description: "You keep one steady connection outside the relationship—because isolation isn’t the price of love.",
    immediateConsequence: "You preserve an outside connection and feel less alone, even if your partner notices and pushes back."
  },
  {
    label: "Belief change",
    description: "You decide that cutting ties proves loyalty—that a “real” partnership means your circle shrinks.",
    immediateConsequence: "You interpret distancing as loyalty, so your guilt softens while your world contracts."
  },
  {
    label: "Justification",
    description: "You tell yourself the friendship was draining anyway—reframing loss as maturity, not fear.",
    immediateConsequence: "You frame the friendship as draining and stop replying, getting short relief while loneliness can creep in later."
  }
]
```

---

## `intimate-relationship-apology`

```js
primaryChoices: [
  {
    label: "Action change",
    description: "You thank them—and still name one concrete change you need next time, because repair without pattern change isn’t safety.",
    immediateConsequence: "You accept the apology but hold one clear change, so repair feels real even if it strains closeness."
  },
  {
    label: "Belief change",
    description: "You redefine love as forgiveness above all—so fear after a blow-up becomes “lack of faith,” not information.",
    immediateConsequence: "You redefine love as forgiveness first, and the tension drops—while fear signals fade and return later."
  },
  {
    label: "Justification",
    description: "You tell yourself you’re oversensitive and that good partners don’t keep score—turning your caution into self-blame.",
    immediateConsequence: "You blame yourself for being oversensitive, so the moment feels smoother, but your inner alarms stay unsettled."
  }
]
```

