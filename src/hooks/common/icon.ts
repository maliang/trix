import { useSvgIconRender } from '@trix/hooks';
import SvgIcon from '@/components/custom/svg-icon.vue';

/**
 * SVG 图标 Hook
 * 用于在菜单等场景中渲染图标 VNode
 */
export function useSvgIcon() {
  const { SvgIconVNode } = useSvgIconRender(SvgIcon);

  return {
    SvgIconVNode
  };
}
