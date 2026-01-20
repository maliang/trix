/**
 * 通知逻辑 Hook
 * @description 整合 Store 和 WebSocket，提供通知组件的核心业务逻辑
 * @requirements 3.3, 3.4, 4.1, 4.5, 5.3, 5.4, 5.5, 6.1, 6.2
 */

import { ref, computed, watch, type Ref, type ComputedRef } from 'vue';
import { useNotificationStore } from '@/store/modules/notification';
import { useWebSocket } from './useWebSocket';
import { get, post } from '@/service/request';
import type {
  HeaderNotificationProps,
  NotificationMessage,
  NotificationPageData,
  NotificationTabConfig
} from '../types';

/** useNotification Hook 返回值 */
export interface UseNotificationReturn {
  // ==================== 状态 ====================
  /** 下拉面板是否显示 */
  showDropdown: Ref<boolean>;
  /** 详情弹窗是否显示 */
  showDetail: Ref<boolean>;
  /** 当前查看的消息 */
  currentMessage: Ref<NotificationMessage | null>;
  /** WebSocket 是否已连接 */
  isConnected: Ref<boolean>;

  // ==================== Store 状态（计算属性） ====================
  /** 筛选后的消息列表 */
  messages: ComputedRef<NotificationMessage[]>;
  /** 加载状态 */
  loading: ComputedRef<boolean>;
  /** 是否有更多数据 */
  hasMore: ComputedRef<boolean>;
  /** 未读消息总数 */
  unreadCount: ComputedRef<number>;
  /** 按类型统计的未读数量 */
  unreadCountByType: ComputedRef<Record<string, number>>;
  /** 当前激活的标签页 */
  activeTab: ComputedRef<string>;

  // ==================== 方法 ====================
  /** 获取消息列表 */
  fetchMessages: (page?: number, append?: boolean) => Promise<void>;
  /** 加载更多消息 */
  loadMore: () => Promise<void>;
  /** 标记单条消息为已读 */
  markAsRead: (id: string) => Promise<void>;
  /** 标记当前标签页所有消息为已读 */
  markAllAsRead: () => Promise<void>;
  /** 打开消息详情 */
  openDetail: (message: NotificationMessage) => void;
  /** 关闭消息详情 */
  closeDetail: () => void;
  /** 切换标签页 */
  changeTab: (tab: string) => void;
  /** 初始化标签页配置 */
  initTabs: (tabs?: NotificationTabConfig[]) => void;
}

/**
 * 通知逻辑 Hook
 * @param props 组件 Props
 * @returns 通知状态和方法
 */
