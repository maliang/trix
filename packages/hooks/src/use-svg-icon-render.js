import { h } from 'vue';
/**
 * SVG 图标渲染 Hook
 *
 * @param SvgIcon SVG 图标组件
 */
export default function useSvgIconRender(SvgIcon) {
    /**
     * SVG 图标 VNode
     *
     * @param config 图标配置
     */
    const SvgIconVNode = (config) => {
        const { color, fontSize, icon } = config;
        const style = {};
        if (color) {
            style.color = color;
        }
        if (fontSize) {
            style.fontSize = `${fontSize}px`;
        }
        if (!icon) {
            return undefined;
        }
        return () => h(SvgIcon, { icon, style });
    };
    return {
        SvgIconVNode
    };
}
