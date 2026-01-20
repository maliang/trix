import { defineStore } from 'pinia';
import { ref, watch, effectScope, onScopeDispose, nextTick } from 'vue';
import { breakpointsTailwind, useBreakpoints, useEventListener } from '@vueuse/core';
import { useBoolean } from '@trix/hooks';
import { useThemeStore } from '../theme';

export const useAppStore = defineStore('app', () => {
  // 延迟获取 theme store，避免循环依赖
  const getThemeStore = () => useThemeStore();
  const scope = effectScope();
  const breakpoints = useBreakpoints(breakpointsTailwind);

  /** 主题抽屉是否可见 */
  const { bool: themeDrawerVisible, setTrue: openThemeDrawer, setFalse: closeThemeDrawer } = useBoolean();

  /** 重新加载标志 */
  const { bool: reloadFlag, setBool: setReloadFlag } = useBoolean(true);

  /** 全屏内容 */
  const { bool: fullContent, toggle: toggleFullContent } = useBoolean();

  /** 内容 X 轴可滚动 */
  const { bool: contentXScrollable, setBool: setContentXScrollable } = useBoolean();

  /** 侧边栏折叠 */
  const { bool: siderCollapse, setBool: setSiderCollapse, toggle: toggleSiderCollapse } = useBoolean();

  /** 混合侧边栏固定 */
  const { bool: mixSiderFixed, setBool: setMixSiderFixed, toggle: toggleMixSiderFixed } = useBoolean(false);

  /** 是否为移动端布局 */
  const isMobile = breakpoints.smaller('sm');

  /** 当前语言 */
  const locale = ref<App.I18n.LangType>('zh-CN');

  /** 语言选项 */
  const localeOptions: App.I18n.LangOption[] = [
    { label: '中文', key: 'zh-CN' },
    { label: 'English', key: 'en-US' }
  ];

  /**
   * 重新加载页面
   * @param duration 持续时间
   */
  async function reloadPage(duration = 300) {
    setReloadFlag(false);
    const d = getThemeStore().page.animate ? duration : 40;
    await new Promise(resolve => setTimeout(resolve, d));
    setReloadFlag(true);
  }

  /**
   * 切换语言
   * @param lang 语言类型
   */
  function changeLocale(lang: App.I18n.LangType) {
    locale.value = lang;
  }

  // 监听 store
  scope.run(() => {
    // 监听移动端，如果是移动端则折叠侧边栏
    watch(
      isMobile,
      newValue => {
        if (newValue) {
          getThemeStore().setThemeLayout('vertical');
          setSiderCollapse(true);
        }
      },
      { immediate: true }
    );
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return {
    isMobile,
    reloadFlag,
    reloadPage,
    fullContent,
    toggleFullContent,
    locale,
    localeOptions,
    changeLocale,
    themeDrawerVisible,
    openThemeDrawer,
    closeThemeDrawer,
    contentXScrollable,
    setContentXScrollable,
    siderCollapse,
    setSiderCollapse,
    toggleSiderCollapse,
    mixSiderFixed,
    setMixSiderFixed,
    toggleMixSiderFixed
  };
});
