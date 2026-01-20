<script setup lang="ts">
/**
 * ApprovalNode - 审批节点
 * Vue Flow 自定义节点示例
 */
import { computed } from 'vue';
import { Handle, Position } from '@vue-flow/core';
import { NButton, NAvatar, NTag } from 'naive-ui';
import { Icon } from '@iconify/vue';

// Vue Flow 节点 props
interface Props {
  id: string;
  data: {
    title?: string;
    approver?: string;
    status?: 'pending' | 'approved' | 'rejected';
    time?: string;
  };
}

const props = defineProps<Props>();

const statusConfig = computed(() => {
  const status = props.data?.status || 'pending';
  const configs = {
    pending: { type: 'warning' as const, text: '待审批', icon: 'mdi:clock-outline' },
    approved: { type: 'success' as const, text: '已通过', icon: 'mdi:check-circle' },
    rejected: { type: 'error' as const, text: '已拒绝', icon: 'mdi:close-circle' }
  };
  return configs[status];
});
</script>

<template>
  <div class="approval-node" :class="`status-${data?.status || 'pending'}`">
    <!-- 连接点 -->
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
    
    <div class="approval-header">
      <Icon icon="mdi:file-sign" class="header-icon" />
      <span>{{ data?.title || '审批节点' }}</span>
    </div>
    <div class="approval-body">
      <div class="approver-info">
        <NAvatar :size="32" round>
          <Icon icon="mdi:account" :width="20" />
        </NAvatar>
        <div class="approver-detail">
          <div class="approver-name">{{ data?.approver || '审批人' }}</div>
          <div class="approver-time">{{ data?.time || '等待中' }}</div>
        </div>
      </div>
      <NTag :type="statusConfig.type" size="small" class="status-tag">
        <template #icon>
          <Icon :icon="statusConfig.icon" />
        </template>
        {{ statusConfig.text }}
      </NTag>
    </div>
    <div v-if="data?.status === 'pending'" class="approval-actions">
      <NButton size="tiny" type="success" secondary>
        <template #icon><Icon icon="mdi:check" /></template>
        通过
      </NButton>
      <NButton size="tiny" type="error" secondary>
        <template #icon><Icon icon="mdi:close" /></template>
        拒绝
      </NButton>
    </div>
  </div>
</template>

<style scoped>
.approval-node {
  width: 200px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-size: 12px;
  border-left: 4px solid #e6a23c;
}

.approval-node.status-approved {
  border-left-color: #67c23a;
}

.approval-node.status-rejected {
  border-left-color: #f56c6c;
}

.approval-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background: #f8f9fa;
  font-weight: 500;
  color: #333;
}

.header-icon {
  font-size: 16px;
  color: #667eea;
}

.approval-body {
  padding: 12px;
}

.approver-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.approver-detail {
  flex: 1;
}

.approver-name {
  font-weight: 500;
  color: #333;
}

.approver-time {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}

.status-tag {
  width: 100%;
  justify-content: center;
}

.approval-actions {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
}

.approval-actions .n-button {
  flex: 1;
}
</style>
