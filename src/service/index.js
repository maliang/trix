/**
 * 服务层导出
 */
// 请求模块
export { request, get, post, put, del } from './request';
// 响应适配器
export { createRequestInterceptor, createResponseInterceptor, setupInterceptors, createResponseAdapter, defaultAdapter, ResponseAdapter, getAdapterConfig } from './request/adapter';
// API 服务
export * from './api';
