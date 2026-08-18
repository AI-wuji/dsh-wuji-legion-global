// Wuji Legion · 参谋部最小调度工具（P1）
// 参谋部只做全局任务分配与契约写入，不亲自执行、不创建第二套 agent-loop。

export const staffPlanTool = {
  name: 'wuji_staff_plan',
  description: '参谋部：把已确认需求转换为有依赖、负责人、输入输出和失败策略的任务分配表，并写入 wuji.task 投影。',
  parameters: {
    type: 'object',
    properties: {
      objective: { type: 'string', description: '已确认的总目标。' },
      tasks: {
        type: 'array',
        description: '结构化任务节点；每个节点必须包含完整执行契约。',
        items: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            deps: { type: 'array', items: { type: 'string' } },
            assignedTo: { type: 'string' },
            requirement: { type: 'string' },
            input: { type: 'string' },
            output: { type: 'string' },
            returnFormat: { type: 'string' },
            failurePolicy: { type: 'string', enum: ['retry', 'reangle', 'report'] },
          },
          required: ['taskId', 'deps', 'assignedTo', 'requirement', 'input', 'output', 'returnFormat', 'failurePolicy'],
        },
      },
    },
    required: ['objective', 'tasks'],
  },
  output: {
    schema: {
      type: 'object',
      properties: {
        objective: { type: 'string' },
        taskCount: { type: 'number' },
        taskIds: { type: 'array', items: { type: 'string' } },
        activeTaskId: { type: ['string', 'null'] },
        dependenciesValid: { type: 'boolean' },
      },
      required: ['objective', 'taskCount', 'taskIds', 'activeTaskId', 'dependenciesValid'],
    },
    render(_args, value) {
      return [{ type: 'text', text: JSON.stringify(value, null, 2) }];
    },
  },
  isConcurrencySafe() { return false; },
  async execute(args, exec) {
    const tasks = Array.isArray(args.tasks) ? args.tasks : [];
    const ids = new Set(tasks.map(task => task.taskId));
    const dependenciesValid = tasks.every(task => task.deps.every(dep => ids.has(dep) || dep === ''));
    if (!args.objective || tasks.length === 0) throw new Error('参谋部任务表需要 objective 和至少一个完整任务节点');
    if (!dependenciesValid) throw new Error('任务依赖必须指向同一任务表中的 taskId');
    const session = exec.agent?.session;
    if (!session) throw new Error('参谋部工具必须在一个有归属 Session 的 Agent 中运行');
    for (const task of tasks) {
      session.append('wuji/task/change', {
        taskId: task.taskId,
        patch: {
          deps: task.deps,
          assignedTo: task.assignedTo,
          requirement: task.requirement,
          input: task.input,
          output: task.output,
          returnFormat: task.returnFormat,
          failurePolicy: task.failurePolicy,
          status: 'pending',
          evidence: null,
        },
      });
    }
    const activeTaskId = tasks.find(task => task.deps.length === 0)?.taskId || tasks[0].taskId;
    session.append('wuji/task/activate', { taskId: activeTaskId });
    return { objective: args.objective, taskCount: tasks.length, taskIds: [...ids], activeTaskId, dependenciesValid };
  },
};

export default staffPlanTool;
