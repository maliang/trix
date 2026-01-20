import { h } from 'vue';
import type { Component } from 'vue';

/**
 * SVG 图标渲染 Hook
 *
 * @param SvgIcon SVG 图标组件
 */
export default function useSvgIconRender(SvgIcon: Component) {
  interface IconConfig {
    /** Iconify 图标名称 */
    icon?: string;
    /** 本地图标名称 */
    localIcon?: string;
    /** 图标颜色 */
    color?: string;
    /** 图标大小 */
    fontSize?: number;
  }

  type IconStyle = Partial<Pick<CSSStyleDeclaration, 'color' | 'fontSize'>>;

  /**
   * SVG 图标 VNode
   *
   * @param config 图标配置
   */
  const SvgIconVNode = (config: IconConfig) => {
    const { color, fontSize, icon, localIcon } = config;

    const style: IconStyle = {};

    if (color) {
      style.color = color;
    }
    if (fontSize) {
      style.fontSize = `${fontSize}px`;
    }

    if (!icon && !localIcon) {
      return undefined;
    }

    return () => h(SvgIcon, { icon, localIcon, style });
  };

  return {
    SvgIconVNode
  };
}
