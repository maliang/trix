import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import zhCN from './langs/zh-cn';
import enUS from './langs/en-us';
import { getBackendConfig } from '@/config/backend';

/**
 * 读取本地存储中的语言偏好（需在后端配置就绪后调用，以便用 languages 校验合法性）。
 */
function resolveStoredLocale(): App.I18n.LangType | null {
  try {
    const value = localStorage.getItem('trix-locale');
    const languages = getBackendConfig().languages || [];
    if (value && languages.some(language => language.key === value)) {
      return value as App.I18n.LangType;
    }
  } catch {
    // Storage can be unavailable in privacy-restricted environments.
  }
  return null;
}

// 创建 i18n 时使用安全默认值，不在模块导入阶段读取后端配置，
// 真正的语言由 applyBackendLocale() 在后端配置就绪后再应用。
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
});

/**
 * 应用后端配置中的语言设置（标题/语言在未注入时也能正确）。
 * 必须在 ensureBackendConfig() 之后调用。
 */
export function applyBackendLocale() {
  const backendConfig = getBackendConfig();
  const storedLocale = resolveStoredLocale();

  // 自定义语言（非内置 zh-CN/en-US）尝试加载本地缓存的翻译
  if (storedLocale && storedLocale !== 'zh-CN' && storedLocale !== 'en-US') {
    try {
      const cached = localStorage.getItem(`trix-locale-messages:${storedLocale}`);
      if (cached) i18n.global.setLocaleMessage(storedLocale as any, JSON.parse(cached));
    } catch {
      // Ignore unavailable or invalid locale cache.
    }
  }

  const initialLocale = storedLocale || backendConfig.locale || 'zh-CN';
  i18n.global.locale.value = initialLocale as any;
  i18n.global.fallbackLocale.value = (backendConfig.fallbackLocale || 'en-US') as any;
}

/** 设置国际化 */
export function setupI18n(app: App) {
  applyBackendLocale();
  app.use(i18n);
}

/** 翻译函数 */
export function $t(key: string) {
  return i18n.global.t(key);
}

export function setI18nLocale(locale: App.I18n.LangType) {
  i18n.global.locale.value = locale as any;
}

export function registerLocaleMessages(locale: App.I18n.LangType, messages: Record<string, any>) {
  i18n.global.setLocaleMessage(locale as any, messages as any);
  try {
    localStorage.setItem(`trix-locale-messages:${locale}`, JSON.stringify(messages));
  } catch {
    // Storage can be unavailable in privacy-restricted environments.
  }
}

export default i18n;
