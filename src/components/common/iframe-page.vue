<script setup lang="ts">
/**
 * Iframe 页面组件
 * 用于在页面内嵌入外部链接
 */
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { NSpin } from 'naive-ui';
import { ref } from 'vue';

defineOptions({
  name: 'IframePage'
});

const route = useRoute();
const loading = ref(true);

/** 获取 iframe 地址 */
const iframeSrc = computed(() => {
  return (route.meta.href as string) || '';
});

/** iframe 加载完成 */
function onLoad() {
  loading.value = false;
}
</script>

<template>
  <div class="iframe-page h-full w-full relative">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-mask absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 z-10">
      <NSpin size="large">
        <template #description>
          <span class="text-gray-500">加载中...</span>
        </template>
      </NSpin>
    </div>
    
    <!-- Iframe -->
    <iframe
      v-if="iframeSrc"
      :src="iframeSrc"
      class="w-full h-full border-none"
      @load="onLoad"
    />
  </div>
</template>

<style scoped>
.iframe-page {
  min-height: 100%;
}
</style>
