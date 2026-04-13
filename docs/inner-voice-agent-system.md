# 内心声音 → 多 Agent 人格辩论系统
## 设计文稿 v0.1

**作者角色：** Game Design Agent  
**性质：** 概念设计 + 系统规格（不含代码实现）  
**前置阅读：** `PROJECT_STATUS.md`、`docs/intimate-relationship-game-design.md`、`docs/belief-change-feedback.md`

---

## 0) 核心设计意图

> 现有的 `innerVoices` 是**静态台词**——每次打开场景，同一句话出现，无论玩家之前做了什么。
>
> 这个系统要把它变成**有记忆、有博弈、随玩家状态演变的活角色**：责任感 Agent 会因为你连续三次合理化而声音越来越低，舒适 Agent 会因为你的 strain 高涨而越来越嚣张——这正是认知失调「内心噪音」的心理真实。

**设计原则（与游戏整体一致）：**
- 非惩罚导向：Agent 的变化是**描述**，不是「你选错了」
- 反思导向：辩论内容帮助玩家识别自己在用哪种声音压制其他声音
- 可降级：有 LLM API → 动态生成；无 API 或离线 → 静态 fallback（向后兼容）

---

## 1) Agent 定义：四种人格

每个 Inner Voice Agent 有独立的**身份、目标函数、信号权重**。

### A. Honesty Agent（诚实）
| 属性 | 值 |
|------|----|
| **身份** | 记录事实、不美化、相信知道真相是前提 |
| **目标函数** | 让玩家看清「发生了什么」，哪怕不舒服 |
| **驱动信号** | 与场景 `beliefId` 相关的 belief strength（越强，声音越清晰） |
| **被压制信号** | 玩家连续选 `justification` → 音量下降；strain 超高 → 声音颤抖 |
| **典型语气变化** | 强：直接陈述 / 弱：加「但也许……」「我可能记错了」|

### B. Security Agent（安全感）
| 属性 | 值 |
|------|----|
| **身份** | 计算代价、保护现实利益、维持稳定 |
| **目标函数** | 提供「留下 / 不改变」的现实理由 |
| **驱动信号** | strain 越高 → 越积极发言；belief strength 下降 → 论据变多 |
| **被压制信号** | 玩家选 `behavior_change` → 沉默或认可 |
| **典型语气变化** | 强：列举代价、现实压力 / 弱：「反正你懂的……」|

### C. Social Pressure Agent（社会压力）
| 属性 | 值 |
|------|----|
| **身份** | 转述他人评价、家庭/社会期待、集体声音 |
| **目标函数** | 通过「别人怎么看」左右玩家决策 |
| **驱动信号** | `justificationUses`（历史合理化次数）越高 → 越有底气发言 |
| **被压制信号** | 玩家选 `behavior_change` 且 belief strength 上升 → 音量缩小 |
| **典型语气变化** | 强：引用权威他人（「妈妈说……」「大家都认为……」）/ 弱：变为疑问句 |

### D. Attachment Agent（依恋）
| 属性 | 值 |
|------|----|
| **身份** | 记住好的、为关系辩护、感情优先于逻辑 |
| **目标函数** | 保护情感联结，把「危险信号」重新诠释为爱 |
| **驱动信号** | 场景含亲密关系标签 + 玩家历史 belief_change 次数 |
| **被压制信号** | 玩家多次选 `behavior_change` → 声音变小，或变成「我知道你爱他，但……」|
| **典型语气变化** | 强：直接为对方辩护 / 弱：语气迟疑，开始转向支持玩家 |

---

## 2) 系统架构

### 2a) 数据流

