/**
 * 路由辅助函数
 * 提供路由相关的工具函数
 */
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router';

/**
 * 判断路由是否使用 JSON 渲染器模式
 * @param route 路由对象
 * @returns 是否使用 JSON 渲染器
 */
export function isJsonRendererRoute(route: RouteLocationNormalized | RouteRecordRaw): boolean {
  const meta = 'meta' in route ? route.meta : undefined;
  return meta?.useJsonRenderer === true;
}

/**
 * 判断路由是否需要认证
 * @param route 路由对象
 * @returns 是否需要认证（默认为 true）
 */
export function isAuthRequired(route: RouteLocationNormalized | RouteRecordRaw): boolean {
  const meta = 'meta' in route ? route.meta : undefined;
  // 默认需要认证，除非明确设置为 false
  return meta?.requiresAuth !== false;
}

/**
 * 获取路由的布局类型
 * @param route 路由对象
 * @returns 布局类型（默认为 'normal'）
 */
export function getLayoutType(route: RouteLocationNormalized | RouteRecordRaw): 'normal' | 'blank' {
  const meta = 'meta' in route ? route.meta : undefined;
  return meta?.layoutType || 'normal';
}

/**
 * 获取路由的打开类型
 * @param route 路由对象
 * @returns 打开类型（默认为 'normal'）
 */
export function getOpenType(route: RouteLocationNormalized | RouteRecordRaw): 'normal' | 'iframe' | 'newWindow' {
  const meta = 'meta' in route ? route.meta : undefined;
  return meta?.openType || 'normal';
}

/**
 * 获取路由的 Schema 来源
 * @param route 路由对象
 * @returns Schema 来源地址
 */
export function getSchemaSource(route: RouteLocationNormalized | RouteRecordRaw): string | undefined {
  const meta = 'meta' in route ? route.meta : undefined;
  return meta?.schemaSource;
}

/**
 * 判断路由是否为登录后默认显示页面
 * @param route 路由对象
 * @returns 是否为默认页面
 */
export function isDefaultAfterLogin(route: RouteLocationNormalized | RouteRecordRaw): boolean {
  const meta = 'meta' in route ? route.meta : undefined;
  return meta?.isDefaultAfterLogin === true;
}

/**
 * 获取路由的外部链接地址
 * @param route 路由对象
 * @returns 外部链接地址
 */
export function getHref(route: RouteLocationNormalized | RouteRecordRaw): string | undefined {
  const meta = 'meta' in route ? route.meta : undefined;
  return meta?.href;
}

/**
 * 获取路由标题
 * @param route 路由对象
 * @returns 路由标题
 */
export function getRouteTitle(route: RouteLocationNormalized | RouteRecordRaw): string {
  const meta = 'meta' in route ? route.meta : undefined;
  return meta?.title || '';
}

/**
 * 判断路由是否在菜单中隐藏
 * @param route 路由对象
 * @returns 是否隐藏
 */
export function isHiddenInMenu(route: RouteLocationNormalized | RouteRecordRaw): boolean {
  const meta = 'meta' in route ? route.meta : undefined;
  return meta?.hideInMenu === true;
}

/**
 * 判断路由是否需要缓存
 * @param route 路由对象
 * @returns 是否缓存
 */
export function isKeepAlive(route: RouteLocationNormalized | RouteRecordRaw): boolean {
  const meta = 'meta' in route ? route.meta : undefined;
  return meta?.keepAlive === true;
}

/**
 * 获取路由权限列表
 * @param route 路由对象
 * @returns 权限列表
 */
export function getPermissions(route: RouteLocationNormalized | RouteRecordRaw): string[] {
  const meta = 'meta' in route ? route.meta : undefined;
  return meta?.permissions || [];
}

/**
 * 从路由列表中获取所有登录后默认显示的页面
 * @param routes 路由列表
 * @returns 默认显示页面的路由列表
 */
export function getDefaultAfterLoginRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = [];

  function traverse(routeList: RouteRecordRaw[]) {
    for (const route of routeList) {
      if (isDefaultAfterLogin(route)) {
        result.push(route);
      }
      if (route.children?.length) {
        traverse(route.children);
      }
    }
  }

  traverse(routes);
  return result;
}

/**
 * 扁平化路由列表
 * @param routes 路由列表
 * @returns 扁平化后的路由列表
 */
export function flattenRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = [];

  function traverse(routeList: RouteRecordRaw[]) {
    for (const route of routeList) {
      result.push(route);
      if (route.children?.length) {
        traverse(route.children);
      }
    }
  }

  traverse(routes);
  return result;
}

/**
 * 根据路径查找路由
 * @param routes 路由列表
 * @param path 路由路径
 * @returns 匹配的路由或 undefined
 */
export function findRouteByPath(routes: RouteRecordRaw[], path: string): RouteRecordRaw | undefined {
  const flatRoutes = flattenRoutes(routes);
  return flatRoutes.find(route => route.path === path);
}

/**
 * 根据名称查找路由
 * @param routes 路由列表
 * @param name 路由名称
 * @returns 匹配的路由或 undefined
 */
export function findRouteByName(routes: RouteRecordRaw[], name: string): RouteRecordRaw | undefined {
  const flatRoutes = flattenRoutes(routes);
  return flatRoutes.find(route => route.name === name);
}
