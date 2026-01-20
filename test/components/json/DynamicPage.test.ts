/**
 * 动态页面组件属性测试
 *
 * **Feature: trix-json-admin, Property 4: Schema 加载状态管理**
 * **Validates: Requirements 3.3, 3.4**
 *
 * 对于任意动态页面加载过程，系统应该在加载期间显示 loading 状态，
 * 加载成功后显示内容，加载失败后显示错误状态并提供重试选项。
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { test } from '@fast-check/vitest';
import * as fc from 'fast-check';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { defineComponent, h } from 'vue';

import DynamicPage from '@/components/json/DynamicPage.vue';

// Mock fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

// 创建测试路由
function createTestRouter(schemaSource?: string) {
  return createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'test',
        component: { template: '<div>Test</div>' },
        meta: {
          schemaSource
        }
      }
    ]
  });
}

// 有效的 JsonNode 生成器
const validJsonNodeArbitrary = fc.record({
  com: fc.constantFrom('NCard', 'NButton', 'NSpace', 'div', 'span'),
  props: fc.option(
    fc.record({
      class: fc.option(fc.string()),
      style: fc.option(fc.string())
    }),
    { nil: undefined }
  ),
  children: fc.option(fc.string(), { nil: undefined })
});

// Schema 来源生成器
const schemaSourceArbitrary = fc.oneof(
  // 本地 JSON 文件路径
  fc.stringMatching(/^\/mock\/schema\/[a-z-]+\.json$/),
  // API 路径
  fc.stringMatching(/^\/api\/schema\/[a-z-]+$/)
);

// HTTP 状态码生成器（错误状态）
const errorStatusArbitrary = fc.constantFrom(400, 401, 403, 404, 500, 502, 503);

// VSchema mock 组件
const VSchemaStub = defineComponent({
  name: 'VSchema',
  props: ['schema'],
  template: '<div class="json-renderer">Rendered Content</div>'
});

// 通用的 stubs 配置
const createStubs = () => ({
  // 使用全局组件名注册 VSchema stub
  VSchema: VSchemaStub,
  NSpin: {
    name: 'NSpin',
    props: ['size'],
    template: '<div class="n-spin"><slot name="description"></slot></div>'
  },
  NResult: {
    name: 'NResult',
    props: ['status', 'title', 'description'],
    template: '<div class="n-result"><slot name="footer"></slot></div>'
  },
  NButton: {
    name: 'NButton',
    props: ['type', 'block', 'loading'],
    emits: ['click'],
    template: '<button class="n-button" @click="$emit(\'click\')"><slot></slot></button>'
  },
  NSpace: {
    name: 'NSpace',
    props: ['justify', 'vertical', 'size'],
    template: '<div class="n-space"><slot></slot></div>'
  }
});

describe('动态页面组件 - Schema 加载状态管理', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Property 4: Schema 加载状态管理
   */
  describe('Property 4: Schema 加载状态管理', () => {
    // 属性测试：对于任意有效的 schema 来源，加载期间应显示 loading 状态
    test.prop(
      [schemaSourceArbitrary],
      { numRuns: 50 }
    )('对于任意有效的 schema 来源，加载期间应显示 loading 状态', async (schemaSource) => {
      // 设置一个永不 resolve 的 Promise 来模拟加载中状态
      let resolvePromise: (value: Response) => void;
      const pendingPromise = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });
      mockFetch.mockReturnValue(pendingPromise);

      const router = createTestRouter(schemaSource);
      await router.push('/');

      const wrapper = mount(DynamicPage, {
        global: {
          plugins: [router, createPinia()],
          stubs: createStubs()
        }
      });

      // 验证 loading 状态
      expect(wrapper.find('.loading-container').exists()).toBe(true);
      expect(wrapper.find('.n-spin').exists()).toBe(true);

      // 清理
      resolvePromise!(new Response(JSON.stringify({ com: 'div' }), { status: 200 }));
      wrapper.unmount();
    });

    // 属性测试：对于任意错误状态码，加载失败后应显示错误状态
    test.prop(
      [errorStatusArbitrary, schemaSourceArbitrary],
      { numRuns: 50 }
    )('对于任意错误状态码，加载失败后应显示错误状态', async (statusCode, schemaSource) => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: statusCode,
        statusText: 'Error'
      });

      const router = createTestRouter(schemaSource);
      await router.push('/');

      const wrapper = mount(DynamicPage, {
        global: {
          plugins: [router, createPinia()],
          stubs: createStubs()
        }
      });

      await flushPromises();

      // 验证错误状态显示
      expect(wrapper.find('.error-container').exists()).toBe(true);
      expect(wrapper.find('.n-result').exists()).toBe(true);
      expect(wrapper.find('.n-button').exists()).toBe(true);

      wrapper.unmount();
    });

    // 属性测试：对于任意网络错误，应显示错误状态并提供重试选项
    test.prop(
      [fc.string({ minLength: 1, maxLength: 100 }), schemaSourceArbitrary],
      { numRuns: 50 }
    )('对于任意网络错误，应显示错误状态并提供重试选项', async (errorMessage, schemaSource) => {
      mockFetch.mockRejectedValue(new Error(errorMessage));

      const router = createTestRouter(schemaSource);
      await router.push('/');

      const wrapper = mount(DynamicPage, {
        global: {
          plugins: [router, createPinia()],
          stubs: createStubs()
        }
      });

      await flushPromises();

      // 验证错误状态显示
      expect(wrapper.find('.error-container').exists()).toBe(true);
      expect(wrapper.find('.n-button').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('加载状态转换', () => {
    it('应正确处理从 loading 到 success 的状态转换', async () => {
      const schema = { com: 'NCard', children: 'Test Content' };

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(schema)
      });

      const router = createTestRouter('/mock/schema/test.json');
      await router.push('/');

      const wrapper = mount(DynamicPage, {
        global: {
          plugins: [router, createPinia()],
          stubs: createStubs()
        }
      });

      // 等待加载完成
      await flushPromises();

      // 验证最终状态
      expect(wrapper.find('.loading-container').exists()).toBe(false);
      expect(wrapper.find('.error-container').exists()).toBe(false);
      // VSchema 被渲染（通过 stub）
      expect(wrapper.find('.json-renderer').exists()).toBe(true);

      wrapper.unmount();
    });

    it('应正确处理从 loading 到 error 的状态转换', async () => {
      mockFetch.mockRejectedValue(new Error('Network Error'));

      const router = createTestRouter('/api/schema/test');
      await router.push('/');

      const wrapper = mount(DynamicPage, {
        global: {
          plugins: [router, createPinia()],
          stubs: createStubs()
        }
      });

      // 等待加载完成
      await flushPromises();

      // 验证最终状态
      expect(wrapper.find('.loading-container').exists()).toBe(false);
      expect(wrapper.find('.error-container').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('重试功能', () => {
    it('点击重试按钮应重新加载 schema', async () => {
      // 第一次失败
      mockFetch.mockRejectedValueOnce(new Error('Network Error'));

      const router = createTestRouter('/api/schema/test');
      await router.push('/');

      const wrapper = mount(DynamicPage, {
        global: {
          plugins: [router, createPinia()],
          stubs: createStubs()
        }
      });

      await flushPromises();

      // 验证错误状态
      expect(wrapper.find('.error-container').exists()).toBe(true);

      // 设置第二次成功
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ com: 'div' })
      });

      // 点击重试按钮
      const buttons = wrapper.findAll('.n-button');
      // 找到包含"重试"文本的按钮
      for (const btn of buttons) {
        if (btn.text().includes('重试')) {
          await btn.trigger('click');
          break;
        }
      }
      await flushPromises();

      // 验证成功状态 - 错误容器应该消失
      expect(wrapper.find('.error-container').exists()).toBe(false);

      wrapper.unmount();
    });
  });

  describe('无 schema 来源配置', () => {
    it('当未配置 schema 来源时应显示错误', async () => {
      const router = createTestRouter(undefined);
      await router.push('/');

      const wrapper = mount(DynamicPage, {
        global: {
          plugins: [router, createPinia()],
          stubs: createStubs()
        }
      });

      await flushPromises();

      // 验证错误状态
      expect(wrapper.find('.error-container').exists()).toBe(true);

      wrapper.unmount();
    });
  });

  describe('直接传入 schema', () => {
    it('当直接传入 schema 时应直接渲染，不发起请求', async () => {
      const schema = { com: 'div', children: 'Direct Schema' };

      const router = createTestRouter('/mock/schema/test.json');
      await router.push('/');

      const wrapper = mount(DynamicPage, {
        props: { schema },
        global: {
          plugins: [router, createPinia()],
          stubs: createStubs()
        }
      });

      await flushPromises();

      // 不应该发起请求
      expect(mockFetch).not.toHaveBeenCalled();
      // 应该直接渲染
      expect(wrapper.find('.json-renderer').exists()).toBe(true);

      wrapper.unmount();
    });
  });
});
