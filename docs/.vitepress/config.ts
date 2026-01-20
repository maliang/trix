import { defineConfig } from 'vitepress'

// 中文侧边栏配置
const zhSidebar = {
  '/guide/': [
    {
      text: '开始',
      items: [
        { text: '简介', link: '/guide/' },
        { text: '快速开始', link: '/guide/getting-started' },
        { text: '项目结构', link: '/guide/project-structure' }
      ]
    },
    {
      text: '核心概念',
      items: [
        { text: 'JSON 驱动', link: '/guide/json-driven' },
        { text: '路由系统', link: '/guide/routing' },
        { text: '状态管理', link: '/guide/state-management' },
        { text: '主题配置', link: '/guide/theming' },
        { text: '国际化', link: '/guide/i18n' }
      ]
    },
    {
      text: '进阶',
      items: [
        { text: '权限控制', link: '/guide/permission' },
        { text: '布局模式', link: '/guide/layout' },
        { text: '请求配置', link: '/guide/request' },
        { text: '部署', link: '/guide/deployment' }
      ]
    }
  ],
  '/schema/': [
    {
      text: 'JSON Schema 基础',
      items: [
        { text: '概述', link: '/schema/' },
        { text: '基本结构', link: '/schema/basic-structure' },
        { text: '数据绑定', link: '/schema/data-binding' },
        { text: '事件处理', link: '/schema/events' },
        { text: '条件渲染', link: '/schema/conditional' }
      ]
    },
    {
      text: '高级特性',
      items: [
        { text: '循环渲染', link: '/schema/loop' },
        { text: '插槽', link: '/schema/slots' },
        { text: '方法定义', link: '/schema/methods' },
        { text: '生命周期', link: '/schema/lifecycle' },
        { text: 'API 请求', link: '/schema/api-request' }
      ]
    },
    {
      text: '示例',
      items: [
        { text: '登录页面', link: '/schema/examples/login' },
        { text: '仪表盘', link: '/schema/examples/dashboard' },
        { text: 'CRUD 列表', link: '/schema/examples/crud' }
      ]
    }
  ],
  '/components/': [
    {
      text: '组件总览',
      items: [
        { text: '概述', link: '/components/' },
        { text: 'NaiveUI 组件', link: '/components/naive-ui' }
      ]
    },
    {
      text: '自定义组件',
      items: [
        { text: 'SvgIcon', link: '/components/svg-icon' },
        { text: 'ButtonIcon', link: '/components/button-icon' },
        { text: 'VueECharts', link: '/components/vue-echarts' },
        { text: 'IconPicker', link: '/components/icon-picker' },
        { text: 'FlowEditor', link: '/components/flow-editor' },
        { text: 'MarkdownEditor', link: '/components/markdown-editor' },
        { text: 'RichEditor', link: '/components/rich-editor' }
      ]
    }
  ],
  '/config/': [
    {
      text: '配置',
      items: [
        { text: '概述', link: '/config/' },
        { text: '环境变量', link: '/config/env' },
        { text: '主题配置', link: '/config/theme' },
        { text: '请求配置', link: '/config/request' },
        { text: 'JSON 渲染器配置', link: '/config/json-renderer' }
      ]
    }
  ],
  '/api/': [
    {
      text: 'API 参考',
      items: [
        { text: '概述', link: '/api/' },
        { text: 'Store', link: '/api/store' },
        { text: 'Hooks', link: '/api/hooks' },
        { text: '工具函数', link: '/api/utils' }
      ]
    }
  ]
}

