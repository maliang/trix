/**
 * 应用类型定义
 * Namespace App
 */
declare namespace App {
  /** 国际化命名空间 */
  namespace I18n {
    /** 语言类型 */
    type LangType = 'zh-CN' | 'en-US';

    /** 语言选项 */
    interface LangOption {
      label: string;
      key: LangType;
    }
  }

  /** 全局命名空间 */
  namespace Global {
    /** 头部属性 */
    interface HeaderProps {
      /** 是否显示 Logo */
      showLogo?: boolean;
      /** 是否显示菜单 */
      showMenu?: boolean;
      /** 是否显示菜单切换器 */
      showMenuToggler?: boolean;
    }

    /** 菜单项 */
    interface Menu {
      /** 菜单键 */
      key: string;
      /** 菜单标签 */
      label: string;
      /** 菜单图标 */
      icon?: any;
      /** 路由键 */
      routeKey: string;
      /** 路由路径 */
      routePath: string;
      /** 国际化键 */
      i18nKey?: string;
      /** 子菜单 */
      children?: Menu[];
      /** 下拉选项 */
      options?: Menu[];
    }

    /** 标签页 */
    interface Tab {
      /** 标签页 ID */
      id: string;
      /** 标签页标签 */
      label: string;
      /** 新标签 */
      newLabel?: string;
      /** 旧标签 */
      oldLabel?: string;
      /** 路由键 */
      routeKey: string;
      /** 路由路径 */
      routePath: string;
      /** 完整路径 */
      fullPath: string;
      /** 固定索引 */
      fixedIndex?: number;
      /** 图标 */
      icon?: string;
    }

    /** 标签页路由 */
    interface TabRoute {
      name: string;
      path: string;
      fullPath: string;
      meta: {
        title?: string;
        i18nKey?: string;
        icon?: string;
        fixedIndexInTab?: number;
      };
    }

    /** 下拉菜单键 */
    type DropdownKey = UnionKey.DropdownKey;

    /** 路由推送选项 */
    interface RouterPushOptions {
      query?: Record<string, string>;
      params?: Record<string, string>;
    }
  }

  /** 主题命名空间 */
  namespace Theme {
    /** 主题颜色键 */
    type ThemeColorKey = 'primary' | 'info' | 'success' | 'warning' | 'error';

    /** 颜色调色板数字 */
    type ColorPaletteNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

    /** 主题调色板颜色 */
    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    } & {
      /** NProgress 进度条颜色 */
      nprogress?: string;
      /** 容器背景颜色 */
      container?: string;
      /** 布局背景颜色 */
      layout?: string;
      /** 反转背景颜色 */
      inverted?: string;
      /** 基础文本颜色 */
      'base-text'?: string;
    };

    /** 主题 Token CSS 变量 */
    interface ThemeTokenCSSVars {
      colors: ThemePaletteColor;
      boxShadow: {
        header: string;
        sider: string;
        tab: string;
      };
    }

    /** 基础 Token */
    interface BaseToken {
      colors: ThemePaletteColor;
      boxShadow: {
        header: string;
        sider: string;
        tab: string;
      };
    }

    /** 主题颜色 */
    interface ThemeColor {
      primary: string;
      info: string;
      success: string;
      warning: string;
      error: string;
    }

    /** 其他颜色 */
    interface OtherColor {
      info: string;
      success: string;
      warning: string;
      error: string;
    }

    /** 主题 Token 配置 */
    interface ThemeTokens {
      light: {
        colors: {
          container: string;
          layout: string;
          inverted: string;
          'base-text': string;
        };
        boxShadow: {
          header: string;
          sider: string;
          tab: string;
        };
      };
      dark?: {
        colors?: {
          container?: string;
          layout?: string;
          'base-text'?: string;
        };
        boxShadow?: {
          header?: string;
          sider?: string;
          tab?: string;
        };
      };
    }

    /** 主题设置 */
    interface ThemeSetting {
      /** 应用标题 */
      appTitle: string;
      /** 应用 Logo */
      logo: string;
      /** 主题方案 */
      themeScheme: UnionKey.ThemeScheme;
      /** 灰度模式 */
      grayscale: boolean;
      /** 色弱模式 */
      colourWeakness: boolean;
      /** 是否推荐颜色 */
      recommendColor: boolean;
      /** 主题色 */
      themeColor: string;
      /** 主题圆角 */
      themeRadius: number;
      /** 其他颜色 */
      otherColor: OtherColor;
      /** info 颜色是否跟随主色 */
      isInfoFollowPrimary: boolean;
      /** 布局配置 */
      layout: {
        mode: UnionKey.ThemeLayoutMode;
        scrollMode: UnionKey.ThemeScrollMode;
      };
      /** 页面配置 */
      page: {
        animate: boolean;
        animateMode: UnionKey.ThemePageAnimateMode;
      };
      /** 头部配置 */
      header: {
        height: number;
        inverted: boolean;
        breadcrumb: {
          visible: boolean;
          showIcon: boolean;
        };
        multilingual: {
          visible: boolean;
        };
        globalSearch: {
          visible: boolean;
        };
      };
      /** 标签页配置 */
      tab: {
        visible: boolean;
        cache: boolean;
        height: number;
        mode: UnionKey.ThemeTabMode;
        closeTabByMiddleClick: boolean;
      };
      /** 固定头部和标签页 */
      fixedHeaderAndTab: boolean;
      /** 侧边栏配置 */
      sider: {
        inverted: boolean;
        width: number;
        collapsedWidth: number;
        mixWidth: number;
        mixCollapsedWidth: number;
        mixChildMenuWidth: number;
        /** 混合菜单子菜单背景色 */
        mixChildMenuBgColor: string;
        autoSelectFirstMenu: boolean;
      };
      /** 底部配置 */
      footer: {
        visible: boolean;
        fixed: boolean;
        height: number;
        right: boolean;
      };
      /** 水印配置 */
      watermark: {
        visible: boolean;
        text: string;
        enableUserName: boolean;
        enableTime: boolean;
        timeFormat: string;
      };
      /** 主题 Token 配置 */
      tokens: ThemeTokens;
    }
  }

  /** 服务命名空间 */
  namespace Service {
    /** 其他请求的 key */
    type OtherBaseURLKey = 'demo';

    /** 服务配置项 */
    interface ServiceConfigItem {
      /** 后端服务地址 */
      baseURL: string;
      /** 代理模式 */
      proxyPattern: string;
    }

    /** 其他服务配置项 */
    interface OtherServiceConfigItem extends ServiceConfigItem {
      key: OtherBaseURLKey;
    }

    /** 简单服务配置 */
    interface SimpleServiceConfig {
      /** 后端服务地址 */
      baseURL: string;
      /** 其他后端服务地址 */
      other: Record<OtherBaseURLKey, string>;
    }

    /** 服务配置 */
    interface ServiceConfig extends ServiceConfigItem {
      /** 其他后端服务配置 */
      other: OtherServiceConfigItem[];
    }
  }
}

/** 通用类型命名空间 */
declare namespace CommonType {
  /** 是或否 */
  type YesOrNo = 'Y' | 'N';

  /** 策略模式 */
  interface StrategyAction {
    /** 条件 */
    condition: boolean;
    /** 条件为真时执行的回调函数 */
    callback: () => void;
  }

  /**
   * 选项类型
   *
   * @property value 选项值
   * @property label 选项标签
   */
  interface Option<K = string> {
    value: K;
    label: string;
  }
}
