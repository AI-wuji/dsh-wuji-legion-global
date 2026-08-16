# 无极军团全量设计资产清点与 DSH 适配矩阵

> 版本：v1.8
> 日期：2026-08-15
> 性质：**权威基线文档**。本文档一次性盘点无极军团所有版本（v4 / v11.3 / 2.1 / 3.0）的设计资产，逐项裁决其在 DeepSeek Harness 的适配方式。**以后任何迭代、改造、讨论都以本文档为出发点，不再依赖回忆。**
> 用途：① 防止设计资产被遗忘；② 新能力评审时先查本文档对应行；③ 每个已裁决项有明确落点或明确拒绝理由。
> v1.8 变更：①-⑥ 同 v1.6。⑦ 女娲再评估补充淘汰链条与白帽裁决（角色=职能非人名）。⑧ 新增 §4.6 命名体系（三级建制：军团级阿极/参谋部/独立官员→师团级主帅→普通军人岗位，名字一律保留）。⑨ **独立官员权限硬边界（用户强制确认）：只有建议权、零修改权**——O4/§0.5 教训五/§7 迭代纪律三处同步；实施校验"用户采纳+阿极转写"两步缺一即越权。

---

## 0.5 实战教训：三条核心设计的落地走样（2026-08-15 复盘）

> 结论先行：**融合=查漏补缺、多子agent并行、子agent独立上下文——这三条设计意图全部正确且文档有明确原文；实战中全部走样在"落地层"，不是设计错误。** 教训是：设计→落地之间必须有验收闸门。

### 走样一：融合变成了"并列堆叠"，不是"互补合成"

- **设计原文（正确）**：进化主帅规则——"先理解各自的基本操作、适用条件、边界和资源，**再合成一条新的规则、算法或决策结构**"；"融合规则必须记录其**删除了哪些重复、吸收了哪些互补部分**、产生了什么父代原本没有的新决策能力"；"融合是创造新规则，**而不是让父代 Skill 轮流调用**……不是把父代提示并排塞进上下文"。
- **落地实况（走样）**：实测 `wuji-editable-deck/SKILL.md`，融合产物写成"3. Internally use PPT Master atoms… 4. Internally use Huashu… 5. Use Baoyu, Dashi, Guizang, Codex Grid, elite brand…"——**九个上游并列罗列、轮流调用**，正是文档自己禁止的形式。
- **根因**：融合产物没有"互补矩阵"验收（每个父代的优点/缺点/新决策结构必须显式成文），也没有与父代的持续对照验证，导致"合成新决策结构"退化成"目录堆叠"。
- **对新系统的强制要求**：融合提案必须附带**互补矩阵**（父代A优点 / 父代A缺点 / 父代B优点 / 父代B缺点 / 新决策结构如何取长补短），且融合前后在同一 fixture 上做产物对照（不降级才保留）。

### 走样二：并行被"预检强制串行"和"宿主逐个冷启动"双重压制

- **设计原文（正确）**：3.0"**没有依赖关系的执行节点可以并发**"；2.1"**Parallelize independent branches only**, with compact contracts"；search 能力 manifest 第一句就是"**parallel official, GitHub, and community evidence branches**"（正是用户说的"一个搜社区、一个搜 GitHub"）。
- **落地实况（走样）**：README 明确"`preflight_workers` **必须先于 `workers` 执行，两阶段禁止并行**"；且 Codex 宿主"并行"=主线程逐个创建真实子代理（每个完整冷启动 + 完整模型往返）。
- **根因**：① 规则层面把预检阶段强制串行；② 宿主机制不支持真正的同时执行（子代理冷启动是串行的）。
- **对新系统的强制要求**：DSH 的 `subagent`/`workflow`/`parallel()` 原生支持真并行，**预检与独立分支必须并行**；并行度受 jobs 预算控制而非"禁止并行"规则控制。

### 走样三：子代理独立了上下文，但主线程没省

- **设计原文（正确）**：2.1"子代理只获得本节点所需的任务契约、局部需求、接口、输入、输出、验收与失败回报；**不继承完整父聊天**"；3.0"参谋本部只从结构化需求快照开始，**不继承此前几十轮聊天**"。
- **落地实况（走样）**：子代理侧确实独立，但**主线程上下文没省**——3.0 文档自己承认"Codex 无法通过 Skill 强制移除主线程已发送历史……主窗口只能逻辑上优先使用图谱，不能保证物理清空"。
- **根因**：上下文削减只做了"子代理投影"一侧，没有覆盖"每次模型调用的主线程上下文"。
- **对新系统的强制要求**：投影必须进**每次模型调用的注入路径**（DSH `systemPrompt.variable()` + `agent/pre-step`），主线程历史用投影替换回放；同时用 tools/skills 注册表的 scope 机制按需呈现工具与技能（非图谱侧的大头）。

### 教训四：后置验证是慢的根源——必须在生成前限制住，不是生成后找问题（2026-08-15 用户明确指出）

> **用户原话**："我最怕的就是你的各种验证……一个任务要跑很久，都是处在各种验证上了。这不对。应该在生成前就限制住，而不是生成后再去找问题。"

