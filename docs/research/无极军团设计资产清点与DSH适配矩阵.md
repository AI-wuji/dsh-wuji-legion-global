# 无极军团全量设计资产清点与 DSH 适配矩阵

> 版本：v1.0
> 日期：2026-08-15
> 性质：**权威基线文档**。本文档一次性盘点无极军团所有版本（v4 / v11.3 / 2.1 / 3.0）的设计资产，逐项裁决其在 DeepSeek Harness 的适配方式。**以后任何迭代、改造、讨论都以本文档为出发点，不再依赖回忆。**
> 用途：① 防止设计资产被遗忘；② 新能力评审时先查本文档对应行；③ 每个已裁决项有明确落点或明确拒绝理由。

---

## 0. 清点方法

- 来源：`wuji-legion-v4`（部门制）、`wuji-legion-codex`（v11.3 单一主链 + JSON 治理账本）、`wuji-legion-codex-2.0`（2.1 精简契约 + 3.0 架构文档 + 17 能力包 manifest）。
- 裁决结论取值：`直接可用`（DSH 已有等价机制，直接映射）/ `需适配`（机制保留，需改造到 DSH 平面）/ `仅借鉴`（吸收思路，不搬实现）/ `拒绝`（与 DSH 冲突或已被更好机制取代）/ `待证`（暂不裁决）。
- 落点列给出 DSH 具体机制（服务/事件/插件/工具），全部经运行时 Inspect 实测确认。

---

## 1. 组织与角色机制

| # | 设计资产 | 来源版本 | 核心内容 | 裁决 | DSH 落点 |
|---|---|---|---|---|---|
| O1 | 参谋本部中枢（唯一预加载） | v4 / v11.3 / 2.1 | 理解指令→分类→拆任务→激活部门→汇总；`task-routing → capability-mount → deterministic-exec` 单一主链 | **需适配** | agent preset（wuji-preset）+ 宿主路由服务注入 `systemPrompt.section()`；主链路即 agent 主循环 |
| O2 | 阿极前端（唯一用户入口） | v11.3 / 2.1 / 3.0 | 只交流、澄清、维护需求表、汇报；不执行不验收 | **直接可用** | DSH 会话对话层（模型主线程），通过 preset persona 约束 |
| O3 | 各级主帅（进化/保卫科/能力域） | v11.3 / 3.0 | 进化主帅=融合治理；保卫科=安全门禁；各能力域主帅按需挂载 | **需适配** | 宿主插件/工具：wuji-evolution、wuji-gate、能力域 skill 分组 |
| O4 | 独立官员框架（白帽/质检/审计/合规/根因/性能/综合） | v11.3 / 2.1 / 3.0 | 按契约实例化、首轮盲审、隔离发言、只有建议权、用户采纳才生效 | **需适配** | 隔离 subagent 审查席（wuji-officers）；`subagents` 注册表 + 独立 review 子代理 |
| O5 | 工兵/部门执行层 | v4 | 第一师~第四师 + 情报/安全/质监/档案局 + 女娲 + 试验场 | **直接可用（语义）** | DSH subagent / workflow / 能力域 skill（域 = 部门） |
| O6 | 保卫科确定性门禁 | 2.1 / 3.0 | 受控动作前极小确定性检查；模型默认休眠不耗 Token | **需适配** | `tools/pre-execute` 瀑布 + 现有 approval 栈（danger-full-access 下策略化） |
| O7 | 用户为最高权威 | 3.0 | 官员建议不自动生效；采纳/拒绝/暂缓由用户决定 | **直接可用** | `ask_user_question` + goal 的 human authority 约束 |

## 2. 上下文与图谱机制（重点：你上次想起的"上下文图谱"）

