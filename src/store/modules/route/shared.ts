import type { RouteLocationNormalizedLoaded, RouteMeta, RouteRecordRaw } from 'vue-router';
import { defineComponent, h } from 'vue';
import { useSvgIcon } from '@/hooks/common/icon';
import DynamicPageComponent from '@/components/json/DynamicPage.vue';

/** 布局组件 - 根据 meta.layoutType 动态选择布局 */
const LayoutWrapper = () => import('@/layouts/index.vue');

/** 菜单分组路由占位组件（内部只渲染 RouterView） */
const RouteView = () => import('@/layouts/route-view.vue');

/** Iframe 页面组件 */
const IframePage = () => import('@/components/common/iframe-page.vue');

/**
 * 创建具有唯一名称的动态页面组件
 * 用于 KeepAlive 缓存识别
 * @param name 组件名称（通常使用路由名称）
 * @param schemaSource schema 来源路径
 */
function createDynamicPage(name: string, schemaSource?: string) {
  return defineComponent({
    name,
    setup() {
      // 将 schemaSource 固定在组件创建时，避免路由变化导致重新加载
      const fixedSchemaSource = schemaSource;
      return () => h(DynamicPageComponent, { schemaSource: fixedSchemaSource });
    }
  });
}

/**
 * 菜单项接口
 */
export interface MenuItem {
  /** 菜单键 */
  key: string;
  /** 菜单标签 */
  label: string;
  /** 菜单图标（渲染函数） */
  icon?: () => any;
  /** 路由键 */
  routeKey: string;
  /** 路由路径 */
  routePath: string;
  /** 国际化键 */
  i18nKey?: string;
  /** 子菜单 */
  children?: MenuItem[];
}

/**
 * 面包屑项接口
 */
export interface BreadcrumbItem {
  /** 键 */
  key: string;
  /** 标签 */
  label: string;
  /** 图标 */
  icon?: any;
  /** 路由键 */
  routeKey?: string;
  /** 路由路径 */
  routePath?: string;
  /** 下拉选项 */
  options?: BreadcrumbItem[];
}

/**
 * 根据角色过滤路由
 * @param routes 路由列表
 * @param roles 角色列表
 * @returns 过滤后的路由列表
 */
export function filterRoutesByRoles(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  return routes.flatMap(route => filterRouteByRoles(route, roles));
}

/**
 * 根据角色过滤单个路由
 * @param route 路由
 * @param roles 角色列表
 * @returns 过滤后的路由列表
 */
function filterRouteByRoles(route: RouteRecordRaw, roles: string[]): RouteRecordRaw[] {
  const routeRoles = (route.meta?.roles as string[]) || [];

  // 如果路由没有设置角色限制，则允许访问
  const isEmptyRoles = !routeRoles.length;

  // 如果用户角色包含在路由角色中，则允许访问
  const hasPermission = routeRoles.some(role => roles.includes(role));

  const filterRoute = { ...route };

  if (filterRoute.children?.length) {
    filterRoute.children = filterRoute.children.flatMap(item => filterRouteByRoles(item, roles));
  }

  // 如果过滤后没有子路由，则排除该路由
  if (filterRoute.children?.length === 0) {
    return [];
  }

  return hasPermission || isEmptyRoles ? [filterRoute] : [];
}

/**
 * 按 order 排序路由
 * @param routes 路由列表
 * @returns 排序后的路由列表
 */
export function sortRoutesByOrder(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  routes.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0));
  routes.forEach(sortRouteByOrder);
  return routes;
}

/**
 * 按 order 排序单个路由的子路由
 * @param route 路由
 */
function sortRouteByOrder(route: RouteRecordRaw) {
  if (route.children?.length) {
    route.children.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0));
    route.children.forEach(sortRouteByOrder);
  }
}

/**
 * 从路由生成菜单
 * @param routes 路由列表
 * @param parentPath 父路径（用于拼接完整路径）
 * @returns 菜单列表
 */
export function getMenusByRoutes(routes: RouteRecordRaw[], parentPath = ''): MenuItem[] {
  const menus: MenuItem[] = [];

  routes.forEach(route => {
    // 跳过 root 路由，直接处理其子路由
    if (route.name === 'root' && route.children) {
      menus.push(...getMenusByRoutes(route.children, parentPath));
      return;
    }

    // 计算当前路由的完整路径
    const currentPath = route.path.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, '/');

    if (!route.meta?.hideInMenu) {
      const menu = getMenuByRoute(route, currentPath);

      if (route.children?.some(child => !child.meta?.hideInMenu)) {
        menu.children = getMenusByRoutes(route.children, currentPath);
      }

      menus.push(menu);
    }
  });

  return menus;
}

/**
 * 从单个路由生成菜单项
 * @param route 路由
 * @param fullPath 完整路径
 * @returns 菜单项
 */
