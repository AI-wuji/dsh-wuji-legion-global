// 无极军团 · 三张表投影单元（P0-2b 代码骨架）
// 说明：这是 sessionProjections 投影单元定义骨架，参考 dsh-goal 的真实写法。
// 每张表 = { key, schema, init, apply, view, stateVersion }，事件驱动纯函数折叠。
// 注意：本文件是【代码骨架】，挂载到 DSH 前需对照 sessionProjections 真实 view 契约验证。

// ---------------------------------------------------------------------------
// 需求表（wuji.requirement）—— 阿极填写
// ---------------------------------------------------------------------------
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
});

export const requirementInit = () => ({
  units: [],
  activeUnitId: null,
  version: 0,
});

// apply：只处理自己域的 change 事件，无关事件返回同一引用（Object.is 门禁不更新）
export function applyRequirement(state, event) {
  if (event.type === 'wuji/requirement/change') {
    const { unitId, patch } = event.data;
    const idx = state.units.findIndex(u => u.id === unitId);
    const nextUnits = [...state.units];
    if (idx >= 0) {
      // 更新既有单元：修订号 +1，应用 patch
      nextUnits[idx] = {
        ...nextUnits[idx],
        ...patch,
        revision: nextUnits[idx].revision + 1,
      };
    } else {
      // 新增单元
      nextUnits.push({ revision: 1, ...patch, id: unitId });
    }
    return {
      ...state,
      units: nextUnits,
      version: state.version + 1,
    };
  }
  if (event.type === 'wuji/requirement/activate') {
    return {
      ...state,
      activeUnitId: event.data.unitId,
      version: state.version + 1,
    };
  }
  return state; // 无关事件，同一引用
}

// ---------------------------------------------------------------------------
// 任务表（wuji.task）—— 参谋部填写（甘特图式）
// ---------------------------------------------------------------------------
export const taskSchema = z.object({
  nodes: z.array(z.object({
    taskId: z.string(),
    deps: z.array(z.string()),
    assignedTo: z.string(),
    requirement: z.string(),
    input: z.string(),
    output: z.string(),
    returnFormat: z.string(),
    failurePolicy: z.enum(['retry', 'reangle', 'report']),
    status: z.enum(['pending', 'running', 'success', 'failed']),
    evidence: z.string().nullable(),
  })),
  activeNodeId: z.string().nullable(),
  version: z.number(),
});

export const taskInit = () => ({
  nodes: [],
  activeNodeId: null,
  version: 0,
});

export function applyTask(state, event) {
  if (event.type === 'wuji/task/change') {
    const { taskId, patch } = event.data;
    const idx = state.nodes.findIndex(n => n.taskId === taskId);
    const nextNodes = [...state.nodes];
    if (idx >= 0) {
      nextNodes[idx] = { ...nextNodes[idx], ...patch };
    } else {
      nextNodes.push({ taskId, ...patch });
    }
    return { ...state, nodes: nextNodes, version: state.version + 1 };
  }
  if (event.type === 'wuji/task/status') {
    const { taskId, status, evidence } = event.data;
    const nextNodes = state.nodes.map(n =>
      n.taskId === taskId ? { ...n, status, evidence: evidence ?? n.evidence } : n
    );
    return { ...state, nodes: nextNodes, version: state.version + 1 };
  }
  return state;
}

// ---------------------------------------------------------------------------
// 官员建议表（wuji.officer-advice）—— 独立官员填写（零修改权）
// ---------------------------------------------------------------------------
export const officerAdviceSchema = z.object({
  advices: z.array(z.object({
    adviceId: z.string(),
    officer: z.string(),
    content: z.string(),
    evidence: z.string(),
    userDecision: z.enum(['adopted', 'rejected', 'deferred', 'pending']),
    affectedRequirement: z.string().nullable(),
  })),
  version: z.number(),
});

export const officerAdviceInit = () => ({ advices: [], version: 0 });

export function applyOfficerAdvice(state, event) {
  if (event.type === 'wuji/officer-advice/change') {
    const { adviceId, patch } = event.data;
    const idx = state.advices.findIndex(a => a.adviceId === adviceId);
    const next = [...state.advices];
    if (idx >= 0) {
      next[idx] = { ...next[idx], ...patch };
    } else {
      next.push({ adviceId, ...patch });
    }
    return { ...state, advices: next, version: state.version + 1 };
  }
  // 用户决定：采纳/拒绝/暂缓
  if (event.type === 'wuji/officer-advice/decision') {
    const { adviceId, userDecision } = event.data;
    const next = state.advices.map(a =>
      a.adviceId === adviceId ? { ...a, userDecision } : a
    );
    return { ...state, advices: next, version: state.version + 1 };
  }
  return state;
}

// ---------------------------------------------------------------------------
// 注册（宿主插件 apply 内）
// ---------------------------------------------------------------------------
// ctx.inject(['sessionProjections'], (projectionCtx) => {
//   const p = projectionCtx.sessionProjections;
//   p.register({ key: 'wuji.requirement', schema: requirementSchema, init: requirementInit, apply: applyRequirement, view: s => s, stateVersion: 1 });
//   p.register({ key: 'wuji.task', schema: taskSchema, init: taskInit, apply: applyTask, view: s => s, stateVersion: 1 });
//   p.register({ key: 'wuji.officer-advice', schema: officerAdviceSchema, init: officerAdviceInit, apply: applyOfficerAdvice, view: s => s, stateVersion: 1 });
// });

// ---------------------------------------------------------------------------
// 说明：稀疏投影（框架 + 当前项）
// ---------------------------------------------------------------------------
// view 目前是 s => s（先跑通），稀疏投影需要在 view 里实现：
// - 需求表：只输出"所有单元标题(id+goal) + 当前活跃单元全文"
// - 任务表：只输出"所有节点标题(taskId) + 当前节点全文"
// 这一步待挂载后，对照 sessionProjections 真实 view 契约再精确实现。
