/**
 * JSON 渲染器配置
 * 用于配置 vue-json-schema 渲染器的全局选项
 */
import { responseConfig } from './response';
import { getApiBaseUrl } from './backend';
/**
 * 默认 JSON 渲染器配置
 * 注意：responseFormat 从 responseConfig 获取，保持与通用请求配置一致
 */
export const jsonRendererConfig = {
    // API 基础 URL，优先使用后台注入的配置
    baseURL: getApiBaseUrl(),
    // 响应数据提取路径（与 responseConfig.dataField 保持一致）
    responseDataPath: responseConfig.dataField,
    // API 响应格式配置（与 responseConfig 保持一致）
    responseFormat: {
        codeField: responseConfig.codeField,
        msgField: responseConfig.messageField,
        dataField: responseConfig.dataField,
        successCode: responseConfig.successCode
    },
    // 默认请求头
    defaultHeaders: {
        'Content-Type': 'application/json'
    },
    // 开发模式（根据 Vite 环境变量判断）
    devMode: import.meta.env.DEV,
    // 全局状态注入配置
    globalState: {
        injectUser: true,
        injectPermissions: true,
        injectTheme: true,
        injectRoute: true
    },
    // 请求超时时间：30 秒
    timeout: 30000,
    // 自动携带 token
    withToken: true,
    // token 存储 key
    tokenKey: 'token',
    // token 请求头名称
    tokenHeaderName: 'Authorization',
    // token 前缀
    tokenPrefix: 'Bearer '
};
/**
 * 创建自定义 JSON 渲染器配置
 * @param customConfig - 自定义配置（部分覆盖）
 * @returns 合并后的完整配置
 */
export function createJsonRendererConfig(customConfig) {
    return {
        ...jsonRendererConfig,
        ...customConfig,
        defaultHeaders: {
            ...jsonRendererConfig.defaultHeaders,
            ...customConfig.defaultHeaders
        },
        globalState: {
            ...jsonRendererConfig.globalState,
            ...customConfig.globalState
        },
        responseFormat: {
            ...jsonRendererConfig.responseFormat,
            ...customConfig.responseFormat
        }
    };
}
/**
 * 获取当前环境的 JSON 渲染器配置
 * 可根据不同环境返回不同配置
 */
export function getJsonRendererConfig() {
    const env = import.meta.env.MODE;
    // 生产环境可能需要不同的配置
    if (env === 'production') {
        return {
            ...jsonRendererConfig,
            devMode: false
        };
    }
    return jsonRendererConfig;
}
