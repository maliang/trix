<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SimpleScrollbar } from '@trix/materials';
import { useBoolean } from '@trix/hooks';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/config/constants';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu, useMixMenuContext } from '../context';
import FirstLevelMenu from '../components/first-level-menu.vue';
import GlobalLogo from '../../global-logo/index.vue';

defineOptions({
  name: 'VerticalHybridHeaderFirst'
});

const route = useRoute();
const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
const { routerPushByKeyWithMetaQuery } = useRouterPush();
const { bool: drawerVisible, setBool: setDrawerVisible } = useBoolean();
const {
  firstLevelMenus,
  activeFirstLevelMenuKey,
  handleSelectFirstLevelMenu,
  getActiveFirstLevelMenuKey,
  secondLevelMenus,
  activeSecondLevelMenuKey,
  isActiveSecondLevelMenuHasChildren,
  handleSelectSecondLevelMenu,
  getActiveSecondLevelMenuKey,
  childLevelMenus,
  hasChildLevelMenus,
  activeDeepestLevelMenuKey
} = useMixMenuContext('VerticalHybridHeaderFirst');
const { selectedKey } = useMenu();

const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted);

/** 是否应用自定义子菜单背景色（非深色模式时生效，深色侧边栏也使用自定义背景色） */
const useCustomBgColor = computed(() => !themeStore.darkMode);

const showDrawer = computed(() => hasChildLevelMenus.value && (drawerVisible.value || appStore.mixSiderFixed));

function handleSelectMixMenu(key: string) {
  handleSelectSecondLevelMenu(key);

  if (isActiveSecondLevelMenuHasChildren.value) {
    setDrawerVisible(true);
  }
}

/**
 * 根据 autoSelectFirstMenu 设置处理二级菜单选择：
 * - 禁用时：仅激活第一个二级菜单用于显示，如果存在三级菜单则展开
 * - 启用时：自动导航到最深层菜单
 */
function handleSelectMenu(key: string) {
  handleSelectFirstLevelMenu(key);

  if (secondLevelMenus.value.length === 0) return;

  const secondFirstMenuKey = secondLevelMenus.value[0].routeKey;

  // 情况1：autoSelectFirstMenu 禁用 - 仅激活菜单用于显示
  if (!themeStore.sider.autoSelectFirstMenu) {
    // 检查是否有三级菜单
    const hasChildren = secondLevelMenus.value.find(menu => menu.key === secondFirstMenuKey)?.children?.length;

    // 如果有三级菜单，展开它们
    if (hasChildren) {
      handleSelectMixMenu(secondFirstMenuKey);
    }
    return;
  }

  // 情况2：autoSelectFirstMenu 启用 - 导航到最深层菜单
  activeDeepestLevelMenuKey();
  setDrawerVisible(false);
}

function handleResetActiveMenu() {
  setDrawerVisible(false);

  if (!appStore.mixSiderFixed) {
    getActiveFirstLevelMenuKey();
    getActiveSecondLevelMenuKey();
  }
}

const expandedKeys = ref<string[]>([]);

function updateExpandedKeys() {
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = [];
    return;
  }
  expandedKeys.value = routeStore.getSelectedMenuKeyPathByKey(selectedKey.value);
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys();
  },
  { immediate: true }
);
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <NMenu
      mode="horizontal"
      :value="activeFirstLevelMenuKey"
      :options="(firstLevelMenus as any)"
      :indent="18"
      responsive
      @update:value="handleSelectMenu"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <div class="h-full flex" @mouseleave="handleResetActiveMenu">
      <FirstLevelMenu
        :menus="secondLevelMenus"
        :active-menu-key="activeSecondLevelMenuKey"
        :inverted="inverted"
        :sider-collapse="appStore.siderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectMixMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      >
        <GlobalLogo :show-title="false" :style="{ height: themeStore.header.height + 'px' }" />
      </FirstLevelMenu>
      <div
        class="relative h-full transition-width-300"
        :style="{
          width: appStore.mixSiderFixed && hasChildLevelMenus ? themeStore.sider.mixChildMenuWidth + 'px' : '0px'
        }"
      >
        <DarkModeContainer
          class="absolute-lt h-full flex-col-stretch nowrap-hidden shadow-sm transition-all-300"
          :class="{ 'mix-child-menu-custom-bg': useCustomBgColor }"
          :inverted="inverted"
          :style="{ width: showDrawer ? themeStore.sider.mixChildMenuWidth + 'px' : '0px' }"
        >
          <header class="flex-y-center justify-between px-12px" :style="{ height: themeStore.header.height + 'px' }">
            <h2 class="text-16px text-primary font-bold">{{ themeStore.appTitle }}</h2>
            <PinToggler
              :pin="appStore.mixSiderFixed"
              :class="{ 'text-white:88 !hover:text-white': inverted }"
              @click="appStore.toggleMixSiderFixed"
            />
          </header>
          <SimpleScrollbar>
            <NMenu
              v-model:expanded-keys="expandedKeys"
              mode="vertical"
              :value="selectedKey"
              :options="(childLevelMenus as any)"
              :inverted="inverted"
              :indent="18"
              @update:value="routerPushByKeyWithMetaQuery"
            />
          </SimpleScrollbar>
        </DarkModeContainer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.mix-child-menu-custom-bg {
  background-color: var(--mix-child-menu-bg-color) !important;
}
</style>
