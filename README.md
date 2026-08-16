# ⚔️ 无极军团 / Wuji Legion — dsh-wuji-legion v1.0

**一句话 / One Sentence**:
系统级多智能体组织：让小白用人话下达命令，一支会自己进化的智能体军团自动把事办成 / A system-level multi-agent organization: novices give orders in plain language, a self-evolving agent legion gets it done automatically

**适配架构 / Architecture**:
DeepSeek Harness (Cordis 插件系统) 原生 / Native DeepSeek Harness (Cordis plugin system)

📺 [在线看板 / Live Dashboard](./无极军团介绍看板.html) | 📋 [规划文档 / Planning](./无极军团完整规划v3.0.md)

---

## 🎯 这是什么？ / What is this?

⚔️ **无极军团 / Wuji Legion** 是一个基于 **DeepSeek Harness** 的 AI 多智能体协作系统。

以**军事指挥链**为架构，通过**系统级下沉**（所有角色都是真正的 DSH 插件/服务，不是 persona 文字）实现"能沉多低沉多低"。

### 核心优势 / Key Advantages

| 特性 Feature | 中文 | English |
|-------------|------|---------|
| 🎯 | 系统级无感调用 | System-Level Zero-Config Invocation |
| 🧬 | 能力进化重生 | Capability Evolution Reborn |
| 🎖️ | 白帽反迎合 | White-Hat Anti-Sycophancy |
| 🏛️ | 三级建制 | Three-Tier Military Structure |
| ⚡ | MoE 统一形态 | MoE (Mixture-of-Roles) |
| 🛡️ | 权力边界 | Power Boundaries |

---

## 🏛️ 三级建制 / Three-Tier Structure

```
用户 User
    ↓
阿极 A-Ji（用户接口 User Interface / 收集需求 Collect Requirements）
    ↓
参谋部 General Staff（全局调度 Global Dispatch / 唯一裁决 Sole Decider）
    ↓ 单链调度 Single Chain
┌─────────┬─────────┬─────────┐
│ 内容主帅 │ 视觉主帅 │ 开发主帅 │  ← 域内选型 Domain Selection
│ Content │ Visual  │ Dev     │
└─────────┴─────────┴─────────┘
    ↓ 横向扇出并行 Parallel Fan-out
专家 / 工兵 Experts / Workers（打螺丝的只知打螺丝 / Each only knows its own job）
    ↓
独立官员 Officers（白帽/质检/审计 White-Hat/QA/Audit，只建议零修改权 Advise Only）
    ↓
阿极汇报 → 用户 A-Ji Reports → User
```

---

## 🔥 三大卖点 / Three Highlights

### ① 系统级无感调用 / System-Level Zero-Config Invocation

用户只说"把这个表格做成 PPT 发群里"，系统自己决定调飞书、PPT、还是发消息。**全程不让用户接触 skill/插件/MCP 这些概念。**

*The user says "turn this table into a PPT and send it to the group" — the system decides which capability to call. The user never touches "skill/plugin/MCP".*

### ② 能力进化重生 / Capability Evolution Reborn

同类型能力不"叠加"、不"只留最强"，而是**查漏补缺、取长补短地重生**成一个不属于任何前身的新物种。

*Similar capabilities are neither stacked nor trimmed — they are reborn into a new species, filling gaps and combining strengths.*

```
打赢漂亮仗 Win a battle → 官员点评 Officers Review → 参谋部拍板 Staff Decides
→ 进化主帅融合重生 Evolution Commander Fuses & Reborns
→ 行为探针验证（带 benchmark，不是 README 自吹）Behavior Probe
→ 版本化入库（可回滚）Versioned & Rollback-able
```

### ③ 白帽反迎合 / White-Hat Anti-Sycophancy

内置"白帽"（军事建制中的宪兵，戴白钢盔），专门从你的利益出发找反例、风险、遗漏。**没有它，任何 AI 都只会一味迎合你。**

*Built-in "White Hat" (the military police, white helmet) hunts for counterexamples, risks, and omissions in your interest. Without it, any AI just flatters you.*

> 官方依据 / Official: Anthropic Persona Vectors（可编辑谄媚 / edits out sycophancy）+ OpenAI 回滚过度谄媚的 GPT-4o / rolled back over-flattering GPT-4o

---

## 📐 每一个设计，都有背书 / Every Design Is Backed

| 设计 Design | 中文 | 背书 Evidence |
|-------------|------|--------------|
| 🧩 | MoE 统一形态 | MoRAgent · ICML 2025 |
| 📏 | 自适应层级 | Cursor 百万行代码 + Gated Routing |
| 🎯 | 主帅选型 | GraphRouter · ICLR + OWL · NeurIPS |
| 🧬 | 融合两分法 | GraphRouter + MoErging · TMLR |
| 🔍 | 情报官只搜集不分析 | DecoupleSearch · EMNLP 2025 |
| 💾 | 记忆压缩 | Structured Distillation（11x token）+ Hermes |
| 💻 | 代码质量 | DeepCode（75.9% 超人类）+ superpowers（187K⭐） |
| 🔧 | 根因修复 | Microsoft OpenRCA · ICLR + ICSE |
| 🛡️ | 产出物自查 | Facebook secpriv（128 benchmark）+ Cisco |
| 🦠 | 防恶意代码 | OWASP + aguara + JadeGate |
| 🔐 | 破译+加密 | Google CASCADE · ICSE + 博世 ProxyPrompt + DeepMind CaMeL |

---

## 🛡️ 三大通病，从源头堵死 / Three Chronic Ills, Blocked at Source

| 老毛病 Illness | 中文 | 为什么不会再犯 Why It Won't Recur |
|---------------|------|----------------------------------|
| 😫 | 上下文超大 | 全量数据从第一次读起就没进上下文的通道 |
| 😤 | 任务耗时久 | 直道优先 + 真并行 + 前置限制，绕路的结构不存在 |
| 🤯 | 融合不如不用 | 选型与重生分开，主帅只选型不堆叠 |

---

## 🔒 权限分级 / Permission Tiers

| Level | 中文 | English | Limit |
|-------|------|---------|-------|
| 🟢 | 无害 | Harmless | 自动 Auto |
| 🟡 | 局部 | Local | 子agent自决 Self |
| 🟠 | 中等 | Medium | 阿极确认 A-Ji |
| 🔴 | 高危 | High | 用户确认 User |
| ⚫ | 致命 | Fatal | 否决 Veto |

---

## 🚀 快速开始 / Quick Start（规划中 In planning）

```bash
# P0 即将开始 P0 coming soon
# 目标：说一句话，自动找到对应技能
# Goal: one sentence → auto-find the right skill
```

> 本项目处于**架构定型阶段**。规划见 `无极军团完整规划v3.0.md`。
> *Architecture-finalized stage. See planning doc.*

---

## 📚 命名与立场 / Naming & Stance

- **命名**：阿极、参谋部、主帅、独立官员、工兵——全是无极自己的建制。*All names are Wuji's own.*
- **借鉴**：外部项目只学方法、不借名字。*External projects contribute methods, not names.*
- **纪律**：官员只建议零修改权；融合永远是重生。*Officers advise only; fusion is always rebirth.*

---

**⚔️ 阿极在此，全军待命。请下达指令！**
**⚔️ A-Ji here, all units standing by. Awaiting your orders!**

**License**: MIT
