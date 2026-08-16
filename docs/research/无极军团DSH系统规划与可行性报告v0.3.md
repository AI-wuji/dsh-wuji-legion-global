# 无极军团 × DeepSeek Harness 系统规划与可行性报告

> 版本：v0.3（规划稿，未实施）
> 日期：2026-08-15
> 性质：可行性报告 + 实施蓝图。本文只规划，不改动任何运行配置或代码。
> 依据：**[无极军团设计资产清点与DSH适配矩阵](./无极军团设计资产清点与DSH适配矩阵.md)**（v1.0，权威基线，以下裁决统一引用其行号，如 C1/O1/E2）+ DeepSeek Harness 运行时实测 + 2026 年外部生态全网调研。
> v0.3 变更：① 全文裁决改为引用资产矩阵行号，不再重复解释机制；② 上下文图谱并入矩阵 C1-C16；③ 增加"迭代纪律"：任何新想法先查矩阵，不在矩阵内的新增一行，不依赖回忆。

---

## 0. 一句话定位

> **在 DeepSeek Harness 上重建"参谋本部中枢制"的无极军团：系统级自动路由（capability-mount）让小白用户无感调用 skill/插件/MCP；进化主帅机制持续蒸馏、融合同类能力为更强的 DSH 原生插件；独立官员按契约对高风险交付做真实验证。**

---

## 1. 组织架构（资产矩阵：O1-O7）

```
用户（小白，无技能概念）
   │  一句话业务需求
   ▼
┌─────────────────────────────────────────────────────┐
│ 阿极（前端，O2）—— DSH 会话层                          │
│   用户交流 / 需求澄清 / 结果汇报 / 采纳官员建议           │
└─────────────────────────────────────────────────────┘
   │ 需求快照（版本化）
   ▼
┌─────────────────────────────────────────────────────┐
│ 参谋本部（主 Skill 中枢，O1，唯一预加载）                 │
│   task-routing → capability-mount → deterministic-exec │
│   = 系统级自动路由：skill_candidates / plugin_candidates │
│     / mcp_candidates → 只选一条主链路，用户无感知         │
└─────────────────────────────────────────────────────┘
   │ 分派
   ▼
┌─────────────────────────────────────────────────────┐
│ 各级主帅（O3，按需挂载）                                 │
│   · 进化主帅：能力谱系 / 蒸馏 / 融合 / 退役              │
│   · 保卫科：安全门禁（O6，确定性）                        │
│   · 能力域主帅（= v4 部门制 O5 的语义延续）               │
└─────────────────────────────────────────────────────┘
   │
   ▼
┌─────────────────────────────────────────────────────┐
│ 独立官员（O4，按契约触发，隔离审查，只有建议权）            │
│   白帽 / 质检 / 审计 / 合规 / 根因 / 性能 / 综合          │
└─────────────────────────────────────────────────────┘
   │ 执行证据 + 验收证据（O7 用户最高权威）
   ▼
工兵/部门执行层（O5）—— DSH subagent / workflow / skill / MCP
```

| 原角色 | DSH 落点 | 矩阵行 |
|---|---|---|
| 参谋本部中枢 | agent preset + 宿主路由服务（systemPrompt.section / agent/pre-step） | O1 |
| capability-mount | skill 目录语义化 + skills 注册表 + MCP 客户端动态装载 | O1/G2 |
| 阿极前端 | 会话对话层（模型主线程） | O2 |
| 进化主帅 | wuji-evolution 工具 + cordis 动态插件管道 | O3/E2-E9 |
| 保卫科 | tools/pre-execute 瀑布 + approval 栈 | O6/G8 |
| 独立官员 | 隔离 subagent 审查席（wuji-officers） | O4/G3 |
| 上下文图谱 | sessionProjections 原生服务 | C1-C16 |

---

## 2. 现状与差距

### 2.1 已就位（实测确认）

- DSH 官方：Cordis 插件系统、skills/tools 注册表、subagent/workflow/goal/jobs、plan mode、approval 栈、sandbox、web 服务、动态插件（define/run/stop/undefine）+ Inspect 只读查询。
- DSH 官方 MCP 客户端已内置（packages/mcp/mcp-client）+ examples/mcp-memory。
- **DSH 原生投影服务 sessionProjections**（矩阵 C1）——goal/todo/token-meter/subagent/session-title/plan-mode 均已在用。
- 无极资产：17 能力包 manifest、wuji.exe 路由（实测可运行）、行为探针、融合基因组、3.0 图谱与进化主帅规则、2.1 图谱投影命令（有严格调用链）。
- 本机已装：27 个 lark-* + dashi-ppt + wuji-legion-codex-2-1 + cordis 开发技能。

