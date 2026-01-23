/**
 * VSchema 渲染器集成测试
 *
 * 验证 VSchema 组件可用，NaiveUI 组件可以通过 JSON 渲染
 *
 * **Feature: trix-json-admin, 检查点 5**
 * **验证: 需求 2.1, 2.2, 2.3, 2.4**
 */

import { describe, it, expect } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createApp, defineComponent, h, nextTick } from 'vue';
import { createVSchemaPlugin } from 'vschema-ui';
import type { JsonNode } from 'vschema-ui';
import { getAllComponents, getNaiveUIComponents, customComponents } from '@/plugins/json-renderer';

// 创建测试插件实例
function createTestPlugin() {
  return createVSchemaPlugin({
    components: getAllComponents()
  });
}

describe('VSchema 渲染器集成测试', () => {
  describe('VSchema 组件可用性', () => {
    it('createVSchemaPlugin 应该返回有效的 Vue 插件', () => {
      const plugin = createTestPlugin();

      expect(plugin).toBeDefined();
      expect(typeof plugin.install).toBe('function');
    });

    it('VSchema 组件应该被正确注册到 Vue 应用', () => {
      const app = createApp(
        defineComponent({
          render: () => h('div')
        })
      );

      const plugin = createTestPlugin();
      app.use(plugin);

      // 检查组件是否已注册到应用实例
      expect(app._context.components.VSchema).toBeDefined();
    });

    it('VSchema 组件应该能够接收 schema prop', async () => {
      const schema: JsonNode = {
        com: 'div',
        children: '测试内容'
      };

      const wrapper = mount(
        defineComponent({
          template: '<VSchema :schema="schema" />',
          setup() {
            return { schema };
          }
        }),
        {
          global: {
            plugins: [createTestPlugin()]
          }
        }
      );

      await nextTick();
      await flushPromises();

      // 验证 schema 渲染成功
      expect(wrapper.html()).toContain('测试内容');
    });
  });

  describe('NaiveUI 组件通过 JSON 渲染', () => {
    it('应该能够渲染简单的 NButton 组件', async () => {
      const schema: JsonNode = {
        com: 'NButton',
        props: {
          type: 'primary'
        },
        children: '测试按钮'
      };

      const wrapper = mount(
        defineComponent({
          template: '<VSchema :schema="schema" />',
          setup() {
            return { schema };
          }
        }),
        {
          global: {
            plugins: [createTestPlugin()]
          }
        }
      );

      await nextTick();
      await flushPromises();

      expect(wrapper.html()).toContain('测试按钮');
    });

    it('应该能够渲染 NSpace 布局组件', async () => {
      const schema: JsonNode = {
        com: 'NSpace',
        props: {
          vertical: true
        },
        children: [
          {
            com: 'span',
            children: '文本1'
          },
          {
            com: 'span',
            children: '文本2'
          }
        ]
      };

      const wrapper = mount(
        defineComponent({
          template: '<VSchema :schema="schema" />',
          setup() {
            return { schema };
          }
        }),
        {
          global: {
            plugins: [createTestPlugin()]
          }
        }
      );

      await nextTick();
      await flushPromises();

      expect(wrapper.html()).toContain('文本1');
      expect(wrapper.html()).toContain('文本2');
    });

    it('应该能够渲染带数据绑定的组件', async () => {
      const schema: JsonNode = {
        data: {
          message: 'Hello VSchema'
        },
        com: 'span',
        children: '{{ message }}'
      };

      const wrapper = mount(
        defineComponent({
          template: '<VSchema :schema="schema" />',
          setup() {
            return { schema };
          }
        }),
        {
          global: {
            plugins: [createTestPlugin()]
          }
        }
      );

      await nextTick();
      await flushPromises();

      expect(wrapper.html()).toContain('Hello VSchema');
    });

    it('应该能够渲染 NCard 组件', async () => {
      const schema: JsonNode = {
        com: 'NCard',
        props: {
          title: '测试卡片'
        },
        children: [
          {
            com: 'span',
            children: '卡片内容'
          }
        ]
      };

      const wrapper = mount(
        defineComponent({
          template: '<VSchema :schema="schema" />',
          setup() {
            return { schema };
          }
        }),
        {
          global: {
            plugins: [createTestPlugin()]
          }
        }
      );

      await nextTick();
      await flushPromises();

      expect(wrapper.html()).toContain('测试卡片');
      expect(wrapper.html()).toContain('卡片内容');
    });
  });

  describe('组件注册完整性验证', () => {
    it('NaiveUI 组件应该全部可用', () => {
      const naiveComponents = getNaiveUIComponents();
      const componentCount = Object.keys(naiveComponents).length;

      // Sanity check: ensure we register a reasonable amount of components.
      expect(componentCount).toBeGreaterThan(50);

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
        'NSpace',
        'NAlert',
        'NTag'
      ];

      for (const name of criticalComponents) {
        expect(naiveComponents[name]).toBeDefined();
      }
    });

    it('自定义组件应该全部可用', () => {
      const expectedComponents = [
        'SvgIcon',
        'ButtonIcon',
        'CountTo',
        'BetterScroll',
        'DarkModeContainer',
        'ExceptionBase',
        'FullScreen',
        'LangSwitch',
        'MenuToggler',
        'ReloadButton',
        'SystemLogo',
        'ThemeSchemaSwitch'
      ];

      for (const name of expectedComponents) {
        expect(customComponents[name]).toBeDefined();
      }
    });

    it('getAllComponents 应该包含所有组件', () => {
      const allComponents = getAllComponents();
      const naiveComponents = getNaiveUIComponents();

      for (const name of Object.keys(naiveComponents)) {
        expect(allComponents[name]).toBeDefined();
      }

      for (const name of Object.keys(customComponents)) {
        expect(allComponents[name]).toBeDefined();
      }
    });
  });
});
