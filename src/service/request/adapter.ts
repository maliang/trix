/**
 * 请求/响应适配器（adapter）
 *
 * 用途：
 * - 统一处理鉴权（authentication，认证）：自动追加 token（令牌）
 * - 统一处理错误提示与 Token 过期等逻辑
 * - 提供 ResponseAdapter（响应适配器）用于解析通用后端响应结构
 */

import { responseConfig, parseResponse, parsePaginationData, getValueByPath } from '@/config/response';
import type { ResponseFormatConfig, PaginationConfig } from '@/config/response';
import { localStg } from '@/utils/storage';
import type { RequestConfig } from './type';

/**
 * 请求拦截器配置
 */
export interface RequestInterceptorConfig {
  /** 是否添加 token（令牌） */
  addToken?: boolean;
  /** token 头部名称 */
  tokenHeader?: string;
  /** token 前缀 */
  tokenPrefix?: string;
  /** 自定义请求头 */
  customHeaders?: Record<string, string>;
  /** 请求前处理函数（可用于统一补充 headers / 追踪字段等） */
  beforeRequest?: (config: RequestConfig) => RequestConfig;
}

/**
 * 响应拦截器配置
 */
export interface ResponseInterceptorConfig {
  /** 响应格式配置 */
  responseFormat?: ResponseFormatConfig;
  /** 是否自动处理错误（默认 true：会弹出错误提示） */
  autoHandleError?: boolean;
  /** 错误处理函数 */
  onError?: (error: Error) => void;
  /** 成功处理函数 */
  onSuccess?: (response: Response) => void;
  /** Token 过期处理函数 */
  onTokenExpired?: () => void;
  /** Token 过期 HTTP 状态码（默认 401） */
  tokenExpiredStatus?: number;
}

/**
 * 适配器配置
 */
export interface AdapterConfig {
  request?: RequestInterceptorConfig;
  response?: ResponseInterceptorConfig;
}

const defaultRequestConfig: RequestInterceptorConfig = {
  addToken: true,
  tokenHeader: 'Authorization',
  tokenPrefix: 'Bearer '
};

const defaultResponseConfig: ResponseInterceptorConfig = {
  responseFormat: responseConfig,
  autoHandleError: true,
  tokenExpiredStatus: 401
};

let globalAdapterConfig: AdapterConfig = {};

/**
 * 设置全局拦截器配置
 *
 * 说明：fetch 本身没有全局拦截器链，这里仅保存配置，供 request() 调用时应用。
 */
export function setupInterceptors(config: AdapterConfig = {}) {
  globalAdapterConfig = config;
}

export function getAdapterConfig(): AdapterConfig {
  return globalAdapterConfig;
}

/**
 * 创建请求拦截器
 */
export function createRequestInterceptor(config: RequestInterceptorConfig = defaultRequestConfig) {
  const finalConfig: RequestInterceptorConfig = { ...defaultRequestConfig, ...config };
  return (req: RequestConfig): RequestConfig => {
    const next: RequestConfig = { ...req, headers: { ...(req.headers || {}) } };

    // 添加 token
    if (finalConfig.addToken) {
      const token = localStg.get('token');
      if (token) {
        const headerName = finalConfig.tokenHeader || 'Authorization';
        const headerValue = finalConfig.tokenPrefix ? `${finalConfig.tokenPrefix}${token}` : token;
        next.headers![headerName] = headerValue;
      }
    }

    // 添加自定义 headers
    if (finalConfig.customHeaders) {
      Object.assign(next.headers!, finalConfig.customHeaders);
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
export function createResponseInterceptor(config: ResponseInterceptorConfig = defaultResponseConfig) {
  const finalConfig: ResponseInterceptorConfig = { ...defaultResponseConfig, ...config };
  return {
    onFulfilled: (response: Response): Response => {
      finalConfig.onSuccess?.(response);
      return response;
    },
    onRejected: (error: Error, response?: Response, responseBody?: unknown) => {
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

function getErrorMessage(error: Error, response?: Response, body?: unknown): string {
  // 优先从后端响应体里取 message 字段（兼容 responseConfig.messageField）
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    const message = getValueByPath<string>(body as Record<string, unknown>, responseConfig.messageField);
    if (message) return message;
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
  private config: ResponseFormatConfig;

  constructor(config: ResponseFormatConfig = responseConfig) {
    this.config = config;
  }

  parse<T = unknown>(response: Record<string, unknown>) {
    return parseResponse<T>(response, this.config);
  }

  parsePagination<T = unknown>(data: Record<string, unknown>) {
    if (!this.config.pagination) {
      throw new Error('分页配置未设置');
    }
    return parsePaginationData<T>(data, this.config.pagination);
  }

  isSuccess(response: Record<string, unknown>): boolean {
    const code = getValueByPath<number | string>(response, this.config.codeField);
    return code === this.config.successCode;
  }

  getData<T = unknown>(response: Record<string, unknown>): T | undefined {
    return getValueByPath<T>(response, this.config.dataField);
  }

  getMessage(response: Record<string, unknown>): string {
    return getValueByPath<string>(response, this.config.messageField) || '';
  }

  getCode(response: Record<string, unknown>): number | string {
    return getValueByPath<number | string>(response, this.config.codeField) ?? '';
  }

  updateConfig(config: Partial<ResponseFormatConfig>) {
    this.config = { ...this.config, ...config };
  }
}

export function createResponseAdapter(config?: ResponseFormatConfig): ResponseAdapter {
  return new ResponseAdapter(config);
}

export const defaultAdapter = new ResponseAdapter();
