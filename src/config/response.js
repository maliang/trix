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
 * 默认响应格式配置
 * 适用于常见的后端响应格式：{ code: 0, data: {...}, message: 'success' }
 */
export const responseConfig = {
    codeField: 'code',
    successCode: 0,
    dataField: 'data',
    messageField: 'msg',
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
export function getValueByPath(obj, path) {
    if (!obj || !path)
        return undefined;
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
        if (result === null || result === undefined)
            return undefined;
        result = result[key];
    }
    return result;
}
/**
 * 解析 API 响应
 * @param response - 原始响应数据
 * @param config - 响应格式配置（可选，默认使用全局配置）
 * @returns 解析后的响应结果
 */
export function parseResponse(response, config = responseConfig) {
    const code = getValueByPath(response, config.codeField);
    const data = getValueByPath(response, config.dataField);
    const message = getValueByPath(response, config.messageField) || '';
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
export function parsePaginationData(data, config = responseConfig.pagination) {
    return {
        list: getValueByPath(data, config.listField) || [],
        total: getValueByPath(data, config.totalField) || 0,
        page: getValueByPath(data, config.pageField) || 1,
        pageSize: getValueByPath(data, config.pageSizeField) || 10
    };
}
/**
 * 创建自定义响应格式配置
 * @param customConfig - 自定义配置（部分覆盖）
 * @returns 合并后的完整配置
 */
export function createResponseConfig(customConfig) {
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
