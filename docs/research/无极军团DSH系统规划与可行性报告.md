# 无极军团 × DeepSeek Harness 系统规划与可行性报告

> 版本：v0.1（规划稿，未实施）
> 日期：2026-08-15
> 性质：可行性报告 + 实施蓝图。本文只规划，不改动任何运行配置或代码。
> 依据：无极军团全谱系（v4 参谋本部制 / v11.3 Codex 单一主链 / 2.1 Codex 精简契约 / 3.0 蓝图）+ DeepSeek Harness 运行时实测 + 2026 年外部生态全网调研。

---

## 0. 一句话定位

> **在 DeepSeek Harness 上重建"参谋本部中枢制"的无极军团：系统级自动路由（capability-mount）让小白用户无感调用 skill/插件/MCP；进化主帅机制持续蒸馏、融合同类能力为更强的 DSH 原生插件；独立官员按契约对高风险交付做真实验证。**

---

## 1. 组织架构（以你确认的完整体系为准，不再用 2.1 的压缩表述）

```
用户（小白，无技能概念）
   │  一句话业务需求
   ▼
┌─────────────────────────────────────────────────────┐
│ 阿极（前端）—— DSH 会话层                              │
│   用户交流 / 需求澄清 / 结果汇报 / 采纳官员建议           │
└─────────────────────────────────────────────────────┘
   │ 需求快照（版本化）
   ▼
┌─────────────────────────────────────────────────────┐
│ 参谋本部（主 Skill 中枢，唯一预加载）                     │
│   task-routing → capability-mount → deterministic-exec │
│   = 系统级自动路由：skill_candidates / plugin_candidates │
│     / mcp_candidates → 只选一条主链路，用户无感知         │
└─────────────────────────────────────────────────────┘
   │ 分派
   ▼
┌─────────────────────────────────────────────────────┐
│ 各级主帅（按需挂载）                                     │
│   · 进化主帅：能力谱系 / 蒸馏 / 融合 / 退役              │
│   · 保卫科：安全门禁（确定性）                            │
│   · 情报局/搜索、质监局/验收 等能力主帅                    │
└─────────────────────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────────────────────┐
│ 独立官员（按契约触发，隔离审查，只有建议权）                │
│   白帽 / 质检 / 审计 / 合规 / 根因 / 性能                 │
└─────────────────────────────────────────────────────┘
   │ 执行证据 + 验收证据
   ▼
工兵/部门执行层 —— DSH subagent / workflow / skill / MCP
```

**对应 DSH 机制**（已实测确认可用）：

| 原角色 | DSH 落点 | 状态 |
|---|---|---|
| 参谋本部中枢 | DSH agent preset + 宿主路由服务（`systemPrompt.section()` 注入路由决策；`agent/pre-step` 钩子） | 待建 |
| capability-mount | skill 目录描述语义化 + `skills` 注册表 + MCP 客户端动态装载 | 半成品（有 skill 自动装载，无确定性路由层） |
| 阿极前端 | 会话对话层（模型主线程） | 现成 |
| 进化主帅 | 融合治理插件 + `cordis_define/run/stop` 动态插件管道 | 待建 |
| 保卫科 | `tools/pre-execute` 瀑布 + 现有 approval 栈 + 确定性门禁 | 可复用+待建 |
| 独立官员 | 隔离 subagent 审查席（`officer-select` → 独立 review 子代理） | 可复用+待建 |
| 工兵执行层 | subagent / workflow / skill / MCP | 现成 |

---

## 2. 现状与差距（事实核查）

### 2.1 已就位

