import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import labPlugin from 'colord/plugins/lab';
import type { AnyColor, HslColor, RgbColor } from 'colord';

extend([mixPlugin, labPlugin]);

export function isValidColor(color: AnyColor) {
  return colord(color).isValid();
}

export function getHex(color: AnyColor) {
  return colord(color).toHex();
}

export function getRgb(color: AnyColor) {
  return colord(color).toRgb();
}

export function getHsl(color: AnyColor) {
  return colord(color).toHsl();
}

export function getHsv(color: AnyColor) {
  return colord(color).toHsv();
}

export function getDeltaE(color1: AnyColor, color2: AnyColor) {
  return colord(color1).delta(color2);
}

export function transformHslToHex(color: HslColor) {
  return colord(color).toHex();
}

/** 添加颜色透明度 */
export function addColorAlpha(color: AnyColor, alpha: number) {
  return colord(color).alpha(alpha).toHex();
}

/** 混合颜色 */
export function mixColor(firstColor: AnyColor, secondColor: AnyColor, ratio: number) {
  return colord(firstColor).mix(secondColor, ratio).toHex();
}

/** 将带透明度的颜色转换为不带透明度的相似颜色 */
export function transformColorWithOpacity(color: AnyColor, alpha: number, bgColor = '#ffffff') {
  const originColor = addColorAlpha(color, alpha);
  const { r: oR, g: oG, b: oB } = colord(originColor).toRgb();
  const { r: bgR, g: bgG, b: bgB } = colord(bgColor).toRgb();

  function calRgb(or: number, bg: number, al: number) {
    return bg + (or - bg) * al;
  }

  const resultRgb: RgbColor = {
    r: calRgb(oR, bgR, alpha),
    g: calRgb(oG, bgG, alpha),
    b: calRgb(oB, bgB, alpha)
  };

  return colord(resultRgb).toHex();
}

export function isWhiteColor(color: AnyColor) {
  return colord(color).isEqual('#ffffff');
}

export { colord };
