import type { App } from 'vue';
import type { RouterHistory } from 'vue-router';
import { createRouter, createWebHashHistory, createWebHistory, createMemoryHistory } from 'vue-router';
import { routes, staticRoutes, builtinRoutes, dynamicRoutes, notFoundRoute } from './routes';
import { setupRouterGuard, setRouterGuardOptions, getDefaultAfterLoginRoutes } from './guard';
import type { RouterGuardOptions } from './guard';

/**
 * 根据环境变量创建路由历史模式
 */
function createRouterHistory(): RouterHistory {
  const mode = import.meta.env.VITE_ROUTER_MODE || 'hash';
  const baseUrl = import.meta.env.VITE_BASE_URL;

  switch (mode) {
    case 'history':
      return createWebHistory(baseUrl);
    case 'memory':
      return createMemoryHistory(baseUrl);
    case 'hash':
    default:
      return createWebHashHistory(baseUrl);
  }
}

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createRouterHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

/**
 * 设置路由
 * @param app Vue 应用实例
 * @param guardOptions 路由守卫配置选项
 */
export async function setupRouter(app: App, guardOptions?: Partial<RouterGuardOptions>) {
  // 设置路由守卫
  setupRouterGuard(router, guardOptions);

  // 注册路由
  app.use(router);

  // 等待路由准备就绪
  await router.isReady();
}

// 导出路由实例和相关配置
export { router, staticRoutes, builtinRoutes, dynamicRoutes, notFoundRoute };
export default router;

// 导出守卫相关
export { setupRouterGuard, setRouterGuardOptions, getDefaultAfterLoginRoutes };
export type { RouterGuardOptions };

// 导出辅助函数
export {
  isJsonRendererRoute,
  isAuthRequired,
  getLayoutType,
  getOpenType,
  getHref,
  getRouteTitle,
  isDefaultAfterLogin,
  getDefaultAfterLoginRoutes as getDefaultAfterLoginRoutesFromConfig
} from './helper';
