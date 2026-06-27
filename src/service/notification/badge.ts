import { useNotificationStore } from '@/store/modules/notification';

/**
 * 解析通知徽标数量。
 * types 为空时统计全部未读通知；否则按指定消息类型求和。
 */
export function resolveNotificationBadgeCount(badge?: Api.Route.MenuBadgeConfig): number {
  if (!badge) return 0;

  if (badge.source === 'static') {
    return Number(badge.value || 0);
  }

  const notificationStore = useNotificationStore();
  const types = badge.types?.filter(Boolean) || [];

  if (!types.length) {
    return notificationStore.unreadCount;
  }

  return types.reduce((sum, type) => sum + (notificationStore.unreadCountByType[type] || 0), 0);
}