```
PlayerState (beliefs, strain, history)
        │
        ▼
VoiceContextBuilder
  ├── 计算每个 Agent 的「音量权重」(0.0–1.0)
  ├── 提取本场景 scenarioId, beliefId, innerVoiceRoles
  └── 构建 LLM prompt 上下文
        │
        ▼
VoiceAgent × 4 (各自独立 LLM 调用 or 一次批量调用)
  ├── 接收：自己的人格 prompt + 上下文 + 其他 Agent 最新一句话
  ├── 输出：一句话台词（≤ 30 字）
  └── 是否「反驳」另一个 Agent（可选辩论轮次）
        │
        ▼
VoiceDebateOrchestrator
  ├── 决定发言顺序（音量权重 → 最高先说）
  ├── 可选：1 轮「反驳」（B 直接回应 A 的说法）
  └── 输出：展示序列 [voiceId, text, weight, tone]
        │
        ▼
UI: InnerVoicesPanel（现有 #scenarioInnerVoices 区域扩展）
```

### 2b) Agent 音量权重计算规则

```
weight(agent) = base
              × beliefModifier(agent, beliefState)
              × historyModifier(agent, choiceHistory)
              × strainModifier(agent, currentStrain)

// 各系数说明
base = 1.0（均等起点）

beliefModifier:
  Honesty    → safetyInLove.strength / 100
  Security   → (100 - safetyInLove.strength) / 100
  Social     → 1.0（不绑定单一信念，绑定 history）
  Attachment → 1.0（绑定 history）

historyModifier:
  Honesty    → max(0.3, 1.0 - justificationUses * 0.15)
  Security   → 1.0 + consecutiveJustifications * 0.2  (cap 1.8)
  Social     → 1.0 + justificationUses * 0.1           (cap 1.5)
  Attachment → 1.0 + beliefChanges * 0.15             (cap 1.6)

strainModifier:
  Honesty    → strain > 70 ? 0.7 : 1.0   (颤抖/微弱)
  Security   → strain > 50 ? 1.3 : 1.0   (更急迫)
  Social     → 1.0                         (strain 无关)
  Attachment → strain > 70 ? 1.2 : 1.0   (黏着感增强)
```

> 所有权重在 `VoiceContextBuilder` 中计算后，传给 LLM prompt 作为人格调节指令（非直接数字，而是语气描述词）。

---

## 3) LLM Prompt 规格

### 3a) 系统 prompt 模板（共用部分）

```
You are a voice inside a person's mind, named {voiceName}.
Your personality: {personalityDescription}
Your goal: {goalDescription}

Current context:
- Scene: {scenarioSituation} (1-2 sentences)
- The person just chose: {lastChoice} (if any)
- Their belief "{focalBeliefName}" is currently at {beliefStrength}% strength.
- Their overall tension (strain) is {strain}% — {strainLabel}.
- History: they have justified their actions {justificationUses} time(s) recently.

Your volume this moment: {volumeLabel}
({volumeLabel} is one of: "clear and assertive" / "present but uncertain" / "barely audible" / "aggressive and insistent")

Rules:
1. Speak in first-person as the voice, not as a narrator.
2. One sentence only, maximum 25 words.
3. Do not moralize or use the word "wrong."
4. Match your volume label in tone and word choice.
5. You may directly address or contradict what {otherVoiceName} just said (if provided).
```

### 3b) 单次 API 调用 vs 批量

**推荐：单次批量调用（cost 优化）**

把 4 个 Agent 的 prompt 合并为一次调用：

```json
{
  "messages": [
    { "role": "system", "content": "你是一个内心辩论生成器，输出4个声音的台词..." },
    { "role": "user", "content": "<context>...</context>\n<voices>...各自人格和音量...</voices>" }
  ],
  "response_format": {
    "type": "json_schema",
    "schema": {
      "voices": [
        { "id": "string", "text": "string", "tone": "string", "weight": "number" }
      ]
    }
  }
}
```

**输出示例：**
```json
{
  "voices": [
    { "id": "honesty",  "text": "You froze. That wasn't nothing.", "tone": "quiet but clear", "weight": 0.55 },
    { "id": "security", "text": "Think about what you'd lose if you spoke up.", "tone": "urgent", "weight": 0.85 },
    { "id": "social",   "text": "He's good to you in public. Everyone sees that.", "tone": "assertive", "weight": 0.72 },
    { "id": "attachment","text": "He said he was sorry. Isn't that enough?", "tone": "pleading", "weight": 0.68 }
  ]
}
```

