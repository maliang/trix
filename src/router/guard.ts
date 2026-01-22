/**
 * 路由守卫
 * 处理路由跳转前后的逻辑，包括认证、权限、布局等
 */
import type { Router, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import {
  isAuthRequired,
  getLayoutType,
  getOpenType,
  getHref,
  getRouteTitle,
  getPermissions,
  isDefaultAfterLogin
} from './helper';

/**
 * 路由守卫配置选项
 */
export interface RouterGuardOptions {
  /** 获取登录状态的函数 */
  isLoggedIn?: () => boolean;
  /** 获取用户权限的函数 */
  getUserPermissions?: () => string[];
  /** 检查用户是否有任一权限的函数 */
  hasAnyPermission?: (permissions: string[]) => boolean;
  /** 检查动态路由是否已初始化 */
  isAuthRouteInitialized?: () => boolean;
  /** 初始化动态路由 */
  initAuthRoute?: () => Promise<void>;
  /** 登录页路由名称 */
  loginRouteName?: string;
  /** 无权限页路由名称 */
  forbiddenRouteName?: string;
  /** 应用标题 */
  appTitle?: string;
  /** 登录成功后的回调 */
  onLoginSuccess?: (defaultRoutes: string[]) => void;
}

/**
 * 默认配置
 */
const defaultOptions: RouterGuardOptions = {
  isLoggedIn: () => true, // 默认已登录（开发阶段）
  getUserPermissions: () => [],
  hasAnyPermission: () => true, // 默认有权限（开发阶段）
  isAuthRouteInitialized: () => true,
  initAuthRoute: async () => {},
  loginRouteName: 'login',
  forbiddenRouteName: 'forbidden',
  appTitle: 'Trix Admin',
  onLoginSuccess: () => {}
};

/**
 * 当前配置
 */
let currentOptions: RouterGuardOptions = { ...defaultOptions };

/**
 * 收集的默认显示页面路由
 */
const defaultAfterLoginRoutes: string[] = [];

/**
 * 设置路由守卫配置
 * @param options 配置选项
 */
export function setRouterGuardOptions(options: Partial<RouterGuardOptions>) {
  currentOptions = { ...currentOptions, ...options };
}

/**
 * 获取当前路由守卫配置
 */
export function getRouterGuardOptions(): RouterGuardOptions {
  return { ...currentOptions };
}

/**
 * 获取所有默认显示页面的路由路径
 */
export function getDefaultAfterLoginRoutes(): string[] {
  return [...defaultAfterLoginRoutes];
}

/**
 * 收集默认显示页面
 * @param to 目标路由
 */
function collectDefaultAfterLoginRoute(to: RouteLocationNormalized) {
  if (isDefaultAfterLogin(to)) {
    const path = to.fullPath;
    if (!defaultAfterLoginRoutes.includes(path)) {
      defaultAfterLoginRoutes.push(path);
    }
    
    // 同时添加到 tabStore 的默认标签页
    try {
      const { useTabStore } = require('@/store/modules/tab');
      const tabStore = useTabStore();
      tabStore.addDefaultTab({
        name: to.name as string,
        path: to.path,
        fullPath: to.fullPath,
        meta: {
          title: to.meta.title as string,
          icon: to.meta.icon as string
        }
      });
    } catch (e) {
      // store 可能还未初始化，忽略错误
    }
  }
}

/**
 * 处理外部链接
 * @param to 目标路由
 * @returns 是否已处理（true 表示已处理，不需要继续导航）
 */
function handleExternalLink(to: RouteLocationNormalized): boolean {
  const openType = getOpenType(to);
  const href = getHref(to);

  if (openType === 'newWindow' && href) {
    window.open(href, '_blank');
    return true;
  }

  return false;
}

/**
 * 处理认证检查
 * @param to 目标路由
 * @param next 导航函数
 * @returns 是否已处理（true 表示已处理，不需要继续导航）
 */
function handleAuthCheck(
  to: RouteLocationNormalized,
  next: NavigationGuardNext
): boolean {
  const { isLoggedIn, loginRouteName } = currentOptions;
  const loggedIn = isLoggedIn?.() ?? false;

  // 已登录用户访问登录页，重定向到首页
  if (loggedIn && to.name === loginRouteName) {
    next({ path: '/home' });
    return true;
  }

  // 检查是否需要认证
  if (isAuthRequired(to)) {
    if (!loggedIn) {
      // 未登录，重定向到登录页
      next({
        name: loginRouteName,
        query: { redirect: to.fullPath }
      });
      return true;
    }
  }

  return false;
}

/**
 * 处理权限检查
 * @param to 目标路由
 * @param next 导航函数
 * @returns 是否已处理（true 表示已处理，不需要继续导航）
 */
function handlePermissionCheck(
  to: RouteLocationNormalized,
  next: NavigationGuardNext
): boolean {
  const { hasAnyPermission, forbiddenRouteName } = currentOptions;
  const permissions = getPermissions(to);

  // 如果路由配置了权限要求
  if (permissions.length > 0) {
    const hasPermission = hasAnyPermission?.(permissions) ?? false;

    if (!hasPermission) {
      // 无权限，重定向到 403 页面
      next({ name: forbiddenRouteName });
      return true;
    }
  }

  return false;
}

/**
 * 设置页面标题
 * @param to 目标路由
 */
function setPageTitle(to: RouteLocationNormalized) {
  const title = getRouteTitle(to);
  // 优先从 currentOptions 获取，其次使用默认值
  const defaultTitle = 'Trix Admin';
  const appTitle = currentOptions.appTitle || defaultTitle;

  if (title) {
    document.title = `${title} | ${appTitle}`;
  } else {
    document.title = appTitle;
  }
}

/**
 * 路由前置守卫
 */
async function beforeEachGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // 开始进度条
  window.NProgress?.start();

  const { isLoggedIn, loginRouteName, isAuthRouteInitialized, initAuthRoute } = currentOptions;
  const loggedIn = isLoggedIn?.() ?? false;

  // 如果已登录但动态路由未初始化，先初始化路由
  if (loggedIn && !isAuthRouteInitialized?.()) {
    await initAuthRoute?.();
    // 重新导航到目标路由（此时动态路由已加载）
    next({ ...to, replace: true });
    return;
  }

  // 设置页面标题
  setPageTitle(to);

  // 收集默认显示页面
  collectDefaultAfterLoginRoute(to);

  // 处理外部链接
  if (handleExternalLink(to)) {
    next(false);
    window.NProgress?.done();
    return;
  }

  // 处理认证检查
  if (handleAuthCheck(to, next)) {
    window.NProgress?.done();
    return;
  }

  // 处理权限检查
  if (handlePermissionCheck(to, next)) {
    window.NProgress?.done();
    return;
  }

  // 继续导航
  next();
}

/**
 * 路由后置守卫
 */
function afterEachGuard() {
  // 结束进度条
  window.NProgress?.done();
}

/**
 * 路由错误处理
 */
function onErrorHandler(error: Error) {
  console.error('[Router Error]', error);
  window.NProgress?.done();
}

/**
 * 设置路由守卫
 * @param router 路由实例
 * @param options 配置选项
 */
export function setupRouterGuard(router: Router, options?: Partial<RouterGuardOptions>) {
  // 合并配置
  if (options) {
    setRouterGuardOptions(options);
  }

  // 注册前置守卫
  router.beforeEach(beforeEachGuard);

  // 注册后置守卫
  router.afterEach(afterEachGuard);

  // 注册错误处理
  router.onError(onErrorHandler);
}

/**
 * 获取布局类型（供布局组件使用）
 * @param route 路由对象
 */
export { getLayoutType };

/**
 * 获取打开类型（供布局组件使用）
 */
export { getOpenType };
