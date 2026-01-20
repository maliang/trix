import { computed, ref, watch } from 'vue';
import { useEventListener } from '@vueuse/core';
import { defineStore } from 'pinia';
import { useThemeStore } from '../theme';
import { useAuthStore } from '../auth';
import { useRouteStore } from '../route';

/** 本地存储的 key */
const TAB_STORAGE_KEY = 'trix_tabs';

/**
 * 标签页 Store
 * 管理多标签页模式下的标签页状态
 */
export const useTabStore = defineStore('tab', () => {
  // 延迟获取 theme store，避免循环依赖
  const getThemeStore = () => useThemeStore();
  const getRouteStore = () => useRouteStore();

  /** 标签页列表 */
  const tabs = ref<App.Global.Tab[]>([]);

  /** 首页标签页 */
  const homeTab = ref<App.Global.Tab | null>(null);

  /** 默认显示的标签页（isDefaultAfterLogin: true 的页面） */
  const defaultTabs = ref<App.Global.Tab[]>([]);

  /** 当前激活的标签页 ID */
  const activeTabId = ref<string>('');

  /** 所有标签页（包含首页） */
  const allTabs = computed(() => {
    if (homeTab.value) {
      return [homeTab.value, ...tabs.value.filter(tab => tab.id !== homeTab.value?.id)];
    }
    return tabs.value;
  });

  /**
   * 设置激活的标签页 ID
   * @param id 标签页 ID
   */
  function setActiveTabId(id: string) {
    activeTabId.value = id;
  }

  /**
   * 初始化首页标签页
   * @param route 首页路由
   */
  function initHomeTab(route: App.Global.TabRoute) {
    homeTab.value = {
      id: route.fullPath,
      label: route.meta.title || '首页',
      routeKey: route.name,
      routePath: route.path,
      fullPath: route.fullPath,
      icon: route.meta.icon,
      localIcon: route.meta.localIcon
    };
  }

  /**
   * 清除首页标签页
   * 当有 isDefaultAfterLogin 页面时，首页不显示在标签栏
   */
  function clearHomeTab() {
    homeTab.value = null;
  }

  /**
   * 添加默认显示的标签页
   * 用于处理 isDefaultAfterLogin: true 的页面
   * @param route 路由信息
   */
  function addDefaultTab(route: App.Global.TabRoute) {
    const tab: App.Global.Tab = {
      id: route.fullPath,
      label: route.meta.title || '',
      routeKey: route.name,
      routePath: route.path,
      fullPath: route.fullPath,
      icon: route.meta.icon,
      localIcon: route.meta.localIcon
    };

    // 检查是否已存在
    const exists = defaultTabs.value.some(t => t.id === tab.id);
    if (!exists) {
      defaultTabs.value.push(tab);
    }
  }

  /**
   * 初始化标签页 Store
   * @param currentRoute 当前路由
   */
  function initTabStore(currentRoute: App.Global.TabRoute) {
    // 先尝试恢复缓存的标签页
    restoreTabs();
    
    // 添加当前路由到标签页
    addTab(currentRoute);
  }

  /**
   * 添加标签页
   * @param route 路由信息
   * @param active 是否激活
   */
  function addTab(route: App.Global.TabRoute, active = true) {
    const tab: App.Global.Tab = {
      id: route.fullPath,
      label: route.meta.title || '',
      routeKey: route.name,
      routePath: route.path,
      fullPath: route.fullPath,
      icon: route.meta.icon,
      localIcon: route.meta.localIcon
    };

    // 检查是否为首页
    const isHomeTab = homeTab.value && tab.id === homeTab.value.id;

    // 如果不是首页且不在标签页列表中，则添加
    if (!isHomeTab && !tabs.value.some(t => t.id === tab.id)) {
      tabs.value.push(tab);
      // 恢复 KeepAlive 缓存（如果之前被移除过）
      if (tab.routeKey) {
        getRouteStore().restoreCacheRoute(tab.routeKey);
      }
    }

    if (active) {
      setActiveTabId(tab.id);
    }
  }

  /**
   * 移除标签页
   * @param tabId 标签页 ID
   */
  function removeTab(tabId: string) {
    // 不能移除首页
    if (homeTab.value && tabId === homeTab.value.id) {
      return;
    }

    // 不能移除默认显示的标签页（在多标签模式下）
    if (getThemeStore().tab.visible && isTabRetain(tabId)) {
      return;
    }

    const index = tabs.value.findIndex(tab => tab.id === tabId);
    if (index !== -1) {
      // 从 KeepAlive 缓存中移除该路由
      const tab = tabs.value[index];
      if (tab.routeKey) {
        getRouteStore().removeCacheRoute(tab.routeKey);
      }
      tabs.value.splice(index, 1);
    }
  }

  /**
   * 清除所有标签页
   * @param excludes 排除的标签页 ID 列表
   */
  function clearTabs(excludes: string[] = []) {
    const retainIds = [
      homeTab.value?.id,
      ...defaultTabs.value.map(t => t.id),
      ...excludes
    ].filter(Boolean) as string[];

    tabs.value = tabs.value.filter(tab => retainIds.includes(tab.id));
  }

  /**
   * 清除左侧标签页
   * @param tabId 当前标签页 ID
   */
  function clearLeftTabs(tabId: string) {
    const index = tabs.value.findIndex(tab => tab.id === tabId);
    if (index === -1) return;

    const excludes = tabs.value.slice(index).map(tab => tab.id);
    clearTabs(excludes);
  }

  /**
   * 清除右侧标签页
   * @param tabId 当前标签页 ID
   */
  function clearRightTabs(tabId: string) {
    const index = tabs.value.findIndex(tab => tab.id === tabId);
    if (index === -1) return;

    const excludes = tabs.value.slice(0, index + 1).map(tab => tab.id);
    clearTabs(excludes);
  }

  /**
   * 固定标签页
   * @param tabId 标签页 ID
   */
  function fixTab(tabId: string) {
    const tab = tabs.value.find(t => t.id === tabId);
    if (tab) {
      tab.fixedIndex = tabs.value.filter(t => t.fixedIndex !== undefined).length;
    }
  }

  /**
   * 取消固定标签页
   * @param tabId 标签页 ID
   */
  function unfixTab(tabId: string) {
    const tab = tabs.value.find(t => t.id === tabId);
    if (tab) {
      tab.fixedIndex = undefined;
    }
  }

  /**
   * 判断标签页是否应该保留（不能关闭）
   * @param tabId 标签页 ID
   */
  function isTabRetain(tabId: string): boolean {
    // 首页不能关闭
    if (homeTab.value && tabId === homeTab.value.id) {
      return true;
    }

    // 默认显示的标签页不能关闭（在多标签模式下）
    if (getThemeStore().tab.visible && defaultTabs.value.some(t => t.id === tabId)) {
      return true;
    }

    // 固定的标签页不能关闭
    const tab = tabs.value.find(t => t.id === tabId);
    if (tab && tab.fixedIndex !== undefined) {
      return true;
    }

    return false;
  }

  /**
   * 根据路由获取标签页 ID
   * 用于 KeepAlive 的 key，需要与组件名称一致才能正确缓存
   * @param route 路由信息
   */
  function getTabIdByRoute(route: App.Global.TabRoute): string {
    // 使用路由名称作为 key，与 KeepAlive 的 include 匹配
    return route.name || route.fullPath;
  }

  /**
   * 切换到指定标签页
   * @param tab 标签页
   */
  async function switchRouteByTab(tab: App.Global.Tab) {
    setActiveTabId(tab.id);
    // 实际的路由跳转需要在组件中处理
  }

  /**
   * 缓存标签页到本地存储
   * 只有在已登录状态下才缓存，避免在登录页刷新时覆盖缓存
   */
  function cacheTabs() {
    if (!getThemeStore().tab.cache) return;
    
    // 检查是否已登录，未登录时不缓存（避免在登录页刷新时覆盖缓存）
    try {
      const authStore = useAuthStore();
      if (!authStore.isLogin) return;
    } catch {
      // store 可能还未初始化，不缓存
      return;
    }
    
    const cacheData = {
      tabs: tabs.value,
      homeTab: homeTab.value,
      activeTabId: activeTabId.value
    };
    
    try {
      localStorage.setItem(TAB_STORAGE_KEY, JSON.stringify(cacheData));
    } catch (e) {
      console.warn('[TabStore] 缓存标签页失败:', e);
    }
  }

  /**
   * 从本地存储恢复标签页
   */
  function restoreTabs() {
    if (!getThemeStore().tab.cache) return;
    
    try {
      const cached = localStorage.getItem(TAB_STORAGE_KEY);
      if (cached) {
        const cacheData = JSON.parse(cached);
        if (cacheData.tabs?.length) {
          tabs.value = cacheData.tabs;
        }
        if (cacheData.homeTab) {
          homeTab.value = cacheData.homeTab;
        }
        if (cacheData.activeTabId) {
          activeTabId.value = cacheData.activeTabId;
        }
      }
    } catch (e) {
      console.warn('[TabStore] 恢复标签页失败:', e);
    }
  }

  /**
   * 清除缓存的标签页
   */
  function clearCachedTabs() {
    try {
      localStorage.removeItem(TAB_STORAGE_KEY);
    } catch (e) {
      // 忽略错误
    }
  }

  /**
   * 获取登录后的默认显示页面
   * 非多标签模式：返回最后一个设置 isDefaultAfterLogin 的页面
   * 多标签模式：返回所有设置 isDefaultAfterLogin 的页面
   */
  function getDefaultPagesAfterLogin(): App.Global.Tab[] {
    if (getThemeStore().tab.visible) {
      // 多标签模式：返回所有默认页面
      return defaultTabs.value;
    } else {
      // 非多标签模式：返回最后一个默认页面
      const lastDefault = defaultTabs.value[defaultTabs.value.length - 1];
      return lastDefault ? [lastDefault] : [];
    }
  }

  /**
   * 初始化登录后的默认标签页
   * 在登录成功后调用
   */
  function initDefaultTabsAfterLogin() {
    const defaultPages = getDefaultPagesAfterLogin();
    
    if (getThemeStore().tab.visible) {
      // 多标签模式：添加所有默认页面到标签页
      defaultPages.forEach(tab => {
        if (!tabs.value.some(t => t.id === tab.id)) {
          tabs.value.push(tab);
        }
      });
    }
  }

  // 页面关闭或刷新时缓存标签页
  useEventListener(window, 'beforeunload', () => {
    cacheTabs();
  });

  // 监听标签页变化，自动缓存
  watch([tabs, activeTabId], () => {
    cacheTabs();
  }, { deep: true });

  return {
    tabs: allTabs,
    homeTab,
    defaultTabs,
    activeTabId,
    setActiveTabId,
    initHomeTab,
    clearHomeTab,
    addDefaultTab,
    initTabStore,
    addTab,
    removeTab,
    clearTabs,
    clearLeftTabs,
    clearRightTabs,
    fixTab,
    unfixTab,
    isTabRetain,
    getTabIdByRoute,
    switchRouteByTab,
    cacheTabs,
    restoreTabs,
    clearCachedTabs,
    getDefaultPagesAfterLogin,
    initDefaultTabsAfterLogin
  };
});
