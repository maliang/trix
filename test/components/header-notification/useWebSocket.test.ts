/**
 * WebSocket Hook 单元测试
 * @description 测试 WebSocket 连接、消息接收、断开重连等功能
 * @requirements 5.2, 5.6
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { defineComponent, nextTick } from 'vue';
import { useWebSocket, type UseWebSocketOptions } from '@/components/common/header-notification/composables/useWebSocket';

// Mock WebSocket
class MockWebSocket {
  static instances: MockWebSocket[] = [];
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  url: string;
  readyState: number = MockWebSocket.CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  sentMessages: string[] = [];

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  send(data: string): void {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
    this.sentMessages.push(data);
  }

  close(): void {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code: 1000, reason: 'Normal closure' }));
    }
  }

  // 模拟连接成功
  simulateOpen(): void {
    this.readyState = MockWebSocket.OPEN;
    if (this.onopen) {
      this.onopen(new Event('open'));
    }
  }

  // 模拟收到消息
  simulateMessage(data: unknown): void {
    if (this.onmessage) {
      this.onmessage(new MessageEvent('message', { data: JSON.stringify(data) }));
    }
  }

  // 模拟连接错误
  simulateError(): void {
    if (this.onerror) {
      this.onerror(new Event('error'));
    }
  }

  // 模拟连接断开
  simulateClose(code = 1006, reason = 'Abnormal closure'): void {
    this.readyState = MockWebSocket.CLOSED;
    if (this.onclose) {
      this.onclose(new CloseEvent('close', { code, reason }));
    }
  }
}

// 创建测试组件的辅助函数
function createTestComponent(options: UseWebSocketOptions) {
  return defineComponent({
    setup() {
      const ws = useWebSocket(options);
      return { ws };
    },
    template: '<div></div>'
  });
}

describe('useWebSocket', () => {
  beforeEach(() => {
    // 重置 Mock WebSocket 实例
    MockWebSocket.instances = [];
    // 替换全局 WebSocket
    vi.stubGlobal('WebSocket', MockWebSocket);
    // 使用假定时器
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('连接建立', () => {
    it('组件挂载时应自动建立连接', async () => {
      const onConnect = vi.fn();
      const TestComponent = createTestComponent({
        url: 'ws://localhost:8080',
        enabled: true,
        onConnect
      });

      const wrapper = mount(TestComponent);
      await nextTick();

      // 应该创建了 WebSocket 实例
      expect(MockWebSocket.instances.length).toBe(1);
      expect(MockWebSocket.instances[0].url).toBe('ws://localhost:8080');

      // 模拟连接成功
      MockWebSocket.instances[0].simulateOpen();
      await nextTick();

      // 应该调用 onConnect 回调
      expect(onConnect).toHaveBeenCalledTimes(1);
      // isConnected 应该为 true
      expect(wrapper.vm.ws.isConnected.value).toBe(true);

      wrapper.unmount();
    });

    it('enabled 为 false 时不应建立连接', async () => {
      const TestComponent = createTestComponent({
        url: 'ws://localhost:8080',
        enabled: false
      });

      const wrapper = mount(TestComponent);
      await nextTick();

      // 不应该创建 WebSocket 实例
      expect(MockWebSocket.instances.length).toBe(0);

      wrapper.unmount();
    });

    it('url 为空时不应建立连接', async () => {
      const TestComponent = createTestComponent({
        url: '',
        enabled: true
      });

      const wrapper = mount(TestComponent);
      await nextTick();

      // 不应该创建 WebSocket 实例
      expect(MockWebSocket.instances.length).toBe(0);

      wrapper.unmount();
    });
  });

  describe('消息接收', () => {
    it('收到 notification 类型消息时应调用 onMessage 回调', async () => {
      const onMessage = vi.fn();
      const TestComponent = createTestComponent({
        url: 'ws://localhost:8080',
        enabled: true,
        onMessage
      });

      const wrapper = mount(TestComponent);
      await nextTick();

      // 模拟连接成功
      MockWebSocket.instances[0].simulateOpen();
      await nextTick();

      // 模拟收到通知消息
      const notificationData = {
        id: '1',
        title: '测试标题',
        content: '测试内容',
        type: 'system',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      MockWebSocket.instances[0].simulateMessage({
        type: 'notification',
        data: notificationData
      });
      await nextTick();

      // 应该调用 onMessage 回调
      expect(onMessage).toHaveBeenCalledTimes(1);
      expect(onMessage).toHaveBeenCalledWith(notificationData);

      wrapper.unmount();
    });

    it('收到 ping 消息时应自动响应 pong', async () => {
      const TestComponent = createTestComponent({
        url: 'ws://localhost:8080',
        enabled: true
      });

      const wrapper = mount(TestComponent);
      await nextTick();

      // 模拟连接成功
      MockWebSocket.instances[0].simulateOpen();
      await nextTick();

      // 模拟收到 ping 消息
      MockWebSocket.instances[0].simulateMessage({ type: 'ping' });
      await nextTick();

      // 应该发送 pong 响应
      expect(MockWebSocket.instances[0].sentMessages.length).toBe(1);
      expect(JSON.parse(MockWebSocket.instances[0].sentMessages[0])).toEqual({ type: 'pong' });

      wrapper.unmount();
    });
  });

  describe('断开重连', () => {
    it('连接断开时应调用 onDisconnect 回调', async () => {
      const onDisconnect = vi.fn();
      const TestComponent = createTestComponent({
        url: 'ws://localhost:8080',
        enabled: true,
        onDisconnect
      });

      const wrapper = mount(TestComponent);
      await nextTick();

      // 模拟连接成功
      MockWebSocket.instances[0].simulateOpen();
      await nextTick();

      // 模拟连接断开
      MockWebSocket.instances[0].simulateClose();
      await nextTick();

      // 应该调用 onDisconnect 回调
      expect(onDisconnect).toHaveBeenCalledTimes(1);
      // isConnected 应该为 false
      expect(wrapper.vm.ws.isConnected.value).toBe(false);

      wrapper.unmount();
    });

    it('非正常断开时应自动尝试重连', async () => {
      const TestComponent = createTestComponent({
        url: 'ws://localhost:8080',
        enabled: true,
        reconnectInterval: 1000,
        maxReconnectAttempts: 3
      });

      const wrapper = mount(TestComponent);
      await nextTick();

      // 模拟连接成功
      MockWebSocket.instances[0].simulateOpen();
      await nextTick();

      // 模拟非正常断开
      MockWebSocket.instances[0].simulateClose(1006, 'Abnormal closure');
      await nextTick();

      // 等待重连定时器
      vi.advanceTimersByTime(1000);
      await nextTick();

      // 应该尝试重连（创建新的 WebSocket 实例）
      expect(MockWebSocket.instances.length).toBe(2);
      expect(wrapper.vm.ws.reconnectAttempts.value).toBe(1);

      wrapper.unmount();
    });
  });

  describe('发送消息', () => {
    it('连接成功后应能发送消息', async () => {
      const TestComponent = createTestComponent({
        url: 'ws://localhost:8080',
        enabled: true
      });

      const wrapper = mount(TestComponent);
      await nextTick();

      // 模拟连接成功
      MockWebSocket.instances[0].simulateOpen();
      await nextTick();

      // 发送消息
      wrapper.vm.ws.send({ type: 'test', data: 'hello' });

      // 应该发送消息
      expect(MockWebSocket.instances[0].sentMessages.length).toBe(1);
      expect(JSON.parse(MockWebSocket.instances[0].sentMessages[0])).toEqual({
        type: 'test',
        data: 'hello'
      });

      wrapper.unmount();
    });

    it('连接未就绪时发送消息应被忽略', async () => {
      const TestComponent = createTestComponent({
        url: 'ws://localhost:8080',
        enabled: true
      });

      const wrapper = mount(TestComponent);
      await nextTick();

      // 不模拟连接成功，直接发送消息
      wrapper.vm.ws.send({ type: 'test' });

      // 不应该发送消息（连接未就绪）
      expect(MockWebSocket.instances[0].sentMessages.length).toBe(0);

      wrapper.unmount();
    });
  });

  describe('组件卸载', () => {
    it('组件卸载时应断开连接', async () => {
      const onDisconnect = vi.fn();
      const TestComponent = createTestComponent({
        url: 'ws://localhost:8080',
        enabled: true,
        onDisconnect
      });

      const wrapper = mount(TestComponent);
      await nextTick();

      // 模拟连接成功
      MockWebSocket.instances[0].simulateOpen();
      await nextTick();

      // 卸载组件
      wrapper.unmount();
      await nextTick();

      // 应该调用 onDisconnect 回调
      expect(onDisconnect).toHaveBeenCalled();
    });
  });
});
