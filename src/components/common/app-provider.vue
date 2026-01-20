<script setup lang="ts">
import { 
  NDialogProvider, 
  NLoadingBarProvider, 
  NMessageProvider, 
  NNotificationProvider,
  useDialog,
  useLoadingBar,
  useMessage,
  useNotification
} from 'naive-ui';

defineOptions({
  name: 'AppProvider'
});

/**
 * 挂载 Naive UI 的全局 API 到 window 对象
 * 使得在非组件环境（如 Pinia store）中也能使用消息提示等功能
 */
function setupNaiveDiscreteApi() {
  const message = useMessage();
  const notification = useNotification();
  const dialog = useDialog();
  const loadingBar = useLoadingBar();

  window.$message = message;
  window.$notification = notification;
  window.$dialog = dialog;
  window.$loadingBar = loadingBar;
}
</script>

<template>
  <NLoadingBarProvider>
    <NDialogProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <!-- 内部组件用于挂载全局 API -->
          <NaiveProviderContent />
          <slot />
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NLoadingBarProvider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

/**
 * 内部组件，用于在 Provider 内部调用 useXxx hooks
 * 必须在 Provider 内部才能正确获取到实例
 */
const NaiveProviderContent = defineComponent({
  name: 'NaiveProviderContent',
  setup() {
    const message = useMessage();
    const notification = useNotification();
    const dialog = useDialog();
    const loadingBar = useLoadingBar();

    // 挂载到 window 对象
    window.$message = message;
    window.$notification = notification;
    window.$dialog = dialog;
    window.$loadingBar = loadingBar;

    return () => null;
  }
});

export { NaiveProviderContent };
</script>
