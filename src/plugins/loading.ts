// @unocss-include
import { getColorPalette, getRgb } from '@trix/color';
import { DARK_CLASS } from '@/config/constants';
import { localStg } from '@/utils/storage';
import { toggleHtmlClass } from '@/utils/common';

/** 默认 Logo 图片路径 */
const DEFAULT_LOGO = '/favicon.svg';

/** 默认应用标题 */
const DEFAULT_APP_TITLE = 'Trix Admin';

export function setupLoading() {
  // 从缓存中获取主题设置
  const cachedSettings = localStg.get('themeSettings');
  const logoPath = cachedSettings?.logo || DEFAULT_LOGO;
  const appTitle = cachedSettings?.appTitle || DEFAULT_APP_TITLE;
  
  const themeColor = localStg.get('themeColor') || '#646cff';
  const darkMode = localStg.get('darkMode') || false;
  const palette = getColorPalette(themeColor);

  const { r, g, b } = getRgb(themeColor);

  const primaryColor = `--primary-color: ${r} ${g} ${b}`;

  const svgCssVars = Array.from(palette.entries())
    .map(([key, value]) => `--logo-color-${key}: ${value}`)
    .join(';');

  const cssVars = `${primaryColor}; ${svgCssVars}`;

  if (darkMode) {
    toggleHtmlClass(DARK_CLASS).add();
  }

  const loadingClasses = [
    'left-0 top-0',
    'left-0 bottom-0 animate-delay-500',
    'right-0 top-0 animate-delay-1000',
    'right-0 bottom-0 animate-delay-1500'
  ];

  const dot = loadingClasses
    .map(item => {
      return `<div class="absolute w-16px h-16px bg-primary rounded-8px animate-pulse ${item}"></div>`;
    })
    .join('\n');

  const loading = `
<div class="fixed-center flex-col bg-layout" style="${cssVars}">
  <div class="w-128px h-128px">
    <img src="${logoPath}" alt="Logo" class="w-full h-full object-contain" />
  </div>
  <div class="w-56px h-56px my-36px">
    <div class="relative h-full animate-spin">
      ${dot}
    </div>
  </div>
  <h2 class="text-28px font-500 text-primary">${appTitle}</h2>
</div>`;

  const app = document.getElementById('app');

  if (app) {
    app.innerHTML = loading;
  }
}
