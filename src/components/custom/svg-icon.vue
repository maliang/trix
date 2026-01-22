<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Icon } from '@iconify/vue';

defineOptions({ name: 'SvgIcon', inheritAttrs: false });

/**
 * Props
 *
 * - 使用 iconify 图标
 */
interface Props {
  /** Iconify 图标名称 */
  icon?: string;
}

const props = defineProps<Props>();

const attrs = useAttrs();

const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || ''
}));
</script>

<template>
  <Icon v-if="icon" :icon="icon" v-bind="bindAttrs" />
</template>

<style scoped></style>
