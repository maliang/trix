<script setup lang="ts">
defineOptions({
  name: 'SystemLogo'
});

interface Props {
  /** Logo 图片路径，默认使用 favicon.svg */
  src?: string;
}

withDefaults(defineProps<Props>(), {
  src: '/favicon.svg'
});
</script>

<template>
  <div class="system-logo">
    <img :src="src" alt="Logo" class="size-full object-contain" />
  </div>
</template>
