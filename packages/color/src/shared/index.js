import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import labPlugin from 'colord/plugins/lab';
extend([mixPlugin, labPlugin]);
export function isValidColor(color) {
    return colord(color).isValid();
}
export function getHex(color) {
    return colord(color).toHex();
}
export function getRgb(color) {
    return colord(color).toRgb();
}
export function getHsl(color) {
    return colord(color).toHsl();
}
export function getHsv(color) {
    return colord(color).toHsv();
}
export function getDeltaE(color1, color2) {
    return colord(color1).delta(color2);
}
export function transformHslToHex(color) {
    return colord(color).toHex();
}
/** 添加颜色透明度 */
export function addColorAlpha(color, alpha) {
    return colord(color).alpha(alpha).toHex();
}
/** 混合颜色 */
export function mixColor(firstColor, secondColor, ratio) {
    return colord(firstColor).mix(secondColor, ratio).toHex();
}
/** 将带透明度的颜色转换为不带透明度的相似颜色 */
export function transformColorWithOpacity(color, alpha, bgColor = '#ffffff') {
    const originColor = addColorAlpha(color, alpha);
    const { r: oR, g: oG, b: oB } = colord(originColor).toRgb();
    const { r: bgR, g: bgG, b: bgB } = colord(bgColor).toRgb();
    function calRgb(or, bg, al) {
        return bg + (or - bg) * al;
    }
    const resultRgb = {
        r: calRgb(oR, bgR, alpha),
        g: calRgb(oG, bgG, alpha),
        b: calRgb(oB, bgB, alpha)
    };
    return colord(resultRgb).toHex();
}
export function isWhiteColor(color) {
    return colord(color).isEqual('#ffffff');
}
export { colord };
