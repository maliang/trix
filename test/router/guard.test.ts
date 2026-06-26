import { describe, expect, it } from 'vitest';
import { buildAuthRouteReloadLocation } from '@/router/guard';

describe('router guard', () => {
  it('reloads auth routes by path instead of stale route name', () => {
    const location = buildAuthRouteReloadLocation({
      fullPath: '/system/menu?tab=all#list',
      path: '/system/menu',
      query: { tab: 'all' },
      hash: '#list',
      name: 'system-menu',
      matched: [{ name: 'system-menu' }]
    } as any);

    expect(location).toEqual({
      path: '/system/menu',
      query: { tab: 'all' },
      hash: '#list',
      replace: true
    });
    expect(location).not.toHaveProperty('name');
    expect(location).not.toHaveProperty('matched');
  });
});
