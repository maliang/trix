import { transformRecordToOption } from '@/utils/common';

/** 深色模式 class 名称 */
export const DARK_CLASS = 'dark';

/** 全局 Header 菜单容器 ID */
export const GLOBAL_HEADER_MENU_ID = '__GLOBAL_HEADER_MENU__';

/** 全局侧边栏菜单容器 ID */
export const GLOBAL_SIDER_MENU_ID = '__GLOBAL_SIDER_MENU__';

/** 主题方案记录 */
export const themeSchemaRecord: Record<UnionKey.ThemeScheme, string> = {
  light: '浅色模式',
  dark: '深色模式',
  auto: '跟随系统'
};

/** 布局模式记录 */
export const themeLayoutModeRecord: Record<UnionKey.ThemeLayoutMode, string> = {
  vertical: '左侧菜单模式',
  'vertical-mix': '左侧菜单混合模式',
  'vertical-hybrid-header-first': '顶部菜单优先混合模式',
  horizontal: '顶部菜单模式',
  'top-hybrid-sidebar-first': '侧边栏优先混合模式',
  'top-hybrid-header-first': '顶部菜单优先混合模式'
};

/** 滚动模式记录 */
export const themeScrollModeRecord: Record<UnionKey.ThemeScrollMode, string> = {
  wrapper: '外层滚动',
  content: '内容区滚动'
};

/** 滚动模式选项 */
export const themeScrollModeOptions = transformRecordToOption(themeScrollModeRecord);

/** 标签页模式记录 */
export const themeTabModeRecord: Record<UnionKey.ThemeTabMode, string> = {
  chrome: '谷歌风格',
  button: '按钮风格',
  slider: '滑块风格'
};

/** 标签页模式选项 */
export const themeTabModeOptions = transformRecordToOption(themeTabModeRecord);

/** 页面动画模式记录 */
export const themePageAnimationModeRecord: Record<UnionKey.ThemePageAnimateMode, string> = {
  'fade-slide': '滑动淡入淡出',
  fade: '淡入淡出',
  'fade-bottom': '底部淡入',
  'fade-scale': '缩放淡入',
  'zoom-fade': '缩放淡入淡出',
  'zoom-out': '缩小淡出',
  none: '无动画'
};

/** 页面动画模式选项 */
export const themePageAnimationModeOptions = transformRecordToOption(themePageAnimationModeRecord);

/** 水印时间格式选项 */
export const watermarkTimeFormatOptions = [
  { label: 'YYYY-MM-DD HH:mm', value: 'YYYY-MM-DD HH:mm' },
  { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
  { label: 'YYYY/MM/DD HH:mm', value: 'YYYY/MM/DD HH:mm' },
  { label: 'YYYY/MM/DD HH:mm:ss', value: 'YYYY/MM/DD HH:mm:ss' },
  { label: 'HH:mm', value: 'HH:mm' },
  { label: 'HH:mm:ss', value: 'HH:mm:ss' },
  { label: 'MM-DD HH:mm', value: 'MM-DD HH:mm' }
];
