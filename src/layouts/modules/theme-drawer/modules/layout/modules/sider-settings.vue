<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

defineOptions({
  name: 'SiderSettings'
});

const themeStore = useThemeStore();

const layoutMode = computed(() => themeStore.layout.mode);
const isMixLayoutMode = computed(() => layoutMode.value.includes('mix') || layoutMode.value.includes('hybrid'));
const isHybridLayoutMode = computed(() => layoutMode.value.includes('hybrid'));
/** 是否显示混合子菜单设置（左侧菜单混合模式 或 左侧混合-顶部优先模式） */
const showMixChildMenuSettings = computed(() => layoutMode.value === 'vertical-mix' || layoutMode.value === 'vertical-hybrid-header-first');
</script>

<template>
  <NDivider>{{ $t('theme.sider.title') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <SettingItem v-if="layoutMode === 'vertical'" key="1" :label="$t('theme.sider.width')">
      <NInputNumber v-model:value="themeStore.sider.width" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="layoutMode === 'vertical'" key="2" :label="$t('theme.sider.collapsedWidth')">
      <NInputNumber v-model:value="themeStore.sider.collapsedWidth" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="isMixLayoutMode" key="3" :label="$t('theme.sider.mixWidth')">
      <NInputNumber v-model:value="themeStore.sider.mixWidth" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="isMixLayoutMode" key="4" :label="$t('theme.sider.mixCollapsedWidth')">
      <NInputNumber v-model:value="themeStore.sider.mixCollapsedWidth" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="showMixChildMenuSettings" key="5" :label="$t('theme.sider.mixChildMenuWidth')">
      <NInputNumber v-model:value="themeStore.sider.mixChildMenuWidth" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="showMixChildMenuSettings" key="5-1" :label="$t('theme.sider.mixChildMenuBgColor')">
      <NColorPicker v-model:value="themeStore.sider.mixChildMenuBgColor" size="small" class="w-120px" />
    </SettingItem>
    <SettingItem v-if="isHybridLayoutMode" key="6" :label="$t('theme.sider.autoSelectFirstMenu')">
      <template #suffix>
        <NTooltip>
          <template #trigger>
            <span class="flex-center">
              <SvgIcon icon="mdi:information-outline" class="cursor-help text-icon" />
            </span>
          </template>
          {{ $t('theme.sider.autoSelectFirstMenuTip') }}
        </NTooltip>
      </template>
      <NSwitch v-model:value="themeStore.sider.autoSelectFirstMenu" />
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
