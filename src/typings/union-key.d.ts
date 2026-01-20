/** 联合类型键值命名空间 */
declare namespace UnionKey {
  /** 主题方案 */
  type ThemeScheme = 'light' | 'dark' | 'auto';

  /** 布局模式 */
  type ThemeLayoutMode =
    | 'vertical'
    | 'vertical-mix'
    | 'vertical-hybrid-header-first'
    | 'horizontal'
    | 'top-hybrid-sidebar-first'
    | 'top-hybrid-header-first';

  /** 滚动模式 */
  type ThemeScrollMode = 'wrapper' | 'content';

  /** 标签页模式 */
  type ThemeTabMode = 'chrome' | 'button' | 'slider';

  /** 页面动画模式 */
  type ThemePageAnimateMode =
    | 'fade-slide'
    | 'fade'
    | 'fade-bottom'
    | 'fade-scale'
    | 'zoom-fade'
    | 'zoom-out'
    | 'none';

  /** 登录模块 */
  type LoginModule = 'pwd-login' | 'code-login' | 'register' | 'reset-pwd' | 'bind-wechat';

  /** 下拉菜单键 */
  type DropdownKey = 'closeCurrent' | 'closeOther' | 'closeLeft' | 'closeRight' | 'closeAll' | 'pin' | 'unpin';
}
