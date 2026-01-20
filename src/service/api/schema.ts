/**
 * Schema API 服务
 * 用于获取 JSON Schema 配置
 */

import type { JsonNode } from '@maliang47/vschema';
import { responseConfig, getValueByPath } from '@/config/response';

/**
 * 获取页面 Schema
 * @param source Schema 来源（API 地址或静态文件路径）
 * @returns Schema 数据
 */
export async function fetchSchema(source: string): Promise<JsonNode> {
  // 判断是否为静态文件路径
  const isStaticFile = source.endsWith('.json') || source.startsWith('/mock/');

  if (isStaticFile) {
    // 静态文件：直接 fetch
    return fetchStaticSchema(source);
  } else {
    // API 地址：使用 request 方法
    return fetchApiSchema(source);
  }
}

/**
 * 获取静态 Schema 文件
 * @param path 文件路径
 * @returns Schema 数据
 */
async function fetchStaticSchema(path: string): Promise<JsonNode> {
  try {
    const response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`获取 Schema 失败: ${response.status} ${response.statusText}`);
    }

    const schema = await response.json();
    return schema as JsonNode;
  } catch (error) {
    const message = error instanceof Error ? error.message : '获取 Schema 失败';
    throw new Error(message);
  }
}

/**
 * 从 API 获取 Schema
 * @param url API 地址
 * @returns Schema 数据
 */
async function fetchApiSchema(url: string): Promise<JsonNode> {
  const baseURL = import.meta.env.VITE_SERVICE_BASE_URL || '';
  const finalUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

  const response = await fetch(finalUrl, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`获取 Schema 失败: ${response.status} ${response.statusText}`);
  }

  // 解析响应，支持两种格式：
  // - 原始 JsonNode: { com, props, children, ... }
  // - 包装响应: { code, data, message, ... } 其中 data 是 JsonNode
  const raw = (await response.json()) as unknown;
  
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const responseObj = raw as Record<string, unknown>;
    
    // 使用统一的响应配置检查是否为包装响应
    const code = getValueByPath(responseObj, responseConfig.codeField);
    
    // 如果存在 code 字段，说明是包装响应，提取 data
    if (code !== undefined) {
      const data = getValueByPath(responseObj, responseConfig.dataField);
      return (data ?? responseObj) as JsonNode;
    }
  }

  return raw as JsonNode;
}

/**
 * 获取 Header 右侧 Schema
 * @param source Schema 来源（可选，默认使用配置的地址）
 * @returns Schema 数据或 null
 */
export async function fetchHeaderSchema(source?: string): Promise<JsonNode | null> {
  const schemaSource = source || import.meta.env.VITE_HEADER_SCHEMA_URL;

  if (!schemaSource) {
    return null;
  }

  try {
    return await fetchSchema(schemaSource);
  } catch {
    // Header Schema 获取失败时返回 null，使用默认配置
    return null;
  }
}

/**
 * 获取菜单 Schema
 * @param source Schema 来源
 * @returns Schema 数据
 */
export async function fetchMenuSchema(source: string): Promise<JsonNode> {
  return fetchSchema(source);
}

/**
 * 获取表单 Schema
 * @param source Schema 来源
 * @returns Schema 数据
 */
export async function fetchFormSchema(source: string): Promise<JsonNode> {
  return fetchSchema(source);
}

/**
 * 获取表格 Schema
 * @param source Schema 来源
 * @returns Schema 数据
 */
export async function fetchTableSchema(source: string): Promise<JsonNode> {
  return fetchSchema(source);
}
