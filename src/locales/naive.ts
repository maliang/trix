import { zhCN, dateZhCN, enUS, dateEnUS } from 'naive-ui';
import type { NLocale, NDateLocale } from 'naive-ui';

export const naiveLocales: Record<string, NLocale> = {
  'zh-CN': zhCN,
  'en-US': enUS
};

export const naiveDateLocales: Record<string, NDateLocale> = {
  'zh-CN': dateZhCN,
  'en-US': dateEnUS
};
