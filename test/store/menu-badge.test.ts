import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createMenuBadgeExtra, resolveMenuBadgeCount, transformMenuRoutesToRoutes } from '@/store/modules/route/shared';
import { useNotificationStore } from '@/store/modules/notification';
import type { NotificationMessage } from '@/components/common/header-notification/types';
import { resolveNotificationBadgeCount } from '@/service/notification/badge';

function createMessage(id: string, type: string, isRead = false): NotificationMessage {
  return {
    id,
    type,
    isRead,
    title: `message ${id}`,
    content: '',
    createdAt: '2026-06-28T00:00:00+08:00'
  };
}

describe('menu badge - notification source', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('按一个或多个通知类型统计未读数量，并在标记已读后同步减少', () => {
    const notificationStore = useNotificationStore();
    notificationStore.setMessages([
      createMessage('1', 'approval.contract'),
      createMessage('2', 'approval.contract', true),
      createMessage('3', 'task.todo'),
      createMessage('4', 'system.notice')
    ]);

    const badge = {
      source: 'notification',
      types: ['approval.contract', 'task.todo']
    } as const;

    expect(resolveMenuBadgeCount(badge)).toBe(2);

    notificationStore.markAsRead('1');
    expect(resolveMenuBadgeCount(badge)).toBe(1);

    notificationStore.markAllAsRead(['task.todo']);
    expect(resolveMenuBadgeCount(badge)).toBe(0);
    expect(resolveNotificationBadgeCount(badge)).toBe(0);
  });

  it('菜单路由转换会保留 meta.badge 配置', () => {
    const routes = transformMenuRoutesToRoutes([
      {
        name: 'approvals',
        path: '/approvals',
        meta: {
          title: 'Approvals',
          badge: {
            source: 'notification',
            types: ['approval.contract'],
            max: 9
          }
        }
      }
    ]);

    expect(routes[0].children?.[0].meta?.badge).toEqual({
      source: 'notification',
      types: ['approval.contract'],
      max: 9
    });
  });

  it('renders custom badge color from badge.color', () => {
    const render = createMenuBadgeExtra({
      source: 'static',
      value: 3,
      color: '#f5222d'
    });

    const vnode = render?.() as any;

    expect(vnode?.props?.style).toEqual({
      '--n-badge-color': '#f5222d'
    });
  });
});
