/** Header 配置 */
interface AdminLayoutHeaderConfig {
  /**
   * Header 是否可见
   *
   * @default true
   */
  headerVisible?: boolean;
  /**
   * Header 高度
   *
   * @default 56px
   */
  headerHeight?: number;
}

/** Tab 配置 */
interface AdminLayoutTabConfig {
  /**
   * Tab 是否可见
   *
   * @default true
   */
  tabVisible?: boolean;
  /**
   * Tab 类名
   *
   * @default ''
   */
  tabClass?: string;
  /**
   * Tab 高度
   *
   * @default 48px
   */
  tabHeight?: number;
}

/** Sider 配置 */
interface AdminLayoutSiderConfig {
  /**
   * Sider 是否可见
   *
   * @default true
   */
  siderVisible?: boolean;
  /**
   * Sider 类名
   *
   * @default ''
   */
  siderClass?: string;
  /**
   * 移动端 Sider 类名
   *
   * @default ''
   */
  mobileSiderClass?: string;
  /**
   * Sider 折叠状态
   *
   * @default false
   */
  siderCollapse?: boolean;
  /**
   * Sider 展开时的宽度
   *
   * @default '220px'
   */
  siderWidth?: number;
  /**
   * Sider 折叠时的宽度
   *
   * @default '64px'
   */
  siderCollapsedWidth?: number;
}

/** Content 配置 */
export interface AdminLayoutContentConfig {
  /**
   * Content 类名
   *
   * @default ''
   */
  contentClass?: string;
  /**
   * Content 是否全屏
   *
   * 如果为 true，其他元素将通过 `display: none` 隐藏
   */
  fullContent?: boolean;
}

/** Footer 配置 */
export interface AdminLayoutFooterConfig {
  /**
   * Footer 是否可见
   *
   * @default true
   */
  footerVisible?: boolean;
  /**
   * Footer 是否固定
   *
   * @default true
   */
  fixedFooter?: boolean;
  /**
   * Footer 类名
   *
   * @default ''
   */
  footerClass?: string;
  /**
   * Footer 高度
   *
   * @default 48px
   */
  footerHeight?: number;
  /**
   * Footer 是否在右侧
   *
   * 当布局为垂直模式时，Footer 在右侧
   */
  rightFooter?: boolean;
}

/**
 * 布局模式
 *
 * - Horizontal: 水平布局
 * - Vertical: 垂直布局
 */
export type LayoutMode = 'horizontal' | 'vertical';

/**
 * 内容溢出时的滚动模式
 *
 * - Wrapper: 布局组件的包装元素有滚动条
 * - Content: 布局组件的内容元素有滚动条
 *
 * @default 'wrapper'
 */
export type LayoutScrollMode = 'wrapper' | 'content';

/** Admin 布局属性 */
export interface AdminLayoutProps
  extends
    AdminLayoutHeaderConfig,
    AdminLayoutTabConfig,
    AdminLayoutSiderConfig,
    AdminLayoutContentConfig,
    AdminLayoutFooterConfig {
  /** 布局模式 */
  mode?: LayoutMode;
  /** 是否为移动端布局 */
  isMobile?: boolean;
  /** 滚动模式 */
  scrollMode?: LayoutScrollMode;
  /**
   * 布局滚动元素的 ID
   *
   * 可用于获取对应的 DOM 并滚动它
   */
  scrollElId?: string;
  /** 滚动元素的类名 */
  scrollElClass?: string;
  /** 滚动包装元素的类名 */
  scrollWrapperClass?: string;
  /**
   * 布局的通用类名
   *
   * 可用于配置过渡动画
   *
   * @default 'transition-all-300'
   */
  commonClass?: string;
  /**
   * 是否固定 Header 和 Tab
   *
   * @default true
   */
  fixedTop?: boolean;
  /**
   * 布局的最大 z-index
   *
   * Header、Tab、Sider 和 Footer 的 z-index 不会超过此值
   */
  maxZIndex?: number;
}

type Kebab<S extends string> = S extends Uncapitalize<S> ? S : `-${Uncapitalize<S>}`;

type KebabCase<S extends string> = S extends `${infer Start}${infer End}`
  ? `${Uncapitalize<Start>}${KebabCase<Kebab<End>>}`
  : S;

type Prefix = '--soy-';

export type LayoutCssVarsProps = Pick<
  AdminLayoutProps,
  'headerHeight' | 'tabHeight' | 'siderWidth' | 'siderCollapsedWidth' | 'footerHeight'
> & {
  headerZIndex?: number;
  tabZIndex?: number;
  siderZIndex?: number;
  mobileSiderZIndex?: number;
  footerZIndex?: number;
};

export type LayoutCssVars = {
  [K in keyof LayoutCssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};

/**
 * Tab 模式
 *
 * - Button: 按钮样式
 * - Chrome: Chrome 样式
 * - Slider: 滑块样式
 *
 * @default chrome
 */
export type PageTabMode = 'button' | 'chrome' | 'slider';

export interface PageTabProps {
  /** 是否为暗黑模式 */
  darkMode?: boolean;
  /** Tab 模式 */
  mode?: PageTabMode;
  /**
   * 布局的通用类名
   *
   * 可用于配置过渡动画
   *
   * @default 'transition-all-300'
   */
  commonClass?: string;
  /** 按钮 Tab 的类名 */
  buttonClass?: string;
  /** Chrome Tab 的类名 */
  chromeClass?: string;
  /** 滑块 Tab 的类名 */
  sliderClass?: string;
  /** Tab 是否激活 */
  active?: boolean;
  /** 激活 Tab 的颜色 */
  activeColor?: string;
  /**
   * Tab 是否可关闭
   *
   * 为 true 时显示关闭图标
   */
  closable?: boolean;
}

export type PageTabCssVarsProps = {
  primaryColor: string;
  primaryColor1: string;
  primaryColor2: string;
  primaryColorOpacity1: string;
  primaryColorOpacity2: string;
  primaryColorOpacity3: string;
};

export type PageTabCssVars = {
  [K in keyof PageTabCssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};
