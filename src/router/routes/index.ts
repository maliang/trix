import type { RouteRecordRaw } from 'vue-router';
import { defineComponent, h } from 'vue';
import DynamicPageComponent from '@/components/json/DynamicPage.vue';

// 布局组件 - 根据 meta.layoutType 动态选择布局
const LayoutWrapper = () => import('@/layouts/index.vue');

// 登录页组件
const LoginPage = () => import('@/views/login/index.vue');

/**
 * 创建具有唯一名称的动态页面组件
 * 用于 KeepAlive 缓存识别
 * @param name 组件名称（通常使用路由名称）
 */
function createDynamicPage(name: string) {
  return defineComponent({
    name,
    render() {
      return h(DynamicPageComponent);
    }
  });
}

/**
 * 静态路由配置
 * 这些路由不需要权限验证，在应用启动时就会注册
 */
export const staticRoutes: RouteRecordRaw[] = [];

/**
 * 内置路由配置
 * 包含登录、错误页面等系统内置页面
 * 这些页面通过 LayoutWrapper 根据 layoutType 动态选择布局
 */
export const builtinRoutes: RouteRecordRaw[] = [
  // 登录页 - 使用 blank 布局
  {
    path: '/login',
    component: LayoutWrapper,
    children: [
      {
        path: '',
        name: 'login',
        component: LoginPage,
        meta: {
          title: '登录',
          requiresAuth: false,
          layoutType: 'blank',
          hideInMenu: true
        }
      }
    ]
  },
  // 403 无权限页面
  {
    path: '/403',
    component: LayoutWrapper,
    children: [
      {
        path: '',
        name: 'forbidden',
        component: createDynamicPage('forbidden'),
        meta: {
          title: '无权限',
          requiresAuth: false,
          layoutType: 'normal',
          hideInMenu: true,
          useJsonRenderer: true,
          schemaSource: '/mock/schema/403.json'
        }
      }
    ]
  },
  // 404 页面不存在
  {
    path: '/404',
    component: LayoutWrapper,
    children: [
      {
        path: '',
        name: 'not-found',
        component: createDynamicPage('not-found'),
        meta: {
          title: '页面不存在',
          requiresAuth: false,
          layoutType: 'normal',
          hideInMenu: true,
          useJsonRenderer: true,
          schemaSource: '/mock/schema/404.json'
        }
      }
    ]
  },
  // 500 服务器错误
  {
    path: '/500',
    component: LayoutWrapper,
    children: [
      {
        path: '',
        name: 'server-error',
        component: createDynamicPage('server-error'),
        meta: {
          title: '服务器错误',
          requiresAuth: false,
          layoutType: 'normal',
          hideInMenu: true,
          useJsonRenderer: true,
          schemaSource: '/mock/schema/500.json'
        }
      }
    ]
  }
];

/**
 * 404 兜底路由
 * 需要在动态路由加载完成后再添加，否则会拦截动态路由
 */
export const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'not-found-catch',
  redirect: '/404',
  meta: {
    hideInMenu: true
  }
};

/**
 * 动态页面路由配置
 * 使用 JSON 渲染器模式的页面
 * 所有业务页面都通过 JSON Schema 配置渲染
 * 通过 LayoutWrapper 根据 layoutType 动态选择布局
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: LayoutWrapper,
    redirect: '/home',
    children: [
      // 首页（仪表盘）- 登录后默认显示页面
      {
        path: 'home',
        name: 'home',
        component: createDynamicPage('home'),
        meta: {
          title: '首页',
          icon: 'mdi:home',
          isDefaultAfterLogin: true,
          requiresAuth: true,
          layoutType: 'normal',
          useJsonRenderer: true,
          schemaSource: '/mock/schema/dashboard.json',
          order: 1
        }
      },
      // 系统管理菜单
      {
        path: 'system',
        name: 'system',
        redirect: '/system/user',
        meta: {
          title: '系统管理',
          icon: 'mdi:cog',
          requiresAuth: true,
          order: 100
        },
        children: [
          // 成员管理
          {
            path: 'user',
            name: 'system-user',
            component: createDynamicPage('system-user'),
            meta: {
              title: '成员管理',
              icon: 'mdi:account-group',
              requiresAuth: true,
              layoutType: 'normal',
              useJsonRenderer: true,
              schemaSource: '/mock/schema/system/user-list.json',
              order: 1
            }
          },
          // 角色管理
          {
            path: 'role',
            name: 'system-role',
            component: createDynamicPage('system-role'),
            meta: {
              title: '角色管理',
              icon: 'mdi:account-key',
              requiresAuth: true,
              layoutType: 'normal',
              useJsonRenderer: true,
              schemaSource: '/mock/schema/system/role-list.json',
              order: 2
            }
          },
          // 菜单管理
          {
            path: 'menu',
            name: 'system-menu',
            component: createDynamicPage('system-menu'),
            meta: {
              title: '菜单管理',
              icon: 'mdi:menu',
              requiresAuth: true,
              layoutType: 'normal',
              useJsonRenderer: true,
              schemaSource: '/mock/schema/system/menu-list.json',
              order: 3
            }
          },
          // 权限管理
          {
            path: 'permission',
            name: 'system-permission',
            component: createDynamicPage('system-permission'),
            meta: {
              title: '权限管理',
              icon: 'mdi:shield-key',
              requiresAuth: true,
              layoutType: 'normal',
              useJsonRenderer: true,
              schemaSource: '/mock/schema/system/permission-list.json',
              order: 4
            }
          },
          // 系统设置
          {
            path: 'setting',
            name: 'system-setting',
            component: createDynamicPage('system-setting'),
            meta: {
              title: '系统设置',
              icon: 'mdi:cog-outline',
              requiresAuth: true,
              layoutType: 'normal',
              useJsonRenderer: true,
              schemaSource: '/mock/schema/system/setting.json',
              order: 5
            }
          }
        ]
      }
    ]
  }
];

/**
 * 所有路由配置
 * 合并静态路由、动态路由和内置路由
 */
export const routes: RouteRecordRaw[] = [
  ...dynamicRoutes,
  ...staticRoutes,
  ...builtinRoutes
];
