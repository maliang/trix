<script setup lang="ts">
/**
 * 通知下拉面板组件
 * @description 实现标签页切换、滚动加载更多、空状态和加载状态显示、全部已读按钮、内嵌详情展示
 * @requirements 2.1, 2.2, 2.3, 2.4, 2.5, 3.3, 3.4, 3.5, 3.6, 4.4
 */
import { computed, ref, watch, nextTick } from 'vue';
import { NTabs, NTabPane, NButton, NSpin, NScrollbar, NTag } from 'naive-ui';
import type { ScrollbarInst } from 'naive-ui';
import { Icon } from '@iconify/vue';
import NotificationList from './NotificationList.vue';
import type { NotificationMessage, NotificationTabConfig } from '../types';

interface Props {
  /** 标签页配置 */
  tabs?: NotificationTabConfig[];
  /** 消息列表 */
  messages: NotificationMessage[];
  /** 加载状态 */
  loading: boolean;
  /** 是否有更多数据 */
  hasMore: boolean;
  /** 当前激活的标签页 */
  activeTab: string;
  /** 按类型统计的未读数量 */
  unreadCountByType: Record<string, number>;
  /** 标签页未读徽章背景色 */
  tabBadgeColor?: string;
  /** 是否启用详情展示 */
  enableDetail?: boolean;
  /** 是否显示详情 */
  showDetail?: boolean;
  /** 当前查看的消息 */
  currentMessage?: NotificationMessage | null;
}

interface Emits {
  (e: 'changeTab', tab: string): void;
  (e: 'loadMore'): void;
  (e: 'clickItem', message: NotificationMessage): void;
  (e: 'markAllRead'): void;
  (e: 'closeDetail'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 滚动条实例引用
const scrollbarRef = ref<ScrollbarInst | null>(null);
// 记录滚动位置
const savedScrollTop = ref(0);

// 缓存每个标签页的消息
const cachedMessages = ref<Record<string, NotificationMessage[]>>({});
const isTabSwitching = ref(false);

watch(
  () => props.messages,
  (newMessages) => {
    if (newMessages.length > 0 || !isTabSwitching.value) {
      cachedMessages.value[props.activeTab] = [...newMessages];
    }
    isTabSwitching.value = false;
  },
  { immediate: true, deep: true }
);

// 监听详情显示状态，恢复滚动位置
watch(
  () => props.showDetail,
  (newVal, oldVal) => {
    if (!newVal && oldVal) {
      // 从详情返回列表时，恢复滚动位置
      nextTick(() => {
        scrollbarRef.value?.scrollTo({ top: savedScrollTop.value });
      });
    }
  }
);

const displayMessages = computed(() => {
  if (isTabSwitching.value && cachedMessages.value[props.activeTab]?.length > 0) {
    return cachedMessages.value[props.activeTab];
  }
  return props.messages;
});

const showTabs = computed(() => props.tabs && props.tabs.length > 0);

const headerStyle = computed(() => ({
  backgroundColor: props.tabBadgeColor || 'rgb(var(--primary-color, 24 160 88))'
}));

const themeColor = computed(() => props.tabBadgeColor || 'rgb(var(--primary-color, 24 160 88))');

/**
 * 格式化详情时间
 */
const formattedDetailTime = computed(() => {
  if (!props.currentMessage) return '';
  return new Date(props.currentMessage.createdAt).toLocaleString();
});

function handleTabChange(tab: string) {
  isTabSwitching.value = true;
  emit('changeTab', tab);
}

function handleScroll(e: Event) {
  const target = e.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = target;
  
  // 记录当前滚动位置
  savedScrollTop.value = scrollTop;
  
  if (scrollHeight - scrollTop - clientHeight < 50 && props.hasMore && !props.loading) {
    emit('loadMore');
  }
}

function getTabUnreadCount(tab: NotificationTabConfig): number {
  if (!tab.types || tab.types.length === 0) {
    return props.unreadCountByType[tab.key] || 0;
  }
  return tab.types.reduce((sum, type) => sum + (props.unreadCountByType[type] || 0), 0);
}

function getTypeColor(type: string): 'warning' | 'info' | 'success' | 'error' | 'default' | 'primary' {
  const colorMap: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default' | 'primary'> = {
    system: 'warning',
    notice: 'info',
    message: 'success',
    todo: 'error'
  };
  return colorMap[type] || 'default';
}
</script>

<template>
  <div class="notification-dropdown">
    <!-- 列表视图 -->
    <template v-if="!showDetail">
      <!-- 头部 -->
      <div class="dropdown-header" :style="headerStyle">
        <div class="header-left">
          <Icon icon="mdi:bell-ring-outline" width="18" height="18" class="header-icon" />
          <span class="header-title">消息通知</span>
        </div>
        <NButton text size="small" class="mark-read-btn" @click="emit('markAllRead')">
          <template #icon>
            <Icon icon="mdi:check-all" width="16" height="16" />
          </template>
          全部已读
        </NButton>
      </div>

      <!-- 标签页 -->
      <div v-if="showTabs" class="dropdown-tabs">
        <NTabs
          :value="activeTab"
          type="line"
          size="small"
          animated
          @update:value="handleTabChange"
        >
          <NTabPane v-for="tab in tabs" :key="tab.key" :name="tab.key">
            <template #tab>
              <div class="tab-item">
                <Icon v-if="tab.icon" :icon="tab.icon" width="16" height="16" />
                <span>{{ tab.label }}</span>
                <span v-if="getTabUnreadCount(tab) > 0" class="tab-badge">
                  {{ getTabUnreadCount(tab) > 99 ? '99+' : getTabUnreadCount(tab) }}
                </span>
              </div>
            </template>
          </NTabPane>
        </NTabs>
      </div>

