<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'GlobalLogo'
});

interface Props {
  /** 是否显示标题 */
  showTitle?: boolean;
}

withDefaults(defineProps<Props>(), {
  showTitle: true
});

const themeStore = useThemeStore();
</script>

<template>
  <RouterLink to="/" class="w-full flex-center nowrap-hidden">
    <img :src="themeStore.logo" alt="Logo" class="size-32px" />
    <h2 v-show="showTitle" class="pl-8px text-16px text-primary font-bold transition duration-300 ease-in-out">
      {{ themeStore.appTitle }}
    </h2>
  </RouterLink>
</template>

<style scoped></style>
