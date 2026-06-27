import { createApp } from 'vue';
import './plugins/assets';
import { setupDayjs, setupIconifyOffline, setupJsonRenderer, setupLoading, setupNProgress } from './plugins';
import { setupStore } from './store';
import { setupRouter, setRouterGuardOptions } from './router';
import { setupI18n, applyBackendLocale } from './locales';
import { useAuthStore } from './store/modules/auth';
import { useRouteStore } from './store/modules/route';
import { getBackendConfig, hasInjectedConfig } from './config/backend';
import type { BackendConfig } from './config/backend';
import { useNotificationRealtime } from './service/notification';
import { useAudioUnlock } from './service/audio/unlock';
import { get } from './service/request';
import App from './App.vue';

/**
 * 运行时兜底加载后端配置
 *
 * 正常情况下后端 entry() 会把 window.__LARTRIX_CONFIG__ 注入到入口 HTML。
 * 但当入口 HTML 被 Web 服务器当作静态文件直接返回（例如 /admin 命中物理目录、
 * 未经过 PHP 路由）时，注入会被跳过，导致 realtime.behaviors 等配置丢失。
 * 这里在缺失时主动调用 auth/config 接口补齐，避免依赖具体的 Web 服务器路由配置。
 */
async function ensureBackendConfig(): Promise<void> {
  if (hasInjectedConfig()) return;

  try {
    const { data } = await get<BackendConfig>('/auth/config', undefined, { showErrorMessage: false });
    if (data) {
      window.__LARTRIX_CONFIG__ = data;
    }
  } catch (error) {
    console.warn('[BackendConfig] runtime fetch fallback failed:', error);
  }
}

async function setupApp() {
  // 入口未注入配置时，运行时补齐（必须在所有读取配置的初始化之前）
  await ensureBackendConfig();

  // 配置就绪后立即应用语言（让标题/语言在未注入时也正确）
  applyBackendLocale();

  setupLoading();

  setupNProgress();

  setupIconifyOffline();

  setupDayjs();

  useAudioUnlock().install();

  const app = createApp(App);

  // 设置 JSON 渲染器插件（在路由之前初始化）
  setupJsonRenderer(app);

  setupStore(app);

  // 初始化认证状态（在路由之前）
  const authStore = useAuthStore();
  await authStore.initUserInfo();
  if (authStore.isLogin) {
    useNotificationRealtime().start(getBackendConfig().realtime);
  }

  // 初始化路由 Store（在配置守卫之前）
  const routeStore = useRouteStore();

  // 配置路由守卫选项（在设置路由之前）
  setRouterGuardOptions({
    appTitle: getBackendConfig().appTitle,
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
