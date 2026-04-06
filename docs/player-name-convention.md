# Player name — authoring & UI convention

**Goal:** No fixed default protagonist name in player-facing copy. Use **second person** or the **name the player entered** during onboarding.

## Runtime values

- **`persona.name`** — trimmed string, max 40 chars, from onboarding input. May be empty for legacy saves (`v < 3`) until the player completes onboarding again.
- **Display fallback** — when `onboardingDone` is true and `persona.name` is empty, UI shows **`you`** (see `GameUI.getDisplayedPlayerName()`).

## Placeholder for authored strings (optional)

If a string is authored outside JS and must include the name later, use:

- **`{playerName}`** — replaced at runtime with `persona.name.trim()` when non-empty; when empty, substitute **`you`** (lowercase) so sentences still read naturally, e.g. `Help {playerName} choose.` → `Help you choose.`

**Do not** use `{playerName}` in `content/scenarios.js` today — scenarios are plain strings; keep scenario prose in **you**-voice or neutral (“Your neighbor…”) unless you add a small interpolator in the loader.

## Static HTML / CSS

- Avoid hardcoding any sample protagonist name in buttons, hints, or titles.
- Prefer “you” or generic prompts (“Pick how you cope.”).