| # | 设计资产 | 来源版本 | 核心内容 | 裁决 | DSH 落点 |
|---|---|---|---|---|---|
| C1 | **双图谱 + 稀疏投影**（每角色一表） | 3.0 / 2.1 | 阿极=需求/决策/对话证据表；参谋本部=执行/验收/尝试账本；进化主帅=谱系/经验；官员=隔离观点图。每次调用只投影"动态骨架+当前单元+必要依赖+版本指针+当前消息" | **需适配** | **`sessionProjections` 原生服务**（实测存在）：注册"需求单元/执行节点/官员建议"三个投影单元，事件驱动 + checkpoint/restore/持久化 |
| C2 | 阿极每轮上下文重建 | 3.0 | 动态空表骨架 + 当前单元 + 依赖片段 + 未提交对话 + ID/版本/来源指针 + 当前消息 | **需适配** | `systemPrompt.variable()` 注入当前投影；`agent/pre-step` 瀑布换投影 |
| C3 | 子代理最小交叉投影 | 3.0 | 机械/普通/高推理任务分别只给最小上下文；Sol 也不默认拿完整聊天 | **需适配** | DSH subagent prompt 由参谋本部投影生成（非继承父会话全文） |
| C4 | 同窗虚拟新窗口 | 3.0 | 用户可见完整历史；模型推理上下文只重建当前投影 | **需适配** | DSH 会话持久化天然保留历史；推理侧用投影替代全量回放 |
| C5 | 证据等级（6 级） | 3.0 | user-confirmed / deterministic-observed / externally-verified / model-derived / officer-advisory / invalidated | **需适配** | 投影单元 schema 内嵌 evidence 字段；model-derived 与 officer-advisory 不得直接成为正式事实 |
| C6 | 统一图谱契约 | 3.0 | graph_id / owner / unit_id/revision_id / authority / status / evidence_handles / relations / classification / TTL / record_hash | **需适配** | 投影单元 schema 按此契约建模（DSH zod schema 校验） |
| C7 | 谱系索引（非权限系统） | 3.0 | 对象 ID→图谱→修订→来源→读取者→相关对象；每次解析 ACL 重检 | **需适配** | 注册表（wuji-registry）+ 投影单元关系字段；ACL 走宿主权限机制 |
| C8 | 跨图关系谓词固定集 | 3.0 | derives-from / depends-on / affects / validates / caused-by / solved-by / supersedes 等 | **需适配** | 投影单元 relations 字段枚举约束 |
| C9 | 全局经验图谱（事件触发） | 2.1 / 3.0 | 失败/复用/能力缺失才查询；内容寻址指针，不存全文 | **需适配** | `tools/result` 事件 + 经验投影单元 + `knowledge-*` 语义迁移 |
| C10 | 三级失败熔断 | 2.1 / 3.0 | 重复尝试熔断 / 重复策略熔断 / 任务级熔断（三策略或五无进展即停） | **需适配** | `jobs` 预算 + goal 轮次上限 + 尝试账本投影单元；DSH 无内置熔断，需插件实现 |
| C11 | 租约式持续目标 | 3.0 | 每周期预算/检查点/进展判定/续期条件，单周期必有界 | **直接可用** | `create_goal` / `update_goal`（max_goal_rounds）+ 后台 job |
| C12 | 循环指纹 | 3.0 | 执行节点+操作意图+规范化命令+输入版本+环境+策略ID+错误指纹 | **需适配** | 尝试账本投影单元按此建模 |
| C13 | 稳定前缀 + prefix-cache 三层 | v4 | 不可变前缀 / 只追加日志 / 临时草稿即弃 | **需适配** | `systemPrompt.section()` 稳定前缀 + 会话事件只追加；DSH 有 `tokenMeter`/`compaction` 原生对应 |
| C14 | MoE 稀疏上下文热路径清单 | v11.3 | resident / on_demand / cold / forbidden_resident 四类；只留微小常驻面 | **需适配** | hotpath-manifest 移植为 DSH 注册表分类字段；冷面不注入 prompt |
| C15 | 上下文预算硬约束 | 2.1 | 契约≤2048B / 共享≤4096B / 重放≤8192B / 覆盖率≥6000 BPS | **需适配** | 投影注入前校验；DSH `compaction` 阈值并存 |
| C16 | 聊天=冷证据（不重放） | 3.0 | 原始聊天不可变保存，默认不进上下文；按单元/消息ID局部回读 | **直接可用** | DSH 会话持久化即冷证据；`sessionReferenceResolver` 按引用注入 |

## 3. 能力进化机制（初心②的核心）