// 英文侧边栏配置
const enSidebar = {
  '/en/guide/': [
    {
      text: 'Getting Started',
      items: [
        { text: 'Introduction', link: '/en/guide/' },
        { text: 'Quick Start', link: '/en/guide/getting-started' },
        { text: 'Project Structure', link: '/en/guide/project-structure' }
      ]
    },
    {
      text: 'Core Concepts',
      items: [
        { text: 'JSON Driven', link: '/en/guide/json-driven' },
        { text: 'Routing', link: '/en/guide/routing' },
        { text: 'State Management', link: '/en/guide/state-management' },
        { text: 'Theming', link: '/en/guide/theming' },
        { text: 'Internationalization', link: '/en/guide/i18n' }
      ]
    },
    {
      text: 'Advanced',
      items: [
        { text: 'Permission Control', link: '/en/guide/permission' },
        { text: 'Layout Modes', link: '/en/guide/layout' },
        { text: 'Request Configuration', link: '/en/guide/request' },
        { text: 'Deployment', link: '/en/guide/deployment' }
      ]
    }
  ],
  '/en/schema/': [
    {
      text: 'JSON Schema Basics',
      items: [
        { text: 'Overview', link: '/en/schema/' },
        { text: 'Basic Structure', link: '/en/schema/basic-structure' },
        { text: 'Data Binding', link: '/en/schema/data-binding' },
        { text: 'Event Handling', link: '/en/schema/events' },
        { text: 'Conditional Rendering', link: '/en/schema/conditional' }
      ]
    },
    {
      text: 'Advanced Features',
      items: [
        { text: 'Loop Rendering', link: '/en/schema/loop' },
        { text: 'Slots', link: '/en/schema/slots' },
        { text: 'Methods', link: '/en/schema/methods' },
        { text: 'Lifecycle', link: '/en/schema/lifecycle' },
        { text: 'API Requests', link: '/en/schema/api-request' }
      ]
    },
    {
      text: 'Examples',
      items: [
        { text: 'Login Page', link: '/en/schema/examples/login' },
        { text: 'Dashboard', link: '/en/schema/examples/dashboard' },
        { text: 'CRUD List', link: '/en/schema/examples/crud' }
      ]
    }
  ],
  '/en/components/': [
    {
      text: 'Components Overview',
      items: [
        { text: 'Overview', link: '/en/components/' },
        { text: 'NaiveUI Components', link: '/en/components/naive-ui' }
      ]
    },
    {
      text: 'Custom Components',
      items: [
        { text: 'SvgIcon', link: '/en/components/svg-icon' },
        { text: 'ButtonIcon', link: '/en/components/button-icon' },
        { text: 'VueECharts', link: '/en/components/vue-echarts' },
        { text: 'IconPicker', link: '/en/components/icon-picker' },
        { text: 'FlowEditor', link: '/en/components/flow-editor' },
        { text: 'MarkdownEditor', link: '/en/components/markdown-editor' },
        { text: 'RichEditor', link: '/en/components/rich-editor' }
      ]
    }
  ],
  '/en/config/': [
    {
      text: 'Configuration',
      items: [
        { text: 'Overview', link: '/en/config/' },
        { text: 'Environment Variables', link: '/en/config/env' },
        { text: 'Theme Configuration', link: '/en/config/theme' },
        { text: 'Request Configuration', link: '/en/config/request' },
        { text: 'JSON Renderer Configuration', link: '/en/config/json-renderer' }
      ]
    }
  ],
  '/en/api/': [
    {
      text: 'API Reference',
      items: [
        { text: 'Overview', link: '/en/api/' },
        { text: 'Store', link: '/en/api/store' },
        { text: 'Hooks', link: '/en/api/hooks' },
        { text: 'Utilities', link: '/en/api/utils' }
      ]
    }
  ]
}

export default defineConfig({
  title: 'Trix Admin',
  description: 'JSON-driven Modern Admin System',
  base: '/trix/',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }]
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: 'JSON 驱动的现代化后台管理系统'
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      description: 'JSON-driven Modern Admin System'
    }
  },

  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '指南', link: '/guide/', activeMatch: '/guide/' },
      { text: 'JSON Schema', link: '/schema/', activeMatch: '/schema/' },
      { text: '组件', link: '/components/', activeMatch: '/components/' },
      { text: '配置', link: '/config/', activeMatch: '/config/' },
      { text: 'API', link: '/api/', activeMatch: '/api/' }
    ],

    sidebar: {
      ...zhSidebar,
      ...enSidebar
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-repo/trix' }
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024 Trix Admin'
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          },
          en: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search'
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Clear query',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Navigate'
                }
              }
            }
          }
        }
      }
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    editLink: {
      pattern: 'https://github.com/your-repo/trix/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    }
  }
})
