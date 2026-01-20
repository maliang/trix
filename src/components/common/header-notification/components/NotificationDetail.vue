<script setup lang="ts">
/**
 * 通知详情弹窗组件
 * @description 使用 NModal 显示消息完整内容，包括标题、内容、时间、类型
 * @requirements 4.2, 4.3
 */
import { computed } from 'vue';
import { NModal, NCard, NTag, NButton } from 'naive-ui';
import { Icon } from '@iconify/vue';
import type { NotificationMessage } from '../types';

interface Props {
  /** 弹窗是否显示 */
  show: boolean;
  /** 消息数据 */
  message: NotificationMessage | null;
}

interface Emits {
  /** 更新显示状态 */
  (e: 'update:show', value: boolean): void;
  /** 关闭弹窗 */
  (e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

/**
 * 格式化时间显示
 */
const formattedTime = computed(() => {
  if (!props.message) return '';
  return new Date(props.message.createdAt).toLocaleString();
});

/**
 * 获取类型对应的图标
 */
function getTypeIcon(type: string): string {
  const iconMap: Record<string, string> = {
    system: 'mdi:cog',
    notice: 'mdi:bullhorn',
    message: 'mdi:message-text',
    todo: 'mdi:checkbox-marked-circle-outline'
  };
  return iconMap[type] || 'mdi:bell';
}

/**
 * 获取类型对应的颜色
 */
function getTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    system: 'warning',
    notice: 'info',
    message: 'success',
    todo: 'error'
  };
  return colorMap[type] || 'default';
}

/**
 * 处理关闭弹窗
 */
function handleClose() {
  emit('update:show', false);
  emit('close');
}
</script>

<template>
  <NModal
    :show="show"
    preset="card"
    style="width: 520px; max-width: 90vw"
    :bordered="false"
    :segmented="{ content: true, footer: 'soft' }"
    :mask-closable="false"
    :close-on-esc="false"
    @update:show="(v) => emit('update:show', v)"
  >
    <template #header>
      <div class="modal-header">
        <Icon :icon="getTypeIcon(message?.type || '')" width="22" height="22" class="header-icon" />
        <span class="header-title">{{ message?.title || '消息详情' }}</span>
      </div>
    </template>

    <template v-if="message">
      <!-- 消息元信息 -->
      <div class="meta-info">
        <NTag size="small" :type="getTypeColor(message.type)" :bordered="false" round>
          {{ message.type }}
        </NTag>
        <span class="meta-time">
          <Icon icon="mdi:clock-outline" width="14" height="14" />
          {{ formattedTime }}
        </span>
      </div>

      <!-- 消息内容 -->
      <div class="message-content">
        {{ message.content }}
      </div>
    </template>

    <template #footer>
      <div class="modal-footer">
        <NButton type="primary" @click="handleClose">知道了</NButton>
      </div>
    </template>
  </NModal>
</template>

<style scoped>
.modal-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-icon {
  color: var(--n-color-target, #18a058);
}

.header-title {
  font-size: 16px;
  font-weight: 600;
}

.meta-info {
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

.message-content {
  font-size: 14px;
  line-height: 1.8;
  color: var(--n-text-color, #333);
  white-space: pre-wrap;
  word-break: break-word;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
