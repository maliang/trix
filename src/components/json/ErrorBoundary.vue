<script setup lang="ts">
/**
 * 错误边界组件
 * 捕获子组件渲染错误并显示友好提示
 * 需求: 10.4 - 当发生 schema 验证错误时，系统应显示有帮助的错误消息
 */
import { ref, onErrorCaptured, provide, readonly } from 'vue';
import { NResult, NButton, NSpace, NCollapse, NCollapseItem, NCode, NAlert } from 'naive-ui';

defineOptions({
  name: 'ErrorBoundary'
});

// Props 定义
interface Props {
  /** 错误标题 */
  errorTitle?: string;
  /** 是否显示错误详情 */
  showDetails?: boolean;
  /** 是否显示重试按钮 */
  showRetry?: boolean;
  /** 是否显示返回按钮 */
  showBack?: boolean;
  /** 自定义错误处理函数 */
  onError?: (error: Error, info: string) => void;
  /** 最大重试次数 */
  maxRetries?: number;
}

const props = withDefaults(defineProps<Props>(), {
  errorTitle: '页面渲染出错',
  showDetails: true,
  showRetry: true,
  showBack: true,
  maxRetries: 3
});

// Emits 定义
const emit = defineEmits<{
  /** 错误发生 */
  error: [error: Error, info: string];
  /** 重试 */
  retry: [];
  /** 返回 */
  back: [];
  /** 错误已恢复 */
  recovered: [];
}>();

// 状态
const hasError = ref(false);
const errorMessage = ref('');
const errorStack = ref('');
const errorInfo = ref('');
const retryCount = ref(0);

// 是否为开发模式
const isDev = import.meta.env.DEV;

/**
 * 错误上下文，供子组件使用
 */
const errorContext = {
  hasError: readonly(hasError),
  errorMessage: readonly(errorMessage),
  retryCount: readonly(retryCount),
  reportError: (error: Error, info?: string) => {
    handleError(error, info || 'manual');
  },
  clearError: () => {
    resetError();
  }
};

provide('errorBoundary', errorContext);

/**
 * 处理错误
 */
function handleError(error: Error, info: string) {
  hasError.value = true;
  errorMessage.value = error.message || '未知错误';
  errorStack.value = error.stack || '';
  errorInfo.value = info;

  // 记录错误到控制台
  console.error('[ErrorBoundary] 捕获到渲染错误:', {
    message: error.message,
    stack: error.stack,
    info
  });

  // 调用自定义错误处理函数
  if (props.onError) {
    props.onError(error, info);
  }

  emit('error', error, info);
}

/**
 * 重置错误状态
 */
function resetError() {
  hasError.value = false;
  errorMessage.value = '';
  errorStack.value = '';
  errorInfo.value = '';
  emit('recovered');
}

/**
 * 重试
 */
function retry() {
  if (retryCount.value < props.maxRetries) {
    retryCount.value++;
    resetError();
    emit('retry');
  }
}

/**
 * 返回上一页
 */
function goBack() {
  emit('back');
  window.history.back();
}

/**
 * 复制错误信息
 */
async function copyErrorInfo() {
  const errorText = `
错误信息: ${errorMessage.value}
错误来源: ${errorInfo.value}
错误堆栈:
${errorStack.value}
  `.trim();

  try {
    await navigator.clipboard.writeText(errorText);
    // 可以添加消息提示
  } catch (e) {
    console.error('复制失败:', e);
  }
}

/**
 * 捕获子组件错误
 */
onErrorCaptured((error: Error, instance, info: string) => {
  handleError(error, info);
  // 返回 false 阻止错误继续向上传播
  return false;
});

// 暴露方法供外部调用
defineExpose({
  hasError,
  errorMessage,
  retryCount,
  resetError,
  retry
});
</script>

<template>
  <div class="error-boundary">
    <!-- 错误状态 -->
    <div v-if="hasError" class="error-container">
      <NResult status="error" :title="props.errorTitle" :description="errorMessage">

        <!-- 错误详情 -->
        <template v-if="props.showDetails && (errorStack || errorInfo)">
          <NCollapse class="error-details mb-4">
            <NCollapseItem title="错误详情" name="details">
              <div class="error-detail-content">
                <div v-if="errorInfo" class="mb-2">
                  <strong>错误来源：</strong>
                  <span class="text-gray-600 dark:text-gray-400">{{ errorInfo }}</span>
                </div>
                <div v-if="errorStack">
                  <strong>错误堆栈：</strong>
                  <NCode
                    :code="errorStack"
                    language="text"
                    class="mt-2 text-xs"
                    style="max-height: 200px; overflow: auto;"
                  />
                </div>
              </div>
            </NCollapseItem>
          </NCollapse>
        </template>

        <template #footer>
          <NSpace justify="center">
            <NButton v-if="props.showBack" @click="goBack">
              返回上一页
            </NButton>
            <NButton
              v-if="props.showRetry && retryCount < props.maxRetries"
              type="primary"
              @click="retry"
            >
              重试 ({{ retryCount }}/{{ props.maxRetries }})
            </NButton>
            <NButton
              v-if="props.showDetails"
              quaternary
              size="small"
              @click="copyErrorInfo"
            >
              复制错误信息
            </NButton>
          </NSpace>
        </template>
      </NResult>

      <!-- 开发模式提示 -->
      <div v-if="isDev" class="dev-tips mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded">
        <p class="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
          <strong>开发提示：</strong>
        </p>
        <ul class="text-xs text-yellow-600 dark:text-yellow-400 list-disc list-inside">
          <li>检查 JSON Schema 格式是否正确</li>
          <li>确认组件名称是否已注册</li>
          <li>验证 props 类型是否匹配</li>
          <li>查看控制台获取更多错误信息</li>
        </ul>
      </div>
    </div>

    <!-- 正常内容 -->
    <slot v-else />
  </div>
</template>

<style scoped>
.error-boundary {
  width: 100%;
  height: 100%;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 24px;
}

.error-details {
  max-width: 600px;
  width: 100%;
  text-align: left;
}

.error-detail-content {
  font-size: 13px;
}

.dev-tips {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
</style>
