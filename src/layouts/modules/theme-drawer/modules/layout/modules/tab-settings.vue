<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import { themeTabModeOptions } from '@/config/constants';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

defineOptions({
  name: 'TabSettings'
});

const themeStore = useThemeStore();
</script>

<template>
  <NDivider>{{ $t('theme.tab.title') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <SettingItem key="1" :label="$t('theme.tab.visible')">
      <NSwitch v-model:value="themeStore.tab.visible" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="2" :label="$t('theme.tab.cache')">
      <template #suffix>
        <NTooltip>
          <template #trigger>
            <span class="flex-center">
              <SvgIcon icon="mdi:information-outline" class="cursor-help text-icon" />
            </span>
          </template>
          {{ $t('theme.tab.cacheTip') }}
        </NTooltip>
      </template>
      <NSwitch v-model:value="themeStore.tab.cache" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="3" :label="$t('theme.tab.height')">
      <NInputNumber v-model:value="themeStore.tab.height" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="themeStore.tab.visible" key="4" :label="$t('theme.tab.mode.title')">
      <NSelect
        v-model:value="themeStore.tab.mode"
        :options="(themeTabModeOptions as SelectOption[])"
        size="small"
        class="w-120px"
      />
    </SettingItem>
  </TransitionGroup>
</template>

<style scoped>
.setting-list-move,
.setting-list-enter-active,
.setting-list-leave-active {
  transition: all 0.3s;
}

.setting-list-enter-from,
.setting-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.setting-list-leave-active {
  position: absolute;
}
</style>
