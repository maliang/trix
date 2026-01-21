/**
 * 环境变量类型定义
 * Namespace Env
 */
declare namespace Env {
  /** 服务环境类型 */
  type ServiceEnvType = 'dev' | 'test' | 'prod';

  /** 后端服务的环境配置 */
  interface ServiceEnvConfig {
    /** 后端服务地址 */
    url: string;
    /** 代理模式 */
    urlPattern: string;
    /** 是否开启代理 */
    secondUrlPattern?: string;
  }

  /** Vite 环境变量 */
  interface ImportMeta {
    /** 项目基础路径 */
    readonly VITE_BASE_URL: string;
    /** 主题配置 API 地址 */
    readonly VITE_THEME_CONFIG_API?: string;
    /** 登录页 Schema 地址 */
    readonly VITE_LOGIN_SCHEMA_URL?: string;
    /** Header 右侧 Schema 地址 */
    readonly VITE_HEADER_RIGHT_SCHEMA_URL?: string;
    /** 开启请求代理 */
    readonly VITE_HTTP_PROXY?: CommonType.YesOrNo;
    /** iconify 图标作为组件的前缀 */
    readonly VITE_ICON_PREFIX: 'icon';
    /**
     * 本地 SVG 图标作为组件的前缀, 请注意一定要包含 VITE_ICON_PREFIX
     * - 格式 {VITE_ICON_PREFIX}-{本地图标集合名称}
     * - 例如：icon-local
     */
    readonly VITE_ICON_LOCAL_PREFIX: 'icon-local';
    /** 是否开启代理日志 */
    readonly VITE_PROXY_LOG?: CommonType.YesOrNo;
    /** 是否开启 Source Map */
    readonly VITE_SOURCE_MAP?: CommonType.YesOrNo;
    /** 后端请求地址 */
    readonly VITE_SERVICE_BASE_URL: string;
    /** 其他后端请求地址 */
    readonly VITE_OTHER_SERVICE_BASE_URL?: string;
    /** 菜单路由 API 地址 */
    readonly VITE_MENU_ROUTE_URL?: string;
    /** 路由模式：hash | history | memory */
    readonly VITE_ROUTER_MODE?: 'hash' | 'history' | 'memory';
    /** 是否使用模拟认证（Y 为模拟模式，其他为正式模式） */
    readonly VITE_AUTH_MOCK?: CommonType.YesOrNo;
    /** 登录 API 地址 */
    readonly VITE_LOGIN_API?: string;
    /** 获取用户信息 API 地址 */
    readonly VITE_USER_INFO_API?: string;
  }
}

interface ImportMetaEnv extends Env.ImportMeta {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
