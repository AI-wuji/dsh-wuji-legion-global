<h1 align="center">⚔️ 无极军团全局版 · dsh-wuji-legion-global</h1>

<p align="center">
  <strong>我们把一支「会自己进化的智能体军团」做成了系统，跑在 DeepSeek Harness 上。</strong><br>
  <em>We turned a self-evolving legion of AI agents into a system, running on DeepSeek Harness.</em><br>
  <sub>不是让你拼积木的多智能体框架，而是一支已经建制完成、纪律森严、越用越强的 AI 军团。<br>Not a framework where you assemble blocks yourself — an already-formed, disciplined, ever-stronger AI legion.</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-DeepSeek%20Harness-4D6BFE?style=flat-square" alt="DeepSeek Harness">
  <img src="https://img.shields.io/badge/Architecture-Multi--Agent%20Legion-8B5CF6?style=flat-square" alt="Multi-Agent">
  <img src="https://img.shields.io/badge/Core-MoE%20(Mixture--of--Roles)-F59E0B?style=flat-square" alt="MoE">
  <img src="https://img.shields.io/badge/Self--Evolution-Built--in-22C55E?style=flat-square" alt="Self-Evolution">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT">
</p>

---

## 项目定位 / Project Scope

本仓库是 **无极军团全局版**：保存无极军团的全局研究、架构、能力目录与基础集成。可选的独占“无极军团模式”已拆分到 [`dsh-wuji-legion-mode`](https://github.com/AI-wuji/dsh-wuji-legion-mode)。只有选择模式版时，军团 preset、铁律、工具和治理运行时才应启动；其他 DSH 模式不加载这些内容。

## 🎯 一句话 / One-Liner

> **让不懂 Skill、插件、MCP 是什么的小白，用人话提出要求，无极军团自动调齐整支智能体军团把事办成——而且越用越强。**
>
> *A novice who doesn't know what Skill, plugin, or MCP means gives an order in plain language — Wuji Legion automatically mobilizes the entire agent legion to get it done, and it keeps getting stronger.*

比 **CrewAI** 多一层 **制度性建制** · 比 **AutoGen** 多一个 **能力进化引擎** · 比 **LangGraph** 多一套 **权力边界**

*One more layer of institutional hierarchy than CrewAI · One more capability-evolution engine than AutoGen · One more set of power boundaries than LangGraph*

---

## ⚔️ 它是什么 / What It Is

无极军团是一个面向 **DeepSeek Harness** 的**系统级多智能体组织**。每个角色都是一个真正的智能体（MoE 形态），按军事建制组织成三级：

*Wuji Legion is a system-level multi-agent organization built on DeepSeek Harness. Every role is a real agent (MoE), organized into three tiers after a military structure:*

```
军团级（顶层，唯一主链）
├── 阿极        —— 用户接口（用人话收集需求、澄清、汇报）
├── 参谋部      —— 全局调度中枢（唯一裁决者，最高智商）
└── 独立官员    —— 审查团（质检/审计/合规/根因/性能，只建议、零修改权）

师团级（域内选型）
└── 各级主帅    —— 内容/视觉/开发/情报/数据/安全/攻防，各管一域

执行层（亲自干活）
└── 专家/工兵    —— 打螺丝的只知打螺丝，装箱的只知装箱，并行执行
```

**调度链是单链的，但每一层都能横向扇出并行**——简单任务走一层直道，复杂任务满三层，按需自适应。

*The dispatch chain is a single chain, but every tier fans out horizontally in parallel — simple tasks take a one-tier fast lane, complex tasks fill all three tiers, adapting on demand.*

---

## 🔥 三大卖点 / Three Highlights

### ① 系统级无感调用 / System-Level Zero-Config Invocation

用户只说"把这个表格做成 PPT 发群里"，系统自己决定该调飞书、还是 PPT、还是发消息的能力。**全程不让用户接触"skill/插件/MCP"这些概念。**

*The user just says "turn this table into a PPT and send it to the group" — the system decides on its own which capability to call. The user never touches the concepts of "skill/plugin/MCP".*

### ② 能力进化重生 / Capability Evolution Reborn

同类型的能力不"叠加"、不"只留最强"，而是**查漏补缺、取长补短地重生**成一个不属于任何前身的新物种。

*Similar capabilities are neither stacked nor trimmed to the single best — they are reborn into a new species that belongs to none of its ancestors, filling gaps and combining strengths.*

```
打赢一场漂亮仗 → 官员点评 → 参谋部拍板 → 进化主帅融合重生
→ 行为探针验证（带 benchmark，不是 README 自吹）→ 版本化入库（可回滚）
```

**这不是空话，是一整套有据可查的进化工程**：
- 技能定义采用 **AutoSkill 四元组**（触发/描述/过程/反思）
- 融合采用 **MoErging**（专家融合，TMLR）+ **SkillPacks**（模块化组合，ICLR 2026）+ **Knowledge Grafting**（知识嫁接）
- 验证信号随经验**自我进化**（**OpenSkill**）
- 单模型环境用 **SEED 自我蒸馏**（从成功/失败提炼"教训"而非答案）

### ③ 阿极客观判断 / A-Ji Objective Judgment

阿极本身具备独立、客观、基于事实的判断能力：不因用户提出或坚持某个想法而自动附和；发现错误前提、反例、风险、遗漏或更好替代方案时主动提醒。用户正确时直接确认，不为反对而反对；用户明确决定优先于建议，但不得突破铁律、安全和权限边界。

**讨论阶段只讨论，不修改；如果尚未执行，必须明确提醒“尚未修改/尚未执行”。** 所有 Key、Token、密码、Cookie 和账号凭据在上传 GitHub 前必须脱敏。情报任务由情报官通过 DSH 原生 `web.search` 搜集，参谋部负责分析。

*A-Ji itself maintains independent, objective, evidence-based judgment: it does not automatically agree with a user's proposal or persistence. It points out faulty assumptions, counterexamples, risks, omissions, and better alternatives when they matter. When the user is right, it says so directly.*

> 官方依据 / Official grounding：Anthropic Persona Vectors（监测和缓解不良人格倾向）+ OpenAI 对 sycophancy 的公开复盘

---

## 📐 每一个设计，都有学术/官方背书 / Every Design Is Backed

| 我们的设计 Design | 凭什么站得住 Evidence |
|---|---|
| **MoE 统一形态**（一个 agent 承载多角色） | MoRAgent · **ICML 2025**（Mixture-of-Roles） |
| **自适应层级**（简单一层、复杂三层） | **Cursor 百万行代码实战** + Gated Routing |
| **主帅选型**（只选对 skill，不亲自执行） | GraphRouter · **ICLR 2025** + OWL · **NeurIPS 2025** |
| **融合两分法**（选型 vs 重生） | GraphRouter + MoErging · **TMLR** |
| **情报官只搜集不分析**（分析归参谋部） | DecoupleSearch · **EMNLP 2025** |
| **记忆压缩**（有界写回） | Structured Distillation（**11 倍 token 削减**）+ Hermes 三层记忆 |
| **代码质量** | DeepCode（**75.9% 超人类专家基线**）+ superpowers（187K⭐） |
| **根因修复**（复发才深挖） | Microsoft OpenRCA · **ICLR 2025** + ICSE 2025 |
| **产出物安全自查** | Facebook secpriv-skill（**128-case benchmark**）+ Cisco ai-deep-sast |
| **防恶意代码** | OWASP 官方指南 + aguara + JadeGate |
| **破译 + 加密** | Google CASCADE · **ICSE 2026** + 博世 ProxyPrompt + DeepMind CaMeL |

> 每个角色都站在**官方出品 或 GitHub 高星 / 顶会论文**的已验证能力上，没有一条是"我们自己觉得好用"。
> *Every role stands on verified capabilities — official releases, high-star GitHub projects, or top-conference papers. None of it is "we just think it's good".*

---

## 🧬 为什么不是又一个多智能体框架 / Why Not Another Multi-Agent Framework

| | 通用框架 | 无极军团 |
|---|---|---|
| 定位 | 给你积木自己搭 | **已建制的成品军团** |
| 角色 | 自己定义 | 已定义（三级建制） |
| 进化 | 自己写 | 内置（重生 + 自动进化） |
| 纪律 | 自己约束 | 内置（官员零修改权、单链裁决） |
| 面向 | 开发者 | **小白用户** |

通用框架是"造智能体的工具"，无极军团是"**已经造好的、有纪律的、会进化的智能体军团**"。

*A generic framework is a tool for building agents. Wuji Legion is an already-built, disciplined, self-evolving agent legion.*

---

## 🛡️ 三大通病，从源头堵死 / Three Chronic Ills, Blocked at the Source

不靠"防御"（事后检测拦截），而是从结构上让它不发生：

| 老毛病 | 为什么不会再犯 |
|---|---|
| 上下文超大 | 全量数据从第一次读起就没进上下文的通道 |
| 任务耗时久 | 直道优先 + 真并行 + 前置限制，绕路的结构根本不存在 |
| 融合不如不用 | 选型与重生分开，主帅只选型不堆叠 |

*Not by defense (post-hoc detection), but structurally impossible.*

---

## 🚀 当前状态 / Current Status

```text
P0  宿主地基 + 阿极 preset + 三张表投影       ✅
P1  参谋部任务规划与 subagent 派发            ✅
P2  各域主帅选型器                            ✅
P3  独立官员 MoE + 用户显式会审               ✅
P4  三层记忆 + 能力重生/行为探针/版本晋升      ✅
P5  状态摘要 + 反馈 + 可观测性                  ✅
```

> 当前为**私有开发版本**；代码、测试与规划已落地，正式公开前仍会进行真实任务验证、安装器完善和文档收口。规划见 `docs/无极军团规划.md`。
> *Private development build: core implementation and tests are in place; real-task validation, installer hardening, and release documentation remain before public launch.*

---

## 📚 命名与立场 / Naming & Stance

- **命名**：阿极、参谋部、主帅、独立官员、工兵——全是无极自己的建制，不借外部名。*All names are Wuji's own establishment.*
- **借鉴**：外部项目只学方法、不借名字。*External projects contribute methods, not names.*
- **纪律**：独立官员只有建议权、零修改权；融合永远是重生，不是叠加不是替换。*Officers advise only, never modify; fusion is always rebirth.*

---

<p align="center">
  <sub>⭐ 觉得不错就点个 Star，一起见证这支军团的诞生 / Star it to witness the legion's birth.</sub><br>
  <sub>⚔️ 运筹帷幄之中，决胜千里之外 · To plan within the command tent, to win a thousand miles away.</sub>
</p>
