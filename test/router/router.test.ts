/**
 * 路由系统属性测试
 *
 * **Feature: trix-json-admin, Property 3: 路由渲染模式控制**
 * **Validates: Requirements 3.6, 3.7**
 *
 * 对于任意路由配置，当 useJsonRenderer 为 true 时应使用 JsonRenderer 渲染页面，
 * 当 useJsonRenderer 为 false 或未设置时应使用传统 Vue 组件渲染。
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { test } from '@fast-check/vitest';
import * as fc from 'fast-check';
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router';
import {
  isJsonRendererRoute,
  isAuthRequired,
  getLayoutType,
  getOpenType,
  getSchemaSource,
  isDefaultAfterLogin,
  getHref,
  getRouteTitle,
  isHiddenInMenu,
  isKeepAlive,
  getPermissions,
  getDefaultAfterLoginRoutes,
  flattenRoutes,
  findRouteByPath,
  findRouteByName
} from '@/router/helper';

// 路由元数据生成器
const routeMetaArbitrary = fc.record({
  useJsonRenderer: fc.option(fc.boolean(), { nil: undefined }),
  schemaSource: fc.option(fc.string(), { nil: undefined }),
  title: fc.option(fc.string(), { nil: undefined }),
  icon: fc.option(fc.string(), { nil: undefined }),
  requiresAuth: fc.option(fc.boolean(), { nil: undefined }),
  layoutType: fc.option(fc.constantFrom('normal', 'blank') as fc.Arbitrary<'normal' | 'blank'>, { nil: undefined }),
  openType: fc.option(fc.constantFrom('normal', 'iframe', 'newWindow') as fc.Arbitrary<'normal' | 'iframe' | 'newWindow'>, { nil: undefined }),
  href: fc.option(fc.webUrl(), { nil: undefined }),
  isDefaultAfterLogin: fc.option(fc.boolean(), { nil: undefined }),
  hideInMenu: fc.option(fc.boolean(), { nil: undefined }),
  keepAlive: fc.option(fc.boolean(), { nil: undefined }),
  permissions: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 20 }), { maxLength: 5 }), { nil: undefined })
});

// 简单路由配置生成器
const simpleRouteArbitrary = fc.record({
  path: fc.stringMatching(/^\/[a-z-]*$/),
  name: fc.stringMatching(/^[a-z-]+$/),
  meta: routeMetaArbitrary
}).map(({ path, name, meta }) => ({
  path,
  name,
  component: { template: '<div>Test</div>' },
  meta
} as RouteRecordRaw));

// 创建模拟的 RouteLocationNormalized
function createMockRouteLocation(route: RouteRecordRaw): RouteLocationNormalized {
  return {
    path: route.path,
    name: route.name,
    meta: route.meta || {},
    params: {},
    query: {},
    hash: '',
    fullPath: route.path,
    matched: [],
    redirectedFrom: undefined
  } as RouteLocationNormalized;
}

describe('路由系统 - 路由渲染模式控制', () => {
  /**
   * Property 3: 路由渲染模式控制
   *
   * *对于任意* 路由配置，当 useJsonRenderer 为 true 时应使用 JsonRenderer 渲染页面，
   * 当 useJsonRenderer 为 false 或未设置时应使用传统 Vue 组件渲染。
   *
   * **Validates: Requirements 3.6, 3.7**
   */
  describe('Property 3: 路由渲染模式控制', () => {
    // 属性测试：当 useJsonRenderer 为 true 时，isJsonRendererRoute 应返回 true
    test.prop(
      [simpleRouteArbitrary],
      { numRuns: 100 }
    )('当 useJsonRenderer 为 true 时，isJsonRendererRoute 应返回 true', (route) => {
      // 设置 useJsonRenderer 为 true
      const routeWithJsonRenderer: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, useJsonRenderer: true }
      };

      expect(isJsonRendererRoute(routeWithJsonRenderer)).toBe(true);
      expect(isJsonRendererRoute(createMockRouteLocation(routeWithJsonRenderer))).toBe(true);
    });

    // 属性测试：当 useJsonRenderer 为 false 时，isJsonRendererRoute 应返回 false
    test.prop(
      [simpleRouteArbitrary],
      { numRuns: 100 }
    )('当 useJsonRenderer 为 false 时，isJsonRendererRoute 应返回 false', (route) => {
      // 设置 useJsonRenderer 为 false
      const routeWithoutJsonRenderer: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, useJsonRenderer: false }
      };

      expect(isJsonRendererRoute(routeWithoutJsonRenderer)).toBe(false);
      expect(isJsonRendererRoute(createMockRouteLocation(routeWithoutJsonRenderer))).toBe(false);
    });

    // 属性测试：当 useJsonRenderer 未设置时，isJsonRendererRoute 应返回 false
    test.prop(
      [simpleRouteArbitrary],
      { numRuns: 100 }
    )('当 useJsonRenderer 未设置时，isJsonRendererRoute 应返回 false', (route) => {
      // 移除 useJsonRenderer
      const routeWithoutMeta: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, useJsonRenderer: undefined }
      };

      expect(isJsonRendererRoute(routeWithoutMeta)).toBe(false);
      expect(isJsonRendererRoute(createMockRouteLocation(routeWithoutMeta))).toBe(false);
    });

    // 属性测试：isJsonRendererRoute 的结果应与 meta.useJsonRenderer === true 一致
    test.prop(
      [simpleRouteArbitrary],
      { numRuns: 100 }
    )('isJsonRendererRoute 的结果应与 meta.useJsonRenderer === true 一致', (route) => {
      const expected = route.meta?.useJsonRenderer === true;
      expect(isJsonRendererRoute(route)).toBe(expected);
      expect(isJsonRendererRoute(createMockRouteLocation(route))).toBe(expected);
    });
  });

  describe('路由认证控制', () => {
    // 属性测试：当 requiresAuth 为 false 时，isAuthRequired 应返回 false
    test.prop(
      [simpleRouteArbitrary],
      { numRuns: 100 }
    )('当 requiresAuth 为 false 时，isAuthRequired 应返回 false', (route) => {
      const routeWithoutAuth: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, requiresAuth: false }
      };

      expect(isAuthRequired(routeWithoutAuth)).toBe(false);
    });

    // 属性测试：当 requiresAuth 未设置时，isAuthRequired 应返回 true（默认需要认证）
    test.prop(
      [simpleRouteArbitrary],
      { numRuns: 100 }
    )('当 requiresAuth 未设置时，isAuthRequired 应返回 true（默认需要认证）', (route) => {
      const routeWithoutAuthMeta: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, requiresAuth: undefined }
      };

      expect(isAuthRequired(routeWithoutAuthMeta)).toBe(true);
    });
  });

  describe('布局类型控制', () => {
    // 属性测试：当 layoutType 为 'blank' 时，getLayoutType 应返回 'blank'
    test.prop(
      [simpleRouteArbitrary],
      { numRuns: 100 }
    )('当 layoutType 为 blank 时，getLayoutType 应返回 blank', (route) => {
      const routeWithBlankLayout: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, layoutType: 'blank' }
      };

      expect(getLayoutType(routeWithBlankLayout)).toBe('blank');
    });

    // 属性测试：当 layoutType 未设置时，getLayoutType 应返回 'normal'（默认值）
    test.prop(
      [simpleRouteArbitrary],
      { numRuns: 100 }
    )('当 layoutType 未设置时，getLayoutType 应返回 normal（默认值）', (route) => {
      const routeWithoutLayoutType: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, layoutType: undefined }
      };

      expect(getLayoutType(routeWithoutLayoutType)).toBe('normal');
    });
  });

  describe('打开类型控制', () => {
    // 属性测试：当 openType 为 'newWindow' 时，getOpenType 应返回 'newWindow'
    test.prop(
      [simpleRouteArbitrary],
      { numRuns: 100 }
    )('当 openType 为 newWindow 时，getOpenType 应返回 newWindow', (route) => {
      const routeWithNewWindow: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, openType: 'newWindow' }
      };

      expect(getOpenType(routeWithNewWindow)).toBe('newWindow');
    });

    // 属性测试：当 openType 未设置时，getOpenType 应返回 'normal'（默认值）
    test.prop(
      [simpleRouteArbitrary],
      { numRuns: 100 }
    )('当 openType 未设置时，getOpenType 应返回 normal（默认值）', (route) => {
      const routeWithoutOpenType: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, openType: undefined }
      };

      expect(getOpenType(routeWithoutOpenType)).toBe('normal');
    });
  });

  describe('Schema 来源获取', () => {
    // 属性测试：getSchemaSource 应返回配置的 schemaSource 值
    test.prop(
      [simpleRouteArbitrary, fc.string({ minLength: 1 })],
      { numRuns: 100 }
    )('getSchemaSource 应返回配置的 schemaSource 值', (route, schemaSource) => {
      const routeWithSchema: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, schemaSource }
      };

      expect(getSchemaSource(routeWithSchema)).toBe(schemaSource);
    });
  });

  describe('默认登录后页面', () => {
    // 属性测试：当 isDefaultAfterLogin 为 true 时，isDefaultAfterLogin 函数应返回 true
    test.prop(
      [simpleRouteArbitrary],
      { numRuns: 100 }
    )('当 isDefaultAfterLogin 为 true 时，函数应返回 true', (route) => {
      const routeAsDefault: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, isDefaultAfterLogin: true }
      };

      expect(isDefaultAfterLogin(routeAsDefault)).toBe(true);
    });

    // 属性测试：getDefaultAfterLoginRoutes 应返回所有 isDefaultAfterLogin 为 true 的路由
    it('getDefaultAfterLoginRoutes 应返回所有 isDefaultAfterLogin 为 true 的路由', () => {
      const routes: RouteRecordRaw[] = [
        { path: '/a', name: 'a', component: { template: '' }, meta: { isDefaultAfterLogin: true } },
        { path: '/b', name: 'b', component: { template: '' }, meta: { isDefaultAfterLogin: false } },
        { path: '/c', name: 'c', component: { template: '' }, meta: { isDefaultAfterLogin: true } },
        { path: '/d', name: 'd', component: { template: '' }, meta: {} }
      ];

      const defaultRoutes = getDefaultAfterLoginRoutes(routes);
      expect(defaultRoutes).toHaveLength(2);
      expect(defaultRoutes.map(r => r.name)).toContain('a');
      expect(defaultRoutes.map(r => r.name)).toContain('c');
    });
  });

  describe('路由辅助函数', () => {
    // 属性测试：flattenRoutes 应返回所有路由（包括嵌套路由）
    it('flattenRoutes 应返回所有路由（包括嵌套路由）', () => {
      const routes: RouteRecordRaw[] = [
        {
          path: '/parent',
          name: 'parent',
          component: { template: '' },
          children: [
            { path: 'child1', name: 'child1', component: { template: '' } },
            { path: 'child2', name: 'child2', component: { template: '' } }
          ]
        },
        { path: '/other', name: 'other', component: { template: '' } }
      ];

      const flatRoutes = flattenRoutes(routes);
      expect(flatRoutes).toHaveLength(4);
      expect(flatRoutes.map(r => r.name)).toContain('parent');
      expect(flatRoutes.map(r => r.name)).toContain('child1');
      expect(flatRoutes.map(r => r.name)).toContain('child2');
      expect(flatRoutes.map(r => r.name)).toContain('other');
    });

    // 属性测试：findRouteByPath 应返回匹配路径的路由
    test.prop(
      [fc.array(simpleRouteArbitrary, { minLength: 1, maxLength: 10 })],
      { numRuns: 100 }
    )('findRouteByPath 应返回匹配路径的路由', (routes) => {
      const targetRoute = routes[0];
      const found = findRouteByPath(routes, targetRoute.path);
      expect(found?.path).toBe(targetRoute.path);
    });

    // 属性测试：findRouteByName 应返回匹配名称的路由
    test.prop(
      [fc.array(simpleRouteArbitrary, { minLength: 1, maxLength: 10 })],
      { numRuns: 100 }
    )('findRouteByName 应返回匹配名称的路由', (routes) => {
      const targetRoute = routes[0];
      if (targetRoute.name) {
        const found = findRouteByName(routes, targetRoute.name as string);
        expect(found?.name).toBe(targetRoute.name);
      }
    });
  });

  describe('其他路由元数据', () => {
    // 属性测试：getRouteTitle 应返回配置的标题
    test.prop(
      [simpleRouteArbitrary, fc.string({ minLength: 1 })],
      { numRuns: 100 }
    )('getRouteTitle 应返回配置的标题', (route, title) => {
      const routeWithTitle: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, title }
      };

      expect(getRouteTitle(routeWithTitle)).toBe(title);
    });

    // 属性测试：isHiddenInMenu 应正确返回隐藏状态
    test.prop(
      [simpleRouteArbitrary],
      { numRuns: 100 }
    )('isHiddenInMenu 应正确返回隐藏状态', (route) => {
      const routeHidden: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, hideInMenu: true }
      };

      expect(isHiddenInMenu(routeHidden)).toBe(true);

      const routeVisible: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, hideInMenu: false }
      };

      expect(isHiddenInMenu(routeVisible)).toBe(false);
    });

    // 属性测试：isKeepAlive 应正确返回缓存状态
    test.prop(
      [simpleRouteArbitrary],
      { numRuns: 100 }
    )('isKeepAlive 应正确返回缓存状态', (route) => {
      const routeCached: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, keepAlive: true }
      };

      expect(isKeepAlive(routeCached)).toBe(true);

      const routeNotCached: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, keepAlive: false }
      };

      expect(isKeepAlive(routeNotCached)).toBe(false);
    });

    // 属性测试：getPermissions 应返回配置的权限列表
    test.prop(
      [simpleRouteArbitrary, fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 })],
      { numRuns: 100 }
    )('getPermissions 应返回配置的权限列表', (route, permissions) => {
      const routeWithPermissions: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, permissions }
      };

      expect(getPermissions(routeWithPermissions)).toEqual(permissions);
    });

    // 属性测试：getHref 应返回配置的外部链接
    test.prop(
      [simpleRouteArbitrary, fc.webUrl()],
      { numRuns: 100 }
    )('getHref 应返回配置的外部链接', (route, href) => {
      const routeWithHref: RouteRecordRaw = {
        ...route,
        meta: { ...route.meta, href }
      };

      expect(getHref(routeWithHref)).toBe(href);
    });
  });
});
