<script setup lang="ts">
/**
 * Header 通知组件
 * @description 位于 Header 右侧的消息通知入口，使用 NPopover 实现下拉面板，NBadge 显示未读数量
 * @requirements 1.1, 1.2, 1.3, 1.4, 1.5, 2.1
 */
import { onMounted, computed } from 'vue';
import { NBadge, NPopover, NButton } from 'naive-ui';
import { Icon } from '@iconify/vue';
import NotificationDropdown from './components/NotificationDropdown.vue';
import { useNotification } from './composables/useNotification';
import type { HeaderNotificationProps } from './types';

const props = withDefaults(defineProps<HeaderNotificationProps>(), {
  badgeMode: 'count',
  pageSize: 10,
  enableWs: false,
  enableNotification: true,
  notificationDuration: 4500,
  enableDetail: true
});

const {
  showDropdown,
  showDetail,
  currentMessage,
  messages,
  loading,
  hasMore,
  unreadCount,
  unreadCountByType,
  activeTab,
  fetchMessages,
  loadMore,
  markAllAsRead,
  openDetail,
  closeDetail,
  changeTab
} = useNotification(props);

/**
 * 处理消息项点击
 */
function handleItemClick(message: any) {
  if (props.enableDetail) {
    openDetail(message);
  }
}

/**
 * 处理标签切换
 */
function handleTabChange(tab: string) {
  changeTab(tab);
}

/**
 * 计算 Badge 显示值
 * @requirements 1.3, 1.4
 */
function getBadgeValue(): number | undefined {
  if (props.badgeMode === 'dot') {
    return undefined;
  }
  return unreadCount.value;
}

/**
 * 计算 Badge 最大值
 * @requirements 1.4
 */
function getBadgeMax(): number {
  return 99;
}

/**
 * 是否显示 Badge
 * @requirements 1.5
 */
function shouldShowBadge(): boolean {
  return unreadCount.value > 0;
}

// 组件挂载时获取消息列表
onMounted(() => {
  fetchMessages();
});
</script>

<template>
  <NPopover
    v-model:show="showDropdown"
    trigger="click"
    placement="bottom-end"
    :width="380"
    :show-arrow="false"
  >
    <template #trigger>
      <NButton quaternary circle>
        <template #icon>
          <NBadge
            :value="getBadgeValue()"
            :max="getBadgeMax()"
            :dot="badgeMode === 'dot'"
            :show="shouldShowBadge()"
          >
            <Icon icon="ion:notifications-outline" width="20" height="20" />
          </NBadge>
        </template>
      </NButton>
    </template>

    <NotificationDropdown
      :tabs="tabs"
      :messages="messages"
      :loading="loading"
      :has-more="hasMore"
      :active-tab="activeTab"
      :unread-count-by-type="unreadCountByType"
      :tab-badge-color="tabBadgeColor"
      :enable-detail="enableDetail"
      :show-detail="showDetail"
      :current-message="currentMessage"
      @change-tab="handleTabChange"
      @load-more="loadMore"
      @click-item="handleItemClick"
      @mark-all-read="markAllAsRead"
      @close-detail="closeDetail"
    />
  </NPopover>
</template>
