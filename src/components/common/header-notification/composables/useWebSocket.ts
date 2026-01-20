/**
 * WebSocket Hook
 * @description 提供 WebSocket 连接、断开、重连、消息接收等功能
 * @requirements 5.1, 5.2, 5.6, 5.7
 */

import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import type { WebSocketMessage, NotificationMessage } from '../types';

/** WebSocket Hook 配置选项 */
export interface UseWebSocketOptions {
  /** WebSocket 连接地址 */
  url: string;
  /** 是否启用 WebSocket，默认 true */
  enabled?: boolean;
  /** 重连间隔（毫秒），默认 3000 */
  reconnectInterval?: number;
  /** 最大重连次数，默认 5 */
  maxReconnectAttempts?: number;
  /** 收到新消息时的回调 */
  onMessage?: (message: NotificationMessage) => void;
  /** 连接成功时的回调 */
  onConnect?: () => void;
  /** 连接断开时的回调 */
  onDisconnect?: () => void;
  /** 连接错误时的回调 */
  onError?: (error: Event) => void;
}

/** WebSocket Hook 返回值 */
export interface UseWebSocketReturn {
  /** 是否已连接 */
  isConnected: Ref<boolean>;
  /** 当前重连次数 */
  reconnectAttempts: Ref<number>;
  /** 手动连接 */
  connect: () => void;
  /** 手动断开 */
  disconnect: () => void;
  /** 发送消息 */
  send: (data: unknown) => void;
}

/**
 * WebSocket 连接 Hook
 * @param options 配置选项
 * @returns WebSocket 状态和控制方法
 */
export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    url,
    enabled = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onMessage,
    onConnect,
    onDisconnect,
    onError,
  } = options;

  // WebSocket 实例
  let ws: WebSocket | null = null;
  // 重连定时器
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  // 是否手动关闭（手动关闭时不自动重连）
  let isManualClose = false;

  // 响应式状态
  const isConnected = ref(false);
  const reconnectAttempts = ref(0);

  /**
   * 解析 WebSocket 消息
   * @param data 原始消息数据
   * @returns 解析后的消息对象，解析失败返回 null
   */
  function parseMessage(data: string): WebSocketMessage | null {
    try {
      const message = JSON.parse(data) as WebSocketMessage;
      // 验证消息格式
      if (!message.type || !['notification', 'ping', 'pong'].includes(message.type)) {
        console.warn('[WebSocket] 无效的消息类型:', message.type);
        return null;
      }
      return message;
    } catch (e) {
      console.error('[WebSocket] 消息解析失败:', e);
      return null;
    }
  }

  /**
   * 处理收到的消息
   * @param event WebSocket 消息事件
   */
  function handleMessage(event: MessageEvent): void {
    const message = parseMessage(event.data);
    if (!message) return;

    switch (message.type) {
      case 'notification':
        // 通知消息，调用回调
        if (message.data) {
          onMessage?.(message.data);
        }
        break;
      case 'ping':
        // 心跳检测，响应 pong
        send({ type: 'pong' });
        break;
      case 'pong':
        // 心跳响应，忽略
        break;
    }
  }

  /**
   * 尝试重连
   */
  function attemptReconnect(): void {
    // 如果是手动关闭或已达到最大重连次数，不再重连
    if (isManualClose) {
      return;
    }

    if (reconnectAttempts.value >= maxReconnectAttempts) {
      console.warn('[WebSocket] 达到最大重连次数，停止重连');
      return;
    }

    // 清除之前的重连定时器
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }

    reconnectTimer = setTimeout(() => {
      reconnectAttempts.value++;
      console.log(`[WebSocket] 尝试重连 (${reconnectAttempts.value}/${maxReconnectAttempts})`);
      connect();
    }, reconnectInterval);
  }

  /**
   * 建立 WebSocket 连接
   */
  function connect(): void {
    // 如果未启用或没有 URL，不连接
    if (!enabled || !url) {
      return;
    }

    // 如果已经连接，先断开
    if (ws) {
      ws.close();
      ws = null;
    }

    isManualClose = false;

    try {
      ws = new WebSocket(url);

      ws.onopen = () => {
        isConnected.value = true;
        reconnectAttempts.value = 0;
        console.log('[WebSocket] 连接成功');
        onConnect?.();
      };

      ws.onmessage = handleMessage;

      ws.onclose = (event) => {
        isConnected.value = false;
        console.log('[WebSocket] 连接关闭', event.code, event.reason);
        onDisconnect?.();
        // 非正常关闭时尝试重连
        if (!isManualClose) {
          attemptReconnect();
        }
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] 连接错误:', error);
        onError?.(error);
      };
    } catch (e) {
      console.error('[WebSocket] 创建连接失败:', e);
      attemptReconnect();
    }
  }

  /**
   * 断开 WebSocket 连接
   */
  function disconnect(): void {
    isManualClose = true;

    // 清除重连定时器
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    // 关闭连接
    if (ws) {
      ws.close();
      ws = null;
    }

    isConnected.value = false;
    reconnectAttempts.value = 0;
  }

  /**
   * 发送消息
   * @param data 要发送的数据
   */
  function send(data: unknown): void {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn('[WebSocket] 连接未就绪，无法发送消息');
      return;
    }

    try {
      ws.send(JSON.stringify(data));
    } catch (e) {
      console.error('[WebSocket] 发送消息失败:', e);
    }
  }

  // 组件挂载时自动连接
  onMounted(() => {
    if (enabled && url) {
      connect();
    }
  });

  // 组件卸载时断开连接
  onUnmounted(() => {
    disconnect();
  });

  return {
    isConnected,
    reconnectAttempts,
    connect,
    disconnect,
    send,
  };
}
