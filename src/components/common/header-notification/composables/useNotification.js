import { computed, ref, watch } from 'vue';
import { useNotificationStore } from '@/store/modules/notification';
import { get, post } from '@/service/request';

export function useNotification(props) {
  const store = useNotificationStore();
  const showDropdown = ref(false);
  const showDetail = ref(false);
  const currentMessage = ref(null);

  async function fetchMessages(page = 1, append = false) {
    if (!props.fetchApi) {
      console.warn('[Notification] 未配置 fetchApi');
      return;
    }

    store.setLoading(true);

    try {
      const params = {
        page,
        pageSize: props.pageSize || 10
      };

      if (store.activeTab !== 'all') {
        const types = store.tabTypesMap[store.activeTab];
        if (types && types.length > 0) {
          params.types = types.join(',');
        } else {
          params.type = store.activeTab;
        }
      }

      const { data, error } = await get(props.fetchApi, params);
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

  async function loadMore() {
    if (!store.hasMore || store.loading) return;
    await fetchMessages(store.currentPage + 1, true);
  }

  async function markAsRead(id) {
    store.markAsRead(id);

    if (props.readApi) {
      try {
        const { error } = await post(props.readApi, { id });
        if (error) {
          console.error('[Notification] 标记已读失败:', error);
        }
      } catch (e) {
        console.error('[Notification] 标记已读异常:', e);
      }
    }
  }

  async function markAllAsRead() {
    let types;
    if (store.activeTab !== 'all') {
      const tabTypes = store.tabTypesMap[store.activeTab];
      types = tabTypes && tabTypes.length > 0 ? tabTypes : [store.activeTab];
    }

    store.markAllAsRead(types);

    if (props.readAllApi) {
      try {
        const { error } = await post(props.readAllApi, { types });
        if (error) {
          console.error('[Notification] 全部已读失败:', error);
        }
      } catch (e) {
        console.error('[Notification] 全部已读异常:', e);
      }
    }
  }

  function openDetail(message) {
    currentMessage.value = message;
    showDetail.value = true;

    if (!message.isRead) {
      markAsRead(message.id);
    }
  }

  function closeDetail() {
    showDetail.value = false;
    currentMessage.value = null;
  }

  function changeTab(tab) {
    if (store.activeTab === tab) return;
    store.setActiveTab(tab);
    store.resetPagination();
    fetchMessages(1);
  }

  function initTabs(tabs) {
    if (!tabs || tabs.length === 0) {
      store.setTabTypesMap({});
      return;
    }

    const map = {};
    tabs.forEach(tab => {
      map[tab.key] = tab.types;
    });
    store.setTabTypesMap(map);
  }

  watch(
    () => props.tabs,
    newTabs => {
      initTabs(newTabs);
    },
    { immediate: true, deep: true }
  );

  return {
    showDropdown,
    showDetail,
    currentMessage,
    messages: computed(() => store.filteredMessages),
    loading: computed(() => store.loading),
    hasMore: computed(() => store.hasMore),
    unreadCount: computed(() => store.unreadCount),
    unreadCountByType: computed(() => store.unreadCountByType),
    activeTab: computed(() => store.activeTab),
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
