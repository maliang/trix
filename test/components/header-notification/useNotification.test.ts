/**
 * 通知逻辑 Hook 单元测试
 * @description 验证新消息添加位置等核心功能
 */
import { describe, expect, beforeEach, it } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNotificationStore } from '@/store/modules/notification';
import type { NotificationMessage } from '@/components/common/header-notification/types';

// 创建测试消息的辅助函数
function createMessage(overrides: Partial<NotificationMessage> = {}): NotificationMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: '测试标题',
    content: '测试内容',
    type: 'system',
    isRead: false,
    createdAt: new Date().toISOString(),
    ...overrides
  };
}

describe('useNotification Hook - 新消息添加位置', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  /**
   * Property 5: 新消息添加位置
   * Feature: header-notification, Property 5: 新消息添加位置
   * Validates: Requirements 5.3
   * 
   * 对于任意通过 WebSocket 收到的新消息，该消息应该被添加到消息列表的顶部（索引 0 位置），而不是底部。
   */
  describe('Property 5: 新消息添加位置', () => {
    it('新消息应被添加到列表顶部（索引 0 位置）', () => {
      const store = useNotificationStore();
      
      // 设置初始消息列表
      const initialMessages = [
        createMessage({ id: 'old-1', title: '旧消息1' }),
        createMessage({ id: 'old-2', title: '旧消息2' })
      ];
      store.setMessages(initialMessages);
      const initialLength = store.messages.length;
      
      // 添加新消息
      const newMessage = createMessage({ id: 'new-1', title: '新消息' });
      store.addMessage(newMessage);
      
      // 验证新消息在列表顶部
      expect(store.messages[0].id).toBe(newMessage.id);
      expect(store.messages[0].title).toBe(newMessage.title);
      
      // 验证列表长度增加了 1
      expect(store.messages.length).toBe(initialLength + 1);
    });

    it('添加新消息后，原有消息的顺序应保持不变', () => {
      const store = useNotificationStore();
      
      // 设置初始消息列表
      const initialMessages = [
        createMessage({ id: 'msg-1' }),
        createMessage({ id: 'msg-2' }),
        createMessage({ id: 'msg-3' })
      ];
      store.setMessages(initialMessages);
      
      // 记录原有消息的 ID 顺序
      const originalOrder = initialMessages.map(m => m.id);
      
      // 添加新消息
      const newMessage = createMessage({ id: 'new-msg' });
      store.addMessage(newMessage);
      
      // 验证原有消息的顺序保持不变（从索引 1 开始）
      const currentOrder = store.messages.slice(1).map(m => m.id);
      expect(currentOrder).toEqual(originalOrder);
    });

    it('连续添加多条新消息时，最后添加的消息应在最顶部', () => {
      setActivePinia(createPinia()); // 确保使用新的 pinia 实例
      const store = useNotificationStore();
      
      // 设置初始消息列表
      const initialMessages = [
        createMessage({ id: 'initial-1' }),
        createMessage({ id: 'initial-2' })
      ];
      store.setMessages(initialMessages);
      
      // 连续添加多条新消息
      const newMessages = [
        createMessage({ id: 'new-1' }),
        createMessage({ id: 'new-2' }),
        createMessage({ id: 'new-3' })
      ];
      newMessages.forEach(msg => {
        store.addMessage(msg);
      });
      
      // 验证最后添加的消息在最顶部
      const lastAddedMessage = newMessages[newMessages.length - 1];
      expect(store.messages[0].id).toBe(lastAddedMessage.id);
      
      // 验证总长度正确：初始 2 条 + 新增 3 条 = 5 条
      expect(store.messages.length).toBe(5);
    });

    it('向空列表添加新消息时，该消息应成为唯一元素', () => {
      const store = useNotificationStore();
      
      // 确保列表为空
      expect(store.messages.length).toBe(0);
      
      // 添加新消息
      const newMessage = createMessage({ id: 'first-msg' });
      store.addMessage(newMessage);
      
      // 验证消息是唯一元素
      expect(store.messages.length).toBe(1);
      expect(store.messages[0].id).toBe(newMessage.id);
    });

    it('不同类型的消息都应被添加到列表顶部', () => {
      const store = useNotificationStore();
      
      const types = ['system', 'order', 'message', 'alert', 'info'] as const;
      
      types.forEach((type, index) => {
        const msg = createMessage({ id: `type-${type}`, type });
        store.addMessage(msg);
        
        // 每次添加后，新消息都应在顶部
        expect(store.messages[0].id).toBe(`type-${type}`);
        expect(store.messages[0].type).toBe(type);
        expect(store.messages.length).toBe(index + 1);
      });
    });
  });
});
