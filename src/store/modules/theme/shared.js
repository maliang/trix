import { addColorAlpha, getColorPalette, getPaletteColorByNumber, getRgb } from '@trix/color';
import { DARK_CLASS } from '@/config/constants';
import { getBackendConfig } from '@/config/backend';
import { toggleHtmlClass } from '@/utils/common';
import { themeVars } from '@/styles/vars';
/** 获取带 base URL 的路径 */
export function getBaseUrl(path) {
    const base = import.meta.env.VITE_BASE_URL || '/';
    // 如果路径已经是完整 URL 或已包含 base，直接返回
    if (path.startsWith('http') || path.startsWith(base)) {
        return path;
    }
    // 移除路径开头的 /，然后拼接 base
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${base}${cleanPath}`;
}
/** 获取默认主题设置（使用后台注入的配置） */
function getDefaultThemeSettings() {
    const backendConfig = getBackendConfig();
    return {
        appTitle: backendConfig.appTitle || 'Trix Admin',
        logo: backendConfig.logo || getBaseUrl('/favicon.svg'),
        themeScheme: 'light',
        grayscale: false,
        colourWeakness: false,
        recommendColor: false,
        themeColor: '#646cff',
        themeRadius: 6,
        otherColor: {
            info: '#2080f0',
            success: '#52c41a',
            warning: '#faad14',
            error: '#f5222d'
        },
        isInfoFollowPrimary: true,
        layout: {
            mode: 'vertical',
            scrollMode: 'content'
        },
        page: {
            animate: true,
            animateMode: 'fade-slide'
        },
        header: {
            height: 56,
            inverted: false,
            breadcrumb: {
                visible: true,
                showIcon: true
            },
            multilingual: {
                visible: true
            },
            globalSearch: {
                visible: true
            }
        },
        tab: {
            visible: true,
            cache: true,
            height: 44,
            mode: 'chrome',
            closeTabByMiddleClick: false
        },
        fixedHeaderAndTab: true,
        sider: {
            inverted: false,
            width: 220,
            collapsedWidth: 64,
            mixWidth: 90,
            mixCollapsedWidth: 64,
            mixChildMenuWidth: 200,
            mixChildMenuBgColor: '#ffffff',
            autoSelectFirstMenu: false
        },
        footer: {
            visible: false,
            fixed: false,
            height: 48,
            right: true
        },
        watermark: {
            visible: false,
            text: backendConfig.appTitle || 'Trix Admin',
            enableUserName: false,
            enableTime: false,
            timeFormat: 'YYYY-MM-DD HH:mm'
        },
        tokens: {
            light: {
                colors: {
                    container: 'rgb(255, 255, 255)',
                    layout: 'rgb(247, 250, 252)',
                    inverted: 'rgb(0, 20, 40)',
                    'base-text': 'rgb(31, 31, 31)'
                },
                boxShadow: {
                    header: '0 1px 2px rgb(0, 21, 41, 0.08)',
                    sider: '2px 0 8px 0 rgb(29, 35, 41, 0.05)',
                    tab: '0 1px 2px rgb(0, 21, 41, 0.08)'
                }
            },
            dark: {
                colors: {
                    container: 'rgb(28, 28, 28)',
                    layout: 'rgb(18, 18, 18)',
                    'base-text': 'rgb(224, 224, 224)'
                }
            }
        }
    };
}
/** 默认主题设置 */
export const themeSettings = getDefaultThemeSettings();
/**
 * 创建主题 token CSS 变量值
 *
 * @param colors 主题颜色
 * @param tokens 主题设置 tokens
 * @param [recommended=false] 是否使用推荐颜色，默认 false
 */
export function createThemeToken(colors, tokens, recommended = false) {
    const paletteColors = createThemePaletteColors(colors, recommended);
    const { light, dark } = tokens || themeSettings.tokens;
    const themeTokens = {
        colors: {
            ...paletteColors,
            nprogress: paletteColors.primary,
            ...light.colors
        },
        boxShadow: {
            ...light.boxShadow
        }
    };
    const darkThemeTokens = {
        colors: {
            ...themeTokens.colors,
            ...dark?.colors
        },
        boxShadow: {
            ...themeTokens.boxShadow,
            ...dark?.boxShadow
        }
    };
    return {
        themeTokens,
        darkThemeTokens
    };
}
/**
 * 创建主题调色板颜色
 *
 * @param colors 主题颜色
 * @param [recommended=false] 是否使用推荐颜色，默认 false
 */
function createThemePaletteColors(colors, recommended = false) {
    const colorKeys = Object.keys(colors);
    const colorPaletteVar = {};
    colorKeys.forEach(key => {
        const colorMap = getColorPalette(colors[key]);
        colorPaletteVar[key] = colorMap.get(500);
        colorMap.forEach((hex, number) => {
            colorPaletteVar[`${key}-${number}`] = hex;
        });
    });
    return colorPaletteVar;
}
/**
 * 根据 tokens 获取 CSS 变量
 *
 * @param tokens 主题基础 tokens
 */
function getCssVarByTokens(tokens) {
    const styles = [];
    function removeVarPrefix(value) {
        return value.replace('var(', '').replace(')', '');
    }
    function removeRgbPrefix(value) {
        return value.replace('rgb(', '').replace(')', '');
    }
    for (const [key, tokenValues] of Object.entries(themeVars)) {
        for (const [tokenKey, tokenValue] of Object.entries(tokenValues)) {
            let cssVarsKey = removeVarPrefix(tokenValue);
            let cssValue = tokens[key][tokenKey];
            if (key === 'colors') {
                cssVarsKey = removeRgbPrefix(cssVarsKey);
                const { r, g, b } = getRgb(cssValue);
                cssValue = `${r} ${g} ${b}`;
            }
            styles.push(`${cssVarsKey}: ${cssValue}`);
        }
    }
    const styleStr = styles.join(';');
    return styleStr;
}
/**
 * 将主题变量添加到全局
 *
 * @param tokens 浅色主题 tokens
 * @param darkTokens 深色主题 tokens
 */
export function addThemeVarsToGlobal(tokens, darkTokens) {
    const cssVarStr = getCssVarByTokens(tokens);
    const darkCssVarStr = getCssVarByTokens(darkTokens);
    const css = `
    :root {
      ${cssVarStr}
    }
  `;
    const darkCss = `
    html.${DARK_CLASS} {
      ${darkCssVarStr}
    }
  `;
    const styleId = 'theme-vars';
    const style = document.querySelector(`#${styleId}`) || document.createElement('style');
    style.id = styleId;
    style.textContent = css + darkCss;
    document.head.appendChild(style);
}
/**
 * 切换 CSS 深色模式
 *
 * @param darkMode 是否深色模式
 */
