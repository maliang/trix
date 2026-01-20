<script setup lang="ts">
import type { PageTabProps } from '../../types';
import style from './index.module.css';

defineOptions({
  name: 'SliderTab'
});

defineProps<PageTabProps>();

type SlotFn = (props?: Record<string, unknown>) => any;

type Slots = {
  /** Tab 的中间内容 */
  default?: SlotFn;
  /** Tab 的左侧内容 */
  prefix?: SlotFn;
  /** Tab 的右侧内容 */
  suffix?: SlotFn;
};

defineSlots<Slots>();
</script>

<template>
  <div
    class=":soy: relative inline-flex cursor-pointer items-center justify-center gap-6px whitespace-nowrap px-12px py-4px"
    :class="[
      style['slider-tab'],
      { [style['slider-tab_dark']]: darkMode },
      { [style['slider-tab_active']]: active },
      { [style['slider-tab_active_dark']]: active && darkMode }
    ]"
  >
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
  </div>
</template>

<style scoped></style>