### 2.2 核心缺口（对应矩阵行）

| # | 缺口 | 矩阵行 |
|---|---|---|
| G1 | 无系统级能力路由层 | O1 |
| G2 | 无能力注册表（DSH 版 manifest） | E1/C7 |
| G3 | 无融合管道（蒸馏→定义→验证→热路径） | E2-E9 |
| G4 | 无官员审查席 | O4/G3 |
| G5 | 无失败经验闭环 | C9 |
| G6 | 小白入口未抽象 | O2/O7 |
| G7 | 无无极领域投影单元（需求/执行/官员建议） | C1-C6 |

---

## 3. 外部生态调研：可融合的新东西（2026 年视角）

> 融合与否的裁决统一走矩阵 E6 四态；下表候选均在矩阵第 3 节原报告中有来源链接（详见 v0.1 报告 §3 与 §4，此处保留裁决摘要）。

| 候选 | 结论 | 融合方式 |
|---|---|---|
| DSH 官方 MCP 客户端 + Agent Skills 规范（MCP 2026） | 融合提案 | capability-mount 的 mcp_candidates 通道 |
| 社区插件集市（awesome-dsh-plugin 270+） | 融合提案 | 进化主帅来源池第一目标 |
| hermes / memory-evolve / continual-evolve | 融合提案（蒸馏三选一） | 蒸馏为统一记忆/经验主帅能力 |
| superpowers-dsh | 融合提案（部分） | code 能力域候选原子 |
| semantic-router / 双轨路由 | 融合提案 | 路由层语义召回层（可选） |
| MCP Registry / GitHub MCP Registry | 融合提案（检索源） | 来源池之一 |
| openskills / agent-skills-marketplace | 仅借鉴 | 只借鉴 catalog 元数据格式 |
| Feishu-MCP / lark-mcp 社区实现 | 待证 | 与官方 lark 通道对照探针后再裁决 |
| A2A / ACP / AGNTCY 协议 | 拒绝（当前） | DSH 有原生 subagent/workflow |
| AutoSkill / OpenSkill / MemSkill / spark-skills | 仅借鉴（方法） | "轨迹验证蒸馏"原则写入进化主帅规则 |
| mem0 / Zep / LangMem | 仅借鉴 | 借鉴分层/混合召回设计 |

---

## 4. 目标架构（v0.3）

### 4.1 组成

```
无极军团 DSH 系统 = 1 个 agent preset + 1 个宿主路由插件 + N 个能力插件/skill + 1 套治理工具
```

| 组件 | 平面 | 职责 | 矩阵行 |
|---|---|---|---|
| `wuji-preset`（agent preset） | 会话 | 参谋本部 persona + 路由热路径规则；阿极对话层 | O1/O2/O7 |
| `wuji-router`（宿主插件） | 宿主 | capability-mount 确定性路由 + 决策注入 | O1/C2 |
| `wuji-registry`（数据） | 宿主/工作区 | DSH 版 manifest：登记/触发词/入口/探针/生命周期/热路径分类 | E1/C7/C14 |
| `wuji-projection`（插件） | 宿主 | 需求/执行/官员建议三个投影单元 | C1-C8 |
| `wuji-evolution`（工具/插件） | 宿主 | 融合管道：审计→蒸馏→define→探针验证 | E2-E9/G10 |
| `wuji-officers`（工具） | 宿主 | 官员契约触发 + 隔离审查席 + 建议回执 | O4/G3 |
| `wuji-gate`（工具/瀑布） | 宿主 | 保卫科门禁 + 审计记录 | O6/G6/G8 |
| `wuji-memory`（插件） | 宿主 | 经验沉淀 + 失败闭环 | C9/C13/C15 |

### 4.2 一条主链路（小白视角）

```
用户："帮我整理飞书里那个表格，做成PPT发群里"
  → 阿极接收（O2，不暴露任何技能术语）
  → 参谋本部路由（O1）：lark-sheets → presentation → lark-im
  → capability-mount：自动装载对应 skill/插件/MCP（至多选一主链路）
  → 执行（subagent/工作流）→ 验证探针（E3）→ 阿极汇报（O7）
  → 用户全程只看到业务语言与结果
```

