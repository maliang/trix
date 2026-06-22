/**
 * 请求/响应适配器（adapter）
 *
 * 用途：
 * - 统一处理鉴权（authentication，认证）：自动追加 token（令牌）
 * - 统一处理错误提示与 Token 过期等逻辑
 * - 提供 ResponseAdapter（响应适配器）用于解析通用后端响应结构
 */
import { responseConfig, parseResponse, parsePaginationData, getValueByPath } from '@/config/response';
import { localStg } from '@/utils/storage';
const defaultRequestConfig = {
    addToken: true,
    tokenHeader: 'Authorization',
    tokenPrefix: 'Bearer '
};
const defaultResponseConfig = {
    responseFormat: responseConfig,
    autoHandleError: true,
    tokenExpiredStatus: 401
};
let globalAdapterConfig = {};
/**
 * 设置全局拦截器配置
 *
 * 说明：fetch 本身没有全局拦截器链，这里仅保存配置，供 request() 调用时应用。
 */
export function setupInterceptors(config = {}) {
    globalAdapterConfig = config;
}
export function getAdapterConfig() {
    return globalAdapterConfig;
}
/**
 * 创建请求拦截器
 */
export function createRequestInterceptor(config = defaultRequestConfig) {
    const finalConfig = { ...defaultRequestConfig, ...config };
    return (req) => {
        const next = { ...req, headers: { ...(req.headers || {}) } };
        // 添加 token
        if (finalConfig.addToken) {
            const token = localStg.get('token');
            if (token) {
                const headerName = finalConfig.tokenHeader || 'Authorization';
                const headerValue = finalConfig.tokenPrefix ? `${finalConfig.tokenPrefix}${token}` : token;
                next.headers[headerName] = headerValue;
            }
        }
        // 添加自定义 headers
        if (finalConfig.customHeaders) {
            Object.assign(next.headers, finalConfig.customHeaders);
        }
        // 自定义处理
        if (finalConfig.beforeRequest) {
            return finalConfig.beforeRequest(next);
        }
        return next;
    };
}
/**
 * 创建响应拦截器（用于 request() 内部调用）
 */
export function createResponseInterceptor(config = defaultResponseConfig) {
    const finalConfig = { ...defaultResponseConfig, ...config };
    return {
        onFulfilled: (response) => {
            finalConfig.onSuccess?.(response);
            return response;
        },
        onRejected: (error, response, responseBody) => {
            // Token 过期
            if (finalConfig.tokenExpiredStatus && response?.status === finalConfig.tokenExpiredStatus) {
                finalConfig.onTokenExpired?.();
            }
            // 自动错误提示
            if (finalConfig.autoHandleError) {
                const message = getErrorMessage(error, response, responseBody);
                window.$message?.error(message);
            }
            finalConfig.onError?.(error);
        }
    };
}
function getErrorMessage(error, response, body) {
    // 优先从后端响应体里取 message 字段（兼容 responseConfig.messageField）
    if (body && typeof body === 'object' && !Array.isArray(body)) {
        const message = getValueByPath(body, responseConfig.messageField);
        if (message)
            return message;
    }
    if (response) {
        switch (response.status) {
            case 400:
                return '请求参数错误';
            case 401:
                return '未授权，请重新登录';
            case 403:
                return '拒绝访问';
            case 404:
                return '请求的资源不存在';
            case 500:
                return '服务器内部错误';
            case 502:
                return '网关错误';
            case 503:
                return '服务不可用';
            case 504:
                return '网关超时';
            default:
                return `请求失败: ${response.status}`;
        }
    }
    // 网络/超时等
    if (error.name === 'AbortError') {
        return '请求超时，请稍后重试';
    }
    return error.message || '未知错误';
}
/**
 * 响应适配器类
 * 提供更灵活的响应解析功能（用于解析通用后端结构）
 */
export class ResponseAdapter {
    config;
    constructor(config = responseConfig) {
        this.config = config;
    }
    parse(response) {
        return parseResponse(response, this.config);
    }
    parsePagination(data) {
        if (!this.config.pagination) {
            throw new Error('分页配置未设置');
        }
        return parsePaginationData(data, this.config.pagination);
    }
    isSuccess(response) {
        const code = getValueByPath(response, this.config.codeField);
        return code === this.config.successCode;
    }
    getData(response) {
        return getValueByPath(response, this.config.dataField);
    }
    getMessage(response) {
        return getValueByPath(response, this.config.messageField) || '';
    }
    getCode(response) {
        return getValueByPath(response, this.config.codeField) ?? '';
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
}
export function createResponseAdapter(config) {
    return new ResponseAdapter(config);
}
export const defaultAdapter = new ResponseAdapter();
