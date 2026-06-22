import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import zhCN from './langs/zh-cn';
import enUS from './langs/en-us';
import { getBackendConfig } from '@/config/backend';

const backendConfig = getBackendConfig();
let storedLocale: App.I18n.LangType | null = null;
try {
  const value = localStorage.getItem('trix-locale');
  if (value && (backendConfig.languages || []).some(language => language.key === value)) storedLocale = value;
} catch {
  // Storage can be unavailable in privacy-restricted environments.
}
const initialLocale = storedLocale || backendConfig.locale || 'zh-CN';

const cachedMessages: Record<string, any> = {};
if (storedLocale && storedLocale !== 'zh-CN' && storedLocale !== 'en-US') {
  try {
    const cached = localStorage.getItem(`trix-locale-messages:${storedLocale}`);
    if (cached) cachedMessages[storedLocale] = JSON.parse(cached);
  } catch {
    // Ignore unavailable or invalid locale cache.
  }
}

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: backendConfig.fallbackLocale || 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    ...cachedMessages
  }
});

/** 设置国际化 */
export function setupI18n(app: App) {
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
