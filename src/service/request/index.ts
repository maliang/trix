/**
 * 请求模块（request layer）
 *
 * 目标：统一使用 fetch（浏览器原生请求）实现 request/get/post/put/del，并支持：
 * - 鉴权（authentication，认证）：自动追加 token（令牌）
 * - 拦截（interceptor，拦截器）：统一错误处理
 * - 超时（timeout）：AbortController
 * - params：自动拼接查询参数
 */

import { responseConfig, parseResponse } from '@/config/response';
import { createRequestInterceptor, createResponseInterceptor, getAdapterConfig } from './adapter';
import type { BackendResponse, RequestConfig, RequestResult, ResponseType } from './type';

const DEFAULT_TIMEOUT = 30_000;

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function buildUrl(url: string, baseURL: string, params?: Record<string, unknown>): string {
  const fullUrl = isAbsoluteUrl(url) ? url : `${baseURL}${url}`;

  if (!params || Object.keys(params).length === 0) return fullUrl;

  const u = new URL(fullUrl, window.location.origin);

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    u.searchParams.set(key, String(value));
  }

  return u.toString();
}

function detectResponseType(responseType?: ResponseType): ResponseType {
  return responseType ?? 'json';
}

async function readResponseBody(response: Response, responseType: ResponseType): Promise<unknown> {
  if (responseType === 'blob') return response.blob();
  if (responseType === 'text') return response.text();

  // 默认 json：尽量解析，解析失败则返回文本（避免吞掉错误信息）
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function buildRequestInit(config: RequestConfig): RequestInit {
  const method = (config.method || 'GET').toUpperCase();
  const headers: Record<string, string> = { ...(config.headers || {}) };

  const init: RequestInit = {
    method,
    headers
  };

  // 处理 body（仅在非 GET/HEAD 时设置）
  if (config.data !== undefined && method !== 'GET' && method !== 'HEAD') {
    if (config.data instanceof FormData) {
      init.body = config.data;
      // FormData 让浏览器自动设置 Content-Type（含 boundary）
      delete headers['Content-Type'];
    } else if (typeof config.data === 'string') {
      init.body = config.data;
    } else {
      // 默认 JSON
      if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(config.data);
    }
  }

  return init;
}

/**
 * 通用请求方法
 *
 * 默认行为：假设后端返回通用结构 `{ code, data, message }`，并使用 `parseResponse` 判断 success。
 * 若需要拿到原始数据，可通过 `responseType` 配置为 text/blob 或自行在上层处理。
 */
export async function request<T = unknown>(config: RequestConfig): Promise<RequestResult<T>> {
  const baseURL = config.baseURL ?? import.meta.env.VITE_SERVICE_BASE_URL ?? '';
  const timeout = config.timeout ?? DEFAULT_TIMEOUT;
  const responseType = detectResponseType(config.responseType);

  // 应用全局拦截器配置（用于统一鉴权等）
  const adapterConfig = getAdapterConfig();
  const applyRequest = createRequestInterceptor({
    addToken: config.withToken ?? true,
    tokenHeader: config.tokenHeader,
    tokenPrefix: config.tokenPrefix,
    ...adapterConfig.request
  });
  const responseInterceptor = createResponseInterceptor(adapterConfig.response);

  try {
    const interceptedConfig = applyRequest(config);

    const url = buildUrl(interceptedConfig.url, baseURL, interceptedConfig.params);
    const init = buildRequestInit(interceptedConfig);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    let response: Response;
    try {
      response = await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }

    responseInterceptor.onFulfilled(response);

    const body = await readResponseBody(response, responseType);

    // HTTP 失败直接视为错误
    if (!response.ok) {
      const err = new Error(
        typeof body === 'string' && body
          ? body
          : `请求失败: ${response.status} ${response.statusText}`
      );
      responseInterceptor.onRejected(err, response, body);
      return { data: null, error: err, response };
    }

    // 非 json 类型不做通用结构解析，直接返回
    if (responseType !== 'json') {
      return { data: body as T, error: null, response };
    }

    // 兼容：body 可能不是对象（例如返回纯文本）
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return { data: body as T, error: null, response };
    }

    const parsed = parseResponse<T>(body as Record<string, unknown>, responseConfig);
    if (parsed.success) {
      if (config.showSuccessMessage && config.successMessage) {
        window.$message?.success(config.successMessage);
      }
      return { data: parsed.data ?? null, error: null, response };
    }

    const err = new Error(parsed.message || '请求失败');
    if (config.showErrorMessage !== false) {
      window.$message?.error(err.message);
    }
    responseInterceptor.onRejected(err, response, body);
    return { data: null, error: err, response };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    responseInterceptor.onRejected(err);

    if (config.showErrorMessage !== false) {
      // 拦截器里可能已经提示过，这里保持与旧行为一致：仍可显示一次
      window.$message?.error(err.message);
    }

    return { data: null, error: err };
  }
}

export async function get<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: RequestConfig
): Promise<RequestResult<T>> {
  return request<T>({
    ...(config || {}),
    url,
    method: 'GET',
    params
  });
}

export async function post<T = unknown>(
  url: string,
  data?: Record<string, unknown>,
  config?: RequestConfig
): Promise<RequestResult<T>> {
  return request<T>({
    ...(config || {}),
    url,
    method: 'POST',
    data
  });
}

export async function put<T = unknown>(
  url: string,
  data?: Record<string, unknown>,
  config?: RequestConfig
): Promise<RequestResult<T>> {
  return request<T>({
    ...(config || {}),
    url,
    method: 'PUT',
    data
  });
}

export async function del<T = unknown>(
  url: string,
  params?: Record<string, unknown>,
  config?: RequestConfig
): Promise<RequestResult<T>> {
  return request<T>({
    ...(config || {}),
    url,
    method: 'DELETE',
    params
  });
}

export type { RequestConfig, RequestResult, BackendResponse };

