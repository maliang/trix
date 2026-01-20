/**
 * 通知 Store 属性测试
 * @description 使用 fast-check 进行属性测试，验证 Store 的核心功能
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useNotificationStore } from '@/store/modules/notification';
import type { NotificationMessage } from '@/components/common/header-notification/types';

// 生成随机消息类型
const messageTypeArbitrary = fc.constantFrom('system', 'order', 'message', 'alert', 'info');

// 生成随机通知消息
const notificationMessageArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 50 }),
  content: fc.string({ minLength: 1, maxLength: 200 }),
  type: messageTypeArbitrary,
  isRead: fc.boolean(),
  createdAt: fc.date().map(d => d.toISOString())
}) as fc.Arbitrary<NotificationMessage>;

// 生成随机消息列表
const messageListArbitrary = fc.array(notificationMessageArbitrary, { minLength: 0, maxLength: 50 });

describe('Notification Store - 属性测试', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  /**
   * Property 1: 未读数量计算正确性
   * Feature: header-notification, Property 1: 未读数量计算正确性
   * Validates: Requirements 1.2, 4.6, 5.4
   * 
   * 对于任意消息列表，未读数量应该等于列表中 isRead 为 false 的消息数量
   */
  describe('Property 1: 未读数量计算正确性', () => {
    test.prop([messageListArbitrary])(
      '未读数量应等于 isRead 为 false 的消息数量',
      (messages) => {
        setActivePinia(createPinia());
        const store = useNotificationStore();
        store.setMessages(messages);

        const expectedCount = messages.filter(m => !m.isRead).length;
        expect(store.unreadCount).toBe(expectedCount);
      }
    );

    test.prop([messageListArbitrary, notificationMessageArbitrary])(
      '添加新消息后未读数量应正确更新',
      (initialMessages, newMessage) => {
        setActivePinia(createPinia());
        const store = useNotificationStore();
        store.setMessages(initialMessages);

        const initialUnread = store.unreadCount;
        store.addMessage(newMessage);

        const expectedUnread = initialUnread + (newMessage.isRead ? 0 : 1);
        expect(store.unreadCount).toBe(expectedUnread);
      }
    );

    test.prop([messageListArbitrary])(
      '按类型统计的未读数量之和应等于总未读数量',
      (messages) => {
        setActivePinia(createPinia());
        const store = useNotificationStore();
        store.setMessages(messages);

        const countByType = store.unreadCountByType;
        const sumByType = Object.values(countByType).reduce((sum, count) => sum + count, 0);

        expect(sumByType).toBe(store.unreadCount);
      }
    );
  });

  /**
   * Property 2: 标签页筛选正确性
   * Feature: header-notification, Property 2: 标签页筛选正确性
   * Validates: Requirements 2.5, 2.6
   * 
   * 对于任意消息列表和标签页配置，筛选后的消息应只包含该标签页配置的消息类型
   */
  describe('Property 2: 标签页筛选正确性', () => {
    test.prop([messageListArbitrary, messageTypeArbitrary])(
      '切换标签页后，筛选的消息应只包含该类型',
      (messages, tabType) => {
        setActivePinia(createPinia());
        const store = useNotificationStore();
        store.setMessages(messages);
        store.setActiveTab(tabType);

        const filtered = store.filteredMessages;
        expect(filtered.every(m => m.type === tabType)).toBe(true);
      }
    );

    test.prop([messageListArbitrary])(
      'all 标签页应显示所有消息',
      (messages) => {
        setActivePinia(createPinia());
        const store = useNotificationStore();
        store.setMessages(messages);
        store.setActiveTab('all');

        expect(store.filteredMessages.length).toBe(messages.length);
      }
    );

    test.prop([messageListArbitrary, fc.array(messageTypeArbitrary, { minLength: 1, maxLength: 3 })])(
      '配置了多个类型的标签页应显示所有匹配类型的消息',
      (messages, types) => {
        setActivePinia(createPinia());
        const store = useNotificationStore();
        store.setMessages(messages);
        
        // 设置标签页类型映射
        store.setTabTypesMap({ custom: types });
        store.setActiveTab('custom');

        const filtered = store.filteredMessages;
        expect(filtered.every(m => types.includes(m.type))).toBe(true);
      }
    );

    test.prop([messageListArbitrary, messageTypeArbitrary])(
      '每个标签页的未读数量应等于该类型消息中未读的数量',
      (messages, tabType) => {
        setActivePinia(createPinia());
        const store = useNotificationStore();
        store.setMessages(messages);

        const expectedUnread = messages.filter(m => m.type === tabType && !m.isRead).length;
        const actualUnread = store.unreadCountByType[tabType] || 0;

        expect(actualUnread).toBe(expectedUnread);
      }
    );
  });

  /**
   * Property 3: 标记已读正确性
   * Feature: header-notification, Property 3: 标记已读正确性
   * Validates: Requirements 4.1, 4.5
   * 
   * 对于任意消息，标记已读后 isRead 应变为 true
   */
  describe('Property 3: 标记已读正确性', () => {
    test.prop([
      fc.array(notificationMessageArbitrary, { minLength: 1, maxLength: 20 }),
      fc.nat()
    ])(
      '标记单条消息已读后，该消息的 isRead 应为 true',
      (messages, indexSeed) => {
        setActivePinia(createPinia());
        const store = useNotificationStore();
        store.setMessages(messages);

        // 选择一条消息进行标记
        const index = indexSeed % messages.length;
        const targetId = messages[index].id;

        store.markAsRead(targetId);

        const message = store.messages.find(m => m.id === targetId);
        expect(message?.isRead).toBe(true);
      }
    );

    test.prop([messageListArbitrary])(
      '全部已读后，所有消息的 isRead 应为 true',
      (messages) => {
        setActivePinia(createPinia());
        const store = useNotificationStore();
        store.setMessages(messages);

        store.markAllAsRead();

        expect(store.messages.every(m => m.isRead)).toBe(true);
        expect(store.unreadCount).toBe(0);
      }
    );

    test.prop([messageListArbitrary, messageTypeArbitrary])(
      '按类型全部已读后，该类型的所有消息 isRead 应为 true',
      (messages, targetType) => {
        setActivePinia(createPinia());
        const store = useNotificationStore();
        store.setMessages(messages);

        store.markAllAsRead([targetType]);

        // 目标类型的消息应全部已读
        const targetMessages = store.messages.filter(m => m.type === targetType);
        expect(targetMessages.every(m => m.isRead)).toBe(true);

        // 其他类型的消息应保持原状态
        const otherMessages = store.messages.filter(m => m.type !== targetType);
        const originalOtherMessages = messages.filter(m => m.type !== targetType);
        
        otherMessages.forEach((m, i) => {
          const original = originalOtherMessages.find(om => om.id === m.id);
          if (original) {
            expect(m.isRead).toBe(original.isRead);
          }
        });
      }
    );

    test.prop([messageListArbitrary])(
      '标记已读后未读数量应正确减少',
      (messages) => {
        setActivePinia(createPinia());
        const store = useNotificationStore();
        store.setMessages(messages);

        const initialUnread = store.unreadCount;
        store.markAllAsRead();

        expect(store.unreadCount).toBe(0);
        // 如果初始有未读消息，标记后应该减少
        if (initialUnread > 0) {
          expect(store.unreadCount).toBeLessThan(initialUnread);
        }
      }
    );
  });
});
