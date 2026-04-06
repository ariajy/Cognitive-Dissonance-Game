# Player name — experience spec

**Goal:** The player can tell **“this run is me”** without opening devtools. The name is a lightweight identity anchor, not a score.

**Persona field:** `persona.name` (string, max 40), set at onboarding and restored from save (`game/persistence.js`).

**Onboarding flag:** `persona.onboardingDone` — drives top-bar rules below.

---

## 1) Where the name appears

| Surface | Rule |
|--------|------|
| **Top bar (`#personaName`)** | Primary identity slot. See §2. |
| **Onboarding** | **`You’ll appear as: {name}`** (`#onboardingAppearAsName`), live while typing; same string as the top bar (`refreshDisplayedName()` → `getDisplayedPlayerName()`). |
| **Start screen — title (`#startTitle`)** | **Third person:** `Help {name} choose.` If name missing before submit, use `you` (only pre-onboarding edge). |
| **Start screen — subline (`#startNameLine`)** | After onboarding: show **`Playing as: {name}`** (visible, confirms identity under the title). |
| **Scenario / Decision / Dissonance** | No extra name line required; top bar is enough. |
| **Reduction screen** | Subtitle uses **player name**, not a fixed placeholder: e.g. `Pick how {name} copes.` |
| **Summary** | Body copy stays **second person** (`You …`). Add one **identity anchor** line when `onboardingDone`: **`This recap is for {name}.`** as the first list item (or equivalent placement). Same for “no coping” summary. |

---

## 2) Top bar default copy (`#personaName`)

### Onboarding **not** complete (`onboardingDone === false`)

1. If the name field has non-empty trimmed text → show **that draft** (live preview).
2. Else → show **`Add your name`**.

### Onboarding **complete** (`onboardingDone === true`)

1. If `persona.name` is non-empty after trim → show **only** that string (no `Playing as:` prefix in the bar).
2. If empty (data bug / legacy) → show **`you`** as a safe fallback (lowercase, matches Start title).

**Rationale:** Incomplete = invite + preview; complete = clean display of the committed identity.

---

## 3) Onboarding: `Playing as: {name}`

**Recommendation: include it.**

- While `onboardingDone === false`, show under the intro (or under the name field):
  - Non-empty draft → `Playing as: {draft}`
  - Empty → `Playing as: —` (em dash signals “not set yet”)
- Use `aria-live="polite"` on that element so assistive tech hears updates.

This duplicates the top bar slightly on purpose: **onboarding is the one moment** where double confirmation reduces “did that stick?” anxiety.

---

## 4) Summary: second person + identity anchor

- **Keep** reflective second person for mechanics (`You chose…`, `You adjust…`) — aligns with immersion.
- **Add** one short third-person anchor so the recap is explicitly tied to the named run:
  - `This recap is for {name}.`

Do **not** switch the whole summary to third person (adds distance and length).

---

## 5) Acceptance criteria (no console)

A playtester can confirm identity if **all** are true:

1. During onboarding, after typing a name, they see it in the **top bar** and in **`You’ll appear as: …`** on the onboarding card (both driven by `refreshDisplayedName()`).
2. After **Continue**, the **Start** screen shows **`Help {name} choose.`** and **`Playing as: {name}`** is visible.
3. On **Reduction**, the subtitle addresses **you** by name when set (not a generic character name).
4. On **Summary**, the first line includes **`This recap is for {name}.`**
5. Returning with a save: the **top bar** shows their saved name before starting a new scene.

---

## 5b) Manual smoke — header vs Start title (devtools console clean)

For each case, open the browser **console** and confirm **no errors**. Check that **`#personaName`** (top bar) and **`#startTitle`** / **`#startNameLine`** use the **same committed identity** (`persona.name` / save `playerName`). After `onboardingDone`, the bar must **not** follow raw `#playerNameInput` if it were edited out of band.

| Case | Setup | Expect |
|------|--------|--------|
| **New user** | Clear `localStorage` key `dissonantChoices_v1`, reload | Onboarding: typing updates the bar via **`input` → `refreshDisplayedName()`** (draft lives in `persona.name`). After Continue: Start title + `Playing as:` line match the bar. |
| **v3 save** | Save includes `"v":3` and `"playerName":"…"` | On load, bar + Start copy show that name; input field synced from `persona.name` (`syncPlayerNameInputFromPersona`). |
| **v2 save** | Payload has `"v":2` (no `playerName`) | `onboardingDone` true from migration; empty name → bar and Start use **`you`**; still no console errors. |
| **Restart** | From summary, **Restart** (clears save, reload) | Same as **New user**; bar and Start stay consistent through onboarding again. |

---

## 6) Agent handoff notes

- **UI / Dev:** Implement surfaces in §1; wire `startNameLine`, onboarding `Playing as` line, dynamic reduction subtitle, summary anchor. Avoid any hard-coded default protagonist name in player-facing chrome; use `persona.name` or second person.
- **Scenario / copy:** Do not rely on the scenario text to carry the player’s name; identity is **system chrome** + summary anchor.
- **QA:** Walk through onboarding → Start → one full scene → Summary without devtools; verify §5.

---

*End of spec.*
