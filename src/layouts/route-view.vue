<script setup lang="ts">
/**
 * 菜单分组路由占位组件
 * 用途：作为有 children 的菜单分组路由的出口组件
 * 重要：KeepAlive 需要在这里配置，因为这里才是叶子页面组件的直接父级
 */
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useRouteStore } from '@/store/modules/route';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'RouteView'
});

const appStore = useAppStore();
const routeStore = useRouteStore();
const themeStore = useThemeStore();

const transitionName = computed(() => (themeStore.page.animate ? themeStore.page.animateMode : ''));
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="appStore.reloadFlag">
      <Transition :name="transitionName" mode="out-in">
        <KeepAlive :include="routeStore.cacheRoutes" :exclude="routeStore.excludeCacheRoutes">
          <component :is="Component" class="flex-grow" />
        </KeepAlive>
      </Transition>
    </template>
  </RouterView>
</template>
