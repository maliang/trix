<script setup lang="ts">
/**
 * TaskNode - 任务节点
 * Vue Flow 自定义节点示例
 */
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';
import { NTag, NProgress } from 'naive-ui';
import { Icon } from '@iconify/vue';

// Vue Flow 节点 props
interface Props {
  id: string;
  data: {
    title?: string;
    assignee?: string;
    status?: 'pending' | 'active' | 'completed';
    progress?: number;
    icon?: string;
  };
}

const props = defineProps<Props>();

const statusConfig = computed(() => {
  const status = props.data?.status || 'pending';
  const configs = {
    pending: { type: 'default' as const, text: '待处理', color: '#909399' },
    active: { type: 'warning' as const, text: '进行中', color: '#e6a23c' },
    completed: { type: 'success' as const, text: '已完成', color: '#67c23a' }
  };
  return configs[status];
});

const progress = computed(() => props.data?.progress || 0);
</script>

<template>
  <div class="task-node">
    <!-- 连接点 -->
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
    
    <div class="task-header">
      <Icon :icon="data?.icon || 'mdi:clipboard-text'" class="task-icon" />
      <span class="task-title">{{ data?.title || '任务节点' }}</span>
    </div>
    <div class="task-body">
      <div class="task-assignee">
        <Icon icon="mdi:account" />
        <span>{{ data?.assignee || '未分配' }}</span>
      </div>
      <NProgress
        v-if="progress > 0"
        type="line"
        :percentage="progress"
        :height="6"
        :show-indicator="false"
        :color="statusConfig.color"
        class="task-progress"
      />
    </div>
    <div class="task-footer">
      <NTag :type="statusConfig.type" size="small">
        {{ statusConfig.text }}
      </NTag>
    </div>
  </div>
</template>

<style scoped>
.task-node {
  width: 180px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-size: 12px;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.task-icon {
  font-size: 16px;
}

.task-title {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-body {
  padding: 10px;
}

.task-assignee {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  margin-bottom: 8px;
}

.task-progress {
  margin-top: 6px;
}

.task-footer {
  padding: 6px 10px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}
</style>
