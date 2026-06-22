import { createI18n } from 'vue-i18n';
import zhCN from './langs/zh-cn';
import enUS from './langs/en-us';
import { getBackendConfig } from '@/config/backend';
const backendConfig = getBackendConfig();
const initialLocale = backendConfig.locale || 'zh-CN';
const i18n = createI18n({
    legacy: false,
    locale: initialLocale,
    fallbackLocale: backendConfig.fallbackLocale || 'en-US',
    messages: {
        'zh-CN': zhCN,
        'en-US': enUS
    }
});
/** 设置国际化 */
export function setupI18n(app) {
    app.use(i18n);
}
/** 翻译函数 */
export function $t(key) {
    return i18n.global.t(key);
}
export function setI18nLocale(locale) {
    i18n.global.locale.value = locale;
}
export default i18n;
