// Wuji Legion · 技能注册子插件
// 由主插件 wuji-host 在 ctx.inject(['skills']) 后调用。
// 能力清单路径从主插件 config.registryPath 传入。

import { readFileSync } from 'node:fs';

export default {
  name: 'wuji-skill-registry',
  apply(ctx, config = {}) {
    const registryPath = config.registryPath;
    let registry = { capabilities: [] };
    if (registryPath) {
      try {
        registry = JSON.parse(readFileSync(registryPath, 'utf8'));
      } catch (e) {
        console.error('[wuji] capability-registry.json 读取失败:', e.message);
      }
    } else {
      console.warn('[wuji] 未配置 registryPath，技能库为空');
    }

    for (const cap of registry.capabilities || []) {
      ctx.skills.register({
        name: cap.id,
        description: `${cap.domain} · ${cap.commander} · ${cap.triggers.join('/')}`,
      });
    }
  },
};
