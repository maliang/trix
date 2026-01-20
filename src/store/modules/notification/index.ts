/**
 * 通知 Store
 * @description 管理通知消息的状态，包括消息列表、分页、已读状态等
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { NotificationMessage } from '@/components/common/header-notification/types';

export const useNotificationStore = defineStore('notification', () => {
  // ==================== 状态 ====================

  /** 消息列表 */
  const messages = ref<NotificationMessage[]>([]);

  /** 加载状态 */
  const loading = ref(false);

  /** 当前页码 */
  const currentPage = ref(1);

  /** 每页数量 */
  const pageSize = ref(10);

  /** 总数 */
  const total = ref(0);

  /** 是否有更多数据 */
  const hasMore = ref(true);

  /** 当前激活的标签页 */
  const activeTab = ref<string>('all');

  /** 标签页类型映射（key -> types） */
  const tabTypesMap = ref<Record<string, string[] | undefined>>({});

  // ==================== 计算属性 ====================

  /** 未读消息总数 */
  const unreadCount = computed(() => messages.value.filter(m => !m.isRead).length);

  /** 按类型统计未读数量 */
  const unreadCountByType = computed(() => {
    const counts: Record<string, number> = {};
    messages.value.forEach(m => {
      if (!m.isRead) {
        counts[m.type] = (counts[m.type] || 0) + 1;
      }
    });
    return counts;
  });

  /** 根据当前标签页筛选消息 */
  const filteredMessages = computed(() => {
    // 'all' 标签页显示所有消息
    if (activeTab.value === 'all') {
      return messages.value;
    }

    // 获取当前标签页配置的类型
    const types = tabTypesMap.value[activeTab.value];

    // 如果没有配置类型，按标签页 key 作为类型筛选
    if (!types || types.length === 0) {
      return messages.value.filter(m => m.type === activeTab.value);
    }

    // 按配置的类型筛选
    return messages.value.filter(m => types.includes(m.type));
  });

  // ==================== 方法 ====================

  /**
   * 添加新消息到列表顶部
   * @param message 新消息
   */
  function addMessage(message: NotificationMessage) {
    messages.value.unshift(message);
    total.value++;
  }

  /**
   * 设置消息列表
   * @param newMessages 新消息列表
   * @param append 是否追加到现有列表
   */
  function setMessages(newMessages: NotificationMessage[], append = false) {
    if (append) {
      messages.value.push(...newMessages);
    } else {
      messages.value = newMessages;
    }
  }

  /**
   * 标记单条消息为已读
   * @param id 消息 ID
   */
  function markAsRead(id: string) {
    const message = messages.value.find(m => m.id === id);
    if (message) {
      message.isRead = true;
    }
  }

  /**
   * 标记所有消息为已读
   * @param types 要标记的消息类型，为空则标记所有
   */
  function markAllAsRead(types?: string[]) {
    messages.value.forEach(m => {
      if (!types || types.length === 0 || types.includes(m.type)) {
        m.isRead = true;
      }
    });
  }

  /**
   * 设置加载状态
   * @param value 加载状态
   */
  function setLoading(value: boolean) {
    loading.value = value;
  }

  /**
   * 设置分页信息
   * @param page 当前页码
   * @param size 每页数量
   * @param totalCount 总数
   */
  function setPagination(page: number, size: number, totalCount: number) {
    currentPage.value = page;
    pageSize.value = size;
    total.value = totalCount;
    hasMore.value = page * size < totalCount;
  }

  /**
   * 设置当前激活的标签页
   * @param tab 标签页 key
   */
  function setActiveTab(tab: string) {
    activeTab.value = tab;
  }

  /**
   * 设置标签页类型映射
   * @param map 标签页类型映射
   */
  function setTabTypesMap(map: Record<string, string[] | undefined>) {
    tabTypesMap.value = map;
  }

  /**
   * 重置分页信息（不清空消息列表）
   */
  function resetPagination() {
    currentPage.value = 1;
    total.value = 0;
    hasMore.value = true;
  }

  /**
   * 重置状态
   */
  function reset() {
    messages.value = [];
    currentPage.value = 1;
    total.value = 0;
    hasMore.value = true;
  }

  /**
   * 完全重置（包括标签页）
   */
  function resetAll() {
    reset();
    activeTab.value = 'all';
    tabTypesMap.value = {};
  }

  return {
    // 状态
    messages,
    loading,
    currentPage,
    pageSize,
    total,
    hasMore,
    activeTab,
    tabTypesMap,
    // 计算属性
    unreadCount,
    unreadCountByType,
    filteredMessages,
    // 方法
    addMessage,
    setMessages,
    markAsRead,
    markAllAsRead,
    setLoading,
    setPagination,
    setActiveTab,
    setTabTypesMap,
    resetPagination,
    reset,
    resetAll
  };
});