export function useNotification(props: HeaderNotificationProps): UseNotificationReturn {
  const store = useNotificationStore();

  // ==================== 本地状态 ====================
  const showDropdown = ref(false);
  const showDetail = ref(false);
  const currentMessage = ref<NotificationMessage | null>(null);

  // ==================== WebSocket 连接 ====================
  const { isConnected } = useWebSocket({
    url: props.wsUrl || '',
    enabled: props.enableWs ?? false,
    onMessage: handleNewMessage,
    onConnect: () => {
      console.log('[Notification] WebSocket 已连接');
    },
    onDisconnect: () => {
      console.log('[Notification] WebSocket 已断开');
    }
  });

  // ==================== 新消息处理 ====================

  /**
   * 处理 WebSocket 收到的新消息
   * @param message 新消息
   * @requirements 5.3, 5.4, 5.5, 6.1, 6.2
   */
  function handleNewMessage(message: NotificationMessage): void {
    // 将新消息添加到列表顶部（需求 5.3）
    store.addMessage(message);

    // 显示应用内通知（需求 6.1, 6.2）
    if (props.enableNotification !== false) {
      showInAppNotification(message);
    }
  }

  /**
   * 显示应用内通知
   * @param message 消息
   * @requirements 6.1, 6.2
   */
  function showInAppNotification(message: NotificationMessage): void {
    // 使用全局 $notification API（NaiveUI）
    window.$notification?.create({
      title: message.title,
      content: message.content,
      duration: props.notificationDuration ?? 4500,
      closable: true,
      onClose: () => {}
    });
  }

  // ==================== API 请求方法 ====================

  /**
   * 获取消息列表
   * @param page 页码，默认 1
   * @param append 是否追加到现有列表，默认 false
   * @requirements 3.3, 3.4
   */
  async function fetchMessages(page = 1, append = false): Promise<void> {
    if (!props.fetchApi) {
      console.warn('[Notification] 未配置 fetchApi');
      return;
    }

    store.setLoading(true);

    try {
      const params: Record<string, unknown> = {
        page,
        pageSize: props.pageSize || 10
      };

      // 如果不是 'all' 标签页，添加类型筛选
      if (store.activeTab !== 'all') {
        const types = store.tabTypesMap[store.activeTab];
        if (types && types.length > 0) {
          params.types = types.join(',');
        } else {
          params.type = store.activeTab;
        }
      }

      const { data, error } = await get<NotificationPageData>(props.fetchApi, params);

      if (error) {
        console.error('[Notification] 获取消息列表失败:', error);
        return;
      }

      if (data) {
        store.setMessages(data.list, append);
        store.setPagination(data.page, data.pageSize, data.total);
      }
    } catch (e) {
      console.error('[Notification] 获取消息列表异常:', e);
    } finally {
      store.setLoading(false);
    }
  }

  /**
   * 加载更多消息
   * @requirements 3.4
   */
  async function loadMore(): Promise<void> {
    if (!store.hasMore || store.loading) {
      return;
    }
    await fetchMessages(store.currentPage + 1, true);
  }

  /**
   * 标记单条消息为已读
   * @param id 消息 ID
   * @requirements 4.1
   */
  async function markAsRead(id: string): Promise<void> {
    // 先更新本地状态（乐观更新）
    store.markAsRead(id);

    // 如果配置了 API，则同步到服务器
    if (props.readApi) {
      try {
        const { error } = await post(props.readApi, { id });

        if (error) {
          console.error('[Notification] 标记已读失败:', error);
          // 注意：这里不回滚本地状态，保持乐观更新
        }
      } catch (e) {
        console.error('[Notification] 标记已读异常:', e);
      }
    }
  }

  /**
   * 标记当前标签页所有消息为已读
   * @requirements 4.5
   */
  async function markAllAsRead(): Promise<void> {
    // 获取当前标签页的类型
    let types: string[] | undefined;
    if (store.activeTab !== 'all') {
      const tabTypes = store.tabTypesMap[store.activeTab];
      types = tabTypes && tabTypes.length > 0 ? tabTypes : [store.activeTab];
    }

    // 先更新本地状态（乐观更新）
    store.markAllAsRead(types);

    // 如果配置了 API，则同步到服务器
    if (props.readAllApi) {
      try {
        const { error } = await post(props.readAllApi, { types });

        if (error) {
          console.error('[Notification] 全部已读失败:', error);
          // 注意：这里不回滚本地状态，保持乐观更新
        }
      } catch (e) {
        console.error('[Notification] 全部已读异常:', e);
      }
    }
  }

  // ==================== UI 交互方法 ====================

  /**
   * 打开消息详情
   * @param message 消息
   * @requirements 4.1, 4.2
   */
  function openDetail(message: NotificationMessage): void {
    currentMessage.value = message;
    showDetail.value = true;

    // 如果消息未读，标记为已读
    if (!message.isRead) {
      markAsRead(message.id);
    }
  }

  /**
   * 关闭消息详情
   */
  function closeDetail(): void {
    showDetail.value = false;
    currentMessage.value = null;
  }

  /**
   * 切换标签页
   * @param tab 标签页 key
   * @requirements 2.5
   */
  function changeTab(tab: string): void {
    if (store.activeTab === tab) {
      return;
    }

    store.setActiveTab(tab);
    // 只重置分页信息，不清空消息列表，避免徽章闪烁
    store.resetPagination();
    fetchMessages(1);
  }

  /**
   * 初始化标签页配置
   * @param tabs 标签页配置
   */
  function initTabs(tabs?: NotificationTabConfig[]): void {
    if (!tabs || tabs.length === 0) {
      store.setTabTypesMap({});
      return;
    }

    const map: Record<string, string[] | undefined> = {};
    tabs.forEach(tab => {
      map[tab.key] = tab.types;
    });
    store.setTabTypesMap(map);
  }

  // ==================== 监听 Props 变化 ====================

  // 监听 tabs 配置变化
  watch(
    () => props.tabs,
    (newTabs) => {
      initTabs(newTabs);
    },
    { immediate: true, deep: true }
  );

  // ==================== 返回值 ====================

  return {
    // 状态
    showDropdown,
    showDetail,
    currentMessage,
    isConnected,

    // Store 状态（计算属性）
    messages: computed(() => store.filteredMessages),
    loading: computed(() => store.loading),
    hasMore: computed(() => store.hasMore),
    unreadCount: computed(() => store.unreadCount),
    unreadCountByType: computed(() => store.unreadCountByType),
    activeTab: computed(() => store.activeTab),

    // 方法
    fetchMessages,
    loadMore,
    markAsRead,
    markAllAsRead,
    openDetail,
    closeDetail,
    changeTab,
    initTabs
  };
}
