/**
 * JSON 渲染器配置
 * 用于配置 vue-json-schema 渲染器的全局选项
 */

import { responseConfig } from './response';

/**
 * 全局状态注入配置接口
 */
export interface GlobalStateConfig {
  /** 是否注入用户信息（$user） */
  injectUser: boolean;
  /** 是否注入权限信息（$permissions） */
  injectPermissions: boolean;
  /** 是否注入主题信息（$theme） */
  injectTheme: boolean;
  /** 是否注入路由信息（$route） */
  injectRoute: boolean;
}

/**
 * JSON 渲染器配置接口
 */
export interface JsonRendererConfig {
  /** API 基础 URL */
  baseURL: string;
  /** 响应数据提取路径（从响应中提取数据的字段路径） */
  responseDataPath: string;
  /** 默认请求头 */
  defaultHeaders: Record<string, string>;
  /** 是否启用开发模式（显示 Schema 编辑器等调试工具） */
  devMode: boolean;
  /** 全局状态注入配置 */
  globalState: GlobalStateConfig;
  /** 请求超时时间（毫秒） */
  timeout: number;
  /** 是否在请求时自动携带 token */
  withToken: boolean;
  /** token 存储的 key */
  tokenKey: string;
  /** token 请求头名称 */
  tokenHeaderName: string;
  /** token 前缀（例如 "Bearer "） */
  tokenPrefix?: string;
}

/**
 * 默认 JSON 渲染器配置
 * 注意：responseDataPath 从 responseConfig.dataField 获取，保持与通用请求配置一致
 */
export const jsonRendererConfig: JsonRendererConfig = {
  // API 基础 URL，从环境变量读取
  baseURL: import.meta.env.VITE_SERVICE_BASE_URL || '',

  // 响应数据提取路径（与 responseConfig.dataField 保持一致）
  responseDataPath: responseConfig.dataField,

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
export function createJsonRendererConfig(customConfig: Partial<JsonRendererConfig>): JsonRendererConfig {
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
    }
  };
}

/**
 * 获取当前环境的 JSON 渲染器配置
 * 可根据不同环境返回不同配置
 */
export function getJsonRendererConfig(): JsonRendererConfig {
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
