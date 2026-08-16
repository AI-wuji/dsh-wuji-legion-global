// Wuji Legion · 技能注册宿主插件
// 从 capability-registry.json 读取能力清单，注册为 skills provider。

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  name: 'wuji-skill-registry',
  inject: ['skills'],
  apply(ctx) {
    // 读取能力清单（相对于本包的仓库根目录）
    const registryPath = path.resolve(__dirname, '../../../../skills/capability-registry.json');
    let registry = { capabilities: [] };
    try {
      registry = JSON.parse(readFileSync(registryPath, 'utf8'));
    } catch (e) {
      // 清单缺失时注册空库，不阻断宿主启动（诚实：不假装能力存在）
      console.error('[wuji] capability-registry.json 读取失败:', e.message);
    }

    for (const cap of registry.capabilities || []) {
      ctx.skills.register({
        name: cap.id,
        description: `${cap.domain} · ${cap.commander} · ${cap.triggers.join('/')}`,
        // 注意：SkillRegistration 其他字段（invocation/provider 等）待对照真实契约补全
      });
    }
  },
};
