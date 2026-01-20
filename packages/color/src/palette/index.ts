import type { AnyColor, HsvColor } from 'colord';
import { getHex, getHsv, isValidColor, mixColor } from '../shared';
import type { ColorIndex, ColorPaletteNumber } from '../types';

/** 色相步长 */
const hueStep = 2;
/** 饱和度步长（浅色部分） */
const saturationStep = 16;
/** 饱和度步长（深色部分） */
const saturationStep2 = 5;
/** 亮度步长（浅色部分） */
const brightnessStep1 = 5;
/** 亮度步长（深色部分） */
const brightnessStep2 = 15;
/** 浅色数量 */
const lightColorCount = 5;
/** 深色数量 */
const darkColorCount = 4;

/** 根据索引获取 AntD 调色板颜色 */
export function getAntDPaletteColorByIndex(color: AnyColor, index: ColorIndex): string {
  if (!isValidColor(color)) {
    throw new Error('invalid input color value');
  }

  if (index === 6) {
    return getHex(color);
  }

  const isLight = index < 6;
  const hsv = getHsv(color);
  const i = isLight ? lightColorCount + 1 - index : index - lightColorCount - 1;

  const newHsv: HsvColor = {
    h: getHue(hsv, i, isLight),
    s: getSaturation(hsv, i, isLight),
    v: getValue(hsv, i, isLight)
  };

  return getHex(newHsv);
}

/** 深色映射 */
const darkColorMap = [
  { index: 7, opacity: 0.15 },
  { index: 6, opacity: 0.25 },
  { index: 5, opacity: 0.3 },
  { index: 5, opacity: 0.45 },
  { index: 5, opacity: 0.65 },
  { index: 5, opacity: 0.85 },
  { index: 5, opacity: 0.9 },
  { index: 4, opacity: 0.93 },
  { index: 3, opacity: 0.95 },
  { index: 2, opacity: 0.97 },
  { index: 1, opacity: 0.98 }
];

/** 获取 AntD 颜色调色板 */
export function getAntDColorPalette(color: AnyColor, darkTheme = false, darkThemeMixColor = '#141414'): string[] {
  const indexes: ColorIndex[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const patterns = indexes.map(index => getAntDPaletteColorByIndex(color, index));

  if (darkTheme) {
    const darkPatterns = darkColorMap.map(({ index, opacity }) => {
      const darkColor = mixColor(darkThemeMixColor, patterns[index], opacity);
      return darkColor;
    });
    return darkPatterns.map(item => getHex(item));
  }

  return patterns;
}

/** 获取颜色调色板 */
export function getColorPalette(color: AnyColor) {
  const colorMap = new Map<ColorPaletteNumber, string>();
  const colors = getAntDColorPalette(color);
  const colorNumbers: ColorPaletteNumber[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  colorNumbers.forEach((number, index) => {
    colorMap.set(number, colors[index]);
  });

  return colorMap;
}

/** 根据编号获取调色板颜色 */
export function getPaletteColorByNumber(color: AnyColor, number: ColorPaletteNumber) {
  const colorMap = getColorPalette(color);
  return colorMap.get(number as ColorPaletteNumber)!;
}

function getHue(hsv: HsvColor, i: number, isLight: boolean) {
  let hue: number;
  const hsvH = Math.round(hsv.h);

  if (hsvH >= 60 && hsvH <= 240) {
    hue = isLight ? hsvH - hueStep * i : hsvH + hueStep * i;
  } else {
    hue = isLight ? hsvH + hueStep * i : hsvH - hueStep * i;
  }

  if (hue < 0) hue += 360;
  if (hue >= 360) hue -= 360;

  return hue;
}

function getSaturation(hsv: HsvColor, i: number, isLight: boolean) {
  if (hsv.h === 0 && hsv.s === 0) return hsv.s;

  let saturation: number;

  if (isLight) {
    saturation = hsv.s - saturationStep * i;
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep;
  } else {
    saturation = hsv.s + saturationStep2 * i;
  }

  if (saturation > 100) saturation = 100;
  if (isLight && i === lightColorCount && saturation > 10) saturation = 10;
  if (saturation < 6) saturation = 6;

  return saturation;
}

function getValue(hsv: HsvColor, i: number, isLight: boolean) {
  let value: number;

  if (isLight) {
    value = hsv.v + brightnessStep1 * i;
  } else {
    value = hsv.v - brightnessStep2 * i;
  }

  if (value > 100) value = 100;

  return value;
}
