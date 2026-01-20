/**
 * Header 通知组件导出
 * @description 导出主组件和类型定义，支持通过 props 或 JSON Schema 配置
 * @requirements 7.1
 */

// 导出主组件
export { default as HeaderNotification } from './index.vue';

// 导出类型定义
export type {
  NotificationMessage,
  NotificationTabConfig,
  BadgeMode,
  HeaderNotificationProps,
  NotificationPageData,
  NotificationPageResponse,
  MarkReadResponse,
  WebSocketMessageType,
  WebSocketMessage
} from './types';

// 导出 composables（可选，供外部使用）
export { useNotification } from './composables/useNotification';
export { useWebSocket } from './composables/useWebSocket';
export type { UseWebSocketOptions } from './composables/useWebSocket';
