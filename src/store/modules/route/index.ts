import { computed, ref, shallowRef } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { useBoolean } from '@trix/hooks';
import { router, staticRoutes, dynamicRoutes } from '@/router';
import { notFoundRoute } from '@/router/routes';
import { fetchMenuSchema } from '@/service/api';
import { SetupStoreId } from '@/store/plugins';
import { useAuthStore } from '../auth';
import { useTabStore } from '../tab';
import {
  filterRoutesByRoles,
  sortRoutesByOrder,
  getMenusByRoutes,
  getCacheRouteNames,
  getExcludeCacheRouteNames,
  getSelectedMenuKeyPath,
  getBreadcrumbsByRoute,
  transformMenuToSearchMenus,
  transformMenuRoutesToRoutes,
  type MenuItem,
  type BreadcrumbItem
} from './shared';

/**
 * 路由 Store
 * 管理路由状态、菜单、面包屑等
 */
export const useRouteStore = defineStore(SetupStoreId.Route, () => {
  // 延迟获取其他 store，避免循环依赖和初始化顺序问题
  const getAuthStore = () => useAuthStore();
  const getTabStore = () => useTabStore();
  
  const { bool: isInitConstantRoute, setBool: setIsInitConstantRoute } = useBoolean();
  const { bool: isInitAuthRoute, setBool: setIsInitAuthRoute } = useBoolean();

  /** 首页路由键 */
  const routeHome = ref<string>(import.meta.env.VITE_ROUTE_HOME || 'home');

  /**
   * 设置首页路由
   * @param routeKey 路由键
   */
  function setRouteHome(routeKey: string) {
    routeHome.value = routeKey;
  }

  /** 常量路由 */
  const constantRoutes = shallowRef<RouteRecordRaw[]>([]);

  /**
   * 添加常量路由
   * @param routes 路由列表
   */
  function addConstantRoutes(routes: RouteRecordRaw[]) {
    const routesMap = new Map<string, RouteRecordRaw>();

    routes.forEach(route => {
      if (route.name) {
        routesMap.set(route.name as string, route);
      }
    });

    constantRoutes.value = Array.from(routesMap.values());
  }

  /** 认证路由 */
  const authRoutes = shallowRef<RouteRecordRaw[]>([]);

  /**
   * 添加认证路由
   * @param routes 路由列表
   */
  function addAuthRoutes(routes: RouteRecordRaw[]) {
    const routesMap = new Map<string, RouteRecordRaw>();

    routes.forEach(route => {
      if (route.name) {
        routesMap.set(route.name as string, route);
      }
    });

    authRoutes.value = Array.from(routesMap.values());
  }

  /** 移除路由的函数列表 */
  const removeRouteFns: (() => void)[] = [];

  /** 全局菜单 */
  const menus = ref<MenuItem[]>([]);
  
  /** 搜索菜单（扁平化） */
  const searchMenus = computed(() => transformMenuToSearchMenus(menus.value));

  /**
   * 获取全局菜单
   * @param routes 路由列表
   */
  function getGlobalMenus(routes: RouteRecordRaw[]) {
    menus.value = getMenusByRoutes(routes);
  }

  /** 缓存路由名称列表 */
  const cacheRoutes = ref<string[]>([]);

  /** 排除缓存的路由名称列表（包含 keepAlive: false 的路由和临时排除的路由） */
  const excludeCacheRoutes = ref<string[]>([]);

  /** 基础排除缓存列表（keepAlive: false 的路由） */
  const baseExcludeCacheRoutes = ref<string[]>([]);

  /**
   * 获取缓存路由
   * @param routes 路由列表
   */
  function getCacheRoutes(routes: RouteRecordRaw[]) {
    cacheRoutes.value = getCacheRouteNames(routes);
    baseExcludeCacheRoutes.value = getExcludeCacheRouteNames(routes);
    excludeCacheRoutes.value = [...baseExcludeCacheRoutes.value];
  }

  /**
   * 重置路由缓存
   * @param routeKey 路由键（默认当前路由）
   */
  async function resetRouteCache(routeKey?: string) {
    const routeName = routeKey || (router.currentRoute.value.name as string);

    excludeCacheRoutes.value.push(routeName);

    await new Promise(resolve => setTimeout(resolve, 0));

    // 恢复为基础排除列表
    excludeCacheRoutes.value = [...baseExcludeCacheRoutes.value];
  }

  /**
   * 从缓存中移除路由（关闭标签时调用）
   * @param routeName 路由名称
   */
  function removeCacheRoute(routeName: string) {
    // 从 cacheRoutes 中移除
    const index = cacheRoutes.value.indexOf(routeName);
    if (index > -1) {
      cacheRoutes.value.splice(index, 1);
    }
  }

  /**
   * 恢复路由缓存（重新打开标签时调用）
   * @param routeName 路由名称
   */
  function restoreCacheRoute(routeName: string) {
    // 如果不在基础排除列表中，且不在缓存列表中，则添加回缓存
    if (!baseExcludeCacheRoutes.value.includes(routeName) && !cacheRoutes.value.includes(routeName)) {
      cacheRoutes.value.push(routeName);
    }
  }

  /** 面包屑 */
  const breadcrumbs = computed<BreadcrumbItem[]>(() => 
    getBreadcrumbsByRoute(router.currentRoute.value, menus.value)
  );

  /**
   * 重置 Store
   */
  async function resetStore() {
    resetVueRoutes();

    // 重置状态
    constantRoutes.value = [];
    authRoutes.value = [];
    menus.value = [];
    cacheRoutes.value = [];
    excludeCacheRoutes.value = [];
    baseExcludeCacheRoutes.value = [];
    setIsInitConstantRoute(false);
    setIsInitAuthRoute(false);

    // 重新初始化常量路由
    await initConstantRoute();
  }

  /**
   * 重置 Vue 路由
   */
  function resetVueRoutes() {
    removeRouteFns.forEach(fn => fn());
    removeRouteFns.length = 0;
  }

  /**
   * 初始化常量路由
   */
  async function initConstantRoute() {
    if (isInitConstantRoute.value) return;

    // 使用静态路由作为常量路由
    addConstantRoutes(staticRoutes);

    handleConstantAndAuthRoutes();

    setIsInitConstantRoute(true);

    // 注意：首页标签页的初始化移到 initAuthRoute 中
    // 因为在这里当前路由可能是登录页，不应该作为首页
  }

  /**
   * 初始化认证路由
   */
  async function initAuthRoute() {
    const authStore = getAuthStore();

    // 检查用户信息是否已初始化
    if (!authStore.userInfo.userId) {
      await authStore.initUserInfo();
    }

    // 获取菜单路由 API 地址
    const menuRouteUrl = import.meta.env.VITE_MENU_ROUTE_URL;

    let filteredRoutes: RouteRecordRaw[];

    if (menuRouteUrl) {
      // 从 API 获取菜单路由
      try {
        const menuRoutes = await fetchMenuSchema(menuRouteUrl) as unknown as Api.Route.MenuRoute[];
        // 将 API 返回的菜单路由转换为 Vue Router 路由
        const apiRoutes = transformMenuRoutesToRoutes(menuRoutes);
        // 根据用户权限过滤路由
        filteredRoutes = filterRoutesByRoles(apiRoutes, authStore.userInfo.permissions);
      } catch (error) {
        console.error('获取菜单路由失败，使用静态路由配置:', error);
        // 获取失败时回退到静态路由配置
        filteredRoutes = filterRoutesByRoles(dynamicRoutes, authStore.userInfo.permissions);
      }
    } else {
      // 使用静态路由配置
      filteredRoutes = filterRoutesByRoles(dynamicRoutes, authStore.userInfo.permissions);
    }

    addAuthRoutes(filteredRoutes);

    handleConstantAndAuthRoutes();

    // 动态路由加载完成后，添加 404 兜底路由
    addNotFoundRoute();

    setIsInitAuthRoute(true);

    // 收集 isDefaultAfterLogin: true 的页面并初始化标签页
    const defaultRoutes = collectDefaultAfterLoginRoutes(filteredRoutes);
    initDefaultTabs(filteredRoutes, defaultRoutes);
  }

  /** 登录后默认显示的路由列表 */
  const defaultAfterLoginRoutes = ref<Array<{ route: RouteRecordRaw; fullPath: string }>>([]);

  /**
   * 收集所有 isDefaultAfterLogin: true 的路由
   * @param routes 路由列表
   * @returns 默认显示的路由列表
   */
  function collectDefaultAfterLoginRoutes(routes: RouteRecordRaw[]): Array<{ route: RouteRecordRaw; fullPath: string }> {
    const result: Array<{ route: RouteRecordRaw; fullPath: string }> = [];
    
    function traverse(routeList: RouteRecordRaw[], parentPath = '') {
      for (const route of routeList) {
        const currentPath = route.path.startsWith('/') 
          ? route.path 
          : `${parentPath}/${route.path}`.replace(/\/+/g, '/');
        
        if (route.meta?.isDefaultAfterLogin === true && route.name) {
          result.push({ route, fullPath: currentPath });
        }
        
        if (route.children?.length) {
          traverse(route.children, currentPath);
        }
      }
    }
    
    traverse(routes);
    defaultAfterLoginRoutes.value = result;
    return result;
  }

  /**
   * 初始化默认标签页
   * - 无 isDefaultAfterLogin：初始化首页标签
   * - 有 isDefaultAfterLogin：只初始化这些页面的标签（首页不显示）
   * @param routes 所有路由
   * @param defaultRoutes isDefaultAfterLogin 的路由列表
   */
  function initDefaultTabs(routes: RouteRecordRaw[], defaultRoutes: Array<{ route: RouteRecordRaw; fullPath: string }>) {
    const tabStore = getTabStore();
    
    if (defaultRoutes.length === 0) {
      // 无 isDefaultAfterLogin：初始化首页标签
      initHomeTabFromRoutes(routes);
    } else {
      // 有 isDefaultAfterLogin：只初始化这些页面的标签
      // 清除 homeTab（首页不显示在标签栏）
      tabStore.clearHomeTab();
      
      // 添加所有 isDefaultAfterLogin 的页面到默认标签
      defaultRoutes.forEach(({ route, fullPath }) => {
        tabStore.addDefaultTab({
          name: route.name as string,
          path: route.path,
          fullPath,
          meta: {
            title: (route.meta?.title as string) || '',
            icon: route.meta?.icon as string,
            localIcon: route.meta?.localIcon as string
          }
        });
      });
      
      // 初始化默认标签页（添加到标签栏）
      tabStore.initDefaultTabsAfterLogin();
    }
  }

  /**
   * 获取登录后的默认跳转路径
   * - 无 isDefaultAfterLogin：返回首页路径
   * - 有 isDefaultAfterLogin：返回最后一个的路径
   */
  function getDefaultRedirectPath(): string {
    const defaultRoutes = defaultAfterLoginRoutes.value;
    
    if (defaultRoutes.length === 0) {
      // 无 isDefaultAfterLogin：跳转到首页
      return `/${routeHome.value}`;
    } else {
      // 有 isDefaultAfterLogin：跳转到最后一个
      return defaultRoutes[defaultRoutes.length - 1].fullPath;
    }
  }

  /**
   * 从路由配置中初始化首页标签页
   * @param routes 路由列表
   */
  function initHomeTabFromRoutes(routes: RouteRecordRaw[]) {
    const homeRouteName = routeHome.value;
    const homeRoute = findRouteByName(routes, homeRouteName);
    
    if (homeRoute) {
      const homePath = getFullPath(routes, homeRouteName);
      getTabStore().initHomeTab({
        name: homeRoute.name as string,
        path: homeRoute.path,
        fullPath: homePath,
        meta: {
          title: (homeRoute.meta?.title as string) || '首页',
          icon: homeRoute.meta?.icon as string,
          localIcon: homeRoute.meta?.localIcon as string
        }
      });
    }
  }

  /**
   * 根据名称查找路由
   * @param routes 路由列表
   * @param name 路由名称
   */
  function findRouteByName(routes: RouteRecordRaw[], name: string): RouteRecordRaw | null {
    for (const route of routes) {
      if (route.name === name) {
        return route;
      }
      if (route.children?.length) {
        const found = findRouteByName(route.children, name);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * 获取路由的完整路径
   * @param routes 路由列表
   * @param name 路由名称
   * @param parentPath 父路径
   */
  function getFullPath(routes: RouteRecordRaw[], name: string, parentPath = ''): string {
    for (const route of routes) {
      const currentPath = route.path.startsWith('/') 
        ? route.path 
        : `${parentPath}/${route.path}`.replace(/\/+/g, '/');
      
      if (route.name === name) {
        return currentPath;
      }
      if (route.children?.length) {
        const found = getFullPath(route.children, name, currentPath);
        if (found) return found;
      }
    }
    return `/${name}`;
  }

  /**
   * 处理常量路由和认证路由
   */
  function handleConstantAndAuthRoutes() {
    const allRoutes = [...constantRoutes.value, ...authRoutes.value];

    const sortedRoutes = sortRoutesByOrder(allRoutes);

    resetVueRoutes();

    addRoutesToVueRouter(sortedRoutes);

    getGlobalMenus(sortedRoutes);

    getCacheRoutes(sortedRoutes);
  }

  /**
   * 添加路由到 Vue Router
   * @param routes 路由列表
   */
  function addRoutesToVueRouter(routes: RouteRecordRaw[]) {
    routes.forEach(route => {
      const removeFn = router.addRoute(route);
      addRemoveRouteFn(removeFn);
    });
  }

  /**
   * 添加 404 兜底路由
   * 必须在所有动态路由加载完成后调用
   */
  function addNotFoundRoute() {
    // 先移除可能已存在的 404 兜底路由
    if (router.hasRoute('not-found-catch')) {
      router.removeRoute('not-found-catch');
    }
    // 添加 404 兜底路由
    const removeFn = router.addRoute(notFoundRoute);
    addRemoveRouteFn(removeFn);
  }

  /**
   * 添加移除路由的函数
   * @param fn 移除函数
   */
  function addRemoveRouteFn(fn: () => void) {
    removeRouteFns.push(fn);
  }

  /**
   * 获取选中菜单的路径
   * @param selectedKey 选中的菜单键
   * @returns 菜单路径
   */
  function getSelectedMenuKeyPathByKey(selectedKey: string): string[] {
    return getSelectedMenuKeyPath(selectedKey, menus.value);
  }

  /**
   * 路由切换时的回调（已登录）
   */
  async function onRouteSwitchWhenLoggedIn() {
    // 可以在这里添加一些全局初始化逻辑
  }

  /**
   * 路由切换时的回调（未登录）
   */
  async function onRouteSwitchWhenNotLoggedIn() {
    // 可以在这里添加一些全局初始化逻辑
  }

  return {
    resetStore,
    routeHome,
    setRouteHome,
    menus,
    searchMenus,
    cacheRoutes,
    excludeCacheRoutes,
    resetRouteCache,
    removeCacheRoute,
    restoreCacheRoute,
    breadcrumbs,
    initConstantRoute,
    isInitConstantRoute,
    initAuthRoute,
    isInitAuthRoute,
    setIsInitAuthRoute,
    getSelectedMenuKeyPathByKey,
    getDefaultRedirectPath,
    onRouteSwitchWhenLoggedIn,
    onRouteSwitchWhenNotLoggedIn
  };
});

// 导出类型
export type { MenuItem, BreadcrumbItem };
