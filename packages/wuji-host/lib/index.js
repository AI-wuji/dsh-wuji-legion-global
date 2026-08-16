// Wuji Legion · 宿主插件包主入口
// default 导出宿主插件：注册三张表投影单元 + 技能注册。
// 同时导出投影定义（供测试/其他插件引用）。
// 注意：Cordis 通过 package.json 的 main 加载此文件，default 导出必须是插件对象。

import projectionPlugin, {
  requirementProjection,
  taskProjection,
  officerAdviceProjection,
} from './projection.js';
import skillRegistryPlugin from './skill-registry.js';

export default {
  name: 'wuji-host',
  inject: ['sessionProjections', 'skills'],
  apply(ctx) {
    // 注册三张表投影
    projectionPlugin.apply(ctx);
    // 注册技能库
    skillRegistryPlugin.apply(ctx);
  },
};

export {
  projectionPlugin,
  skillRegistryPlugin,
  requirementProjection,
  taskProjection,
  officerAdviceProjection,
};
