/**
 * Schema API 服务
 * 用于获取 JSON Schema 配置
 */
import { get } from '@/service/request';
import { getBaseUrl } from '@/store/modules/theme/shared';
import { getHttpErrorStatus } from '@/utils/common';
/**
 * 获取页面 Schema
 * @param source Schema 来源（API 地址或静态文件路径）
 * @returns Schema 数据
 */
export async function fetchSchema(source) {
    // 判断是否为静态文件路径
    const isStaticFile = source.endsWith('.json') || source.startsWith('/mock/');
    if (isStaticFile) {
        // 静态文件：直接 fetch
        return fetchStaticSchema(source);
    }
    else {
        // API 地址：使用 request 方法
        return fetchApiSchema(source);
    }
}
/**
 * 获取静态 Schema 文件
 * @param path 文件路径
 * @returns Schema 数据
 */
async function fetchStaticSchema(path) {
    try {
        const url = getBaseUrl(path);
        const response = await fetch(url);
        if (!response.ok) {
            const error = new Error(`获取 Schema 失败: ${response.status} ${response.statusText}`);
            error.status = response.status;
            throw error;
        }
        const schema = await response.json();
        return schema;
    }
    catch (error) {
        if (error instanceof Error && getHttpErrorStatus(error)) {
            throw error;
        }
        const message = error instanceof Error ? error.message : '获取 Schema 失败';
        throw new Error(message);
    }
}
/**
 * 从 API 获取 Schema
 * @param url API 地址
 * @returns Schema 数据
 */
async function fetchApiSchema(url) {
    // 使用系统标准请求
    const { data, error, response } = await get(url, {}, {
        showErrorMessage: false
    });
    if (error) {
        const err = new Error(`获取 Schema 失败: ${error.message}`);
        err.status = response?.status || getHttpErrorStatus(error) || null;
        throw err;
    }
    // 标准请求已经处理了响应格式，直接返回 data
    if (data) {
        return data;
    }
    throw new Error('获取 Schema 失败: 返回数据为空');
}
/**
 * 获取 Header 右侧 Schema
 * @param source Schema 来源（可选，默认使用配置的地址）
 * @returns Schema 数据或 null
 */
export async function fetchHeaderSchema(source) {
    const schemaSource = source || import.meta.env.VITE_HEADER_SCHEMA_URL;
    if (!schemaSource) {
        return null;
    }
    try {
        return await fetchSchema(schemaSource);
    }
    catch {
        return null;
    }
}
/** @deprecated 直接使用 fetchSchema(source) 即可 */
export const fetchMenuSchema = fetchSchema;
/** @deprecated 直接使用 fetchSchema(source) 即可 */
export const fetchFormSchema = fetchSchema;
/** @deprecated 直接使用 fetchSchema(source) 即可 */
export const fetchTableSchema = fetchSchema;
