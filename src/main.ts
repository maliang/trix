import { createApp } from 'vue';
import './plugins/assets';
import { setupDayjs, setupIconifyOffline, setupJsonRenderer, setupLoading, setupNProgress } from './plugins';
import { setupStore } from './store';
import { setupRouter, setRouterGuardOptions } from './router';
import { setupI18n } from './locales';
import { useAuthStore } from './store/modules/auth';
import { useRouteStore } from './store/modules/route';
import App from './App.vue';

async function setupApp() {
  setupLoading();

  setupNProgress();

  setupIconifyOffline();

  setupDayjs();

  const app = createApp(App);

  // 设置 JSON 渲染器插件（在路由之前初始化）
  setupJsonRenderer(app);

  setupStore(app);

  // 初始化认证状态（在路由之前）
  const authStore = useAuthStore();
  await authStore.initUserInfo();

  // 初始化路由 Store（在配置守卫之前）
  const routeStore = useRouteStore();

  // 配置路由守卫选项（在设置路由之前）
  setRouterGuardOptions({
    isLoggedIn: () => authStore.isLogin,
    getUserPermissions: () => authStore.userInfo.permissions,
    hasAnyPermission: (permissions: string[]) => {
      if (permissions.length === 0) return true;
      return permissions.some(p => authStore.userInfo.permissions.includes(p));
    },
    isAuthRouteInitialized: () => routeStore.isInitAuthRoute,
    initAuthRoute: () => routeStore.initAuthRoute()
  });

  // 设置路由
  await setupRouter(app);

  // 初始化常量路由
  await routeStore.initConstantRoute();
  
  // 注意：动态路由的初始化由路由守卫在需要时自动触发
  // 这样可以确保刷新页面时动态路由在导航前加载完成

  setupI18n(app);

  app.mount('#app');
}

setupApp();
