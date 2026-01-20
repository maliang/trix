<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import BaseLayout from './base-layout/index.vue';
import BlankLayout from './blank-layout/index.vue';

defineOptions({
  name: 'LayoutWrapper'
});

const route = useRoute();

// 根据路由 meta.layoutType 动态选择布局组件
const layoutComponent = computed(() => {
  const layoutType = route.meta?.layoutType;
  return layoutType === 'blank' ? BlankLayout : BaseLayout;
});
</script>

<template>
  <component :is="layoutComponent" />
</template>
