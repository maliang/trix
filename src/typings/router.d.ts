/**
 * 路由类型扩展
 * 扩展 vue-router 的 RouteMeta 接口，添加 Trix 特有的路由元数据属性
 */
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * 是否使用 JSON 渲染器模式
     * - true: 使用 JsonRenderer 渲染页面
     * - false/undefined: 使用传统 Vue 组件渲染页面
     * @default false
     */
    useJsonRenderer?: boolean;

    /**
     * JSON Schema 来源
     * - 可以是 API 地址（如 '/api/schema/dashboard'）
     * - 可以是静态文件路径（如 '/mock/schema/dashboard.json'）
     * 仅当 useJsonRenderer 为 true 时有效
     */
    schemaSource?: string;

    /**
     * 固定标签页顺序
     * 设置后该路由对应的标签页将固定显示在标签栏中，不能被关闭
     * 数值越小越靠前
     */
    fixedIndexInTab?: number;

    /**
     * 是否为登录后默认显示页面
     * 设置后此页面将替代首页显示在标签栏第一位
     * 如果是全屏页面（layoutType: 'blank'），则不在标签栏记录
     * 如果有多个页面设置此属性为 true，以最后一个为准
     * @default false
     */
    isDefaultAfterLogin?: boolean;

    /**
     * 是否需要登录才能访问
     * @default true
     */
    requiresAuth?: boolean;

    /**
     * 打开类型
     * - normal: 正常打开（在当前布局内）
     * - iframe: 在 iframe 中打开外部链接
     * - newWindow: 在新窗口/标签页中打开
     * @default 'normal'
     */
    openType?: 'normal' | 'iframe' | 'newWindow';

    /**
     * 外部链接地址
     * 当 openType 为 'iframe' 或 'newWindow' 时使用
     */
    href?: string;

    /**
     * 布局类型
     * - normal: 正常布局（带侧边栏、头部等）
     * - blank: 无布局（全屏显示，如登录页）
     * @default 'normal'
     */
    layoutType?: 'normal' | 'blank';

    /**
     * 页面标题
     * 用于显示在标签页、面包屑等位置
     */
    title?: string;

    /**
     * 页面图标
     * 支持 iconify 图标名称或本地 svg 图标名称
     */
    icon?: string;

    /**
     * 权限标识列表
     * 用户需要拥有列表中的任一权限才能访问该页面
     */
    permissions?: string[];

    /**
     * 是否缓存页面
     * 配合 keep-alive 使用
     * @default false
     */
    keepAlive?: boolean;

    /**
     * 是否在菜单中隐藏
     * @default false
     */
    hideInMenu?: boolean;

    /**
     * 菜单排序
     * 数值越小越靠前
     */
    order?: number;

    /**
     * 父级菜单路径
     * 用于面包屑导航
     */
    activeMenu?: string;
  }
}

export {};