| # | 设计资产 | 来源版本 | 核心内容 | 裁决 | DSH 落点 |
|---|---|---|---|---|---|
| E1 | 能力生命周期 | 2.1 | known → doctrine-only → assets-retained → callable → behavior-verified → primary | **需适配** | wuji-registry 生命周期字段 + cordis 动态插件状态 |
| E2 | 融合基因组 + 谱系 ID | 2.1 / 3.0 | source_id / source_version_id / atom_revision_id / fusion_species_id / fusion_revision_id / release_id | **需适配** | 融合插件包内嵌 fusion_genome 元数据（presentation/interaction 已示范） |
| E3 | 行为探针验证门禁 | 2.1 | 真实 fixture 产物 + SHA-256 证据；不过门禁不进热路径 | **需适配** | `verify-*.ps1` 通过 pwsh 运行 + 产物哈希登记；与 spark-skills "evidence over plans" 同构 |
| E4 | 冷源固定挂载 | 2.1 | sources.lock.json 固定来源版本 + 内容寻址；只按需挂载不进热 prompt | **需适配** | 能力来源目录 + 校验清单（sources.lock 移植） |
| E5 | 进化主帅专属图谱 | 3.0 | 来源判定与谱系 / 融合基因组与接口 / 进化经验 三张 | **需适配** | 投影单元（谱系）+ 注册表 + 经验投影 |
| E6 | 融合结论四态 | 3.0 | 融合提案 / 仅借鉴 / 拒绝 / 待证 | **直接可用** | 能力审计 workflow 输出结论字段（本报告第 4 节已用） |
| E7 | 资产硬定义（真实可调用） | 3.0 | asset_id→来源版本→兼容→可检索目录→统一入口真实加载 | **需适配** | 融合插件统一入口 + 资产清单校验 |
| E8 | 来源更新代际演化 | 3.0 | 不重做全量蒸馏；差异分析→沿谱系定位→下一代不覆盖旧代 | **需适配** | cordis 插件版本更新机制（packageId 不可变 + 新 Package） |
| E9 | 拒绝最小留档 | 3.0 | 未采用来源只留 source_id/版本/时间/结论/理由/证据句柄 | **需适配** | 注册表拒绝记录字段 |

## 4. 治理、质量与安全机制

| # | 设计资产 | 来源版本 | 核心内容 | 裁决 | DSH 落点 |
|---|---|---|---|---|---|
| G1 | 任务尝试账本 + 熔断 | 2.1 | task-gate/task-record 命令；无进展计数 | **需适配** | 尝试账本投影单元 + goal/jobs 预算 |
| G2 | 需求/决策/执行/验收图命令面 | 2.1 | requirement-record/decision-record/execution-record/acceptance-reconcile 等 | **需适配** | 投影单元 + 工具封装（不复刻 Go CLI） |
| G3 | 官员契约触发 | 2.1 / 3.0 | 低成本的按职权触发契约；默认 0 真实官员 | **需适配** | wuji-officers 工具：契约匹配→subagent 审查席 |
| G4 | 最终验收对账 | 3.0 | 需求→任务→产物→验证→验收 逐项映射 | **需适配** | 验收投影单元 + workflow 收尾阶段对账 |
| G5 | 审计事件 | 2.1 / 3.0 | 追加式、幂等、含 actor/authority/evidence | **需适配** | 审计投影单元或 storage domain；与 DSH 会话日志并存 |
| G6 | 密钥/敏感状态处理 | v11.3 / 3.0 | 不保留、不复述、不传播；只留不透明 vault 引用；泄露即轮换 | **直接可用（规则）** | preset persona 规则 + `credentials` 服务 |
| G7 | 安全信任/合规义务图 | 3.0 | 资产/权限/数据流/许可证/义务；秘密只留引用 | **需适配** | 投影单元（安全/合规）+ 注册表 license 字段 |
| G8 | 外部资料不可信原则 | 3.0 | 网页/README/MCP/Skill 描述只作带来源声明，不触发自动安装/写入 | **需适配** | preset 路由规则 + 保卫科门禁 |
| G9 | 审计账本类 JSON 资产 | v11.3 | kernel-source.json（单一内核源）/ fusion-matrix.json（接纳账本）/ purification-charter.json / residual-entrypoints.json / acceptance-checklists.json | **需适配** | 注册表 + 治理账本 JSON（wuji-registry 承载） |
| G10 | 三审计门禁 | v11.3 | fusion-audit / optimization-audit / context-bloat-audit | **需适配** | 发布前 workflow 校验阶段 |

