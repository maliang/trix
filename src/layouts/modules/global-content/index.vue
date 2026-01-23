<script setup lang="ts">
import { computed } from 'vue';
import { LAYOUT_SCROLL_EL_ID } from '@trix/materials';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'GlobalContent'
});

interface Props {
  /** 是否显示内边距 */
  showPadding?: boolean;
}

withDefaults(defineProps<Props>(), {
  showPadding: true
});

const appStore = useAppStore();
const themeStore = useThemeStore();

const transitionName = computed(() => (themeStore.page.animate ? themeStore.page.animateMode : ''));

function resetScroll() {
  const el = document.querySelector(`#${LAYOUT_SCROLL_EL_ID}`);
  el?.scrollTo({ left: 0, top: 0 });
}
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition
      :name="transitionName"
      mode="out-in"
      @before-leave="appStore.setContentXScrollable(true)"
      @after-leave="resetScroll"
      @after-enter="appStore.setContentXScrollable(false)"
    >
      <component
        :is="Component"
        v-if="appStore.reloadFlag"
        :class="{ 'p-16px': showPadding }"
        class="flex-1-hidden bg-layout transition-300"
      />
    </Transition>
  </RouterView>
</template>

<style></style>
