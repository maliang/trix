import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
/** 设置 dayjs 语言 */
export function setDayjsLocale(locale = 'zh-cn') {
    dayjs.locale(locale);
}
