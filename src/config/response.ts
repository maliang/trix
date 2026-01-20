/**
 * 响应格式配置（统一配置中心）
 * 
 * 用于配置后端 API 返回的统一响应格式，支持不同后端框架的响应结构。
 * 此配置被以下模块使用：
 * - service/request - 通用请求模块
 * - service/api/schema - Schema API 服务
 * - config/json-renderer - vschema JSON 渲染器配置
 * 
 * 修改此配置后，所有请求相关的响应解析都会同步更新。
 */

/**
 * 分页数据配置接口
 */
export interface PaginationConfig {
  /** 总数字段路径 */
  totalField: string;
  /** 当前页字段路径 */
  pageField: string;
  /** 每页大小字段路径 */
  pageSizeField: string;
  /** 列表数据字段路径 */
  listField: string;
}

/**
 * 响应格式配置接口
 */
export interface ResponseFormatConfig {
  /** 状态码字段路径（支持嵌套路径，如 'result.code'） */
  codeField: string;
  /** 成功状态码值（可以是数字或字符串） */
  successCode: number | string;
  /** 数据字段路径（支持嵌套路径，如 'result.data'） */
  dataField: string;
  /** 消息字段路径（支持嵌套路径，如 'result.message'） */
  messageField: string;
  /** 分页数据配置 */
  pagination?: PaginationConfig;
}

/**
 * 默认响应格式配置
 * 适用于常见的后端响应格式：{ code: 0, data: {...}, message: 'success' }
 */
export const responseConfig: ResponseFormatConfig = {
  codeField: 'code',
  successCode: 0,
  dataField: 'data',
  messageField: 'message',
  pagination: {
    totalField: 'total',
    pageField: 'page',
    pageSizeField: 'pageSize',
    listField: 'list'
  }
};

/**
 * 根据字段路径从对象中获取值
 * @param obj - 源对象
 * @param path - 字段路径（支持点号分隔的嵌套路径）
 * @returns 字段值
 */
export function getValueByPath<T = unknown>(obj: Record<string, unknown>, path: string): T | undefined {
  if (!obj || !path) return undefined;

  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result === null || result === undefined) return undefined;
    result = (result as Record<string, unknown>)[key];
  }

  return result as T;
}

/**
 * 解析 API 响应
 * @param response - 原始响应数据
 * @param config - 响应格式配置（可选，默认使用全局配置）
 * @returns 解析后的响应结果
 */
export function parseResponse<T = unknown>(
  response: Record<string, unknown>,
  config: ResponseFormatConfig = responseConfig
): {
  success: boolean;
  data: T | undefined;
  message: string;
  code: number | string;
} {
  const code = getValueByPath<number | string>(response, config.codeField);
  const data = getValueByPath<T>(response, config.dataField);
  const message = getValueByPath<string>(response, config.messageField) || '';
  const success = code === config.successCode;

  return {
    success,
    data,
    message,
    code: code ?? ''
  };
}

/**
 * 解析分页响应数据
 * @param data - 响应数据
 * @param config - 分页配置（可选，默认使用全局配置）
 * @returns 解析后的分页数据
 */
export function parsePaginationData<T = unknown>(
  data: Record<string, unknown>,
  config: PaginationConfig = responseConfig.pagination!
): {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
} {
  return {
    list: getValueByPath<T[]>(data, config.listField) || [],
    total: getValueByPath<number>(data, config.totalField) || 0,
    page: getValueByPath<number>(data, config.pageField) || 1,
    pageSize: getValueByPath<number>(data, config.pageSizeField) || 10
  };
}

/**
 * 创建自定义响应格式配置
 * @param customConfig - 自定义配置（部分覆盖）
 * @returns 合并后的完整配置
 */
export function createResponseConfig(customConfig: Partial<ResponseFormatConfig>): ResponseFormatConfig {
  const basePagination = responseConfig.pagination;
  const customPagination = customConfig.pagination;

  return {
    ...responseConfig,
    ...customConfig,
    pagination: basePagination && customPagination
      ? { ...basePagination, ...customPagination }
      : customPagination || basePagination
  };
}
