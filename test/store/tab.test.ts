/**
 * 默认显示页面控制属性测试
 * Property 7: 默认显示页面控制
 * 验证: 需求 8.2
 * 
 * 对于任意路由配置中设置了 isDefaultAfterLogin 为 true 的页面：
 * - 在非多标签模式下最后一个设置此属性的页面应作为登录后默认显示页
 * - 在多标签模式下所有设置此属性的页面应默认显示且不能被关闭
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { test, fc } from '@fast-check/vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTabStore } from '@/store/modules/tab';
import { useThemeStore } from '@/store/modules/theme';

// 生成随机标签页数据
const tabArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }),
  label: fc.string({ minLength: 1, maxLength: 20 }),
  routeKey: fc.string({ minLength: 1, maxLength: 30 }),
  routePath: fc.string({ minLength: 1, maxLength: 50 }),
  fullPath: fc.string({ minLength: 1, maxLength: 100 })
});

// 生成随机路由数据
const routeArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 30 }),
  path: fc.string({ minLength: 1, maxLength: 50 }),
  fullPath: fc.string({ minLength: 1, maxLength: 100 }),
  meta: fc.record({
    title: fc.string({ minLength: 1, maxLength: 20 }),
    icon: fc.option(fc.string({ minLength: 1, maxLength: 30 }), { nil: undefined }),
    localIcon: fc.option(fc.string({ minLength: 1, maxLength: 30 }), { nil: undefined })
  })
});

describe('Tab Store - 默认显示页面控制', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  /**
   * Property 7: 默认显示页面控制
   * Feature: trix-json-admin, Property 7: 默认显示页面控制
   * Validates: Requirements 8.2
   */
  describe('Property 7: 默认显示页面控制', () => {
    it('getDefaultPageAfterLogin 应返回最后一个默认页面', () => {
      const tabStore = useTabStore();

      // 添加多个默认页面（以最后一个为准）
      const routes = [
        { name: 'page1', path: '/page1', fullPath: '/page1', meta: { title: '页面1' } },
        { name: 'page2', path: '/page2', fullPath: '/page2', meta: { title: '页面2' } },
        { name: 'page3', path: '/page3', fullPath: '/page3', meta: { title: '页面3' } }
      ];

      routes.forEach(route => {
        tabStore.addDefaultTab(route as App.Global.TabRoute);
      });

      // 获取默认页面
      const defaultPage = tabStore.getDefaultPageAfterLogin();

      // 应返回最后一个
      expect(defaultPage).not.toBeNull();
      expect(defaultPage?.routePath).toBe('/page3');
    });

    it('固定标签页不能被关闭', () => {
      const tabStore = useTabStore();

      // 添加固定标签页
      const fixedRoute = { 
        name: 'fixed', 
        path: '/fixed', 
        fullPath: '/fixed', 
        meta: { title: '固定页面', fixedIndexInTab: 0 } 
      };
      tabStore.addFixedTab(fixedRoute as App.Global.TabRoute);

      // 检查是否可以关闭
      const canClose = !tabStore.isTabRetain('/fixed');
      expect(canClose).toBe(false);
    });

    it('固定标签页按 fixedIndexInTab 排序', () => {
      const tabStore = useTabStore();

      // 添加多个固定标签页（乱序）
      const routes = [
        { name: 'page2', path: '/page2', fullPath: '/page2', meta: { title: '页面2', fixedIndexInTab: 2 } },
        { name: 'page0', path: '/page0', fullPath: '/page0', meta: { title: '页面0', fixedIndexInTab: 0 } },
        { name: 'page1', path: '/page1', fullPath: '/page1', meta: { title: '页面1', fixedIndexInTab: 1 } }
      ];

      routes.forEach(route => {
        tabStore.addFixedTab(route as App.Global.TabRoute);
      });

      // 初始化固定标签页
      tabStore.initDefaultTabsAfterLogin();

      // 检查排序
      const tabs = tabStore.tabs;
      expect(tabs[0].routePath).toBe('/page0');
      expect(tabs[1].routePath).toBe('/page1');
      expect(tabs[2].routePath).toBe('/page2');
    });

    it('首页标签页永远不能被关闭', () => {
      const tabStore = useTabStore();

      // 初始化首页
      const homeRoute = { name: 'home', path: '/home', fullPath: '/home', meta: { title: '首页' } };
      tabStore.initHomeTab(homeRoute as App.Global.TabRoute);

      // 检查首页是否可以关闭
      const canClose = !tabStore.isTabRetain('/home');
      expect(canClose).toBe(false);
    });
  });

  /**
   * Property-based test: 对于任意数量的默认页面
   * Feature: trix-json-admin, Property 7: 默认显示页面控制
   * Validates: Requirements 8.2
   */
  test.prop([fc.array(routeArbitrary, { minLength: 1, maxLength: 10 })])(
    '对于任意数量的默认页面，只保留最后一个',
    (routes) => {
      setActivePinia(createPinia());
      const tabStore = useTabStore();

      // 添加所有路由作为默认页面
      routes.forEach(route => {
        tabStore.addDefaultTab(route as App.Global.TabRoute);
      });

      // 获取默认页面
      const defaultPage = tabStore.getDefaultPageAfterLogin();

      // 应只保留最后一个
      if (routes.length > 0) {
        expect(defaultPage).not.toBeNull();
        expect(defaultPage?.fullPath).toBe(routes[routes.length - 1].fullPath);
      }
    }
  );

  test.prop([fc.array(routeArbitrary, { minLength: 1, maxLength: 5 })])(
    '所有固定标签页都不能被关闭',
    (routes) => {
      setActivePinia(createPinia());
      const tabStore = useTabStore();

      // 添加所有路由作为固定标签页
      const uniqueRoutes = routes.filter((route, index, self) => 
        index === self.findIndex(r => r.fullPath === route.fullPath)
      );

      uniqueRoutes.forEach((route, index) => {
        tabStore.addFixedTab({
          ...route,
          meta: { ...route.meta, fixedIndexInTab: index }
        } as App.Global.TabRoute);
      });

      // 检查所有固定标签页是否都不能关闭
      const allRetained = uniqueRoutes.every(route => tabStore.isTabRetain(route.fullPath));
      expect(allRetained).toBe(true);
    }
  );
});
