# Help entry（问号）与呈现方式 — UI/UX 规格（可交付前端）

**范围：** 根目录 `index.html` / `style.css`；header 右侧已有 `.header-actions`、`#btnSettings`（⚙）、`v1.0` badge。  
**本文档：** 仅设计说明与实现约定，**不包含**业务逻辑代码。

---

## 1) 产品说明（与 Settings 区分）

| 入口 | 产品定位 | 典型内容 |
|------|-----------|----------|
| **Settings（⚙）** | **系统与流程控制** | 音量、数据、**重播教程**、关于版本、可选重置进度等 |
| **Help（? / ⓘ）** | **概念释义与玩法理解** | strain / belief / dissonance / coping 等**静态说明**、FAQ 短链、外链资源（若有） |

**一句话：** Settings 管「怎么玩、系统选项」；Help 管「这些词是什么意思、我在看什么」。

---

## 2) 入口设计（header-actions）

### 2.1 位置与形态

- 在 **`.header-actions`** 内、`#btnSettings` **左侧**（或与 Settings 相邻、**先 Help 后 Settings**，避免误触 Settings）：  
  - 推荐 **圆形幽灵按钮**，尺寸与 `#btnSettings` **一致**（与现有 `.icon-btn` 同一代码体系）。
- **图标二选一（产品定稿其一即可）：**
  - **`?`** — 直觉「帮助/说明」，与「信息」略有重叠但游戏内常见。
  - **`ⓘ`**（Unicode U+24D8 或 SVG circle-i）— 更偏「信息/释义」，与「问答」区分。

### 2.2 视觉层级

- 与 `#btnSettings` **同级**：同一 `.icon-btn` 变体（线框/透明底、同 padding、同最小点击区域）。
- **不要**与 `v1.0` badge 混排为同一可点控件；badge 保持只读展示。

### 2.3 交互状态（移动端为主，含键盘焦点）

| 状态 | 视觉 |
|------|------|
| **默认** | 与 Settings 一致：浅描边或半透明底，图标 `--muted` 或 `--text` 约 0.85 opacity。 |
| **hover**（桌面） | 背景略提亮（如 `rgba(255,255,255,.06)`），边框略强；**过渡 120–180ms**。 |
| **active / pressed** | 背景再压暗一层（如 0.1 opacity），**scale(0.96)** 或内阴影（**≤100ms**），避免夸张。 |
| **focus-visible**（键盘/Switch） | **2px 聚焦环**（`outline` 或 `box-shadow`），颜色与品牌 accent 协调，**不与** Settings 的 focus 样式冲突（可共用 `.icon-btn:focus-visible`）。 |
| **disabled**（若某场景禁用） | `opacity: 0.4`，`pointer-events: none`（少用；一般 Help 始终可用）。 |

### 2.4 无障碍（入口）

- **`aria-label`（英文，与游戏 UI 语言一致）：**  
  - 推荐：`"How this game works"` 或 `"Game concepts and help"`（产品择一固定）。
- **`aria-expanded`：** 若 Help 打开后关联同一按钮，设为 `true`/`false`（与实现模式一致；见 §4）。
- **`aria-controls`：** 指向帮助容器 id（建议 `#helpPanel`），便于 SR 关联。

---

## 3) 呈现方式（三选一 + 推荐）

### 3.1 对比

| 方案 | 优点 | 缺点 | 小屏 + `viewport-fit=cover` |
|------|------|------|------------------------------|
| **A. 底部 Sheet（Bottom sheet）** | 单手友好、拇指区、滑动手势符合习惯；可拖拽高度 | 与「全屏叙事」相比略打断沉浸 | **推荐**：底部预留 `padding-bottom: max(16px, env(safe-area-inset-bottom))` |
| **B. 居中模态（Modal）** | 焦点集中、实现简单 | 占屏高、小屏易顶到刘海；需滚动长文 | 需 `max-height: min(85dvh, …)` + `margin` 考虑 `safe-area-inset-top` |
| **C. 半高全宽抽屉（50% height drawer）** | 介于 A/B | 高度固定可能浪费或不够 | 同样要 safe-area |

**推荐：方案 A（底部 Sheet）** 作为默认；长文时在 sheet 内 **scroll**，**把手（drag handle）** 可选增强可发现性。

### 3.2 安全区（必做）

- 容器：`padding-top: max(12px, env(safe-area-inset-top))`（若 sheet 从顶下挂则主要关心底部）。
- **Sheet 贴底：** `padding-bottom: max(16px, env(safe-area-inset-bottom))`。
- **横向：** `padding-left/right: max(16px, env(safe-area-inset-left/right))`。

### 3.3 结构示意（ASCII）

**Bottom sheet（推荐）**

