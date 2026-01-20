<script setup lang="ts">
/**
 * 通知消息列表组件
 * @description 渲染消息项列表，支持点击事件传递
 * @requirements 3.1
 */
import NotificationItem from './NotificationItem.vue';
import type { NotificationMessage } from '../types';

interface Props {
  /** 消息列表 */
  messages: NotificationMessage[];
  /** 未读小点颜色 */
  dotColor?: string;
}

interface Emits {
  /** 点击消息项事件 */
  (e: 'clickItem', message: NotificationMessage): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <div class="notification-list">
    <NotificationItem
      v-for="message in messages"
      :key="message.id"
      :message="message"
      :dot-color="dotColor"
      @click="$emit('clickItem', message)"
    />
  </div>
</template>
