<script setup lang="ts">
import { computed } from 'vue';
import { useFullscreen } from '@vueuse/core';
import { $t } from '@/locales';

defineOptions({
  name: 'FullScreen'
});

interface Props {
  /** 是否全屏（可选，默认使用内部状态） */
  full?: boolean;
}

const props = defineProps<Props>();

type Emits = {
  (e: 'click'): void;
};

const emit = defineEmits<Emits>();

const { isFullscreen, toggle } = useFullscreen();

/** 当前全屏状态 */
const isFull = computed(() => props.full ?? isFullscreen.value);

function handleClick() {
  toggle();
  emit('click');
}
</script>

<template>
  <ButtonIcon 
    :key="String(isFull)" 
    :tooltip-content="isFull ? $t('icon.fullscreenExit') : $t('icon.fullscreen')"
    @click="handleClick"
  >
    <SvgIcon :icon="isFull ? 'gridicons:fullscreen-exit' : 'gridicons:fullscreen'" />
  </ButtonIcon>
</template>

<style scoped></style>
