/**
 * JSON 渲染器插件属性测试
 *
 * **Feature: trix-json-admin, Property 1: 组件注册完整性**
 * **Validates: Requirements 2.2, 2.3, 4.1**
 *
 * 对于任意 NaiveUI 组件名或 soybean-admin 自定义组件名，
 * 当该组件名在组件注册表中查询时，应该返回对应的 Vue 组件实例。
 */

import { describe, it, expect } from 'vitest';
import { test } from '@fast-check/vitest';
import * as fc from 'fast-check';
import {
  naiveUIComponentNames,
  customComponents,
  getNaiveUIComponents,
  getAllComponents,
  isComponentRegistered,
  getRegisteredComponentNames
} from '@/plugins/json-renderer';

describe('JSON 渲染器插件 - 组件注册', () => {
  /**
   * Property 1: 组件注册完整性
   *
   * *对于任意* NaiveUI 组件名或自定义组件名，
   * 当该组件名在组件注册表中查询时，应该返回对应的 Vue 组件实例。
   *
   * **Validates: Requirements 2.2, 2.3, 4.1**
   */
  describe('Property 1: 组件注册完整性', () => {
    // 属性测试：对于任意 NaiveUI 组件名，应该能在注册表中找到
    test.prop(
      [fc.constantFrom(...naiveUIComponentNames)],
      { numRuns: 100 }
    )('对于任意 NaiveUI 组件名，应该能在注册表中找到', (componentName) => {
      const components = getNaiveUIComponents();
      expect(components[componentName]).toBeDefined();
      expect(typeof components[componentName]).toBe('object');
    });

    // 属性测试：对于任意自定义组件名，应该能在注册表中找到
    test.prop(
      [fc.constantFrom(...Object.keys(customComponents))],
      { numRuns: 100 }
    )('对于任意自定义组件名，应该能在注册表中找到', (componentName) => {
      expect(customComponents[componentName]).toBeDefined();
      expect(typeof customComponents[componentName]).toBe('object');
    });

    // 属性测试：对于任意已注册组件名，isComponentRegistered 应返回 true
    test.prop(
      [fc.constantFrom(...getRegisteredComponentNames())],
      { numRuns: 100 }
    )('对于任意已注册组件名，isComponentRegistered 应返回 true', (componentName) => {
      expect(isComponentRegistered(componentName)).toBe(true);
    });

    // 属性测试：getAllComponents 应包含所有 NaiveUI 和自定义组件
    it('getAllComponents 应包含所有 NaiveUI 和自定义组件', () => {
      const allComponents = getAllComponents();

      // 验证所有 NaiveUI 组件都被包含
      for (const name of naiveUIComponentNames) {
        expect(allComponents[name]).toBeDefined();
      }

      // 验证所有自定义组件都被包含
      for (const name of Object.keys(customComponents)) {
        expect(allComponents[name]).toBeDefined();
      }
    });

    // 属性测试：对于任意未注册的组件名，isComponentRegistered 应返回 false
    test.prop(
      [fc.string().filter(s => !getRegisteredComponentNames().includes(s) && s.length > 0)],
      { numRuns: 100 }
    )('对于任意未注册的组件名，isComponentRegistered 应返回 false', (componentName) => {
      expect(isComponentRegistered(componentName)).toBe(false);
    });
  });

  describe('NaiveUI 组件注册验证', () => {
    it('应注册所有常用 NaiveUI 组件', () => {
      const components = getNaiveUIComponents();
      const registeredCount = Object.keys(components).length;

      // 验证注册了足够数量的组件
      expect(registeredCount).toBeGreaterThan(50);

      // 验证关键组件存在
      const criticalComponents = [
        'NButton',
        'NInput',
        'NForm',
        'NFormItem',
        'NTable',
        'NDataTable',
        'NCard',
        'NModal',
        'NSelect',
        'NSpace'
      ];

      for (const name of criticalComponents) {
        expect(components[name]).toBeDefined();
      }
    });
  });

  describe('自定义组件注册验证', () => {
    it('应注册所有 soybean-admin 自定义组件', () => {
      const expectedComponents = [
        'SvgIcon',
        'ButtonIcon',
        'CountTo',
        'BetterScroll',
        'DarkModeContainer',
        'ExceptionBase',
        'FullScreen',
        'IconTooltip',
        'LangSwitch',
        'MenuToggler',
        'PinToggler',
        'ReloadButton',
        'SystemLogo',
        'ThemeSchemaSwitch',
        'TableColumnSetting'
      ];

      for (const name of expectedComponents) {
        expect(customComponents[name]).toBeDefined();
      }
    });
  });

  describe('组件注册表完整性', () => {
    it('getRegisteredComponentNames 应返回所有组件名', () => {
      const names = getRegisteredComponentNames();

      // 验证包含 NaiveUI 组件
      for (const name of naiveUIComponentNames) {
        expect(names).toContain(name);
      }

      // 验证包含自定义组件
      for (const name of Object.keys(customComponents)) {
        expect(names).toContain(name);
      }
    });
  });
});