### 4.3 关键技术决策

1. **路由 = 确定性优先 + 语义兜底**（O1 + semantic-router 借鉴）：触发词→语义→问用户（业务语言）。
2. **MCP 按需装载**（dynamic-mcp 思路）：不预挂全量 MCP。
3. **融合必须过探针**（E3）：callable → behavior-verified，与 spark-skills 同构。
4. **官员只有建议权**（O4/O7）：隔离盲审 + 用户采纳。
5. **上下文 = sessionProjections 稀疏投影**（C1-C16）：每角色一表、每调用只投影当前单元，完整历史留冷存储。

---

## 5. 分阶段实施路线（规划，未动工）

| 阶段 | 内容 | 产出 | 依赖 |
|---|---|---|---|
| **P0 地基** | ① wuji-registry v1（导入 17 manifest + 本机 27 lark + dashi-ppt + MCP 清单）② skill description 语义化 ③ wuji-preset 骨架 ④ **wuji-projection 三个投影单元先行注册（空 schema）** | 注册表 + preset + 投影骨架 | 无 |
| **P1 路由** | wuji-router（确定性路由 + capability-mount）+ wuji-gate 门禁接入 approval 栈 | 路由插件 | P0 |
| **P2 融合** | wuji-evolution：能力审计 workflow → 首批融合（飞书域/演示域/内容提取域）→ cordis_define + 探针 | 首批融合插件 | P1 |
| **P3 官员** | wuji-officers：契约触发 + 隔离 subagent 审查席 | 官员机制 | P1 |
| **P4 记忆** | wuji-memory 蒸馏（hermes/memory-evolve/continual-evolve）+ 失败经验闭环 | 记忆插件 | P2 |
| **P5 治理** | 生命周期状态机、审计、反馈回路、文档化 | 治理工具 | P2-P4 |

---

## 6. 风险与对策

| 风险 | 等级 | 对策 |
|---|---|---|
| 路由错误装载能力 | 高 | 候选+一条主链路，高风险项阿极按业务语言确认；探针后才进热路径 |
| 融合插件质量不过关 | 中 | 强制行为探针 + SHA-256；不过门禁不挂载（E3） |
| 社区插件来源不可信 | 中 | 进化主帅裁决：清点来源/许可证/入口，只蒸馏最小可调用切片 |
| 上下文膨胀 | 中 | sessionProjections 稀疏投影（C1）+ 热路径分类（C14）+ 预算（C15） |
| 与现有 lark 技能冲突 | 低 | 飞书域统一入口收敛，不删官方 lark-cli 通道 |
| 投影 schema 演化 | 低 | stateVersion 递增走宿主恢复机制（C1） |

---

## 7. 结论

1. **可行且时机很好**：DSH 已内置 MCP 客户端与 Cordis 插件系统，社区已产出记忆/自进化/集市拼图。
2. **核心差异化 = 系统级自动路由 + 进化闭环**：小白无感调用（O1 capability-mount）+ 能力持续变强（E2-E9）。
3. **上下文图谱确认有用且 DSH 已备好底座**：矩阵 C1-C16 全部落在 `sessionProjections` 原生机制上，无需移植 Go 图谱存储。
4. **最优先两步**：P0 注册表 + 投影骨架；P1 wuji-router。纯增量、风险最低。
5. **迭代纪律**：任何新想法先查资产矩阵；不在矩阵内则新增一行再讨论，不再依赖回忆。

---

## 附：调研来源索引

- 资产基线：`无极军团设计资产清点与DSH适配矩阵.md`（v1.0）
- DSH 官方：https://github.com/deepseek-ai/deepseek-harness · docs/architecture.zh.md · packages/mcp/mcp-client · examples/mcp-memory
- DSH 社区：awesome-dsh-plugin（270+）· dsh-hermes-memory · dsh-memory-evolve · dsh-continual-evolve · superpowers-dsh
- 技能/MCP 标准：MCP Registry 官方 · GitHub MCP Registry · modelcontextprotocol.io build-with-agent-skills · openskills
- 路由：semantic-router · dynamic-mcp · claude-ctx
- 自进化/蒸馏：AutoSkill · OpenSkill · MemSkill · spark-skills
