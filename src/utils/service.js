import json5 from 'json5';
/**
 * 根据当前环境创建服务配置
 *
 * @param env 当前环境变量
 */
export function createServiceConfig(env) {
    const { VITE_SERVICE_BASE_URL, VITE_OTHER_SERVICE_BASE_URL } = env;
    let other = {};
    try {
        if (VITE_OTHER_SERVICE_BASE_URL) {
            other = json5.parse(VITE_OTHER_SERVICE_BASE_URL);
        }
    }
    catch {
        // eslint-disable-next-line no-console
        console.error('VITE_OTHER_SERVICE_BASE_URL is not a valid json5 string');
    }
    const httpConfig = {
        baseURL: VITE_SERVICE_BASE_URL,
        other
    };
    const otherHttpKeys = Object.keys(httpConfig.other);
    const otherConfig = otherHttpKeys.map(key => {
        return {
            key,
            baseURL: httpConfig.other[key],
            proxyPattern: createProxyPattern(key)
        };
    });
    const config = {
        baseURL: httpConfig.baseURL,
        proxyPattern: createProxyPattern(),
        other: otherConfig
    };
    return config;
}
/**
 * 获取后端服务基础 URL
 *
 * @param env - 当前环境变量
 * @param isProxy - 是否使用代理
 */
export function getServiceBaseURL(env, isProxy) {
    const { baseURL, other } = createServiceConfig(env);
    const otherBaseURL = {};
    other.forEach(item => {
        otherBaseURL[item.key] = isProxy ? item.proxyPattern : item.baseURL;
    });
    return {
        baseURL: isProxy ? createProxyPattern() : baseURL,
        otherBaseURL
    };
}
/**
 * 获取后端服务基础 URL 的代理模式
 *
 * @param key 如果未设置，将使用默认 key
 */
function createProxyPattern(key) {
    if (!key) {
        return '/proxy-default';
    }
    return `/proxy-${key}`;
}