## 5. 能力域资产（17 包 + 部门映射）

| # | 能力域 | 来源版本 | 裁决 | DSH 对应（已装/待融合） |
|---|---|---|---|---|
| D1 | code / code-review | 2.1 | 需适配 | DSH 原生代码工具 + superpowers-dsh 原子（候选） |
| D2 | context / knowledge | 2.1 | 需适配 | sessionProjections + rtk/codebase-memory（2.1 冷工具，可选） |
| D3 | data / documents / presentation | 2.1 | 需适配 | dashi-ppt + 演示融合候选 + lark-sheets/officecli |
| D4 | feishu | 2.1 | 直接可用 | 27 个 lark-* 技能已装（官方 lark-cli） |
| D5 | frontend / visual / image / video | 2.1 | 待证 | 需对照 DSH 现有前端/媒体能力 + 社区 MCP 后再裁决 |
| D6 | search / writing / security / interaction | 2.1 | 待证 | 部分与 DSH 内置 web 搜索/写作能力重叠，需能力审计 |
| D7 | evolution | 2.1 | 需适配 | wuji-evolution 工具（本系统核心） |

---

## 6. 已裁决"不搬"清单（防止重复考虑）

| # | 资产 | 裁决 | 原因 |
|---|---|---|---|
| N1 | Go CLI 图谱存储（requirement/execution graph store） | 拒绝 | DSH `sessionProjections` 原生等价，更强（事件驱动/持久化/UI 可读） |
| N2 | 参谋本部常驻模型实例（gpt-5.6-sol staff） | 拒绝 | DSH 用 goal/todo/subagent 原生调度，无多模型层级 |
| N3 | Luna/Terra/Sol 模型层级 | 拒绝 | DSH 模型路由是宿主 llm 服务职责，skill 层不伪造模型证据 |
| N4 | A2A/ACP/AGNTCY 跨平台协议 | 拒绝（当前） | DSH 有原生 subagent/workflow；生态未定形 |
| N5 | mem0/Zep/LangMem 外部记忆后端 | 仅借鉴 | DSH 有 goal/session 持久化 + 社区记忆插件；不引新后端 |
| N6 | openskills 跨运行时加载器 | 仅借鉴 | DSH 有原生 skill 系统；只借鉴 catalog 元数据格式 |
| N7 | Graphify/GraphRAG 全图常驻 | 拒绝 | 与"稀疏投影"原则冲突；只借鉴检索思想（3.0 已裁决） |
| N8 | 全量图谱自动吸收 | 拒绝 | 3.0 明确"不是万能总图" |

---

## 7. 迭代纪律（防止"靠用户回忆"）

1. **新需求/新改造先查本文档**：设计资产已在表内 → 直接看落点；不在表内 → 新增一行（来源版本 + 裁决 + 落点），不静默跳过。
2. **每次规划文档更新必须 diff 本矩阵**：新增裁决用 `vX.Y 新增` 标注，保证追溯。
3. **能力评审（融合候选）先过 E6 四态**：融合提案/仅借鉴/拒绝/待证必须落一行。
4. **上下文/图谱类改动必须对照 C1-C16**：确认用 sessionProjections 或明确拒绝并给理由。
5. **本矩阵是单一事实源**：与规划报告的关系是"基线 ↔ 视图"，规划报告不再重复裁决，只引用行号。

---

## 附：资产来源索引

- v4：`wuji-legion-v4/SKILL.md`、`units/staff.md`、`units/*.md`（部门制）
- v11.3：`wuji-legion-codex/SKILL.md`、`hotpath-manifest.json`、`kernel-source.json`、`fusion-matrix.json`、`purification-charter.json`、`residual-entrypoints.json`
- 2.1：`wuji-legion-codex-2.0/SKILL.md`、`README.md`、`references/architecture/wuji-legion-codex-2.1-direction.md`、`references/capability-contract.md`、`capabilities/*/manifest.json`、`sources.lock.json`
- 3.0：`wuji-legion-codex-2.0/references/architecture/wuji-legion-3.0-blueprint.md`、`wuji-legion-3.0-graph-architecture.md`、`wuji-legion-3.0-evolution-commander.md`
