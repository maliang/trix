/**
 * 通知逻辑 Hook
 * @description 整合 Store 和 WebSocket，提供通知组件的核心业务逻辑
 * @requirements 3.3, 3.4, 4.1, 4.5, 5.3, 5.4, 5.5, 6.1, 6.2
 */
import { ref, computed, watch, onUnmounted } from 'vue';
import { useNotificationStore } from '@/store/modules/notification';
import { useWebSocket } from './useWebSocket';
import { get, post } from '@/service/request';
/**
 * 通知逻辑 Hook
 * @param props 组件 Props
 * @returns 通知状态和方法
 */
export function useNotification(props) {
    const store = useNotificationStore();
    // ==================== 本地状态 ====================
    const showDropdown = ref(false);
    const showDetail = ref(false);
    const currentMessage = ref(null);
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
    function handleNewMessage(message) {
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
    function showInAppNotification(message) {
        // 使用全局 $notification API（NaiveUI）
        window.$notification?.create({
            title: message.title,
            content: message.content,
            duration: props.notificationDuration ?? 4500,
            closable: true,
            onClose: () => { }
        });
    }
    // ==================== API 请求方法 ====================
    /**
     * 获取消息列表
     * @param page 页码，默认 1
     * @param append 是否追加到现有列表，默认 false
     * @requirements 3.3, 3.4
     */
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
            // 如果不是 'all' 标签页，添加类型筛选
            if (store.activeTab !== 'all') {
                const types = store.tabTypesMap[store.activeTab];
                if (types && types.length > 0) {
                    params.types = types.join(',');
                }
                else {
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
        }
        catch (e) {
            console.error('[Notification] 获取消息列表异常:', e);
        }
        finally {
            store.setLoading(false);
        }
    }
    /**
     * 加载更多消息
     * @requirements 3.4
     */
    async function loadMore() {
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
    async function markAsRead(id) {
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
            }
            catch (e) {
                console.error('[Notification] 标记已读异常:', e);
            }
        }
    }
    /**
     * 标记当前标签页所有消息为已读
     * @requirements 4.5
     */
    async function markAllAsRead() {
        // 获取当前标签页的类型
        let types;
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
            }
            catch (e) {
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
    function openDetail(message) {
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
    function closeDetail() {
        showDetail.value = false;
        currentMessage.value = null;
    }
    /**
     * 切换标签页
     * @param tab 标签页 key
     * @requirements 2.5
     */
    function changeTab(tab) {
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
    // ==================== 轮询逻辑 ====================
    /** 轮询定时器句柄 */
    let pollingTimer = null;
    /** 轮询是否运行中 */
    const isPolling = ref(false);
    /** 当前最大消息 ID（用于增量拉取） */
    let maxMessageId = 0;
    /**
     * 处理轮询拉取到的新消息
     * @param response 轮询响应
     */
    function handlePollResult(response) {
        if (!response.has_new || !response.messages || response.messages.length === 0) {
            return;
        }
        for (const msg of response.messages) {
            // 更新最大 ID
            const id = Number(msg.id);
            if (id > maxMessageId) {
                maxMessageId = id;
            }
            // 处理新消息（与 WebSocket 共用 handleNewMessage）
            handleNewMessage(msg);
        }
    }
    /**
     * 执行一次轮询请求
     */
    async function doPoll() {
        if (!props.pollingApi) {
            console.warn('[Notification] 未配置 pollingApi');
            stopPolling();
            return;
        }
        try {
            const params = {
                since_id: maxMessageId,
            };
            if (store.activeTab && store.activeTab !== 'all') {
                params.type = store.activeTab;
            }
            const { data, error } = await get(props.pollingApi, params);
            if (error) {
                console.error('[Notification] 轮询失败:', error);
                return;
            }
            if (data) {
                handlePollResult(data);
            }
        }
        catch (e) {
            console.error('[Notification] 轮询异常:', e);
        }
    }
    /**
     * 启动轮询
     */
    function startPolling() {
        if (pollingTimer !== null || isPolling.value) {
            return;
        }
        const interval = props.pollingInterval ?? 15000;
        if (interval < 1000) {
            console.warn('[Notification] 轮询间隔过短，已调整为 1000ms');
        }
        isPolling.value = true;
        pollingTimer = setInterval(() => {
            doPoll();
        }, Math.max(interval, 1000));
    }
    /**
     * 停止轮询
     */
    function stopPolling() {
        if (pollingTimer !== null) {
            clearInterval(pollingTimer);
            pollingTimer = null;
        }
        isPolling.value = false;
    }
    // 组件卸载时自动停止轮询
    onUnmounted(() => {
        stopPolling();
    });
    // ==================== 监听 Props 变化 ====================
    // 监听 tabs 配置变化
    watch(() => props.tabs, (newTabs) => {
        initTabs(newTabs);
    }, { immediate: true, deep: true });
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
        initTabs,
        startPolling,
        stopPolling,
        isPolling
    };
}
