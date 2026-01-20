<script setup lang="ts">
import { GLOBAL_HEADER_MENU_ID } from '@/config/constants';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import GlobalLogo from '../global-logo/index.vue';
import GlobalBreadcrumb from '../global-breadcrumb/index.vue';
import HeaderRight from '@/components/json/HeaderRight.vue';

defineOptions({
  name: 'GlobalHeader'
});

interface Props {
  /** 是否显示 Logo */
  showLogo?: App.Global.HeaderProps['showLogo'];
  /** 是否显示菜单切换器 */
  showMenuToggler?: App.Global.HeaderProps['showMenuToggler'];
  /** 是否显示菜单 */
  showMenu?: App.Global.HeaderProps['showMenu'];
}

withDefaults(defineProps<Props>(), {
  showLogo: false,
  showMenuToggler: false,
  showMenu: false
});

const appStore = useAppStore();
const themeStore = useThemeStore();

/** Header 右侧 Schema 来源 */
const headerRightSchemaSource = import.meta.env.VITE_HEADER_RIGHT_SCHEMA_URL || '';
</script>

<template>
  <DarkModeContainer class="h-full flex-y-center px-12px shadow-header">
    <GlobalLogo v-if="showLogo" class="h-full" :style="{ width: themeStore.sider.width + 'px' }" />
    <MenuToggler v-if="showMenuToggler" :collapsed="appStore.siderCollapse" @click="appStore.toggleSiderCollapse" />
    <div v-if="showMenu" :id="GLOBAL_HEADER_MENU_ID" class="h-full flex-y-center flex-1-hidden"></div>
    <div v-else class="h-full flex-y-center flex-1-hidden">
      <GlobalBreadcrumb v-if="!appStore.isMobile" class="ml-12px" />
    </div>
    <div class="h-full flex-y-center justify-end">
      <HeaderRight :schema-source="headerRightSchemaSource" />
    </div>
  </DarkModeContainer>
</template>

<style scoped></style>