- **设计原文（正确）**：3.0"执行边界是参谋本部和确定性运行时共同维护的**系统能力**，不由合规官动态指挥"；保卫科"在动作**发生前**触发一次极小的确定性防护门禁"——**全部是前置门禁，不是后置审查**。
- **落地实况（走样）**：v11.3 把"fusion-audit / optimization-audit / context-bloat-audit"三审计、行为探针、官员审查全部堆到**生成之后**，形成"生成 → 验证 → 不合格 → 重做 → 再验证"的循环——**每一步模型往返都是分钟级**，简单任务被拖到几小时。
- **根因**：把质量责任放在"事后检查"而不是"事前约束"。验证本身正确，但**数量、频次、位置全错了**——后置验证是有成本的（每次都是完整模型往返 + 可能重做），而前置限制是零成本到低成本的（写进契约、边界、门禁即可）。
- **对新系统的强制要求（最高优先级）**：
  1. **凡能用前置限制解决的，一律不做后置验证**：scope / 边界 / 约束 / 验收标准 / 禁止项在**生成前**写进任务契约（3.0 的 goal boundary lock："Before an execution goal starts, lock scope, target surface, finish line, out-of-scope, completion evidence"）。
  2. **验证降级为"生成时内嵌"**：能通过生成时检查（如渲染溢出、哈希一致性、schema 校验）就地处理的，就地处理，不单独开一轮验证。
  3. **后置验证只保留最小必要**：仅对高风险/不可逆动作（发布、付款、删除、权限）保留一次性门禁；普通任务默认 0 轮独立验证。
  4. **熔断前置**：预算、时间、轮次上限在开始前定死（jobs 预算 + goal max_rounds），不是跑起来后靠后置检查发现超时。

### 教训五：白帽反驳是核心机制，不是可选项——防止阿极/模型一味迎合用户（2026-08-15 用户明确指出）

> **用户原话**："还有个最核心的你忘记了。就是白帽，如果没有他，不管是之前的 codex 还是现在的你，都只是在迎合我，这不是我想要的，该反驳我就要反驳我呀，不能让我一直错下去呀。"

- **设计原文（正确）**：3.0 §12"白帽的特殊地位"——"白帽在命令链之外，**只服务于用户**"；"讨论阶段可以持续提出意见，直到用户确认执行方案"；"阿极和参谋本部听从用户，而不是听从白帽"，但**白帽必须指出假设、反例、风险、错误假设和遗漏**（§11 表格：白帽 = "从用户利益出发找反例、风险、错误假设和遗漏"）。v11.3 白帽职责："block fake fusion, split-brain routing……"。
- **落地实况（走样）**：白帽被当成"独立官员之一、按契约触发、默认 0 实例"——**默认不启动 = 实际永远不反驳**。阿极（模型）天然倾向迎合用户（顺从性偏差），没有强制反方检查时，用户的想法即使有缺陷也会被执行，直到后置验证才暴露，甚至永远不暴露。
- **根因**：把白帽定位成"可选审查席"而非"核心对话机制"。白帽的价值恰恰在于**前置**：在用户确认方案之前就提出反例和风险，而不是生成后审查。
- **对新系统的强制要求（最高优先级）**：
  1. **白帽是默认开启的前置机制**，不是"默认 0 实例"：在**方案确认前**（goal 启动前），阿极必须先输出一次"白帽视角"——假设 / 反例 / 风险 / 错误假设 / 备选方案；用户知情后再确认。
  2. **白帽=人格义务，不只靠独立实例**：DSH 单模型环境下，把"反方检查"写进 agent preset persona 的**强制义务**（"你必须在确认方案前指出用户的假设缺陷、反例、风险与备选；不允许一味迎合"），同时保留"用户明确要求独立白帽"时用隔离 subagent 做真实独立审查（O4）。
  3. **迎合是红线**：任何"用户说的我都照做、不提反例"的输出判定为不合格；白帽视角缺失 = 方案未完成，不得进入执行。
  4. **用户确认后白帽退出热路径**（3.0 原文）：白帽在讨论阶段持续作用，用户确认执行后退出，不干扰执行。
  5. **独立官员只有建议权、零修改权（2026-08-15 用户强制确认，全体系硬边界）**：官员不拥有写权/派发权/否决权/完成裁决权；不修改需求、执行、产物、图谱任何正式状态；输出只能是"建议回执"（建议 ID/职权/内容/证据/因果线），用户采纳后由阿极转写为正式状态；用户可采纳/拒绝/暂缓（O7）。

### 白帽同族项目来源池（2026-08-15 全网调研：业界"防迎合/反方检查"家族，叫法不同，机制同构）

> 用户确认：白帽=宪兵（白钢盔）。业界同类机制散落在不同名字下，全部围绕**对抗谄媚偏差（sycophancy）/ 反方检查 / 独立审查**，是新系统白帽机制的融合候选。