```
┌──────────────────────────── header ────────────────────────────┐
│ Dissonant Choices          [?] [⚙]   v1.0                     │
├────────────────────────────────────────────────────────────────┤
│                         game content                            │
│                                                                 │
├ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ scrim rgba(0,0,0,.4) ─ ─ ─ ─ ─ ─ ─ ─ ─ ┤
│ ╭─ drag handle ─────────────────────────────────────────────╮ │
│ ╭────────────────── Help ────────────────────────────────────╮ │
│ │ How strain works                                           │ │
│ │ Short paragraphs… (scroll)                                 │ │
│ │                                                            │ │
│ │ [ Close ]                                                  │ │
│ ╰────────────────────────────────────────────────────────────╯ │
└────────────────────────────────────────────────────────────────┘
     ↑ safe-area inset bottom
```

---

## 4) 无障碍（打开后）

- **容器角色：** `role="dialog"` **或** `role="dialog"` + `aria-modal="true"`（全屏/半屏遮罩时建议 `true`）。
- **`aria-labelledby`：** 指向 sheet 内标题元素 id；**`aria-describedby`**：可选，指向摘要段落。
- **焦点陷阱：** 打开时焦点移到 **关闭按钮** 或 **标题**（产品二选一；推荐 **关闭** 或 **首可聚焦标题**）；Tab 仅在 sheet 内循环。
- **Esc：** 关闭 help，并 **`focus()` 回到 `#btnHelp`**（或实际触发元素）。
- **关闭后：** 移除 `aria-hidden` 对主内容的错误遮挡（若曾设置）；恢复滚动（`body` 防滚动需谨慎，仅遮罩层时可用 `overflow: hidden` on `body`）。

---

## 5) 与 Settings、教程层的层级（z-index）

**现状（`style.css` 参考）：**  
- `#tutorialLayer`：约 **55**（教程高亮与卡片）  
- `#settingsPanel`：约 **60**（设置面板）

**建议约定：**

| 层 | 建议 z-index | 说明 |
|----|--------------|------|
| 主内容 / header | auto / 1–10 | — |
| `#tutorialLayer` | **55** | 保持；**不**盖住 Settings/Help 若需同时存在时由产品决定（通常互斥） |
| `#settingsPanel` | **60** | 保持 |
| **Help 遮罩 + `#helpPanel`** | **65** | **高于** Settings，避免「先开 Settings 再点 ?」时 Help 出现在 Settings 下面；**产品规则**：打开 Help 时 **自动关闭** Settings（或反之），则层级冲突可简化。 |

**若 Help 与 Settings 互斥打开：** z-index 65 与 60 二选一即可；**若允许叠放**，Help 必须 **> 60**。

---

## 6) 关键 CSS 类名建议（前端实现用）

| 类名 | 用途 |
|------|------|
| `.header-actions` | 已有；内含 Help + Settings |
| `.icon-btn` | 已有；Help 与 Settings **共用** |
| `.icon-btn--help` | **可选** modifier：仅 Help 的图标尺寸微调（若与 ⚙ SVG 不一致） |
| `.help-backdrop` | 全屏半透明遮罩（`position: fixed; inset: 0`） |
| `.help-sheet` | 底部 sheet 容器（`position: fixed; bottom: 0; left: 0; right: 0`） |
| `.help-sheet__handle` | 顶部拖拽条（装饰/可访问性可选） |
| `.help-sheet__header` | 标题栏 + 关闭 |
| `.help-sheet__body` | 可滚动内容区 `overflow-y: auto; overscroll-behavior: contain` |
| `.help-sheet__close` | 关闭按钮（或仅用图标 ✕） |

模态方案若备用：`.help-modal`、`.help-modal__dialog`（`max-width` + `max-height` + safe-area）。

---

## 7) 组件与 id 建议清单

| 元素 | 建议 id | 说明 |
|------|---------|------|
| Help 触发按钮 | `#btnHelp` | `type="button"`，与 `#btnSettings` 并列 |
| 遮罩层 | `#helpBackdrop` | 点击遮罩是否关闭：建议 **是**（或仅点关闭，产品定） |
| 面板根节点 | `#helpPanel` | `hidden` / `aria-hidden` 与打开态同步 |
| 标题 | `#helpPanelTitle` | 供 `aria-labelledby` |
| 关闭按钮 | `#btnHelpClose` | Esc 与点击共用关闭逻辑（实现层） |
| 可滚动内容区 | `#helpPanelBody` | 长文 |

**与现有 id 关系：**

- `#settingsPanel` — 不变；打开 Help 时建议关闭 Settings（或反之）。
- `#tutorialLayer` — **教程引导**；Help 为 **静态释义**，二者内容不混用；可同时存在产品规则：**打开 Help 不自动启动 tutorial**。

---

## 8) 验收要点（设计侧）

- [ ] Help 按钮与 Settings **同高同可点区域**（≥44×44 CSS px）。
- [ ] 小屏横竖屏、带刘海/Home 指示条：**底部内容不被遮挡**。
- [ ] 键盘：Focus 可见；Esc 关闭；关闭后焦点回 `#btnHelp`。
- [ ] 读屏：`aria-label`、`dialog` 标题关联清晰。

---

*文档结束。*
