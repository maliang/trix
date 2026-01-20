/**
 * 存储类型定义
 * Namespace StorageType
 */
declare namespace StorageType {
  /** 本地存储 */
  interface Local {
    /** 用户 Token */
    token: string;
    /** 刷新 Token */
    refreshToken: string;
    /** 用户信息 */
    userInfo: {
      userId: string;
      userName: string;
      permissions: string[];
    };
    /** 主题颜色 */
    themeColor: string;
    /** 暗黑模式 */
    darkMode: boolean;
    /** 主题设置 */
    themeSettings: App.Theme.ThemeSetting;
    /** 语言 */
    lang: App.I18n.LangType;
  }

  /** 会话存储 */
  interface Session {
    /** 标签页 */
    tabRoutes: {
      name: string;
      path: string;
      meta: Record<string, unknown>;
    }[];
  }
}