- **DSH 官方能力**：Cordis 插件系统、`skills` 分层注册表、`tools` 注册表、subagent/workflow/goal/jobs、plan mode、approval 栈、sandbox、web 服务、动态插件（define/run/stop/undefine）+ Inspect 只读查询。
- **DSH 官方 MCP 客户端已内置**（`packages/mcp/mcp-client`），官方还提供了 `examples/mcp-memory` 示例——**"自动调用 MCP"的宿主能力不是障碍，是现成的**。
- **无极资产**：17 个能力包 manifest（触发词/生命周期/探针/fallback）、`wuji.exe` 确定性路由（实测可运行）、行为探针脚本、融合基因组（presentation/interaction 两个物种）、3.0 图谱与进化主帅规则文档。
- **本机已装**：27 个 lark-* 技能 + dashi-ppt + wuji-legion-codex-2-1 + cordis 开发技能。

### 2.2 核心缺口

| # | 缺口 | 说明 |
|---|---|---|
| G1 | 无系统级能力路由层 | 现在 skill 由模型自觉装载；参谋本部中枢要把它变成"确定性路由 + capability-mount 只选一条主链路" |
| G2 | 无能力注册表 | 需要一个 DSH 版 manifest 目录（skill/plugin/MCP 统一登记 + 触发词 + 验证探针） |
| G3 | 无融合管道 | 蒸馏→定义新插件→行为验证→进热路径，这条链没有工具化 |
| G4 | 无官员审查席 | officer-select → 独立 subagent 的按契约触发机制未建 |
| G5 | 无失败经验闭环 | 失败→根因→经验沉淀→下次复用，未接入 DSH 事件 |
| G6 | 小白入口未抽象 | 用户仍可能被问到技能术语；需要"业务语言提问 + 系统层选择"的封装 |

---

## 3. 外部生态调研：可融合的新东西（2026 年视角）

> 以下全部来自本次全网检索，标注来源；融合与否的裁决见第 4 节。

### 3.1 DeepSeek Harness 社区生态（同平台，直接可融合）

