import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import zhCN from './langs/zh-cn';
import enUS from './langs/en-us';

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
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

export default i18n;
