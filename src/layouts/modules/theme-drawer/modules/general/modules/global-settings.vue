<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

defineOptions({
  name: 'GlobalSettings'
});

const themeStore = useThemeStore();
</script>

<template>
  <NDivider>{{ $t('theme.general.title') }}</NDivider>
  <div class="flex-col-stretch gap-12px">
    <SettingItem :label="$t('theme.header.multilingual.visible')">
      <NSwitch v-model:value="themeStore.header.multilingual.visible" />
    </SettingItem>

    <SettingItem :label="$t('theme.header.globalSearch.visible')">
      <NSwitch v-model:value="themeStore.header.globalSearch.visible" />
    </SettingItem>
  </div>
</template>

<style scoped></style>