      <!-- 消息列表区域 -->
      <div class="dropdown-content">
        <NScrollbar ref="scrollbarRef" style="height: 100%" @scroll="handleScroll">
          <div v-if="loading && displayMessages.length === 0" class="loading-skeleton">
            <div v-for="i in 3" :key="i" class="skeleton-item">
              <div class="skeleton-dot" />
              <div class="skeleton-main">
                <div class="skeleton-title" />
                <div class="skeleton-desc" />
              </div>
            </div>
          </div>

          <template v-else>
            <NotificationList
              v-if="displayMessages.length > 0"
              :messages="displayMessages"
              :dot-color="tabBadgeColor"
              @click-item="(msg) => emit('clickItem', msg)"
            />

            <div v-if="displayMessages.length === 0" class="empty-state">
              <Icon icon="mdi:inbox-outline" width="48" height="48" class="empty-icon" />
              <span class="empty-text">暂无消息</span>
            </div>

            <div v-if="loading && displayMessages.length > 0" class="loading-more">
              <NSpin size="small" />
              <span>加载中...</span>
            </div>

            <div v-if="!hasMore && displayMessages.length > 0" class="no-more">
              <span class="no-more-line" />
              <span class="no-more-text">没有更多了</span>
              <span class="no-more-line" />
            </div>
          </template>
        </NScrollbar>
      </div>
    </template>

    <!-- 详情视图 -->
    <template v-else-if="enableDetail && currentMessage">
      <!-- 详情头部 -->
      <div class="detail-header" :style="headerStyle">
        <NButton text size="small" class="back-btn" @click="emit('closeDetail')">
          <template #icon>
            <Icon icon="mdi:arrow-left" width="18" height="18" />
          </template>
          返回
        </NButton>
        <span class="detail-title">消息详情</span>
        <div class="header-placeholder" />
      </div>

      <!-- 详情内容 -->
      <div class="detail-content">
        <NScrollbar style="height: 100%">
          <div class="detail-inner">
            <!-- 标题 -->
            <h3 class="message-title">{{ currentMessage.title }}</h3>
            
            <!-- 元信息 -->
            <div class="message-meta">
              <NTag size="small" :type="getTypeColor(currentMessage.type)" :bordered="false" round>
                {{ currentMessage.type }}
              </NTag>
              <span class="meta-time">
                <Icon icon="mdi:clock-outline" width="14" height="14" />
                {{ formattedDetailTime }}
              </span>
            </div>

            <!-- 内容 -->
            <div class="message-body">
              {{ currentMessage.content }}
            </div>
          </div>
        </NScrollbar>
      </div>

      <!-- 详情底部 -->
      <div class="detail-footer">
        <NButton type="primary" block @click="emit('closeDetail')">知道了</NButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
.notification-dropdown {
  margin: -12px -16px;
  width: 380px;
  background: var(--n-color, #fff);
  border-radius: 8px;
  overflow: hidden;
}

/* 头部样式 */
.dropdown-header,
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  color: rgba(255, 255, 255, 0.9);
}

.header-title,
.detail-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.mark-read-btn,
.back-btn {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 12px;
}

.mark-read-btn:hover,
.back-btn:hover {
  color: #fff !important;
}

.header-placeholder {
  width: 60px;
}

/* 标签页样式 */
.dropdown-tabs {
  padding: 0;
  background: var(--n-color, #fff);
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.dropdown-tabs::-webkit-scrollbar {
  display: none;
}

.dropdown-tabs :deep(.n-tabs-nav) {
  padding: 0 12px;
}

.dropdown-tabs :deep(.n-tabs-tab) {
  padding: 10px 12px;
  font-size: 13px;
  flex-shrink: 0;
}

.dropdown-tabs :deep(.n-tabs-tab-pad) {
  width: 8px;
  flex-shrink: 0;
}

.dropdown-tabs :deep(.n-tabs-bar) {
  bottom: 0;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  position: relative;
}

.tab-badge {
  position: absolute;
  right: -12px;
  top: -8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 500;
  color: #fff;
  background: v-bind(themeColor);
  border-radius: 8px;
}

/* 内容区域 */
.dropdown-content {
  height: 360px;
  background: var(--n-color, #fff);
}

/* 加载骨架屏 */
.loading-skeleton {
  padding: 8px 0;
}

.skeleton-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
}

.skeleton-dot {
  width: 8px;
  height: 8px;
  margin-top: 6px;
  background: #e8e8e8;
  border-radius: 50%;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-main {
  flex: 1;
}

.skeleton-title {
  width: 60%;
  height: 16px;
  margin-bottom: 8px;
  background: #e8e8e8;
  border-radius: 4px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.skeleton-desc {
  width: 90%;
  height: 14px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  animation-delay: 0.2s;
}

@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 280px;
  color: #999;
}

.empty-icon {
  color: #d9d9d9;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

/* 加载更多 */
.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
  font-size: 12px;
  color: #999;
}

/* 没有更多 */
.no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 0;
}

.no-more-line {
  width: 40px;
  height: 1px;
  background: #e8e8e8;
}

.no-more-text {
  font-size: 12px;
  color: #bbb;
}

/* 详情视图样式 */
.detail-content {
  height: 360px;
  background: var(--n-color, #fff);
}

.detail-inner {
  padding: 16px;
}

.message-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--n-text-color, #333);
  line-height: 1.4;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px dashed var(--n-border-color, #e5e7eb);
}

.meta-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.message-body {
  font-size: 14px;
  line-height: 1.8;
  color: var(--n-text-color, #333);
  white-space: pre-wrap;
  word-break: break-word;
}

.detail-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--n-border-color, #e8e8e8);
  background: var(--n-color, #fff);
}
</style>
