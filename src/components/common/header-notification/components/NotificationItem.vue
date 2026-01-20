<script setup lang="ts">
/**
 * 通知消息项组件
 * @description 显示单条通知消息，包括标题、内容摘要、时间和未读状态
 * @requirements 3.1, 3.2
 */
import { computed } from 'vue';
import type { NotificationMessage } from '../types';

interface Props {
  /** 消息数据 */
  message: NotificationMessage;
  /** 未读小点颜色 */
  dotColor?: string;
}

const props = defineProps<Props>();

/**
 * 计算相对时间显示
 * @description 将时间戳转换为友好的相对时间格式
 */
const timeAgo = computed(() => {
  const now = new Date();
  const date = new Date(props.message.createdAt);
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return date.toLocaleDateString();
});

/**
 * 未读小点样式
 */
const dotStyle = computed(() => {
  if (props.dotColor) {
    return { backgroundColor: props.dotColor };
  }
  return {};
});

/**
 * 未读背景色样式
 */
const unreadBgStyle = computed(() => {
  if (props.dotColor) {
    // 从颜色中提取 RGB 值用于半透明背景
    return {
      '--unread-bg': `${props.dotColor}0a`,
      '--unread-bg-hover': `${props.dotColor}14`
    };
  }
  return {};
});
</script>

<template>
  <div
    class="notification-item"
    :class="{ unread: !message.isRead }"
    :style="!message.isRead ? unreadBgStyle : {}"
  >
    <div class="item-content">
      <!-- 未读状态标识 -->
      <div class="unread-dot-wrapper">
        <span v-if="!message.isRead" class="unread-dot" :style="dotStyle" />
      </div>

      <div class="item-main">
        <!-- 标题和时间 -->
        <div class="item-header">
          <span class="item-title" :class="{ 'is-unread': !message.isRead }">
            {{ message.title }}
          </span>
          <span class="item-time">{{ timeAgo }}</span>
        </div>
        <!-- 内容摘要 -->
        <p class="item-desc">{{ message.content }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid var(--n-border-color, #f0f0f0);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background-color: var(--n-color-hover, #f5f5f5);
}

.notification-item.unread {
  background-color: var(--unread-bg, rgba(24, 160, 88, 0.04));
}

.notification-item.unread:hover {
  background-color: var(--unread-bg-hover, rgba(24, 160, 88, 0.08));
}

.item-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.unread-dot-wrapper {
  width: 8px;
  height: 20px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: rgb(var(--primary-color, 24 160 88));
  border-radius: 50%;
}

.item-main {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.item-title {
  font-size: 14px;
  color: var(--n-text-color, #333);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0;
}

.item-title.is-unread {
  font-weight: 600;
}

.item-time {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
  margin-left: 12px;
}

.item-desc {
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
