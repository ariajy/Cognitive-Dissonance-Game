# 「?」问号帮助 — 信息架构规格

**产品与信息架构顾问交付。**
**受众：** UI、文案、Dev。
**语言：** 中文大纲，UI 示例文案标注英文短语。

---

## 0) 分工边界：教程 vs 问号帮助

| 维度 | 首次教程（Tutorial T1–T4） | 「?」问号帮助 |
|------|--------------------------|-------------|
| **触发** | 自动、一次性、按顺序 | 玩家主动点击「?」 |
| **时机** | 第一次进入各屏幕时 | 任何时候 |
| **教什么** | **操作步骤**（如何点、顺序如何走） | **概念与 UI 含义**（这个数字/颜色/词代表什么） |
| **不教什么** | 心理学理论；结果是否「正确」 | 操作步骤（教程已覆盖）；剧情细节（Scenario Generator 负责） |
| **复访** | `tutorialSeen` 标记后不再出现（除非重置） | **随时可看**，无次数限制 |

> **核心原则：问号帮助是「概念词典 + 上下文解释」，不是第二个教程。**

---

## 1) 推荐方案：分屏上下文帮助（Contextual Help Sheet）

### 方案说明

每个屏幕只出现与该屏幕**直接相关**的帮助条目，以「**底部抽屉（Bottom Sheet）**」形式展开；全局通用概念（如 Strain、Belief）在多个屏幕复用同一份定义文本，但通过**上下文触发**的方式呈现。

### 为什么不用「单页总览」

| 单页总览 | 分屏上下文帮助（推荐） |
|---------|----------------------|
| 玩家需要记住哪条对应哪个屏幕 | 打开时只看到「当前屏幕」的相关词条 |
| 认知负荷高，尤其移动端纵向滚动长 | 条目少（2–4 条），一屏读完 |
| 不适合「我不懂这个条」的即时查询 | 点哪个屏幕的「?」就解释哪里的内容 |

### 入口设计

- 顶栏右上角固定「**?**」图标（每个屏幕通用入口）
- 可选：特定 UI 元素旁内嵌小「ⓘ」（如 Strain 条标签旁），点后仅展开该条目
- 抽屉出现时，后面页面**不跳转**，玩家读完关闭继续

---

## 2) 帮助条目完整大纲

### A. 全局概念（任意屏幕的「?」均可访问）

#### A-1. Strain（内心张力）
**玩家可能困惑的问题：** 这个条是干嘛的？会「满」了就输吗？

**建议文案：**
> Strain shows how much inner tension you're carrying right now.
> It rises when your actions conflict with your beliefs, and can ease through coping.
> High strain isn't failure—it means something important is being tested.

---

#### A-2. Beliefs（信念条）
**玩家可能困惑的问题：** 那些标签是什么？为什么有些高亮有些灰？

**建议文案：**
> Beliefs are the values you said matter most to you.
> The highlighted chip shows the belief most at stake in this scene.
> Their strength (%) shifts as you make choices—shifting isn't losing.

---

#### A-3. Primary beliefs vs 其他信念
**玩家可能困惑的问题：** 为什么有些信念平时不显示？我的选择只影响那一条吗？

**建议文案：**
> Your 3 focus beliefs are ones you marked during setup—they're shown upfront.
> All 6 beliefs are still in play; others are shown in "Other beliefs."
> Tap to expand and see the full picture.

---

### B. Onboarding 屏幕

#### B-1. 为什么要填名字
**玩家可能困惑的问题：** 名字有什么用？会被保存到哪里吗？

**建议文案：**
> Your name is only stored in this browser—it personalizes the recap and header.
> It's never sent anywhere. You can restart anytime to clear it.

---

#### B-2. 为什么要选 3 条信念，不是多选或全选
**玩家可能困惑的问题：** 为什么是「恰好 3 条」？我可以之后改吗？

**建议文案：**
> Three focus beliefs keep the header readable and meaningful.
> All beliefs still affect the game; this is your personal priority filter.
> To reset, use Restart in the final screen.

---

### C. Scenario 屏幕

#### C-1. Inner Voices（内心声音）
**玩家可能困惑的问题：** 那些斜体声音是角色的台词吗？是不是「正确答案」的提示？

**建议文案：**
> Inner voices represent different parts of how you might reason in this moment—
> not a narrator, not hints. They show the real conflict inside a decision.
> None of them is the "right" answer.

---

#### C-2. Belief focus tag（场景焦点标签）
**玩家可能困惑的问题：** 「Belief focus: Safety in love」是什么意思？

**建议文案：**
> This tag names the belief most likely to be tested by this scene.
> Watch how it responds after you choose.

---

### D. Decision 屏幕

#### D-1. Primary choices 的性质
**玩家可能困惑的问题：** 三个选项有「正确答案」吗？每个有什么区别？

**建议文案：**
> There's no correct choice—only choices that create different amounts of inner tension.
> Each option reflects a real way people respond in similar situations.
> The discomfort you feel after choosing is the point.

---

