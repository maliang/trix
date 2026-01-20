<script setup lang="ts">
import { computed } from 'vue';
import type { SelectOption } from 'naive-ui';
import { themePageAnimationModeOptions, themeScrollModeOptions } from '@/config/constants';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

defineOptions({
  name: 'ContentSettings'
});

const themeStore = useThemeStore();

const isWrapperScrollMode = computed(() => themeStore.layout.scrollMode === 'wrapper');
</script>

<template>
  <NDivider>{{ $t('theme.content.title') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <SettingItem key="1" :label="$t('theme.content.scrollMode.title')">
      <template #suffix>
        <NTooltip>
          <template #trigger>
            <span class="flex-center">
              <SvgIcon icon="mdi:information-outline" class="cursor-help text-icon" />
            </span>
          </template>
          {{ $t('theme.content.scrollMode.tip') }}
        </NTooltip>
      </template>
      <NSelect
        v-model:value="themeStore.layout.scrollMode"
        :options="(themeScrollModeOptions as SelectOption[])"
        size="small"
        class="w-120px"
      />
    </SettingItem>
    <SettingItem key="2" :label="$t('theme.content.page.animate')">
      <NSwitch v-model:value="themeStore.page.animate" />
    </SettingItem>
    <SettingItem v-if="themeStore.page.animate" key="3" :label="$t('theme.content.page.mode.title')">
      <NSelect
        v-model:value="themeStore.page.animateMode"
        :options="(themePageAnimationModeOptions as SelectOption[])"
        size="small"
        class="w-120px"
      />
    </SettingItem>
    <SettingItem v-if="isWrapperScrollMode" key="4" :label="$t('theme.content.fixedHeaderAndTab')">
      <NSwitch v-model:value="themeStore.fixedHeaderAndTab" />
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
