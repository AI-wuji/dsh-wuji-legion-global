# 三张表投影单元设计（sessionProjections）

> 这是 P0-2 的交付物：三张表投影单元的 schema 与状态机设计。
> 原理：sessionProjections 是事件驱动的纯函数折叠——不直接"写表"，而是订阅特定 `type` 的会话事件，折叠成表。每个投影单元 = { key, schema, init, apply, view, stateVersion }。

## 三张表概览

| 表 | key | 所有者 | 回答的问题 | 每次投影的内容 |
|---|---|---|---|---|
| 需求表 | `wuji.requirement` | 阿极 | 用户真正要什么 | 表框架（所有需求项标题）+ 当前项全文 + 版本指针 |
| 任务表 | `wuji.task` | 参谋部 | 怎么完成（甘特图式） | 表框架 + 当前节点 + 依赖 + 契约 |
| 官员建议表 | `wuji.officer-advice` | 独立官员 | 官员提了什么建议 | 建议回执（建议ID/职权/内容/证据/用户决定） |

## 需求表（wuji.requirement）字段设计

```
RequirementTable = {
  units: Array<{
    id: string,           // 需求单元稳定 ID
    revision: number,     // 修订号
    goal: string,         // 目标（一句）
    dont: string,         // 不要什么（一句）
    constraints: string[], // 约束/优先级
    acceptance: string,   // 验收标准（一句）
    status: 'draft' | 'confirmed' | 'replaced',  // 状态
    sourceMsgId: string   // 来源消息 ID（对话证据）
  }>,
  activeUnitId: string | null,  // 当前活跃单元（投影时只带这个）
  version: number          // 表版本
}
```

**事件驱动**：
- 事件 `type = 'wuji/requirement/change'`，data = { unitId, patch } → apply 折叠进对应单元
- 事件 `type = 'wuji/requirement/activate'`，data = { unitId } → 切换活跃单元

**稀疏投影（关键）**：view 输出时，只输出"所有单元的标题（id + goal 一句话）+ 当前活跃单元的全文"，不是整张表。

## 任务表（wuji.task）字段设计（甘特图式）

```
TaskTable = {
  nodes: Array<{
    taskId: string,        // 任务 ID
    deps: string[],        // 依赖（哪些任务必须先完成）
    assignedTo: string,    // 分给谁（主帅/专家）
    requirement: string,   // 具体要求
    input: string,         // 输入
    output: string,        // 输出格式
    returnFormat: string,  // 返回格式
    failurePolicy: 'retry' | 'reangle' | 'report',  // 失败处理
    status: 'pending' | 'running' | 'success' | 'failed',  // 状态
    evidence: string | null  // 证据句柄
  }>,
  activeNodeId: string | null,
  version: number
}
```

**事件驱动**：
- `type = 'wuji/task/change'` → 折叠任务节点
- `type = 'wuji/task/status'` → 更新状态（成功汇总/失败重派）

## 官员建议表（wuji.officer-advice）字段设计

```
OfficerAdviceTable = {
  advices: Array<{
    adviceId: string,      // 建议 ID
    officer: string,       // 职权（质检/审计/合规/根因/性能；阿极客观判断不属于独立官员）
    content: string,       // 建议内容
    evidence: string,      // 证据/因果线
    userDecision: 'adopted' | 'rejected' | 'deferred' | 'pending',  // 用户决定
    affectedRequirement: string | null  // 受影响需求单元
  }>,
  version: number
}
```

**关键约束**：官员建议**零修改权**——官员只能写"建议回执"，用户采纳后由阿极转写为需求表的正式状态。建议表只记录"建议 + 用户决定"，不直接改需求表。

---

## 投影单元注册代码骨架（参考 dsh-goal 的真实写法）

```js
// src/projection/requirement.js
export const requirementSchema = z.object({
  units: z.array(z.object({
    id: z.string(),
    revision: z.number(),
    goal: z.string(),
    dont: z.string(),
    constraints: z.array(z.string()),
    acceptance: z.string(),
    status: z.enum(['draft', 'confirmed', 'replaced']),
    sourceMsgId: z.string(),
  })),
  activeUnitId: z.string().nullable(),
  version: z.number(),
})

export const requirementInit = () => ({ units: [], activeUnitId: null, version: 0 })

export function applyRequirement(state, event) {
  if (event.type !== 'wuji/requirement/change' && event.type !== 'wuji/requirement/activate') {
    return state  // 无关事件，返回同一引用（Object.is 门禁不更新）
  }
  // ... 折叠逻辑（change 更新单元，activate 切换活跃）
  return nextState
}

// 注册（宿主插件内）
ctx.inject(['sessionProjections'], (projectionCtx) => {
  projectionCtx.sessionProjections.register({
    key: 'wuji.requirement',
    schema: requirementSchema,
    init: requirementInit,
    apply: applyRequirement,
    view: state => state,   // 稀疏投影在 view 里做：只输出框架+当前项
    stateVersion: 1,
  })
})
```

---

## 下一步（P0-2 继续）

1. 把三张表的 schema/apply/view 写成完整 JS 代码（骨架，待挂载验证）
2. view 里实现"稀疏投影"（只输出框架 + 当前项，符合铁律七"不臆断"——需对照 sessionProjections 真实 view 契约）
