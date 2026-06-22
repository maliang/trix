/**
 * 后台配置管理
 * 从服务端注入的 window.__LARTRIX_CONFIG__ 读取配置
 */
/**
 * 获取后台配置
 * 优先使用服务端注入的配置，否则使用环境变量默认值
 */
export function getBackendConfig() {
    const injectedConfig = window.__LARTRIX_CONFIG__;
    if (injectedConfig) {
        return injectedConfig;
    }
    // 回退到环境变量默认值
    return {
        apiPrefix: import.meta.env.VITE_SERVICE_BASE_URL || '/api/admin',
        appTitle: 'Lartrix Admin',
        locale: 'zh-CN',
        fallbackLocale: 'en-US'
    };
}
/**
 * 获取 API 基础 URL
 */
export function getApiBaseUrl() {
    return getBackendConfig().apiPrefix;
}
/**
 * 获取应用标题
 */
export function getAppTitle() {
    return getBackendConfig().appTitle;
}
/**
 * 检查是否有服务端注入的配置
 */
export function hasInjectedConfig() {
    return !!window.__LARTRIX_CONFIG__;
}
