/**
 * 后台配置管理
 * 从服务端注入的 window.__LARTRIX_CONFIG__ 读取配置
 */

export interface BackendConfig {
  /** API 前缀 */
  apiPrefix: string;
  /** 应用标题 */
  appTitle: string;
  /** Logo */
  logo?: string;
}

declare global {
  interface Window {
    __LARTRIX_CONFIG__?: BackendConfig;
  }
}

/**
 * 获取后台配置
 * 优先使用服务端注入的配置，否则使用环境变量默认值
 */
export function getBackendConfig(): BackendConfig {
  const injectedConfig = window.__LARTRIX_CONFIG__;

  if (injectedConfig) {
    return injectedConfig;
  }

  // 回退到环境变量默认值
  return {
    apiPrefix: import.meta.env.VITE_SERVICE_BASE_URL || '/api/admin',
    appTitle: 'Lartrix Admin',
  };
}

/**
 * 获取 API 基础 URL
 */
export function getApiBaseUrl(): string {
  return getBackendConfig().apiPrefix;
}

/**
 * 获取应用标题
 */
export function getAppTitle(): string {
  return getBackendConfig().appTitle;
}

/**
 * 检查是否有服务端注入的配置
 */
export function hasInjectedConfig(): boolean {
  return !!window.__LARTRIX_CONFIG__;
}
