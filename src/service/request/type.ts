/**
 * 请求类型定义
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export type ResponseType = 'json' | 'text' | 'blob';

/**
 * 请求配置
 */
export interface RequestConfig {
  /** 请求地址（相对路径或绝对地址） */
  url: string;
  /** 请求方法 */
  method?: HttpMethod;
  /** 查询参数（会拼接到 URL 上） */
  params?: Record<string, unknown>;
  /** 请求体（非 GET/DELETE 时常用） */
  data?: unknown;
  /** 自定义请求头 */
  headers?: Record<string, string>;
  /** baseURL（默认使用 VITE_SERVICE_BASE_URL） */
  baseURL?: string;
  /** 超时（毫秒），默认 30000 */
  timeout?: number;
  /** 响应类型（默认 json） */
  responseType?: ResponseType;
  /** 是否携带 token（令牌），默认 true */
  withToken?: boolean;
  /** token 请求头名称，默认 Authorization */
  tokenHeader?: string;
  /** token 前缀，默认 Bearer  */
  tokenPrefix?: string;

  /** 是否显示错误消息 */
  showErrorMessage?: boolean;
  /** 是否显示成功消息 */
  showSuccessMessage?: boolean;
  /** 成功消息内容 */
  successMessage?: string;
}

/**
 * 请求结果
 */
export interface RequestResult<T = unknown> {
  /** 数据 */
  data: T | null;
  /** 错误信息 */
  error: Error | null;
  /** 原始响应 */
  response?: Response;
}

/**
 * 后端响应结构
 */
export interface BackendResponse<T = unknown> {
  /** 状态码 */
  code: number | string;
  /** 数据 */
  data: T;
  /** 消息 */
  message: string;
}
