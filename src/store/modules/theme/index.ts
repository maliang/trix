import { computed, effectScope, onScopeDispose, ref, toRefs, watch } from 'vue';
import type { Ref } from 'vue';
import { useDateFormat, useEventListener, useNow, usePreferredColorScheme } from '@vueuse/core';
import { defineStore } from 'pinia';
import { getPaletteColorByNumber } from '@trix/color';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/store/plugins';
import { get, post } from '@/service/request';
import {
  addThemeVarsToGlobal,
  createThemeToken,
  getBaseUrl,
  getNaiveTheme,
  themeSettings as defaultThemeSettings,
  toggleAuxiliaryColorModes,
  toggleCssDarkMode
} from './shared';

/** 主题 Store */
export const useThemeStore = defineStore(SetupStoreId.Theme, () => {
  const scope = effectScope();
  const osTheme = usePreferredColorScheme();

  /** 主题设置 */
  const settings: Ref<App.Theme.ThemeSetting> = ref({ ...defaultThemeSettings });

  /** 水印时间实例 */
  const { now: watermarkTime, pause: pauseWatermarkTime, resume: resumeWatermarkTime } = useNow({ controls: true });

  /** 深色模式 */
  const darkMode = computed(() => {
    if (settings.value.themeScheme === 'auto') {
      return osTheme.value === 'dark';
    }
    return settings.value.themeScheme === 'dark';
  });

  /** 灰度模式 */
  const grayscaleMode = computed(() => settings.value.grayscale);

  /** 色弱模式 */
  const colourWeaknessMode = computed(() => settings.value.colourWeakness);

  /** 主题颜色 */
  const themeColors = computed(() => {
    const { themeColor, otherColor, isInfoFollowPrimary } = settings.value;
    const colors: App.Theme.ThemeColor = {
      primary: themeColor,
      ...otherColor,
      info: isInfoFollowPrimary ? themeColor : otherColor.info
    };
    return colors;
  });

  /** NaiveUI 主题 */
  const naiveTheme = computed(() => getNaiveTheme(themeColors.value, settings.value));

  /** 设置 JSON（用于复制设置） */
  const settingsJson = computed(() => JSON.stringify(settings.value));

  /** 水印时间格式化 */
  const formattedWatermarkTime = computed(() => {
    const { watermark } = settings.value;
    const date = useDateFormat(watermarkTime, watermark.timeFormat);
    return date.value;
  });

  /** 水印内容 */
  const watermarkContent = computed(() => {
    const { watermark } = settings.value;

    if (watermark.enableUserName) {
      return 'Trix User';
    }

    if (watermark.enableTime) {
      return formattedWatermarkTime.value;
    }

    return watermark.text;
  });

  /** 布局配置 - 使用 computed 包装以保持响应式 */
  const layout = computed({
    get: () => settings.value.layout,
    set: (val) => { settings.value.layout = val; }
  });

  /** 侧边栏配置 */
  const sider = computed({
    get: () => settings.value.sider,
    set: (val) => { settings.value.sider = val; }
  });

  /** 头部配置 */
  const header = computed({
    get: () => settings.value.header,
    set: (val) => { settings.value.header = val; }
  });

  /** 标签页配置 */
  const tab = computed({
    get: () => settings.value.tab,
    set: (val) => { settings.value.tab = val; }
  });

  /** 底部配置 */
  const footer = computed({
    get: () => settings.value.footer,
    set: (val) => { settings.value.footer = val; }
  });

  /** 页面配置 */
  const page = computed({
    get: () => settings.value.page,
    set: (val) => { settings.value.page = val; }
  });

  /** 水印配置 */
  const watermark = computed({
    get: () => settings.value.watermark,
    set: (val) => { settings.value.watermark = val; }
  });

  /** 固定头部和标签页 */
  const fixedHeaderAndTab = computed({
    get: () => settings.value.fixedHeaderAndTab,
    set: (val) => { settings.value.fixedHeaderAndTab = val; }
  });

  /** 主题色 */
  const themeColor = computed({
    get: () => settings.value.themeColor,
    set: (val) => { settings.value.themeColor = val; }
  });

  /** 应用标题 */
  const appTitle = computed({
    get: () => settings.value.appTitle,
    set: (val) => { settings.value.appTitle = val; }
  });

  /** 应用 Logo */
  const logo = computed({
    get: () => getBaseUrl(settings.value.logo),
    set: (val) => { settings.value.logo = val; }
  });

  /** 重置 store */
  function resetStore() {
    // 使用深拷贝确保所有嵌套对象都被正确重置
    settings.value = JSON.parse(JSON.stringify(defaultThemeSettings));
    // 重置后手动更新 CSS 变量
    updateMixChildMenuBgColor();
  }

  /** 主题配置 API 地址（从环境变量获取） */
  const THEME_CONFIG_API = import.meta.env.VITE_THEME_CONFIG_API || '';

  /** 是否已加载过远程配置 */
  const remoteConfigLoaded = ref(false);

  /**
   * 从服务器加载主题配置
   * 如果加载失败则使用缓存或默认配置
   * @param force 是否强制加载（忽略已加载标记）
   */
  async function loadRemoteThemeConfig(force = false): Promise<boolean> {
    // 如果未配置 API 地址，直接返回
    if (!THEME_CONFIG_API) {
      console.log('[ThemeStore] 未配置主题配置 API 地址，使用默认配置');
      return false;
    }

    // 如果已经加载过且不是强制加载，直接返回
    if (remoteConfigLoaded.value && !force) {
      return true;
    }

    // 使用系统标准请求，不携带 token，不显示错误消息
    const { data, error } = await get<App.Theme.ThemeSetting>(THEME_CONFIG_API, {}, {
      withToken: false,
      showErrorMessage: false
    });

    if (error || !data) {
      console.log('[ThemeStore] 远程主题配置加载失败，使用缓存或默认配置');
      return false;
    }

    if (data && typeof data === 'object') {
      // 合并远程配置到当前设置（远程配置优先）
      settings.value = { ...defaultThemeSettings, ...settings.value, ...data };
      // 标记已加载
      remoteConfigLoaded.value = true;
      // 保存到缓存
      cacheThemeSettings();
      console.log('[ThemeStore] 已加载远程主题配置并保存到缓存');
      return true;
    }

    return false;
  }

  /**
   * 保存主题配置到服务器
   */
  async function saveRemoteThemeConfig(): Promise<boolean> {
    if (!THEME_CONFIG_API) {
      console.log('[ThemeStore] 未配置主题配置 API 地址，无法保存');
      return false;
    }

    // 使用系统标准请求
    const { error } = await post(THEME_CONFIG_API, settings.value as unknown as Record<string, unknown>, {
      showErrorMessage: false
    });

    if (error) {
      console.error('[ThemeStore] 保存主题配置失败:', error.message);
      return false;
    }

    console.log('[ThemeStore] 主题配置已保存到服务器');
    return true;
  }

  /**
   * 检查是否已加载远程配置
   */
  function isRemoteConfigLoaded(): boolean {
    return remoteConfigLoaded.value;
  }

  /**
   * 设置主题方案
   *
   * @param themeScheme 主题方案
   */
  function setThemeScheme(themeScheme: UnionKey.ThemeScheme) {
    settings.value.themeScheme = themeScheme;
  }

  /**
   * 设置灰度模式
   *
   * @param isGrayscale 是否灰度
   */
  function setGrayscale(isGrayscale: boolean) {
    settings.value.grayscale = isGrayscale;
  }

  /**
   * 设置色弱模式
   *
   * @param isColourWeakness 是否色弱
   */
  function setColourWeakness(isColourWeakness: boolean) {
    settings.value.colourWeakness = isColourWeakness;
  }

  /** 切换主题方案 */
  function toggleThemeScheme() {
    const themeSchemes: UnionKey.ThemeScheme[] = ['light', 'dark', 'auto'];

    const index = themeSchemes.findIndex(item => item === settings.value.themeScheme);

    const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1;

    const nextThemeScheme = themeSchemes[nextIndex];

    setThemeScheme(nextThemeScheme);
  }

  /**
   * 更新主题颜色
   *
   * @param key 主题颜色键
   * @param color 主题颜色
   */
  function updateThemeColors(key: App.Theme.ThemeColorKey, color: string) {
    let colorValue = color;

    if (settings.value.recommendColor) {
      // 根据提供的颜色和颜色名称获取调色板，并使用合适的颜色
      colorValue = getPaletteColorByNumber(color, 500);
    }

    if (key === 'primary') {
      settings.value.themeColor = colorValue;
    } else {
      settings.value.otherColor[key] = colorValue;
    }
  }

  /**
   * 设置主题色
   *
   * @param color 主题色
   */
  function setThemeColor(color: string) {
    settings.value.themeColor = color;
  }

  /**
   * 设置主题布局
   *
   * @param mode 主题布局模式
   */
  function setThemeLayout(mode: UnionKey.ThemeLayoutMode) {
    settings.value.layout.mode = mode;
  }

  /**
   * 设置滚动模式
   *
   * @param mode 滚动模式
   */
  function setScrollMode(mode: UnionKey.ThemeScrollMode) {
    settings.value.layout.scrollMode = mode;
  }

  /** 设置主题变量到全局 */
  function setupThemeVarsToGlobal() {
    const { themeTokens, darkThemeTokens } = createThemeToken(
      themeColors.value,
      settings.value.tokens,
      settings.value.recommendColor
    );
    addThemeVarsToGlobal(themeTokens, darkThemeTokens);
    
    // 设置混合子菜单背景色 CSS 变量
    updateMixChildMenuBgColor();
  }

  /** 更新混合子菜单背景色 CSS 变量 */
  function updateMixChildMenuBgColor() {
    document.documentElement.style.setProperty('--mix-child-menu-bg-color', settings.value.sider.mixChildMenuBgColor);
  }

  /**
   * 设置水印启用用户名
   *
   * @param enable 是否启用用户名水印
   */
  function setWatermarkEnableUserName(enable: boolean) {
    settings.value.watermark.enableUserName = enable;

    if (enable) {
      settings.value.watermark.enableTime = false;
    }
  }

  /**
   * 设置水印启用时间
   *
   * @param enable 是否启用时间水印
   */
  function setWatermarkEnableTime(enable: boolean) {
    settings.value.watermark.enableTime = enable;

    if (enable) {
      settings.value.watermark.enableUserName = false;
    }
  }

  /** 仅在水印可见且启用时间显示时运行计时器 */
  function updateWatermarkTimer() {
    const { watermark } = settings.value;
    const shouldRunTimer = watermark.visible && watermark.enableTime;

    if (shouldRunTimer) {
      resumeWatermarkTime();
    } else {
      pauseWatermarkTime();
    }
  }

  /** 缓存主题设置 */
  function cacheThemeSettings() {
    localStg.set('themeSettings', settings.value);
  }

  /** 从缓存恢复主题设置 */
  function restoreThemeSettings() {
    const cached = localStg.get('themeSettings');
    if (cached && typeof cached === 'object') {
      settings.value = { ...defaultThemeSettings, ...cached };
      console.log('[ThemeStore] 已从缓存恢复主题配置');
      return true;
    }
    return false;
  }

  /** 清除缓存的主题设置 */
  function clearCachedThemeSettings() {
    localStg.remove('themeSettings');
  }

  // 启动时从缓存恢复主题设置
  restoreThemeSettings();

  // 页面关闭或刷新时缓存主题设置
  useEventListener(window, 'beforeunload', () => {
    cacheThemeSettings();
  });

  // 监听 store
  scope.run(() => {
    // 监听深色模式
    watch(
      darkMode,
      val => {
        toggleCssDarkMode(val);
        localStg.set('darkMode', val);
      },
      { immediate: true }
    );

    // 监听灰度和色弱模式
    watch(
      [grayscaleMode, colourWeaknessMode],
      val => {
        toggleAuxiliaryColorModes(val[0], val[1]);
      },
      { immediate: true }
    );

    // 主题颜色变化时，更新 CSS 变量并存储主题色
    watch(
      themeColors,
      val => {
        setupThemeVarsToGlobal();
        localStg.set('themeColor', val.primary);
      },
      { immediate: true }
    );

    // 监听水印设置以控制计时器
    watch(
      () => [settings.value.watermark.visible, settings.value.watermark.enableTime],
      () => {
        updateWatermarkTimer();
      },
      { immediate: true }
    );

    // 监听设置变化，自动缓存
    watch(
      settings,
      () => {
        cacheThemeSettings();
      },
      { deep: true }
    );

    // 监听混合子菜单背景色变化
    watch(
      () => settings.value.sider.mixChildMenuBgColor,
      () => {
        updateMixChildMenuBgColor();
      },
      { immediate: true }
    );
  });

  /** 作用域销毁时 */
  onScopeDispose(() => {
    scope.stop();
  });

  return {
    ...toRefs(settings.value),
    settings,
    darkMode,
    themeColor,
    themeColors,
    naiveTheme,
    settingsJson,
    watermarkContent,
    layout,
    sider,
    header,
    tab,
    footer,
    page,
    watermark,
    fixedHeaderAndTab,
    appTitle,
    logo,
    setGrayscale,
    setColourWeakness,
    resetStore,
    setThemeScheme,
    setThemeColor,
    toggleThemeScheme,
    updateThemeColors,
    setThemeLayout,
    setScrollMode,
    setWatermarkEnableUserName,
    setWatermarkEnableTime,
    loadRemoteThemeConfig,
    saveRemoteThemeConfig,
    isRemoteConfigLoaded,
    cacheThemeSettings,
    restoreThemeSettings,
    clearCachedThemeSettings
  };
});
