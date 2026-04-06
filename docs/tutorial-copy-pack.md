# Tutorial copy pack (English)

Short, action-led lines. Plain language—avoid stacking psychology jargon on-screen.

---

## Global chrome

| Role | Copy |
|------|------|
| **First-time-only notice** | Quick tour—shown once. Skip anytime. |
| **First-time-only (alt)** | First visit tips. They won’t repeat after you finish or skip. |

---

## Buttons (fixed labels)

| Role | Label |
|------|--------|
| Advance step | **Next** |
| Close / dismiss final step | **Got it** |
| Exit tour | **Skip** |

---

## Steps

### Step 1 — Scene flow

| Field | Copy |
|--------|------|
| **title** | Move through short scenes |
| **body** | Read each card, then tap the button to continue. One moment leads to the next. |
| **cta** | Next |
| **tip** (optional) | Dots at the top show where you are in the episode. |

---

### Step 2 — Your choice

| Field | Copy |
|--------|------|
| **title** | Pick one action |
| **body** | When choices appear, tap the option that matches what you’d do. Only one path stays selected. |
| **cta** | Next |
| **tip** (optional) | You can change your mind before you confirm, if the screen allows it. |

---

### Step 3 — Tension bar

| Field | Copy |
|--------|------|
| **title** | Watch the tension bar |
| **body** | The bar shows how heavy the moment feels. It moves when your choices pull you different ways. |
| **cta** | Next |
| **tip** (optional) | It’s feedback, not a grade. |

---

### Step 4 — Follow-up thoughts

| Field | Copy |
|--------|------|
| **title** | Sometimes you’ll get a second beat |
| **body** | After some picks, you’ll choose a thought that settles the story for now. Tap one and move on. |
| **cta** | Next |
| **tip** (optional) | |

---

### Step 5 — Recap (final)

| Field | Copy |
|--------|------|
| **title** | Recap is visual-first |
| **body** | After a scene, bars show belief shifts. Use **Why?** for the longer explanation. |
| **cta** | Got it |
| **tip** (optional) | Your three focus beliefs still show in the header during play. |

---

## Implementation notes (Dev)

- Persist e.g. `tutorialCompleted` or `tutorialSkipped` in save state; gate the **first-time-only** string on that flag.
- **Skip** should set the same flag as completing the tour so tips do not reappear.
- Map **cta** per step: steps 1–4 → `Next`; step 5 → `Got it`.