#### D-2. 为什么某些选项排在最前（Nudge 透明声明）
**玩家可能困惑的问题：** 选项顺序是随机的吗？为什么第一个更容易选？

**建议文案：**
> Option order and wording reflect common social pressure—by design.
> Real-life choices often come pre-sorted toward the path of least resistance.
> You can always scroll and pick any option.

---

### E. Dissonance 屏幕

#### E-1. Dissonance（认知失调）是什么
**玩家可能困惑的问题：** 「Dissonance」是不是说我选错了？

**建议文案：**
> Dissonance means your action and your stated belief pulled in different directions.
> It's not a judgment—it's the friction of being human: we don't always do what we say we value.
> The number shows how much tension that gap created.

---

#### E-2. Tension bar（张力条）的含义
**玩家可能困惑的问题：** Calm / Uneasy / Tense / Overloaded 是什么等级？会重置吗？

**建议文案：**
> The tension bar shows the extra inner pull from this specific moment.
> Calm = little conflict. Overloaded = strong conflict with a deeply held belief.
> It's separate from your overall Strain—this is the scene's spike.

---

#### E-3. "Belief hit"是什么意思
**玩家可能困惑的问题：** 「Hit belief: Love should feel safe」是说我破坏了这条信念吗？

**建议文案：**
> "Belief hit" names which belief the system detected in conflict with your choice.
> It doesn't mean you "broke" it—it means the choice created tension there.
> You'll see how that belief shifts after you cope.

---

### F. Reduction 屏幕

#### F-1. 三种应对方式的含义
**玩家可能困惑的问题：** Action change / Belief change / Justification 是什么意思？是道德排名吗？

**建议文案：**
> These are three real ways people reduce the discomfort of cognitive dissonance—
> not ranked by morality. Action change = align behavior with belief.
> Belief change = redefine the standard. Justification = reframe the event.

---

#### F-2. 为什么「合理化」也是选项
**玩家可能困惑的问题：** 既然合理化是「消极」的，为什么游戏让我选它？

**建议文案：**
> Justification is one of the most common real responses—not "wrong," just costly over time.
> Choosing it lets you experience what it feels like and what it changes.
> The game reflects, it doesn't judge.

---

### G. Summary 屏幕

#### G-1. 信念变化的方向（Firmer / Standard shifted）
**玩家可能困惑的问题：** 信念下降是说我「变坏了」吗？

**建议文案：**
> A lower belief strength means your internal standard shifted—not that you failed.
> "Standard shifted" after justification means the bar for "acceptable" may have moved.
> Noticing this is the point of the game.

---

#### G-2. Reflection prompts（反思提示）的用途
**玩家可能困惑的问题：** 这些问题是测试我吗？需要写下来吗？

**建议文案：**
> These prompts are for you to sit with, not answer aloud.
> They're designed to surface the reasoning you used—no score attached.
> Take a moment, or tap Next whenever you're ready.

---

#### G-3. 场景总张力（Scene Δ）vs 应对张力（Coping Δ）
**玩家可能困惑的问题：** 两个数字有什么不同？哪个更重要？

**建议文案：**
> Scene Δ = total strain change across this whole scene (choice + coping combined).
> Coping Δ = only the change from your coping step.
> Neither is "better"—together they show the shape of the moment.

---

### H. 顶栏 / Persona 面板

#### H-1. 顶栏数字的含义
**玩家可能困惑的问题：** 「82%」「Uneasy」这些数字代表什么？

**建议文案：**
> The % next to a belief shows how strongly you hold it right now—it can move.
> The label (Calm / Uneasy / Tense / Overloaded) reflects your current Strain level.
> Together they're a live snapshot of your inner state.

---

#### H-2. Stability（稳定度）是什么（如有显示）
**玩家可能困惑的问题：** 有个「稳定度」，和强度有什么区别？

**建议文案：**
> Strength = how strongly you currently hold the belief.
> Stability = how consistent it's been across choices. Low stability means it's been shifting.

---

## 3) 条目优先级（v1 建议只实现 P0）

| 优先级 | 条目 |
|--------|------|
| **P0（必须）** | A-1 Strain、A-2 Beliefs、C-1 Inner Voices、D-1 Primary choices、E-1 Dissonance、F-1 三种应对、G-1 信念方向 |
| **P1（建议）** | A-3 Primary vs 其他信念、D-2 Nudge 透明声明、E-2 Tension bar、E-3 Belief hit、F-2 合理化为何可选、G-2 Reflection 用途 |
| **P2（可推迟）** | B-1 B-2 Onboarding 细节、G-3 两个 Δ 的区别、H-1 H-2 顶栏数字 |

---

## 4) 验收标准

- 玩家可以在**不打断游戏进度**的情况下查看任意条目（抽屉打开/关闭，屏幕不跳转）。
- 每条帮助**3 句话以内**，移动端一屏内可读完。
- 打开后不出现「这是什么屏幕」的感知断裂——条目与当前屏幕**语境相关**。
- 不重复教程已教的操作步骤；不包含剧情剧透。

---

*End of spec.*
