<script lang="ts" setup>
import { computed, useSlots } from 'vue';
import type { PopoverPlacement } from 'naive-ui';

defineOptions({ name: 'IconTooltip' });

interface Props {
  icon?: string;
  desc?: string;
  placement?: PopoverPlacement;
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'mdi-help-circle',
  desc: '',
  placement: 'top'
});

const slots = useSlots();
const hasCustomTrigger = computed(() => Boolean(slots.trigger));

if (!hasCustomTrigger.value && !props.icon) {
  throw new Error('当没有提供自定义 trigger 插槽时，icon 是必需的');
}
</script>

<template>
  <NTooltip :placement="placement">
    <template #trigger>
      <slot name="trigger">
        <div class="cursor-pointer">
          <SvgIcon :icon="icon" />
        </div>
      </slot>
    </template>
    <slot>
      <span>{{ desc }}</span>
    </slot>
  </NTooltip>
</template>
