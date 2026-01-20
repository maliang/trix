import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { routes, staticRoutes, builtinRoutes, dynamicRoutes, notFoundRoute } from './routes';
import { setupRouterGuard, setRouterGuardOptions, getDefaultAfterLoginRoutes } from './guard';
import type { RouterGuardOptions } from './guard';

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
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
