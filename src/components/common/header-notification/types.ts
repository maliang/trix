/**
 * Header 通知组件类型定义
 * @description 定义通知组件相关的所有类型接口
 */

/** 通知消息类型 */
export interface NotificationMessage {
  /** 消息 ID */
  id: string;
  /** 消息标题 */
  title: string;
  /** 消息内容 */
  content: string;
  /** 消息类型 */
  type: string;
  /** 是否已读 */
  isRead: boolean;
  /** 创建时间（ISO 8601 格式） */
  createdAt: string;
  /** 额外数据 */
  extra?: Record<string, unknown>;
}

/** 标签页配置 */
export interface NotificationTabConfig {
  /** 标签页 key */
  key: string;
  /** 标签页名称 */
  label: string;
  /** 标签页图标 */
  icon?: string;
  /** 消息类型筛选（为空则显示所有） */
  types?: string[];
}

/** Badge 显示模式 */
export type BadgeMode = 'dot' | 'count';

/** 组件 Props */
export interface HeaderNotificationProps {
  /** Badge 显示模式，默认 'count' */
  badgeMode?: BadgeMode;
  /** 标签页配置 */
  tabs?: NotificationTabConfig[];
  /** 每页消息数量，默认 10 */
  pageSize?: number;
  /** WebSocket 连接地址 */
  wsUrl?: string;
  /** 是否启用 WebSocket，默认 false */
  enableWs?: boolean;
  /** 是否启用应用内通知，默认 true */
  enableNotification?: boolean;
  /** 通知显示时长（毫秒），默认 4500 */
  notificationDuration?: number;
  /** 获取消息列表 API */
  fetchApi?: string;
  /** 标记已读 API */
  readApi?: string;
  /** 全部已读 API */
  readAllApi?: string;
  /** 标签页未读徽章背景色，默认使用主题色 */
  tabBadgeColor?: string;
  /** 是否启用详情展示，默认 true */
  enableDetail?: boolean;
}

/** 分页响应数据 */
export interface NotificationPageData {
  /** 消息列表 */
  list: NotificationMessage[];
  /** 总数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

/** 分页响应 */
export interface NotificationPageResponse {
  /** 响应码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: NotificationPageData;
}

/** 标记已读响应 */
export interface MarkReadResponse {
  /** 响应码 */
  code: number;
  /** 响应消息 */
  message: string;
}

/** WebSocket 消息类型 */
export type WebSocketMessageType = 'notification' | 'ping' | 'pong';

/** WebSocket 消息 */
export interface WebSocketMessage {
  /** 消息类型 */
  type: WebSocketMessageType;
  /** 消息数据（仅 notification 类型有） */
  data?: NotificationMessage;
}
