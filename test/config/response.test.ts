/**
 * 响应格式解析属性测试
 *
 * **Feature: trix-json-admin, Property 6: 响应格式解析**
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
 *
 * 对于任意后端 API 响应和响应格式配置，系统应该能够根据配置的
 * codeField、dataField、messageField 正确提取数据和判断请求是否成功。
 */

import { describe, it, expect } from 'vitest';
import { test } from '@fast-check/vitest';
import * as fc from 'fast-check';
import {
  responseConfig,
  getValueByPath,
  parseResponse,
  parsePaginationData,
  createResponseConfig,
  type ResponseFormatConfig,
  type PaginationConfig
} from '@/config/response';

describe('响应格式解析 - Property 6', () => {
  /**
   * Property 6: 响应格式解析
   *
   * *对于任意* 后端 API 响应和响应格式配置，系统应该能够根据配置的
   * codeField、dataField、messageField 正确提取数据和判断请求是否成功。
   *
   * **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
   */
  describe('Property 6: 响应格式解析', () => {
    // 生成随机响应数据的 Arbitrary
    const responseArbitrary = fc.record({
      code: fc.oneof(fc.integer(), fc.string()),
      data: fc.anything(),
      message: fc.string()
    });

    // 生成嵌套响应数据的 Arbitrary
    const nestedResponseArbitrary = fc.record({
      result: fc.record({
        code: fc.oneof(fc.integer(), fc.string()),
        data: fc.anything(),
        message: fc.string()
      })
    });

    // 属性测试：对于任意响应数据，parseResponse 应正确提取 code 字段
    test.prop(
      [responseArbitrary],
      { numRuns: 100 }
    )('对于任意响应数据，parseResponse 应正确提取 code 字段', (response) => {
      const result = parseResponse(response as Record<string, unknown>);
      expect(result.code).toBe(response.code);
    });

    // 属性测试：对于任意响应数据，parseResponse 应正确提取 data 字段
    test.prop(
      [responseArbitrary],
      { numRuns: 100 }
    )('对于任意响应数据，parseResponse 应正确提取 data 字段', (response) => {
      const result = parseResponse(response as Record<string, unknown>);
      expect(result.data).toEqual(response.data);
    });

    // 属性测试：对于任意响应数据，parseResponse 应正确提取 message 字段
    test.prop(
      [responseArbitrary],
      { numRuns: 100 }
    )('对于任意响应数据，parseResponse 应正确提取 message 字段', (response) => {
      const result = parseResponse(response as Record<string, unknown>);
      expect(result.message).toBe(response.message);
    });

    // 属性测试：当 code 等于 successCode 时，success 应为 true
    test.prop(
      [fc.anything(), fc.string()],
      { numRuns: 100 }
    )('当 code 等于 successCode 时，success 应为 true', (data, message) => {
      const response = {
        code: responseConfig.successCode,
        data,
        message
      };
      const result = parseResponse(response as Record<string, unknown>);
      expect(result.success).toBe(true);
    });

    // 属性测试：当 code 不等于 successCode 时，success 应为 false
    test.prop(
      [fc.integer().filter(n => n !== responseConfig.successCode), fc.anything(), fc.string()],
      { numRuns: 100 }
    )('当 code 不等于 successCode 时，success 应为 false', (code, data, message) => {
      const response = { code, data, message };
      const result = parseResponse(response as Record<string, unknown>);
      expect(result.success).toBe(false);
    });

    // 属性测试：对于嵌套路径配置，应正确提取嵌套字段
    test.prop(
      [nestedResponseArbitrary],
      { numRuns: 100 }
    )('对于嵌套路径配置，应正确提取嵌套字段', (response) => {
      const nestedConfig: ResponseFormatConfig = {
        codeField: 'result.code',
        successCode: 0,
        dataField: 'result.data',
        messageField: 'result.message'
      };

      const result = parseResponse(response as Record<string, unknown>, nestedConfig);
      expect(result.code).toBe(response.result.code);
      expect(result.data).toEqual(response.result.data);
      expect(result.message).toBe(response.result.message);
    });
  });

  describe('getValueByPath 函数测试', () => {
    // 属性测试：对于任意简单路径，应正确获取值
    test.prop(
      [fc.string(), fc.anything()],
      { numRuns: 100 }
    )('对于任意简单路径，应正确获取值', (key, value) => {
      // 过滤掉包含点号的 key，因为那会被解析为嵌套路径
      fc.pre(!key.includes('.') && key.length > 0);
      
      const obj = { [key]: value };
      const result = getValueByPath(obj, key);
      expect(result).toEqual(value);
    });

    // 属性测试：对于嵌套路径，应正确获取值
    test.prop(
      [fc.string().filter(s => !s.includes('.') && s.length > 0), 
       fc.string().filter(s => !s.includes('.') && s.length > 0), 
       fc.anything()],
      { numRuns: 100 }
    )('对于嵌套路径，应正确获取值', (key1, key2, value) => {
      const obj = { [key1]: { [key2]: value } };
      const path = `${key1}.${key2}`;
      const result = getValueByPath(obj, path);
      expect(result).toEqual(value);
    });

    // JavaScript 内置属性名列表（需要在测试中排除）
    const jsBuiltinProperties = [
      'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
      'toLocaleString', 'toString', 'valueOf', '__proto__', '__defineGetter__',
      '__defineSetter__', '__lookupGetter__', '__lookupSetter__'
    ];

    // 属性测试：对于不存在的路径，应返回 undefined
    test.prop(
      [fc.string().filter(s => 
        s.length > 0 && 
        !s.includes('.') && 
        !jsBuiltinProperties.includes(s)
      )],
      { numRuns: 100 }
    )('对于不存在的路径，应返回 undefined', (path) => {
      const obj = { other: 'value' };
      // 确保路径不是 'other'
      fc.pre(path !== 'other');
      
      const result = getValueByPath(obj, path);
      expect(result).toBeUndefined();
    });

    it('对于空对象，应返回 undefined', () => {
      expect(getValueByPath({}, 'any.path')).toBeUndefined();
    });

    it('对于空路径，应返回 undefined', () => {
      expect(getValueByPath({ key: 'value' }, '')).toBeUndefined();
    });
  });

  describe('parsePaginationData 函数测试', () => {
    // 生成分页数据的 Arbitrary
    const paginationDataArbitrary = fc.record({
      list: fc.array(fc.anything()),
      total: fc.nat(),
      page: fc.integer({ min: 1, max: 1000 }),
      pageSize: fc.integer({ min: 1, max: 100 })
    });

    // 属性测试：对于任意分页数据，应正确解析所有字段
    test.prop(
      [paginationDataArbitrary],
      { numRuns: 100 }
    )('对于任意分页数据，应正确解析所有字段', (data) => {
      const result = parsePaginationData(data as Record<string, unknown>);
      
      expect(result.list).toEqual(data.list);
      expect(result.total).toBe(data.total);
      expect(result.page).toBe(data.page);
      expect(result.pageSize).toBe(data.pageSize);
    });

    // 属性测试：对于缺失字段的数据，应返回默认值
    it('对于缺失字段的数据，应返回默认值', () => {
      const result = parsePaginationData({});
      
      expect(result.list).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
    });

    // 属性测试：对于自定义分页配置，应正确解析
    test.prop(
      [fc.array(fc.anything()), fc.nat(), fc.integer({ min: 1, max: 1000 }), fc.integer({ min: 1, max: 100 })],
      { numRuns: 100 }
    )('对于自定义分页配置，应正确解析', (items, count, currentPage, size) => {
      const customConfig: PaginationConfig = {
        listField: 'items',
        totalField: 'count',
        pageField: 'currentPage',
        pageSizeField: 'size'
      };

      const data = {
        items,
        count,
        currentPage,
        size
      };

      const result = parsePaginationData(data as Record<string, unknown>, customConfig);
      
      expect(result.list).toEqual(items);
      expect(result.total).toBe(count);
      expect(result.page).toBe(currentPage);
      expect(result.pageSize).toBe(size);
    });
  });

  describe('createResponseConfig 函数测试', () => {
    // 属性测试：创建的配置应包含所有默认值
    it('创建的配置应包含所有默认值', () => {
      const config = createResponseConfig({});
      
      expect(config.codeField).toBe(responseConfig.codeField);
      expect(config.successCode).toBe(responseConfig.successCode);
      expect(config.dataField).toBe(responseConfig.dataField);
      expect(config.messageField).toBe(responseConfig.messageField);
      expect(config.pagination).toEqual(responseConfig.pagination);
    });

    // 属性测试：自定义配置应覆盖默认值
    test.prop(
      [fc.string(), fc.oneof(fc.integer(), fc.string()), fc.string(), fc.string()],
      { numRuns: 100 }
    )('自定义配置应覆盖默认值', (codeField, successCode, dataField, messageField) => {
      const customConfig = {
        codeField,
        successCode,
        dataField,
        messageField
      };

      const config = createResponseConfig(customConfig);
      
      expect(config.codeField).toBe(codeField);
      expect(config.successCode).toBe(successCode);
      expect(config.dataField).toBe(dataField);
      expect(config.messageField).toBe(messageField);
    });

    // 属性测试：分页配置应正确合并
    it('分页配置应正确合并', () => {
      const customPagination: Partial<PaginationConfig> = {
        totalField: 'customTotal',
        listField: 'customList'
      };

      const config = createResponseConfig({ pagination: customPagination as PaginationConfig });
      
      expect(config.pagination?.totalField).toBe('customTotal');
      expect(config.pagination?.listField).toBe('customList');
      // 其他字段应保持默认值
      expect(config.pagination?.pageField).toBe(responseConfig.pagination?.pageField);
      expect(config.pagination?.pageSizeField).toBe(responseConfig.pagination?.pageSizeField);
    });
  });

  describe('默认配置验证', () => {
    it('默认配置应符合常见后端响应格式', () => {
      expect(responseConfig.codeField).toBe('code');
      expect(responseConfig.successCode).toBe(0);
      expect(responseConfig.dataField).toBe('data');
      expect(responseConfig.messageField).toBe('message');
    });

    it('默认分页配置应符合常见分页格式', () => {
      expect(responseConfig.pagination?.totalField).toBe('total');
      expect(responseConfig.pagination?.pageField).toBe('page');
      expect(responseConfig.pagination?.pageSizeField).toBe('pageSize');
      expect(responseConfig.pagination?.listField).toBe('list');
    });
  });

  describe('边界情况测试', () => {
    it('应处理 null 响应', () => {
      const result = parseResponse(null as unknown as Record<string, unknown>);
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.message).toBe('');
    });

    it('应处理 undefined 响应', () => {
      const result = parseResponse(undefined as unknown as Record<string, unknown>);
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.message).toBe('');
    });

    it('应处理空对象响应', () => {
      const result = parseResponse({});
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.message).toBe('');
      expect(result.code).toBe('');
    });
  });
});
