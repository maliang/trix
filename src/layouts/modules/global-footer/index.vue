<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'GlobalFooter'
});

const themeStore = useThemeStore();
</script>

<template>
  <DarkModeContainer class="h-full flex-center">
    <span class="text-gray-500">
      Copyright © 2024 {{ themeStore.appTitle }}
    </span>
  </DarkModeContainer>
</template>

<style scoped></style>
