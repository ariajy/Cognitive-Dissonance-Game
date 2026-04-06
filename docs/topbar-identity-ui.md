# Top bar identity — hierarchy, contrast, long names (Onboarding vs In-game)

**中文摘要（出稿）：** Onboarding 阶段顶栏 **游戏标题降级**、**人格条（名字）升格**（对比度/字重更高）；In-game 阶段名字略降权，让 **场景卡片** 成为视觉主角。名字最长 40 字：**优先两行折行 + 溢出省略**，并用 `title` 展示全文。Onboarding 卡片在标题下提供 **“You’ll appear as: …”** 与顶栏 `#personaName` **同源同步**；Start 屏用同一句式强化一致性。验收：**不滚动整页**即可看到顶栏名字 + 卡片顶部身份线索（人格条在 `main` 外固定区）。

**Goal:** Make “who is playing” obvious without turning the persona strip into a scoreboard. On small phones, the **first paint** should expose an identity cue **without scrolling the page** (header + persona strip stay in the fixed chrome above the card).

---

## 1) Layout hierarchy

### Onboarding (`data-phase="onboarding"`)

| Zone | Role | Visual intent |
|------|------|----------------|
| **Game title row** (`header`) | App / mode context | **Secondary**: slightly lower contrast than identity (smaller title feel, badges stay muted). |
| **Persona strip** (`persona-panel`) | **Primary identity surface** | **Stronger** border/background emphasis; player name is the most legible text in the strip. |
| **Strain meter** | Context for later | **Tertiary**: readable but slightly de-emphasized vs name (onboarding is about setup, not tension gameplay yet). |
| **Onboarding card** | Tasks | “You’ll appear as:” mirrors the strip **immediately under the card title** (before long copy) so it’s near the top of the scrollable card. |

### In-game (`data-phase="ingame"`)

| Zone | Role | Visual intent |
|------|------|----------------|
| **Game title row** | Stable chrome | **Secondary** (same as onboarding). |
| **Persona strip** | Lightweight status | **Secondary vs scenario card**: name still clear, but slightly smaller/less luminous than onboarding so **scenario content remains the hero**. |
| **Strain meter** | Active feedback | **Normal** emphasis (gameplay-relevant). |

---

## 2) Contrast rules (non-punitive)

- Never use “error red” for the player name.
- **Onboarding:** name uses near-primary text color (`--text`), weight **700**, size **~17px**.
- **In-game:** name uses `--text` at **~92–96% opacity** (or one step smaller), weight **600**, size **~15px**.
- Badges remain `var(--muted)` in both phases.

---

## 3) Long names (max 40 characters from input)

**Display rule (top strip + mirrored lines):**

- **Prefer 2-line wrap** with ellipsis on overflow:
  - `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;`
  - `word-break: break-word;` (CJK / long tokens)
  - `line-height: ~1.25`
- **Do not** use single-line ellipsis for the default mobile layout (40 chars can fit better as two lines).
- **Accessibility / honesty:** set `title` to the **full** displayed string (up to 40 chars) so hover/long-press can reveal the complete value if visually clipped.

**“You’ll appear as:” line**

- Uses the **same** rendered string as `#personaName` (single source of truth from `getDisplayedPlayerName()`).
- Same 2-line clamp + `title` for parity with the strip.

---

## 4) Optional mirroring copy

- **Onboarding card:** `You’ll appear as: …` directly under `Who are you today?`, **before** the long intro paragraph.
- **Start screen:** `You’ll appear as: …` on `#startNameLine` (same wording as onboarding; mirrors `#personaName` after commit).

---

## 5) Acceptance criteria (QA)

1. **Small phone, first load (onboarding):** Without scrolling, the player can see **both**:
   - the **persona strip name**, and  
   - the **onboarding title + “You’ll appear as:”** at the top of the card.  
   _(Page-level chrome does not scroll; only the card may scroll if needed.)_
2. Typing updates **strip + onboarding line** in sync.
3. A **40-character** name remains readable: **up to 2 lines**, then ellipsis; full value available via native `title` tooltip.
4. Switching to **in-game** reduces name luminance/size per spec without hiding identity.