export function toggleCssDarkMode(darkMode = false) {
    const { add, remove } = toggleHtmlClass(DARK_CLASS);
    if (darkMode) {
        add();
    }
    else {
        remove();
    }
}
/**
 * 切换辅助颜色模式
 *
 * @param grayscaleMode 灰度模式
 * @param colourWeakness 色弱模式
 */
export function toggleAuxiliaryColorModes(grayscaleMode = false, colourWeakness = false) {
    const htmlElement = document.documentElement;
    htmlElement.style.filter = [grayscaleMode ? 'grayscale(100%)' : '', colourWeakness ? 'invert(80%)' : '']
        .filter(Boolean)
        .join(' ');
}
/**
 * 获取 NaiveUI 主题颜色
 *
 * @param colors 主题颜色
 * @param [recommended=false] 是否使用推荐颜色，默认 false
 */
function getNaiveThemeColors(colors, recommended = false) {
    const colorActions = [
        { scene: '', handler: color => color },
        { scene: 'Suppl', handler: color => color },
        { scene: 'Hover', handler: color => getPaletteColorByNumber(color, 500) },
        { scene: 'Pressed', handler: color => getPaletteColorByNumber(color, 700) },
        { scene: 'Active', handler: color => addColorAlpha(color, 0.1) }
    ];
    const themeColors = {};
    const colorEntries = Object.entries(colors);
    colorEntries.forEach(color => {
        colorActions.forEach(action => {
            const [colorType, colorValue] = color;
            const colorKey = `${colorType}Color${action.scene}`;
            themeColors[colorKey] = action.handler(colorValue);
        });
    });
    return themeColors;
}
/**
 * 获取 NaiveUI 主题
 *
 * @param colors 主题颜色
 * @param settings 主题设置对象
 */
export function getNaiveTheme(colors, settings) {
    const { primary: colorLoading } = colors;
    const theme = {
        common: {
            ...getNaiveThemeColors(colors, settings.recommendColor),
            borderRadius: `${settings.themeRadius}px`
        },
        LoadingBar: {
            colorLoading
        },
        Tag: {
            borderRadius: `${settings.themeRadius}px`
        }
    };
    return theme;
}