| 项目/方向 | 机制 | 与白帽的对应 | 来源 |
|---|---|---|---|
| **sycophancy（谄媚偏差）研究** | 学术上正式命名"模型迎合用户"这一偏差，有评测与缓解方法（X-Agent 跨语言审计、adversarial dialogues 对抗对话、user rebuttal 压力测试） | 白帽要防的正是 sycophancy；缓解方法=反方检查 | [X-Agent 论文](https://aclanthology.org/2025.emnlp-main.654/)、[Sycophancy under User Rebuttal](https://arxiv-org.ezproxy.obspm.fr/html/2509.16533v1)、[Sycophancy under Pressure](https://www.semanticscholar.org/paper/9f191856a8bdb0c263461f184c75a5aa39d47427) |
| **agent-review-panel**（Claude Code skill） | 4-6 个 AI 审查员辩论代码/方案，然后最高法院法官裁决；9 组自动信号 + 领域清单 + **anti-groupthink 防从众机制** | 与"白帽+综合官"最接近：多反方 + 汇总裁决 + 防集体思维 | [wan-huiyan/agent-review-panel](https://github.com/wan-huiyan/agent-review-panel) |
| **Proserpina** | 多智能体批判与**交叉质询**流水线（文档级严谨性），provider 无关交互图引擎 | "官员沿因果线扩散 + 交叉质询"的实现参考 | [Industrial-Algebra/Proserpina](https://github.com/Industrial-Algebra/Proserpina) |
| **debate-mcp** | MCP 服务器：Skeptic（怀疑派）vs Steelman（最强论证派）对抗辩论，web 检索支撑，**确认偏误攻击** | 白帽=怀疑派；Steelman=反方最强者论证（避免白帽变纯抬杠） | [grzesir/debate-mcp](https://github.com/grzesir/debate-mcp) |
| **RedDebate / Multi-Agent Debate** | 多智能体红队辩论产生更安全回答；dual-agent debate（CRAwDAD）增强推理 | "多官员首轮盲审 + 辩论"的形式化 | [RedDebate](https://arxivlens.com/paperview/viewpdf/reddebate-safer-responses-through-multi-agent-red-teaming-debates-9121-328a0efe)、[CRAwDAD](https://huggingface.co/papers/2511.22854) |
| **sycophancy-guard / counter / llm-rigor** | 结构性防谄媚提示词工具：检测诱导模式、注入补偿提示；counter=结构化的 anti-sycophancy prompts | 白帽作为 persona 义务的**提示词实现参考** | [sycophancy-guard](https://github.com/alkanfel1987/sycophancy-guard)、[counter](https://github.com/paia-m/counter)、[llm-rigor](https://github.com/luiscrsilveira/llm-rigor) |
| **Constitutional AI / Red Teaming** | 宪法原则约束模型行为；红队=攻击视角测试；两者结合=对抗宪法 | 白帽的反方视角 + 保卫科的确定性门禁可借鉴其"原则+对抗"双层 | [Red Teaming Anthropic Claude](https://www.trydeepteam.com/guides/guide-red-teaming-anthropic)、[Constitutional AI](https://redteams.ai/topics/training-pipeline/fine-tuning/constitutional-ai) |
| **确认偏误/从众（confirmation bias / groupthink）** | 多智能体决策研究：agent 会迎合社会影响（social influence in group decision-making） | 白帽机制要防的第二种偏差：不仅防模型迎合用户，还防官员互相同化 | [Conversational Agents as Catalysts for Critical Thinking](https://scirate.com/arxiv/2503.14263) |

**对新系统的融合裁决**：以上全部为**仅借鉴（方法/实现参考）**，不整套搬入——白帽的核心契约（用户确认前强制反方视角、防迎合红线、独立审查可选）已由教训五定义，业界项目只提供：① prompt 层的防谄媚措辞模板（counter/llm-rigor）；② 多反方+裁决的结构（agent-review-panel/RedDebate）；③ 怀疑派+Steelman 双角色（debate-mcp）；④ 防从众的首轮盲审规则（Proserpina/3.0 已有）。

---

## 0. 清点方法

- 来源：`wuji-legion-v4`（部门制）、`wuji-legion-codex`（v11.3 单一主链 + JSON 治理账本）、`wuji-legion-codex-2.0`（2.1 精简契约 + 3.0 架构文档 + 17 能力包 manifest）。
- 裁决结论取值：`直接可用`（DSH 已有等价机制，直接映射）/ `需适配`（机制保留，需改造到 DSH 平面）/ `仅借鉴`（吸收思路，不搬实现）/ `拒绝`（与 DSH 冲突或已被更好机制取代）/ `待证`（暂不裁决）。
- 落点列给出 DSH 具体机制（服务/事件/插件/工具），全部经运行时 Inspect 实测确认。

---

## 1. 组织与角色机制

| # | 设计资产 | 来源版本 | 核心内容 | 裁决 | DSH 落点 |
|---|---|---|---|---|---|
| O1 | 参谋本部中枢（唯一预加载） | v4 / v11.3 / 2.1 | **建制定位（2026-08-15 用户确认）：军团级中枢**。理解指令→分类→拆任务→激活部门→汇总；`task-routing → capability-mount → deterministic-exec` 单一主链。参谋部=军团级（管辖全部师团主帅），阿极=军团级用户接口，独立官员=军团级审查 | **需适配** | agent preset + 宿主路由服务注入 `systemPrompt.section()`；主链路即 agent 主循环 |
| O2 | 阿极前端（唯一用户入口） | v11.3 / 2.1 / 3.0 | 只交流、澄清、维护需求表、汇报；不执行不验收 | **直接可用** | DSH 会话对话层（模型主线程），通过 preset persona 约束 |
| O3 | 各级主帅（进化/保卫科/能力域） | v11.3 / 3.0 | **建制定位（2026-08-15 用户确认）：师团级**。进化主帅=融合治理；保卫科=安全门禁；各能力域主帅按需挂载。主帅=师团级，接受军团级参谋部分派；**主帅下可继续增设普通军人岗位**（如通讯员——负责该师团的信息传递/状态上报等单一职能） | **需适配** | 宿主插件/工具：融合治理、门禁、能力域 skill 分组；师团内普通岗位=该能力域下的子 skill/子工具 |
| O4 | 独立官员框架（白帽/质检/审计/合规/根因/性能/综合） | v11.3 / 2.1 / 3.0 | **执行形态（2026-08-15 用户确认+白帽裁决）**：默认 **MoE 单子agent 承载全部职权**（每次只激活一个职权，共享上下文骨架，启动成本≈0——实测多官员共同启动罕见，多子agent并行严重拖慢任务）。**官员审的是任务/产物，不是彼此**（审计审证据链、质检审产物、合规审许可、根因审失败），且 MoE 单官员档**一次只激活一个**——因此 MoE 档**不存在官员间串台问题**，"首轮互不可见防串场"协议（3.0）**仅适用于"会审档"（用户明确要求多堂会审时，才切真隔离多子agent 盲审）**，不适用于 MoE 档。**触发机制**：除白帽外全部**契约自动触发、无人工干预**（失败→根因官；高风险→保卫科；发布→审计/合规），用完整即退出。**权限硬边界（2026-08-15 用户强制确认）**：**独立官员只有建议权，没有任何修改权**——不拥有写权、派发权、否决权、完成裁决权；不修改需求/执行/产物/图谱任何正式状态；输出只能是"建议回执"，用户采纳后由阿极写入正式状态，采纳/拒绝/暂缓由用户决定（O7）。**白帽默认不独立启动**：反驳义务是人格层机制（preset persona 强制"方案确认前必须输出假设/反例/风险/备选，不允许迎合"），MoE 内/主线程视角切换，0 额外成本；仅用户明确要求"独立第三方意见/让白帽单独审"时才启动隔离子agent（罕见）。**命名源流（用户 2026-08-15 确认）**："白帽"取自军事建制中的**宪兵**（Military Police）——戴**白色钢盔**、执法纠错不徇私；对应职责=从用户利益出发找反例/风险/错误假设/遗漏，**反驳而非迎合** | **需适配** | wuji-officers 插件：单子agent 内职权模板切换（MoE 档，默认，契约自动触发）+ `subagents` 注册表隔离审查席（会审档，仅用户明确要求时）；**官员输出=只读建议回执，落盘前必须经用户采纳+阿极转写**；白帽默认=preset persona 强制反驳义务（人格层，非独立实例） |
| O5 | 工兵/普通军人岗位执行层 | v4 | 第一师~第四师 + 情报/安全/质监/档案局 + 女娲 + 试验场。**2026-08-15 重新定位**：v4 的"师"= 今天的"师团主帅"；主帅下的**普通军人岗位**（如通讯员）= 单一职能执行岗（信息传递/状态上报/单项采集），挂在具体主帅之下，不单列为平级单位 | **直接可用（语义）** | DSH subagent / workflow / 能力域 skill；普通军人岗位=主帅能力域下的职能化子 agent（角色=职能，非人名） |
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
| E2 | 融合基因组 + 谱系 ID | 2.1 / 3.0 | **融合=重生（2026-08-15 用户确认+强化）**：融合产物是**新生成的独立物种**，不属于任何一个前身——不是叠加（父代规则并列，错）、不是替换（只留最强，丢互补，错），而是**查漏补缺、取长补短的新个体**（对）。source_id / source_version_id / atom_revision_id / fusion_species_id / fusion_revision_id / release_id——父代只是"基因来源"（谱系），不是"零件库"；运行时调用的是新物种自己的完整决策结构 | **需适配** | 融合插件包内嵌 fusion_genome 元数据 + **互补矩阵**（父代优点/缺点/新决策结构）；cordis 插件包即"新物种"载体（presentation/interaction 已示范，但需按互补矩阵重审） |
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

## 4.5 各职能强化来源池（2026-08-15 全网调研，按角色职能匹配）

> 规则：以下项目均为**仅借鉴**（吸收方法/实现参考，不整套搬入）；每个来源必须回答"强化了哪个职能的哪个环节"。

### 进化主帅（E1-E9 强化）

| 项目 | 机制 | 强化的环节 |
|---|---|---|
| [Trace2Skill](https://arxiv-org.ezproxy.obspm.fr/html/2603.25158v5) | 把执行轨迹中的局部教训蒸馏为可迁移 Agent 技能；并行归纳 + 分层合并 + 可计算框架 | **蒸馏的可计算方法**：E2 融合的"从真实执行提取技能"有了形式化算法（比"人工读父代文档"强） |
| [SkillPacks（模块化知识融合）](https://mlanthology.org/iclr/2026/du2026iclr-knowledge/) | 大模型知识融合通过模块化 SkillPack，组合已有技能包产生新能力 | **融合=组合而非堆叠**：E2 的"互补合成"有了具体数据结构（模块化包 + 组合接口） |
| [Mem²Evolve](https://arxiv-org.ezproxy.obspm.fr/html/2604.10923v1) | 自进化 agent 通过**协同进化能力扩展 + 经验蒸馏**（双轨并行进化） | **进化双轨**：E5 的"谱系图 + 经验图"如何并行驱动 |
| [SkillX](https://www.emergentmind.com/topics/skillx) | 自动化 SkillKB 框架：技能知识库的组织/检索/更新 | **技能目录管理**：wuji-registry 的技能登记/检索结构参考 |
| ["什么时候 Agent 能自己写 skill"（蒸馏设计深度解析）](https://www.pconline.com.cn/focus/2123/21232912.html) | 中文深度解析：Agent 自我蒸馏技能的设计思路 | **蒸馏工程化**：E3 行为探针 + 蒸馏的落地设计参考 |

### 参谋本部（O1 调度职能强化）

| 项目 | 机制 | 强化的环节 |
|---|---|---|
| [调度器理论框架（Scheduler-Theoretic Framework for LLM Agent Execution）](https://ar5iv.labs.arxiv.org/html/2604.11378) | 从 Agent 循环到结构化图：把执行当调度器问题（优先级/抢占/预算） | **执行图调度**：参谋本部把任务图当调度问题而非"逐条执行清单" |
| [two-speed agent（快速路由器 + 有界微规划）](https://huggingface.co/datasets/John6666/forum2/raw/main/mcp_agent_arch_1.md) | 2-3s 轮次：**快路由器处理简单轮 + 有界微规划器处理复杂轮** | **直道优先（教训四）**：简单任务走快速路由不经过完整参谋本部——正是"简单问题不兜圈子"的实现 |
| [GAP 图并行工具调度](https://github.com/bug-ops/zeph/issues/2172) | 基于图的并行工具调度（LlmPlanner/DagScheduler） | **并行调度（教训走样二）**：DAG 并行调度的工程参考 |

### 根因官（O4 根因职能强化）

| 项目 | 机制 | 强化的环节 |
|---|---|---|
| [Microsoft OpenRCA（ICLR'25）](https://github.com/microsoft/OpenRCA) | 系统性评估 LLM 定位软件失败根因的能力 | **根因基准**：给根因官一个可复用的失败基准/评估法 |
| [MicroRCA-Agent](https://ar5iv.labs.arxiv.org/html/2509.15635) | 微服务根因分析 agent（多步调查） | **根因调查流程**：症状→假设→验证的 agent 化实现 |
| [Praxis（程序分析+可观测性）](https://arxiv-org.ezproxy.obspm.fr/html/2512.22113v3) | 程序分析与可观测性结合做根因分析 | **确定性根因**：不只是模型猜，结合工具观测 |
| [multiagent-debugger（CrewAI）](https://github.com/VishApp/multiagent-debugger) | 多 agent 调试：日志分析/代码追踪/根因分工 | **多视角根因**：多 agent 分工的工程实现 |

### 审计官（O4 审计职能强化）

| 项目 | 机制 | 强化的环节 |
|---|---|---|
| [EviBound（消除虚假声明的治理框架）](https://ar5iv.labs.arxiv.org/html/2511.05524) | 证据约束自治研究：每个结论必须绑定证据 | **证据闭环（G4）**：与"需求→任务→产物→证据"对账完全同构 |
| [EPI（Evidence Packaged Infrastructure）](https://github.com/mohdibrahimaiml/epi-recorder) | 把 AI 执行打包为证据（可审计单元） | **审计事件封装（G5）**：审计事件如何结构化打包 |
| [LOSCR（本地证据账本 + 确定性重放）](https://github.com/kadubon/loscr) | 检查"AI 辅助研发是否真验证过"，JSONL 证据账本 + 确定性重放 | **审计账本（G9）**：本地证据账本的实现参考 |
| [AuditableLLM（哈希链审计）](https://www.semanticscholar.org/paper/501f6091d5dd33ff70762f1184a2d1d79eb3f518) | 哈希链背书 + 合规感知的 LLM 审计框架 | **证据哈希（E3/G5）**：审计链的哈希背书设计 |
| [Thucy（关系库声明验证多 agent）](https://en.papernotes.org/AAAI2026/multi_agent/thucy_an_llm-based_multi-agent_system_for_claim_verification_across_relational_d/) | 多 agent 系统跨数据库验证声明 | **声明核验**：审计官核验用户/模型声明的参考 |

### 质检官（O4 质检职能强化）

| 项目 | 机制 | 强化的环节 |
|---|---|---|
| [groundtruth（human-in-the-loop 自动质检）](https://github.com/veltiq/groundtruth) | 每轮核对真实 diff、跑通、截图、自我修复后再完成；抓 agent 撒谎/漏做 | **质检=产物核对**：与"检查产物是否正确可用"（质检官定义）直接对应，且是**生成时内嵌**（符合教训四） |
| [Binary Bitmask Verification vs LLM Self-Review](https://zenodo.org/records/20200379) | 确定性位掩码验证比 LLM 自评更可靠（服务规模） | **确定性优先（教训四）**：能用确定性检查就不用 LLM 自评——验证慢的解法 |
| [TAG（测试驱动产物生成）](https://arxiv-org.ezproxy.obspm.fr/html/2607.02615v1) | 测试驱动的 agent 产物生成框架：先生成验证再生成产物 | **前置限制（教训四）**：验收标准前置到生成前 |
| [质检模型测试观察](https://dev.to/zxpmail/i-tested-3-models-as-ai-agent-quality-inspectors-the-stronger-the-model-the-more-valid-work-it-gl7) | 实测：越强的模型当质检员越会误拒有效工作 | **警示**：质检官不能过度拒收，否则拖慢任务（呼应"验证慢"） |

### 合规官（O4 合规职能强化）

| 项目 | 机制 | 强化的环节 |
|---|---|---|
| [license-compliance-checker（EU AI Act GPAI）](https://github.com/aiexponenthq/license-compliance-checker) | 多生态许可证 + AI 模型扫描（SBOM/SARIF/训练数据风险） | **许可证/合规扫描（G7）**：融合来源的许可证扫描自动化 |
| [SCANOSS 许可证数据/引擎](https://scanoss.com/license-dataset/) | 全 SPDX 目录 + 许可证引擎；已集成 Eclipse Theia | **SPDX 目录**：合规官的可信许可证数据源 |
| [agent-bom（SBOM for agent）](https://github.com/msaad00/agent-bom/commit/f1e0a45c71ba01ee28b75fb1d16b6c112c12ecbd) | 为 AI agent 生成 SBOM（依赖/许可/供应链） | **agent SBOM（G7）**：能力包依赖的物料清单 |

### 性能官（O4 性能职能强化）

| 项目 | 机制 | 强化的环节 |
|---|---|---|
| [agent-eval-harness](https://github.com/reaatech/agent-eval-harness) | 端到端 agent 评估：轨迹评估/工具使用正确性/每任务成本/延迟预算/金轨迹回归套件 | **性能基准（O4 性能官）**：延迟/成本/成功率的可复现评估 |
| [nexushive-agent-insights（OpenTelemetry）](https://github.com/aygp-dr/nexushive-agent-insights) | 用 OpenTelemetry 做 agent 可观测性 | **遥测**：DSH 已有 sessionTelemetry，可借鉴轨迹级观测 |
| [ruflo-cost-tracker](https://github.com/ruvnet/ruflo/blob/main/plugins/ruflo-cost-tracker/skills/cost-trend/SKILL.md) | 成本趋势追踪 | **成本监控**：token/费用趋势 |

### 保卫科（O6 门禁强化）

| 项目 | 机制 | 强化的环节 |
|---|---|---|
| [aguara（agent 供应链安全引擎）](https://github.com/garagon/aguara) | 开源 AI agent 与供应链信任安全引擎 | **供应链门禁（O6/G8）**：引入外部能力前的信任引擎 |
| [openclaw-skill-vetter-mcp](https://pypi.org/project/openclaw-skill-vetter-mcp/) | MCP 服务器：安装第三方 skill/插件前做安全审查 | **Skill/MCP 引入审查（G8）**：与保卫科"引入前查入口/脚本/依赖"直接对应 |
| [mcpsafetywarden](https://pypi.org/project/mcpsafetywarden/1.3.27/) | MCP 代理：行为画像 + 安全扫描 + 风险门控 + 安全执行 | **MCP 门禁（O6）**：行为画像式的 MCP 代理 |
| [JadeGate（5 层 MCP/技能验证）](https://github.com/JadeGate/jadegate) | 5 层安全扫描器：MCP 服务器与技能 | **多层验证（O6）**：门禁的分层实现 |

### 女娲再评估（2026-08-15 用户要求核实：人事/调度角色是否还有用）

**本地资产轨迹（核实）**：
- **v4/reasonix 版（原功能）**：`units/nuwa.md`——**女娲=人事部+调度**："接收参谋部需求 → 查人才匹配表（5 组 27 人：情报/安全/开发/视觉/决策）→ 为每个子任务匹配专家 → spawn_agent 并发派发 → 收集结果 → 交质监局验收+参谋部汇总"。匹配完直接 spawn，不经过中间层，最省 token。
- **v11.3 版（被剔除/改造）**：`wuji-legion-codex/units/nuwa.md`——女娲不再是独立官/主帅，降级为 `nuwa-preflight` **按需前置补位镜片**：只在能力缺口/专家归口不清/需新 skill/plugin/MCP 候选时出场，只出建议不出命令，不拥有路由/改动/验收/否决权。
- **淘汰链条（CHANGELOG 铁证）**：v9.4"专家不以量取胜；蒸馏不是叠加，新增入口前必须先判断能否合并进现有主责位"（70 卡→44 卡）；v9.5"师团万能主帅入口→内置多模式→独立白帽/质检/安全/合规审查"（44 卡→15 卡，**不再有 27 个具名历史人物**）；v9.3"不吸收外部组织命名，不新增重复入口，不让简单任务变慢"。
- **原项目（核实）**：[alchaincyf/nuwa-skill](https://github.com/alchaincyf/nuwa-skill)（GitHub 12k+ star）——"**你想蒸馏的下一个员工，何必是同事**。蒸馏任何人的思维方式——心智模型、决策启发式、表达DNA"。这是女娲的**角色蒸馏工具**：把人物/岗位的思维模式蒸馏成可调用的 skill。

**白帽裁决（2026-08-15）**：
- **用户"角色并行"想法本身正确**：同一任务不同角度并行（擅长社区搜社区、擅长 GitHub 搜 GitHub）= 3.0 独立分支并行 + search 能力 "parallel official/GitHub/community branches"——方向完全对。
- **被淘汰的是"历史人物角色壳"，不是"角色并行"想法**：把"社区搜索"职能绑定到"某历史人物 persona"上，产生三个问题——① **命名污染**（系统里出现 Mitnick/Snowden/Linus 等人名=外部组织命名大杂烩，正是用户反对的）；② **角色壳≠真实能力**（戴"Snowden 的帽子"不会真让模型更擅长搜索，是 persona 表演不是能力增强）；③ **量膨胀**（27 角色×skill 入口=入口噪音，每次选择都慢，呼应教训四）。
- **正确做法（保留想法、去掉角色壳）**：并行分支的**角色=职能**（"社区搜索专责""GitHub 搜索专责"），用 DSH subagent 独立上下文 + 职能化 prompt 注入，**命名用无极体系**（如"情报局-社区线"），不用历史人名。
- **"人事/调度"职责**：不需要单独的女娲——DSH subagents 注册表 + workflow 原生承担；"补位评估"职责并入进化主帅（capability-mount + wuji-evolution 的候选评估）。
- **"思维蒸馏"方法论**：有价值，并入融合机制 E2——nuwa 蒸"人"、我们融"能力"，同一哲学两种粒度，可借鉴其"如何把某类任务的最佳做法蒸馏成可调用技能"，但**不引入具名历史人物角色**。

### 三省六部（Edict）借鉴（2026-08-15 用户要求核实最新版）

**本地源码（核实）**：`_source\edict` 完整存在（[cft0808/edict](https://github.com/cft0808/edict)，MIT，OpenClaw 运行）——12 个 AI Agent：**皇上→太子（分拣）→中书省（规划）→门下省（审核封驳）→尚书省（派发）→六部+吏部（并行执行）→回奏**。核心设计：
- **制度性审核关卡（门下省）**：执行前强制质量关卡——"不受制约的权力必然会出错"（与白帽/门禁同哲学）
- **不可越级通信（架构强制）**：太子只能调中书，中书只能调门下/尚书，六部不能对外调用——权限矩阵白纸黑字，超权被拦截
- **吏部（libu_hr）= 人事**：Agent 管理/技能培训/考核评估——**与女娲"人事"职能惊人对应**（两者都演化出了"人事官"）
- **实时看板 + 完整审计轨迹 + 奏折归档**：任务全流程可视化、可审计

**裁决（白帽视角）**：
- **"制度性审核关卡"（门下省）值得借鉴**：这正是我们的**前置限制（教训四）+ 白帽强制反方**的制度化表达——DSH 上对应 `tools/pre-execute` 门禁 + 方案确认前的白帽视角。已并入 O6/G3。
- **"不可越级通信"（权限矩阵）**：DSH 有 `subagents` 所有权模型 + tools scope 机制，原生支持"谁只能调谁"；借鉴点是把**指挥链权限写成显式矩阵**（阿极只能写需求、参谋本部只能写执行、官员只能建议——3.0 已有，落成注册表约束）。
- **"人事/吏部"**：与女娲同理——在 DSH 上是**能力注册表 + 融合治理**的职能，不单设"人事官"。
- **"实时看板 + 审计轨迹"**：DSH 有 `sessionProjections`（UI 可读）+ 会话持久化 + messageFeedback，天然等价；可借鉴其"任务流转可视化"的设计。
- **结论**：三省六部的**价值不在"照搬官职"**（我们已有更精简的参谋本部制），而在其**制度性审核关卡 + 强制权限矩阵**这两个设计原子——已并入矩阵对应行。不引入其 12 agent 架构（与"官员 MoE 化 + 单主链"冲突）。**官职名（门下省/中书省等）不进入无极体系命名**，只作为设计出处记录。

## 4.6 命名体系（2026-08-15 用户强制要求：无极军团必须是独立体系，不是大杂烩补丁大集）

> **用户原话**："能用我们最直接现成的 dsh 项目取代更好。但是，我还是希望能用之前的名字。毕竟用别人的方式方法可以，但我们做的是独立的无极军团，所有的命名一定要是自己的一套体系，而不是大杂烩的补丁大集。"
> **用户补充（2026-08-15）**："请不要更改我现有的独立官员、阿极、参谋部、主帅名字，可以加入……参谋部其实是**军团级**的，主帅是**师团级**的，可以在某个主帅下面继续增加比如**通讯员**之类的普通军人岗位。"

**建制层级结构（三级，强制）**：
```
军团级（顶层，现有名字一律保留，不更名）
├── 阿极          —— 军团级用户接口（前端对话层）
├── 参谋部        —— 军团级中枢（调度/拆解/capability-mount，管辖全部师团）
└── 独立官员      —— 军团级审查（白帽/质检/审计/合规/根因/性能/综合，MoE 化执行）

师团级（接受军团级参谋部分派）
└── 各级主帅      —— 师团级负责人（进化主帅/内容主帅/视觉主帅/开发主帅/情报主帅/安全主帅等）

普通军人岗位（挂在某个主帅之下，单一职能执行岗，不单列为平级单位）
└── 如：通讯员    —— 某师团下的信息传递/状态上报岗
      侦察兵/采集员/传令兵 等可按需增设
```

**规则（强制）**：
1. **体系内组件/角色命名一律用无极自己的建制**：阿极 / 参谋本部 / 各级主帅 / 独立官 / 工兵 / 部门（情报局/质监局等）——这些是用户原创体系，保留并作为唯一命名源。**军团级现有名字（阿极/参谋部/独立官员）与师团级主帅名字一律不更改**，只允许新增普通军人岗位。
2. **新组件命名 = 无极/军前缀 + 职能语义**：如"军团调度""军团进化司""军团情报局-社区线"；**禁止**用外部组织名、项目名、人名给体系组件命名。
3. **外部项目（Trace2Skill/Edict/nuwa-skill/OpenRCA 等）只作为"来源池/借鉴记录"**：出现在 §4.5 来源池和 N 表"原因"列，标注方法出处；**不进入体系命名**。
4. **角色=职能，不是人名**：并行分支的角色是"社区搜索专责""GitHub 搜索专责"（职能化），不是"Snowden 去搜社区"（历史人物壳）。历史人物 persona 是表演不是能力，且造成命名污染。
5. **引用外部机制时用职能表述**：如"借鉴三省六部的制度性审核关卡"→ 体系内表述为"参谋本部前置审核（门下省式关卡）"，外部名只作注释。
6. **违规判定**：体系组件名出现外部组织/项目/人名 = 不合格，回退为无极体系命名。

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
| N9 | 女娲"人事部+调度"形态（v4/reasonix，27 位具名历史人物角色） | 拒绝（角色壳）；仅借鉴（调度职责归 DSH、思维蒸馏方法论归 E2） | "匹配专家→spawn 派发"由 DSH subagents/workflow 原生承担；"27 位历史人物 persona"是角色扮演壳，与真实能力脱钩（v11.3 已剔除）；nuwa-skill 的"思维蒸馏"方法论并入 E2 融合方法 |
| N10 | 三省六部 12-agent 官职架构（Edict） | 拒绝（官职层）；仅借鉴（制度性审核关卡 + 强制权限矩阵） | 与"官员 MoE 化 + 单主链"冲突；其"门下省强制审核"并入前置限制/白帽机制（O6/G3），"不可越级通信"并入 subagents 所有权约束，"实时看板+审计轨迹"由 sessionProjections 原生覆盖 |

---

## 7. 迭代纪律（防止"靠用户回忆"）

1. **新需求/新改造先查本文档**：设计资产已在表内 → 直接看落点；不在表内 → 新增一行（来源版本 + 裁决 + 落点），不静默跳过。
2. **每次规划文档更新必须 diff 本矩阵**：新增裁决用 `vX.Y 新增` 标注，保证追溯。
3. **能力评审（融合候选）先过 E6 四态**：融合提案/仅借鉴/拒绝/待证必须落一行。
4. **上下文/图谱类改动必须对照 C1-C16**：确认用 sessionProjections 或明确拒绝并给理由。
5. **本矩阵是单一事实源**：与规划报告的关系是"基线 ↔ 视图"，规划报告不再重复裁决，只引用行号。
6. **v1.1 追加——落地验收闸门（三条强制规则，防止设计走样重演）**：
   - **融合=互补合成，不是堆叠**：任何融合提案必须附带**互补矩阵**（父代各自优点/缺点 → 新决策结构如何取长补短 → 删除了哪些重复），并做融合前后**同一 fixture 产物对照**（hash/断言不降级才保留）。产出物中出现"Internally use A… Internally use B…"并列式指令即判为不合格堆叠。
   - **并行=真并行，不是预检串行**：预检（preflight）与独立分支必须并行执行（DSH `subagent`/`workflow`/`parallel()` 原生支持）；并行度由 jobs 预算约束，禁止用"两阶段禁止并行"类规则压制。搜索类任务默认按"官方 / GitHub / 社区"分方向并行。
   - **上下文削减必须覆盖主线程**：投影注入 `systemPrompt.variable()` + `agent/pre-step`（每次模型调用生效），子代理独立上下文只是其中一半；tools/skills 目录用 scope 按需呈现，不得 30+ 技能描述全部常驻。
7. **v1.2 追加——两条最高优先级强制规则（2026-08-15 用户明确指出）**：
   - **前置限制优先于后置验证（教训四）**：凡能用前置限制解决的（scope/边界/约束/验收标准/禁止项写进任务契约，goal 启动前锁定），一律不做后置验证；后置验证只保留对高风险/不可逆动作的一次性门禁；熔断预算在开始前定死。**新增任何"验证步骤"前必须论证"为什么不能用前置限制替代"——论证不过则不新增验证。**
   - **白帽反驳是默认开启的前置机制（教训五）**：goal/方案确认前，阿极必须先输出白帽视角（假设/反例/风险/错误假设/备选）；"迎合用户、不提反例"的输出判定不合格；用户明确要求时用隔离 subagent 做真实独立白帽；用户确认后白帽退出热路径。
8. **v1.8 追加——独立官员权限硬边界（2026-08-15 用户强制确认）**：**独立官员只有建议权，没有任何修改权**。官员不拥有写权、派发权、否决权、完成裁决权；不修改需求、执行、产物、图谱任何正式状态；输出只能是"建议回执"，用户采纳后由阿极转写为正式状态；用户可采纳/拒绝/暂缓（O7）。**实施校验**：任何官员职权（MoE 档或隔离档）的输出在落盘前必须经过"用户采纳 + 阿极转写"两步，缺少任一步即判定越权。

---

## 附：资产来源索引

- v4：`wuji-legion-v4/SKILL.md`、`units/staff.md`、`units/*.md`（部门制）
- v11.3：`wuji-legion-codex/SKILL.md`、`hotpath-manifest.json`、`kernel-source.json`、`fusion-matrix.json`、`purification-charter.json`、`residual-entrypoints.json`
- 2.1：`wuji-legion-codex-2.0/SKILL.md`、`README.md`、`references/architecture/wuji-legion-codex-2.1-direction.md`、`references/capability-contract.md`、`capabilities/*/manifest.json`、`sources.lock.json`
- 3.0：`wuji-legion-codex-2.0/references/architecture/wuji-legion-3.0-blueprint.md`、`wuji-legion-3.0-graph-architecture.md`、`wuji-legion-3.0-evolution-commander.md`