function getMenuByRoute(route: RouteRecordRaw | RouteLocationNormalizedLoaded, fullPath?: string): MenuItem {
  const { SvgIconVNode } = useSvgIcon();
  
  const { name, path } = route;
  const { title, i18nKey, icon } = route.meta ?? {};

  const menu: MenuItem = {
    key: name as string,
    label: (title as string) || (name as string),
    i18nKey: i18nKey as string | undefined,
    routeKey: name as string,
    routePath: fullPath || path,
    icon: SvgIconVNode({ icon: icon as string, fontSize: 20 })
  };

  return menu;
}

/**
 * 获取需要缓存的路由名称列表
 * @param routes 路由列表
 * @returns 缓存路由名称列表
 */
export function getCacheRouteNames(routes: RouteRecordRaw[]): string[] {
  const cacheNames: string[] = [];

  function collectCacheNames(routeList: RouteRecordRaw[]) {
    routeList.forEach(route => {
      // 如果路由有组件且 keepAlive 不为 false，则缓存
      // 默认缓存所有页面，除非显式设置 keepAlive: false
      if (route.component && route.name && route.meta?.keepAlive !== false) {
        cacheNames.push(route.name as string);
      }
      // 递归处理子路由
      if (route.children?.length) {
        collectCacheNames(route.children);
      }
    });
  }

  collectCacheNames(routes);

  return cacheNames;
}

/**
 * 获取需要排除缓存的路由名称列表
 * @param routes 路由列表
 * @returns 排除缓存的路由名称列表
 */
export function getExcludeCacheRouteNames(routes: RouteRecordRaw[]): string[] {
  const excludeNames: string[] = [];

  function collectExcludeNames(routeList: RouteRecordRaw[]) {
    routeList.forEach(route => {
      // 如果路由显式设置 keepAlive: false，则排除缓存
      if (route.component && route.name && route.meta?.keepAlive === false) {
        excludeNames.push(route.name as string);
      }
      // 递归处理子路由
      if (route.children?.length) {
        collectExcludeNames(route.children);
      }
    });
  }

  collectExcludeNames(routes);

  return excludeNames;
}

/**
 * 根据路由名称判断路由是否存在
 * @param routeName 路由名称
 * @param routes 路由列表
 * @returns 是否存在
 */
export function isRouteExistByRouteName(routeName: string, routes: RouteRecordRaw[]): boolean {
  return routes.some(route => recursiveGetIsRouteExistByRouteName(route, routeName));
}

/**
 * 递归判断路由是否存在
 * @param route 路由
 * @param routeName 路由名称
 * @returns 是否存在
 */
function recursiveGetIsRouteExistByRouteName(route: RouteRecordRaw, routeName: string): boolean {
  let isExist = route.name === routeName;

  if (isExist) {
    return true;
  }

  if (route.children?.length) {
    isExist = route.children.some(item => recursiveGetIsRouteExistByRouteName(item, routeName));
  }

  return isExist;
}

/**
 * 获取选中菜单的路径
 * @param selectedKey 选中的菜单键
 * @param menus 菜单列表
 * @returns 菜单路径
 */
export function getSelectedMenuKeyPath(selectedKey: string, menus: MenuItem[]): string[] {
  const keyPath: string[] = [];

  menus.some(menu => {
    const path = findMenuPath(selectedKey, menu);

    const find = Boolean(path?.length);

    if (find) {
      keyPath.push(...path!);
    }

    return find;
  });

  return keyPath;
}

/**
 * 查找菜单路径
 * @param targetKey 目标菜单键
 * @param menu 菜单
 * @returns 菜单路径
 */
function findMenuPath(targetKey: string, menu: MenuItem): string[] | null {
  const path: string[] = [];

  function dfs(item: MenuItem): boolean {
    path.push(item.key);

    if (item.key === targetKey) {
      return true;
    }

    if (item.children) {
      for (const child of item.children) {
        if (dfs(child)) {
          return true;
        }
      }
    }

    path.pop();

    return false;
  }

  if (dfs(menu)) {
    return path;
  }

  return null;
}

/**
 * 根据路由获取面包屑
 * @param route 当前路由
 * @param menus 菜单列表
 * @returns 面包屑列表
 */
export function getBreadcrumbsByRoute(
  route: RouteLocationNormalizedLoaded,
  menus: MenuItem[]
): BreadcrumbItem[] {
  const key = route.name as string;

  for (const menu of menus) {
    if (menu.key === key) {
      return [transformMenuToBreadcrumb(menu)];
    }

    if (menu.children?.length) {
      const result = getBreadcrumbsByRoute(route, menu.children);
      if (result.length > 0) {
        return [transformMenuToBreadcrumb(menu), ...result];
      }
    }
  }

  return [];
}

/**
 * 将菜单转换为面包屑
 * @param menu 菜单
 * @returns 面包屑
 */
