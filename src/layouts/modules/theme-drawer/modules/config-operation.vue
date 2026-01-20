<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Clipboard from 'clipboard';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';

defineOptions({
  name: 'ConfigOperation'
});

const themeStore = useThemeStore();

const domRef = ref<HTMLElement | null>(null);
const saving = ref(false);

function initClipboard() {
  if (!domRef.value) return;

  const clipboard = new Clipboard(domRef.value);

  clipboard.on('success', () => {
    window.$message?.success($t('theme.configOperation.copySuccessMsg'));
  });
}

function getClipboardText() {
  const reg = /"\w+":/g;

  const json = themeStore.settingsJson;

  return json.replace(reg, match => match.replace(/"/g, ''));
}

function handleReset() {
  themeStore.resetStore();

  setTimeout(() => {
    window.$message?.success($t('theme.configOperation.resetSuccessMsg'));
  }, 50);
}

/** 保存主题配置到服务器 */
async function handleSave() {
  saving.value = true;
  try {
    const success = await themeStore.saveRemoteThemeConfig();
    if (success) {
      window.$message?.success($t('theme.configOperation.saveSuccessMsg'));
    } else {
      window.$message?.error($t('theme.configOperation.saveFailMsg'));
    }
  } catch (error) {
    console.error('[ConfigOperation] 保存主题配置失败:', error);
    window.$message?.error($t('theme.configOperation.saveFailMsg'));
  } finally {
    saving.value = false;
  }
}

const dataClipboardText = computed(() => getClipboardText());

onMounted(() => {
  initClipboard();
});
</script>

<template>
  <div class="w-full flex flex-col gap-12px">
    <div class="flex justify-between">
      <NButton type="error" ghost @click="handleReset">{{ $t('theme.configOperation.resetConfig') }}</NButton>
      <div class="flex gap-8px">
        <div ref="domRef" data-clipboard-target="#themeConfigCopyTarget">
          <NButton type="info">{{ $t('theme.configOperation.copyConfig') }}</NButton>
        </div>
        <NButton type="primary" :loading="saving" @click="handleSave">{{ $t('theme.configOperation.saveConfig') }}</NButton>
      </div>
    </div>
    <textarea id="themeConfigCopyTarget" v-model="dataClipboardText" class="absolute opacity-0 -z-1" />
  </div>
</template>

<style scoped></style>