| 发现 | 内容 | 来源 |
|---|---|---|
| **DSH 官方仓库与教程** | 官方已开源 `deepseek-harness`（docs/cordis-tutorial、architecture.zh.md），插件架构文档齐备 | [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)、[architecture.zh.md](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.zh.md) |
| **DSH 官方 MCP 客户端** | `packages/mcp/mcp-client`，并有 `examples/mcp-memory` | [mcp-client README](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/mcp/mcp-client/README.zh.md)、[mcp-memory 示例](https://github.com/deepseek-ai/deepseek-harness/blob/master/examples/mcp-memory/README.zh.md) |
| **社区插件集市** | `awesome-dsh-plugin` 收录约 **270 个** DSH 插件；另有 `awesome-deepseek-harness` 合集 | [awesome-dsh-plugin](https://github.com/beancookie/awesome-dsh-plugin)、[V2EX 270 插件帖](https://global.v2ex.co/t/1234499)、[0xsline/awesome-deepseek-harness](https://github.com/0xsline/awesome-deepseek-harness) |
| **跨会话记忆 preset** | `dsh-hermes-memory`：Hermes 风格跨会话记忆 + 自主技能学习 | [dsh-hermes-memory](https://github.com/mbj733/dsh-hermes-memory) |
| **记忆+自进化插件** | `dsh-memory-evolve`：五轨记忆 · 技能自我进化与技能管理器 · COI 调度 · 会话搜索；`dsh-continual-evolve`：版本化、可审计、可回滚的持续自进化 | [dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve)、[dsh-continual-evolve](https://github.com/ZK-Andy/dsh-continual-evolve) |
| **Superpowers 适配** | `superpowers-dsh`：把 obra/superpowers 的 TDD/调试/规划技能适配到 DSH | [superpowers-dsh](https://github.com/LayneChai/superpowers-dsh) |
| **桌面壳** | `deepseek-harness-desktop-app`：本地桌面工作区 | [desktop-app](https://github.com/vibeinging/deepseek-harness-desktop-app) |

### 3.2 技能标准与跨运行时互操作

| 发现 | 内容 | 来源 |
|---|---|---|
| **MCP 2026 规范新增 Agent Skills** | MCP 官方文档 `build-with-agent-skills`——技能成为 MCP 协议的一等公民，**这是"skill 与 MCP 统一"的最大信号** | [modelcontextprotocol.io](https://modelcontextprotocol.io/docs/2026-07-28/develop/build-with-agent-skills.md) |
| **MCP Registry 官方化** | MCP 官方博客发布 registry preview；GitHub 发布 MCP Registry（发现/安装/管理 MCP 服务器） | [MCP Registry 官方](https://modelcontextprotocol.info/blog/mcp-registry-preview/)、[GitHub MCP Registry](https://github.blog/ai-and-ml/github-copilot/meet-the-github-mcp-registry-the-fastest-way-to-discover-mcp-servers/) |
| **openskills 通用加载器** | npm `openskills`：universal skills loader，跨 Claude/Codex 等 agent 装载 SKILL.md | [openskills npm](https://www.npmjs.com/package/openskills)、[numman-ali/openskills](https://github.com/numman-ali/openskills) |
| **技能市场/跨运行时库** | agent-skills-marketplace、frankxai/claude-skills-library（MULTI_RUNTIME）、skills.sh 生态 | [agent-skills-marketplace](https://github.com/DiversioTeam/agent-skills-marketplace)、[claude-skills-library](https://github.com/frankxai/claude-skills-library/blob/main/MULTI_RUNTIME.md) |
| **协议全景** | MCP（工具/技能）、A2A（agent 间）、ACP/AGNTCY（agent 通信）并存；Clawbot 整理了 Skill API 标准谱系 | [4sysops 协议对比](https://4sysops.com/archives/comparing-ai-protocols-mcp-a2a-agp-agntcy-ibm-acp-zed-acp/)、[Clawbot Skill API 标准](https://clawbot.ai/wiki/skills/skill-api-standards-and-specifications.html) |

### 3.3 路由与能力选择（参谋本部中枢的技术选型参考）

| 发现 | 内容 | 来源 |
|---|---|---|
| **语义路由成熟化** | vLLM `semantic-router`：用语义向量做意图→路由（取代纯关键词触发词）；开源 LLM 路由 agent 常用"LLM 智能选择 + 规则兜底"双轨 | [semantic-router](https://github.com/vllm-project/semantic-router)、[langgraph-llm-router-agent](https://github.com/jkmaina/langgraph-llm-router-agent) |
| **动态 MCP 装载** | `dynamic-mcp`：按需从注册表装载 MCP 工具，避免全量挂载开销 | [dynamic-mcp](https://github.com/jritsema/dynamic-mcp) |
| **技能推荐系统** | `claude-ctx`：知识图谱 + 技能/agent 推荐 + 质量门禁 | [claude-ctx](https://pypi.org/project/claude-ctx/0.7.4/) |

### 3.4 技能蒸馏、自进化（进化主帅的学术/工程弹药）

| 发现 | 内容 | 来源 |
|---|---|---|
| **AutoSkill**（孙立超团队） | Experience-Driven Lifelong Learning via Skill Self-Evolution，刷新多项基准 | [AutoSkill 论文](https://arxiv-org.ezproxy.obspm.fr/html/2603.01145v2) |
| **OpenSkill** | Agent 自进化新范式：在线轨迹蒸馏出可复用技能 | [OpenSkill 解读](https://hub-assets-cache.baai.ac.cn/view/55375) |
| **MemSkill** | 学习并进化"记忆技能"的自进化 agent | [MemSkill](https://github.com/ViktorAxelsen/MemSkill) |
| **spark-skills** | Evidence Over Plans：在线轨迹验证的 skill 蒸馏（与无极"行为验证才叫融合"原则完全同构） | [spark-skills](https://github.com/EtaYang10th/spark-skills) |
| **Evolving Programmatic Skill Networks** | 程序化技能网络演化 | [arXiv 2601.03509](https://arxiv-org.ezproxy.obspm.fr/html/2601.03509v2) |

### 3.5 记忆与上下文（参谋本部上下文预算的补强）

| 发现 | 内容 | 来源 |
|---|---|---|
| **Agent 记忆三代演进** | RAG → 记忆图（Mem0g）→ 混合召回；mem0 / Zep / LangMem / Letta 横评（向量/图/混合延迟基准） | [CSDN 记忆架构横评](https://blog.csdn.net/LDZKKJ/article/details/162525894)、[Zylos 记忆架构](https://zylos.ai/zh/research/2026-04-05-ai-agent-memory-architectures-persistent-knowledge/) |
| **DSH 记忆插件已验证路径** | hermes-memory / memory-evolve / continual-evolve 已在 DSH 跑通跨会话记忆 | 见 3.1 |

### 3.6 飞书 MCP 生态（飞书域融合的候选资产）

| 发现 | 内容 | 来源 |
|---|---|---|
| **Feishu-MCP** | 飞书文档/任务 MCP 服务器 + CLI + Skill 双形态，兼容 Cursor/Claude Code | [Feishu-MCP](https://github.com/cso1z/Feishu-MCP) |
| **lark-mcp / lark-master-mcp** | Lark Open Platform MCP Server 社区实现 | [lark-mcp](https://github.com/haudnn/lark-mcp)、[lark-master-mcp](https://www.npmjs.com/package/@ivygain/lark-master-mcp) |
| **官方飞书 MCP** | PulseMCP 收录官方 Feishu/Lark MCP Server | [PulseMCP lark-feishu](https://www.pulsemcp.com/servers/lark-feishu) |

---

## 4. 融合候选裁决（沿用进化主帅规则：融合提案 / 仅借鉴 / 拒绝 / 待证）

| 候选 | 结论 | 理由 | 融合方式 |
|---|---|---|---|
| DSH 官方 MCP 客户端 + Agent Skills 规范 | **融合提案** | 官方已内置，MCP 2026 已把技能纳入规范；直接成为 capability-mount 的 MCP 通道 | 参谋本部路由层输出 `mcp_candidates`，按需装载 MCP 服务器 |
| 社区插件集市（awesome-dsh-plugin 270+） | **融合提案** | 现成弹药库；进化主帅的"外部来源清点"第一目标 | 能力审计 workflow 定期盘点 → 蒸馏候选 |
| hermes / memory-evolve / continual-evolve | **融合提案（蒸馏）** | 与本系统"经验沉淀/自进化"同向；但三选一蒸馏，不并排堆叠 | 蒸馏为统一的"记忆与经验"主帅能力 |
| superpowers-dsh | **融合提案（部分）** | TDD/调试/规划原子可直接进 code 能力域 | 作为 code 能力的候选原子，过行为探针 |
| semantic-router / 双轨路由 | **融合提案** | 用语义向量增强触发词路由；保留规则兜底（与无极确定性优先一致） | 路由层加语义召回层（可选开启） |
| MCP Registry / GitHub MCP Registry | **融合提案（检索源）** | 官方发现机制，作为"新 MCP 候选"来源 | 进化主帅的"来源池"之一 |
| openskills / agent-skills-marketplace | **仅借鉴** | 跨运行时装载对 DSH 是多余的（DSH 有原生 skill 系统）；但"技能市场元数据"格式可借鉴 | 只借鉴 catalog 结构，不引入新运行时 |
| Feishu-MCP / lark-mcp 社区实现 | **待证** | 本机已有官方 lark-cli 27 技能；社区 MCP 需对照验证 API 能力与授权边界 | 与官方 lark 通道做对照探针后再裁决 |
| A2A / ACP / AGNTCY 协议 | **拒绝（当前）** | DSH 有原生 subagent/workflow，跨平台 agent 协议暂无必要；生态未定形 | 列入观望清单，不实现 |
| AutoSkill / OpenSkill / MemSkill / spark-skills | **仅借鉴（方法）** | 学术方法给进化主帅提供"轨迹验证蒸馏"的形式化依据；不引入其代码 | 把"在线轨迹验证"原则写进进化主帅规则 |
| mem0 / Zep / LangMem 等 | **仅借鉴** | DSH 已有 goal/session 持久化 + 社区记忆插件；不引入外部记忆后端 | 借鉴分层/混合召回设计，选型时对照 |

---

## 5. 目标架构（v0.1 规划）

### 5.1 组成

```
无极军团 DSH 系统 = 1 个 agent preset + 1 个宿主路由插件 + N 个能力插件/skill + 1 套治理工具
```

| 组件 | 平面 | 职责 |
|---|---|---|
| `wuji-preset`（agent preset） | 会话 | 参谋本部中枢 persona + 路由热路径规则（SKILL.md 化）；阿极=会话对话层 |
| `wuji-router`（宿主插件） | 宿主 | capability-mount 确定性路由：skill_candidates / plugin_candidates / mcp_candidates；输出"只选一条主链路"的决策注入 `systemPrompt.section()` |
| `wuji-registry`（数据） | 宿主/工作区 | DSH 版 manifest 目录：能力登记 + 触发词 + 入口 + 验证探针 + 生命周期 |
| `wuji-evolution`（工具/插件） | 宿主 | 进化主帅：能力审计 workflow → 蒸馏 → `cordis_define` 定义新插件 → 行为探针验证 → 进热路径/退役 |
| `wuji-officers`（工具） | 宿主 | 官员契约触发 → 隔离 subagent 审查席 → 建议回执（白帽/质检/审计/合规/根因/性能） |
| `wuji-gate`（工具/瀑布） | 宿主 | 保卫科：`tools/pre-execute` 确定性门禁 + 审计记录 |
| `wuji-memory`（插件） | 宿主 | 经验沉淀（蒸馏自社区记忆插件） |

### 5.2 一条主链路（小白视角）

```
用户："帮我整理飞书里那个表格，做成PPT发群里"
  → 阿极接收（不暴露任何技能术语）
  → 参谋本部路由：lark-sheets(表格) → presentation(PPT) → lark-im(发群)
       （skill_candidates / plugin_candidates / mcp_candidates 各至多选一）
  → capability-mount：自动装载 lark-sheets skill + 演示能力插件
  → 执行（subagent/工作流）→ 验证探针 → 阿极汇报
  → 用户全程只看到业务语言与结果
```

### 5.3 关键技术决策

1. **路由 = 确定性优先 + 语义兜底**：触发词（沿用 17 个 manifest）→ 未命中走语义路由（semantic-router 思路）→ 再未命中才问用户（业务语言）。
2. **MCP 按需装载**：借鉴 dynamic-mcp，不预挂全量 MCP；参谋本部只在路由命中时装载。
3. **融合必须过探针**：callable → behavior-verified（真实产物 + SHA-256），与 spark-skills "evidence over plans" 同构；不过门禁不进热路径。
4. **官员只有建议权**：隔离 review 子代理，首轮互不可见，建议回执 → 用户采纳 → 阿极写入。
5. **上下文预算**：沿用 2.1 预算（契约≤2048B、共享≤4096B 等），记忆走蒸馏后的经验图而非全量历史。

---

## 6. 分阶段实施路线（规划，未动工）

| 阶段 | 内容 | 产出 | 依赖 |
|---|---|---|---|
| **P0 地基** | ① 能力注册表 v1（导入 17 manifest + 本机 27 lark + dashi-ppt + MCP 清单）② 现有 skill description 语义化 ③ wuji-preset 骨架（参谋本部 persona + 路由热路径 SKILL） | 注册表 JSON + preset 目录 | 无 |
| **P1 路由** | wuji-router 宿主插件（确定性路由 + capability-mount 决策注入）+ 保卫科门禁接入 approval 栈 | 可运行的路由插件 | P0 |
| **P2 融合** | wuji-evolution：能力审计 workflow（聚类 270+ 社区插件 + 本机技能）→ 首批融合候选（飞书域、演示域、内容提取域）→ cordis_define 定义 + 探针验证 | 首批融合插件 | P1 |
| **P3 官员** | wuji-officers：契约触发 + 隔离 subagent 审查席 + 建议回执流程 | 官员机制 | P1 |
| **P4 记忆与自进化** | wuji-memory 蒸馏（对照 hermes/memory-evolve/continual-evolve）+ 失败经验闭环（tools/result 事件） | 记忆插件 + 经验回路 | P2 |
| **P5 治理与发布** | 生命周期状态机、审计、用户反馈回路（messageFeedback）、文档化 | 治理工具 + 文档 | P2-P4 |

---

## 7. 风险与对策

| 风险 | 等级 | 对策 |
|---|---|---|
| 路由错误装载能力 → 误导用户 | 高 | 路由只输出"候选+一条主链路"，执行前由阿极按业务语言确认高风险项；探针验证后才进热路径 |
| 融合插件质量不过关 | 中 | 强制行为探针 + SHA-256 证据；不过门禁一律不挂载 |
| 社区插件来源不可信 | 中 | 进化主帅裁决规则：先清点来源/许可证/入口，只蒸馏最小可调用切片 |
| MCP 生态变动（A2A/ACP 竞争） | 低 | 只依赖官方 MCP + Agent Skills 规范；协议之争列入观望，不押注 |
| 上下文膨胀（技能/候选堆积） | 中 | 沿用 2.1 预算 + 只装载被路由选中的能力；记忆走经验图 |
| 与现有 27 个 lark 技能冲突 | 低 | 飞书域融合以"统一入口 + 域路由"方式收敛，不删除已验证的官方 lark-cli 通道 |

---

## 8. 结论

1. **可行，且时机很好**：DSH 官方已内置 MCP 客户端与 Cordis 插件系统，社区已产出记忆/自进化/集市等成熟拼图；无极军团要做的不是从零造轮子，而是把"参谋本部中枢 + 能力路由 + 进化主帅 + 独立官员"这一组织架构落到 DSH 的插件平面上。
2. **核心差异化 = 系统级自动路由 + 进化闭环**：这正是小白无感调用（capability-mount 只选一条主链路）与能力持续变强（蒸馏融合 + 行为验证）两个初心的直接实现。
3. **最优先的两步**：P0 能力注册表（把 17 manifest + 本机能力统一登记）+ P1 wuji-router（把路由做成宿主插件）。这两步不动任何现有技能，纯增量，风险最低。
4. **需要外部融合的首选**：DSH 官方 MCP 客户端（MCP 通道）、社区插件集市（来源池）、记忆插件蒸馏（经验沉淀）、semantic-router 思路（路由增强）；飞书社区 MCP 与 A2A 协议列为待证/观望。

---

## 附：调研来源索引

- DSH 官方：https://github.com/deepseek-ai/deepseek-harness · https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.zh.md · packages/mcp/mcp-client · examples/mcp-memory
- DSH 社区：awesome-dsh-plugin（270+）· awesome-deepseek-harness · dsh-hermes-memory · dsh-memory-evolve · dsh-continual-evolve · superpowers-dsh
- 技能/MCP 标准：MCP Registry 官方博客 · GitHub MCP Registry · modelcontextprotocol.io build-with-agent-skills · openskills · agent-skills-marketplace · 4sysops 协议对比 · Clawbot Skill API 标准
- 路由：vllm-project/semantic-router · langgraph-llm-router-agent · dynamic-mcp · claude-ctx
- 自进化/蒸馏：AutoSkill · OpenSkill · MemSkill · spark-skills · Evolving Programmatic Skill Networks
- 记忆：CSDN Agent 记忆三代演进 · Zylos 记忆架构
- 飞书 MCP：Feishu-MCP · lark-mcp · PulseMCP lark-feishu