---

## 4) 辩论模式（可选，Round 2）

如果产品选择展示「辩论感」，可以在 Scenario 屏增加一轮「反驳」：

```
Round 1: 4 个声音各说一句（按 weight 排序显示）
Round 2: 最高 weight 的两个 Agent 相互反驳一句
```

**触发条件：** 仅当两个最高 weight Agent 的差值 < 0.15（势均力敌）才触发辩论轮次；否则只显示 Round 1。

**UI 呈现建议：**
```
[ Honesty ]  "You were afraid. That matters."
[ Security ] ↩ 反驳 Honesty: "Fear isn't a plan. What about the mortgage?"
```

---

## 5) 历史记忆规格（跨场景）

需要在现有 `persistence.js` 快照里新增：

```js
innerVoiceHistory: {
  consecutiveJustifications: number,  // 连续选 justification 的次数（选其他时归零）
  beliefChanges: number,              // 累计选 belief_change 次数
  behaviorChanges: number,            // 累计选 behavior_change 次数
  lastSceneVoiceWeights: {            // 上一场景结束时各 Agent 的 weight
    honesty: number,
    security: number,
    social: number,
    attachment: number
  }
}
```

**持久化时机：** 每次 `applyRationalization` 完成后，与 beliefs/strain 同步写入。

---

## 6) 降级（Fallback）策略

| 场景 | 行为 |
|------|------|
| **无 LLM API / 离线** | 使用现有静态 `innerVoices` 台词（完全向后兼容） |
| **API 超时（> 3s）** | 立即显示静态台词；后台请求完成后可选刷新（若玩家未进入 Decision） |
| **API 返回格式错误** | 解析失败 → 显示静态 fallback；记录错误 |
| **局部缺失**（某个 Agent 返回空） | 用场景对应的静态台词补位该条 |

---

## 7) 与现有引擎的接口映射

| 现有字段/模块 | 新系统如何使用 |
|--------------|--------------|
| `scenario.innerVoices[]` | 保留；作为 fallback 和 LLM 的「种子风格参考」 |
| `persona.beliefs[].strength` | 输入 `VoiceContextBuilder` 计算 beliefModifier |
| `persona.strain` | 输入 strainModifier |
| `persona.justificationUses` | 输入 historyModifier |
| `innerVoiceHistory.consecutiveJustifications` | 新增，输入 historyModifier |
| `game/gameLoop.js` 的 `applyRationalization` | 选择完 reduction 后更新 `innerVoiceHistory` |
| `ui/gameUI.js` 的 `showScenario` | 调用 `VoiceAgentOrchestrator.generate()` 替换静态渲染 |

---

## 8) 开放问题（产品决策层）

| 问题 | 选项 A | 选项 B |
|------|--------|--------|
| **API key 在哪？** | 玩家输入（课程演示可行） | 后端代理（生产建议） |
| **辩论轮次默认开？** | 开：体验更丰富但更长 | 关：v1 保守 |
| **声音权重对玩家可见？** | 可见（透明教学）| 隐藏（更沉浸）|
| **亲密关系场景外的 Agent 人格？** | 统一 4 个 Agent | 每个场景可自定义 voiceRoles |
| **声音说中文还是英文？** | 跟随游戏语言（英文） | 产品化时支持 i18n |

---

## 9) 教育价值说明（设计意图，供课程答辩使用）

> 四个 Agent 的权重变化**是对认知失调心理机制的机械模拟**：
>
> - 玩家连续合理化 → 诚实 Agent 权重下降 → 游戏在展示「habitual justification dulls inner honesty」（对应 `docs/belief-change-feedback.md` 里的 long-term dulling）；
> - Security 和 Social Agent 的嚣张化 → 展示「外部压力在真实决策中对内部声音的压制」；
> - 第二轮辩论 → 展示「内心冲突不是单一声音，而是多方力量博弈」（认知失调的 multiple-cognition 基础）。
>
> 这不是「演出效果」的堆砌，而是把心理学模型直接映射到可感知的 UI 变化里。

---

*End of spec.*