function transformMenuToBreadcrumb(menu: MenuItem): BreadcrumbItem {
  const { children, ...rest } = menu;

  const breadcrumb: BreadcrumbItem = {
    ...rest
  };

  if (children?.length) {
    breadcrumb.options = children.map(transformMenuToBreadcrumb);
  }

  return breadcrumb;
}

/**
 * 将菜单转换为搜索菜单（扁平化）
 * @param menus 菜单列表
 * @param treeMap 结果数组
 * @returns 扁平化的菜单列表
 */
export function transformMenuToSearchMenus(menus: MenuItem[], treeMap: MenuItem[] = []): MenuItem[] {
  if (!menus || menus.length === 0) return [];

  return menus.reduce((acc, cur) => {
    if (!cur.children) {
      acc.push(cur);
    }
    if (cur.children && cur.children.length > 0) {
      transformMenuToSearchMenus(cur.children, treeMap);
    }
    return acc;
  }, treeMap);
}

/**
 * 内置路由名称列表
 * 这些路由在应用启动时就已注册，从 API 获取菜单时需要过滤掉，避免重复注册
 */
export const BUILTIN_ROUTE_NAMES = ['login', 'forbidden', 'not-found', 'server-error'];

/**
 * 从 API 菜单数据中提取内置路由的配置
 * @param menuRoutes API 返回的菜单路由列表
 * @returns 内置路由配置映射 { routeName: meta }
 */
export function extractBuiltinRouteMetas(menuRoutes: Api.Route.MenuRoute[]): Map<string, Api.Route.MenuRoute['meta']> {
  const builtinMetas = new Map<string, Api.Route.MenuRoute['meta']>();
  
  menuRoutes.forEach(menuRoute => {
    if (BUILTIN_ROUTE_NAMES.includes(menuRoute.name) && menuRoute.meta) {
      builtinMetas.set(menuRoute.name, menuRoute.meta);
    }
  });
  
  return builtinMetas;
}

/**
 * 将 API 返回的菜单路由转换为 Vue Router 路由
 * @param menuRoutes API 返回的菜单路由列表
 * @returns Vue Router 路由列表
 */
export function transformMenuRoutesToRoutes(menuRoutes: Api.Route.MenuRoute[]): RouteRecordRaw[] {
  // 过滤掉内置路由，避免重复注册
  const filteredMenuRoutes = menuRoutes.filter(
    menuRoute => !BUILTIN_ROUTE_NAMES.includes(menuRoute.name)
  );

  // 将菜单包装到 root 路由下
  const rootRoute: RouteRecordRaw = {
    path: '/',
    name: 'root',
    component: LayoutWrapper,
    redirect: '/home',
    children: filteredMenuRoutes.map(menuRoute => transformMenuRouteToRoute(menuRoute))
  };

  return [rootRoute];
}

/**
 * 将单个菜单路由转换为 Vue Router 路由
 * @param menuRoute 菜单路由
 * @param isChild 是否为子路由
 * @returns Vue Router 路由
 */
function transformMenuRouteToRoute(menuRoute: Api.Route.MenuRoute, isChild = false): RouteRecordRaw {
  const { name, path, redirect, meta, children } = menuRoute;

  // 处理路径：子路由不需要以 / 开头
  const routePath = path.replace(/^\//, '');

  const routeMeta = {
    title: meta?.title,
    icon: meta?.icon,
    order: meta?.order,
    hideInMenu: meta?.hideInMenu,
    keepAlive: meta?.keepAlive,
    permissions: meta?.permissions,
    requiresAuth: true,
    layoutType: meta?.layoutType || 'normal',
    openType: meta?.openType || 'normal',
    href: meta?.href,
    useJsonRenderer: meta?.useJsonRenderer ?? true,
    schemaSource: meta?.schemaSource,
    isDefaultAfterLogin: meta?.isDefaultAfterLogin
  } satisfies RouteMeta;

  // 递归处理子路由
  if (children?.length) {
    // 菜单分组路由（有 children）使用占位组件 RouteView 作为出口。
    // 注意：不要直接使用 RouterView 组件本体，否则当外层使用 Transition/KeepAlive 包裹路由组件时会触发 Vue Router 警告。
    const route: RouteRecordRaw = {
      name,
      path: routePath,
      component: RouteView,
      meta: routeMeta,
      children: children.map(child => transformMenuRouteToRoute(child, true))
    };

    if (redirect) {
      route.redirect = redirect;
    }

    return route;
  }

  // 叶子节点根据 openType 选择组件
  // iframe: 使用 IframePage 组件
  // newWindow: 不需要组件，由路由守卫处理
  // normal: 使用 createDynamicPage 创建具有唯一名称的组件，支持 KeepAlive 缓存
  const openType = meta?.openType || 'normal';
  const leafComponent = openType === 'iframe' ? IframePage : createDynamicPage(name, meta?.schemaSource);

  const leafRoute: RouteRecordRaw = {
    name,
    path: routePath,
    component: leafComponent,
    meta: routeMeta
  };

  return leafRoute;
}
