import { describe, it, expect } from 'vitest';
import { transformMenuRoutesToRoutes } from '@/store/modules/route/shared';

describe('route shared - transformMenuRoutesToRoutes', () => {
  it('菜单分组路由应使用 RouteView 占位组件，避免 RouterView 直接被 Transition/KeepAlive 包裹产生警告', async () => {
    const routes = transformMenuRoutesToRoutes([
      {
        name: 'group',
        path: '/group',
        meta: { title: 'Group' },
        children: [
          {
            name: 'leaf',
            path: '/group/leaf',
            meta: { title: 'Leaf', schemaSource: '/mock/schema/leaf.json' }
          }
        ]
      }
    ] as any);

    const root = routes[0];
    expect(root.name).toBe('root');
    expect(root.children?.length).toBe(1);

    const group = root.children![0];
    expect(group.name).toBe('group');

    // 关键：分组路由 component 应为 lazy import 函数，并指向 RouteView 组件。
    expect(typeof group.component).toBe('function');

    const mod = await (group.component as any)();
    expect(mod?.default?.name).toBe('RouteView');
  });
});
