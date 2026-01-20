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
    it('非多标签模式下，getDefaultPagesAfterLogin 应返回最后一个默认页面', () => {
      const tabStore = useTabStore();
      const themeStore = useThemeStore();

      // 设置为非多标签模式
      themeStore.settings.tab.visible = false;

      // 添加多个默认页面
      const routes = [
        { name: 'page1', path: '/page1', fullPath: '/page1', meta: { title: '页面1' } },
        { name: 'page2', path: '/page2', fullPath: '/page2', meta: { title: '页面2' } },
        { name: 'page3', path: '/page3', fullPath: '/page3', meta: { title: '页面3' } }
      ];

      routes.forEach(route => {
        tabStore.addDefaultTab(route as App.Global.TabRoute);
      });

      // 获取默认页面
      const defaultPages = tabStore.getDefaultPagesAfterLogin();

      // 非多标签模式下应只返回最后一个
      expect(defaultPages.length).toBe(1);
      expect(defaultPages[0].routePath).toBe('/page3');
    });

    it('多标签模式下，getDefaultPagesAfterLogin 应返回所有默认页面', () => {
      const tabStore = useTabStore();
      const themeStore = useThemeStore();

      // 设置为多标签模式
      themeStore.settings.tab.visible = true;

      // 添加多个默认页面
      const routes = [
        { name: 'page1', path: '/page1', fullPath: '/page1', meta: { title: '页面1' } },
        { name: 'page2', path: '/page2', fullPath: '/page2', meta: { title: '页面2' } },
        { name: 'page3', path: '/page3', fullPath: '/page3', meta: { title: '页面3' } }
      ];

      routes.forEach(route => {
        tabStore.addDefaultTab(route as App.Global.TabRoute);
      });

      // 获取默认页面
      const defaultPages = tabStore.getDefaultPagesAfterLogin();

      // 多标签模式下应返回所有默认页面
      expect(defaultPages.length).toBe(3);
    });

    it('多标签模式下，默认页面不能被关闭', () => {
      const tabStore = useTabStore();
      const themeStore = useThemeStore();

      // 设置为多标签模式
      themeStore.settings.tab.visible = true;

      // 添加默认页面
      const defaultRoute = { name: 'default', path: '/default', fullPath: '/default', meta: { title: '默认页面' } };
      tabStore.addDefaultTab(defaultRoute as App.Global.TabRoute);
      tabStore.addTab(defaultRoute as App.Global.TabRoute);

      // 检查是否可以关闭
      const canClose = !tabStore.isTabRetain('/default');
      expect(canClose).toBe(false);
    });

    it('非多标签模式下，默认页面可以被关闭', () => {
      const tabStore = useTabStore();
      const themeStore = useThemeStore();

      // 设置为非多标签模式
      themeStore.settings.tab.visible = false;

      // 添加默认页面
      const defaultRoute = { name: 'default', path: '/default', fullPath: '/default', meta: { title: '默认页面' } };
      tabStore.addDefaultTab(defaultRoute as App.Global.TabRoute);
      tabStore.addTab(defaultRoute as App.Global.TabRoute);

      // 非多标签模式下，默认页面可以被关闭（因为标签页不可见）
      const canClose = !tabStore.isTabRetain('/default');
      expect(canClose).toBe(true);
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
    '对于任意数量的默认页面，非多标签模式下只返回最后一个',
    (routes) => {
      setActivePinia(createPinia());
      const tabStore = useTabStore();
      const themeStore = useThemeStore();

      // 设置为非多标签模式
      themeStore.settings.tab.visible = false;

      // 添加所有路由作为默认页面
      routes.forEach(route => {
        tabStore.addDefaultTab(route as App.Global.TabRoute);
      });

      // 获取默认页面
      const defaultPages = tabStore.getDefaultPagesAfterLogin();

      // 非多标签模式下应只返回最后一个（或空数组如果没有默认页面）
      if (routes.length > 0) {
        expect(defaultPages.length).toBe(1);
      }
    }
  );

  test.prop([fc.array(routeArbitrary, { minLength: 1, maxLength: 10 })])(
    '对于任意数量的默认页面，多标签模式下返回所有页面',
    (routes) => {
      setActivePinia(createPinia());
      const tabStore = useTabStore();
      const themeStore = useThemeStore();

      // 设置为多标签模式
      themeStore.settings.tab.visible = true;

      // 添加所有路由作为默认页面（去重）
      const uniqueRoutes = routes.filter((route, index, self) => 
        index === self.findIndex(r => r.fullPath === route.fullPath)
      );

      uniqueRoutes.forEach(route => {
        tabStore.addDefaultTab(route as App.Global.TabRoute);
      });

      // 获取默认页面
      const defaultPages = tabStore.getDefaultPagesAfterLogin();

      // 多标签模式下应返回所有默认页面
      expect(defaultPages.length).toBe(uniqueRoutes.length);
    }
  );

  test.prop([fc.array(routeArbitrary, { minLength: 1, maxLength: 5 })])(
    '多标签模式下，所有默认页面都不能被关闭',
    (routes) => {
      setActivePinia(createPinia());
      const tabStore = useTabStore();
      const themeStore = useThemeStore();

      // 设置为多标签模式
      themeStore.settings.tab.visible = true;

      // 添加所有路由作为默认页面
      routes.forEach(route => {
        tabStore.addDefaultTab(route as App.Global.TabRoute);
        tabStore.addTab(route as App.Global.TabRoute);
      });

      // 检查所有默认页面是否都不能关闭
      const allRetained = routes.every(route => tabStore.isTabRetain(route.fullPath));
      expect(allRetained).toBe(true);
    }
  );
});
