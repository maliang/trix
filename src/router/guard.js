import { isAuthRequired, getLayoutType, getOpenType, getHref, getRouteTitle, getPermissions, isDefaultAfterLogin } from './helper';
/**
 * 默认配置
 */
const defaultOptions = {
    isLoggedIn: () => true, // 默认已登录（开发阶段）
    getUserPermissions: () => [],
    hasAnyPermission: () => true, // 默认有权限（开发阶段）
    isAuthRouteInitialized: () => true,
    initAuthRoute: async () => { },
    loginRouteName: 'login',
    forbiddenRouteName: 'forbidden',
    appTitle: 'Trix Admin',
    onLoginSuccess: () => { }
};
/**
 * 当前配置
 */
let currentOptions = { ...defaultOptions };
/**
 * 收集的默认显示页面路由
 */
const defaultAfterLoginRoutes = [];
/**
 * 设置路由守卫配置
 * @param options 配置选项
 */
export function setRouterGuardOptions(options) {
    currentOptions = { ...currentOptions, ...options };
}
/**
 * 获取当前路由守卫配置
 */
export function getRouterGuardOptions() {
    return { ...currentOptions };
}
/**
 * 获取所有默认显示页面的路由路径
 */
export function getDefaultAfterLoginRoutes() {
    return [...defaultAfterLoginRoutes];
}
/**
 * 收集默认显示页面
 * @param to 目标路由
 */
function collectDefaultAfterLoginRoute(to) {
    if (isDefaultAfterLogin(to)) {
        const path = to.fullPath;
        if (!defaultAfterLoginRoutes.includes(path)) {
            defaultAfterLoginRoutes.push(path);
        }
        // 同时添加到 tabStore 的默认标签页
        import('@/store/modules/tab').then(({ useTabStore }) => {
            const tabStore = useTabStore();
            tabStore.addDefaultTab({
                name: to.name,
                path: to.path,
                fullPath: to.fullPath,
                meta: {
                    title: to.meta.title,
                    icon: to.meta.icon
                }
            });
        }).catch(() => {
            // store 可能还未初始化，忽略错误
        });
    }
}
/**
 * 处理外部链接
 * @param to 目标路由
 * @returns 是否已处理（true 表示已处理，不需要继续导航）
 */
function handleExternalLink(to) {
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
function handleAuthCheck(to, next) {
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
function handlePermissionCheck(to, next) {
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
function setPageTitle(to) {
    const title = getRouteTitle(to);
    // 优先从 currentOptions 获取，其次使用默认值
    const defaultTitle = 'Trix Admin';
    const appTitle = currentOptions.appTitle || defaultTitle;
    if (title) {
        document.title = `${title} | ${appTitle}`;
    }
    else {
        document.title = appTitle;
    }
}
/**
 * 路由前置守卫
 */
async function beforeEachGuard(to, _from, next) {
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
function onErrorHandler(error) {
    console.error('[Router Error]', error);
    window.NProgress?.done();
}
/**
 * 设置路由守卫
 * @param router 路由实例
 * @param options 配置选项
 */
export function setupRouterGuard(router, options) {
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
