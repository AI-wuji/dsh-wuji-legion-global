// 无极军团 · 宿主插件代码骨架（P0-4）
// 说明：这是宿主层插件（host composition）的代码骨架，负责：
//   ① 注册三张表投影单元（sessionProjections）
//   ② 注册技能库（skills.registerProvider / register）
// 注意：本文件是【代码骨架】，挂载前需对照 DSH 真实接口验证（铁律七）。

// ---------------------------------------------------------------------------
// 投影注册插件（宿主层）
// ---------------------------------------------------------------------------
export const projectionPlugin = {
  name: 'wuji-projection',
  inject: ['sessionProjections'],
  apply(ctx) {
    // 三张表投影单元（详细定义见 src/projection/projections.js）
    const { requirementSchema, requirementInit, applyRequirement } = require('./projection/projections.js');
    const { taskSchema, taskInit, applyTask } = require('./projection/projections.js');
    const { officerAdviceSchema, officerAdviceInit, applyOfficerAdvice } = require('./projection/projections.js');

    ctx.sessionProjections.register({
      key: 'wuji.requirement',
      schema: requirementSchema,
      init: requirementInit,
      apply: applyRequirement,
      view: s => s,   // 稀疏投影待精确实现
      stateVersion: 1,
    });
    ctx.sessionProjections.register({
      key: 'wuji.task',
      schema: taskSchema,
      init: taskInit,
      apply: applyTask,
      view: s => s,
      stateVersion: 1,
    });
    ctx.sessionProjections.register({
      key: 'wuji.officer-advice',
      schema: officerAdviceSchema,
      init: officerAdviceInit,
      apply: applyOfficerAdvice,
      view: s => s,
      stateVersion: 1,
    });
  },
};

// ---------------------------------------------------------------------------
// 技能注册插件（宿主层）
// ---------------------------------------------------------------------------
// skills.register(skill) 接受 SkillRegistration；skills.registerProvider(create) 接受工厂。
// 技能库能力清单见 skills/capability-registry.json。
export const skillRegistryPlugin = {
  name: 'wuji-skill-registry',
  inject: ['skills'],
  apply(ctx) {
    // 方式一：逐个注册 readonly runtime skill（适合少量技能）
    // ctx.skills.register({
    //   name: 'feishu-doc',
    //   description: '飞书文档：读取和编辑飞书文档内容。',
    //   // ... SkillRegistration 其他字段待查证
    // });

    // 方式二：注册 provider（适合技能目录/清单批量提供，推荐）
    // ctx.skills.registerProvider((control) => ({
    //   // ... SkillProvider 契约待查证：list/get 等
    // }));
  },
};

// ---------------------------------------------------------------------------
// 待查证项（挂载前必做，不臆断）
// ---------------------------------------------------------------------------
// 1. SkillRegistration 的确切字段（name/description 之外还有什么）
// 2. SkillProvider 的确切契约（list/get 的签名）
// 3. 宿主组合（host composition）如何加载这个插件：
//    - 写进 ~/.dsh/profiles/web/cordis.patch.yml 的 insert 列表？
//    - 还是作为独立 package 装进 node_modules？
// 这些都要在挂载前用 cordis_inspect 确认真实接口，不能凭本骨架直接挂。
