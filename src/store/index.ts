import type { App } from 'vue';
import { createPinia } from 'pinia';
import { resetSetupStore } from './plugins';

/** 设置 Pinia Store */
export function setupStore(app: App) {
  const pinia = createPinia();
  
  // 添加重置 setup store 的插件
  pinia.use(resetSetupStore);
  
  app.use(pinia);
}

// 导出 store 模块
export { useAppStore } from './modules/app';
export { useThemeStore } from './modules/theme';
export { useTabStore } from './modules/tab';
export { useAuthStore } from './modules/auth';
export { useRouteStore } from './modules/route';
export { useNotificationStore } from './modules/notification';

// 导出 store 插件
export { SetupStoreId, resetSetupStore } from './plugins';
