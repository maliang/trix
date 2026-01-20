/**
 * JSON 渲染器插件
 * 集成 @maliang47/vschema 并注册 NaiveUI 和自定义组件
 */

import type { App, Component } from 'vue';
import { createVSchemaPlugin, type RequestConfig as RendererRequestConfig } from '@maliang47/vschema';
import * as NaiveUI from 'naive-ui';
import { jsonRendererConfig } from '@/config/json-renderer';
import { localStg } from '@/utils/storage';

// 自定义组件导入
import SvgIcon from '@/components/custom/svg-icon.vue';
import ButtonIcon from '@/components/custom/button-icon.vue';
import CountTo from '@/components/custom/count-to.vue';
import BetterScroll from '@/components/custom/better-scroll.vue';
import WaveBg from '@/components/custom/wave-bg.vue';
import VueECharts from '@/components/custom/vue-echarts.vue';

// 通用组件导入
import DarkModeContainer from '@/components/common/dark-mode-container.vue';
import ExceptionBase from '@/components/common/exception-base.vue';
import FullScreen from '@/components/common/full-screen.vue';
import IconTooltip from '@/components/common/icon-tooltip.vue';
import LangSwitch from '@/components/common/lang-switch.vue';
import MenuToggler from '@/components/common/menu-toggler.vue';
import PinToggler from '@/components/common/pin-toggler.vue';
import ReloadButton from '@/components/common/reload-button.vue';
import SystemLogo from '@/components/common/system-logo.vue';
import ThemeSchemaSwitch from '@/components/common/theme-schema-switch.vue';

// 布局模块组件导入
import GlobalSearch from '@/layouts/modules/global-search/index.vue';
import ThemeButton from '@/layouts/modules/global-header/components/theme-button.vue';
import UserAvatar from '@/layouts/modules/global-header/components/user-avatar.vue';

// 高级组件导入
import TableHeaderOperation from '@/components/advanced/table-header-operation.vue';
import TableColumnSetting from '@/components/advanced/table-column-setting.vue';

// JSON 渲染相关组件导入
import SchemaEditor from '@/components/json/SchemaEditor.vue';
import ErrorBoundary from '@/components/json/ErrorBoundary.vue';
import JsonDataTable from '@/components/json/JsonDataTable.vue';

// 业务组件导入
import { IconPicker } from '@/components/business/icon-picker';
import { FlowEditor } from '@/components/business/flow-editor';
import { MarkdownEditor } from '@/components/business/markdown-editor';
import { RichEditor } from '@/components/business/rich-editor';

// Header 通知组件导入
import { HeaderNotification } from '@/components/common/header-notification';

/**
 * 需要注册的 NaiveUI 组件列表
 * 包含所有常用的 NaiveUI 组件
 */
export const naiveUIComponentNames = [
  // 基础组件
  'NButton',
  'NButtonGroup',
  'NIcon',
  'NText',
  'NP',
  'NH1',
  'NH2',
  'NH3',
  'NH4',
  'NH5',
  'NH6',
  // 布局组件
  'NSpace',
  'NGrid',
  'NGridItem',
  'NGi',
  'NLayout',
  'NLayoutHeader',
  'NLayoutContent',
  'NLayoutFooter',
  'NLayoutSider',
  'NFlex',
  'NDivider',
  // 表单组件
  'NForm',
  'NFormItem',
  'NFormItemGi',
  'NInput',
  'NInputNumber',
  'NInputGroup',
  'NInputGroupLabel',
  'NSelect',
  'NRadio',
  'NRadioGroup',
  'NRadioButton',
  'NCheckbox',
  'NCheckboxGroup',
  'NSwitch',
  'NSlider',
  'NRate',
  'NTimePicker',
  'NDatePicker',
  'NUpload',
  'NUploadDragger',
  'NColorPicker',
  'NCascader',
  'NTreeSelect',
  'NAutoComplete',
  'NMention',
  'NDynamicInput',
  'NDynamicTags',
  'NTransfer',
  // 数据展示
  'NTable',
  'NDataTable',
  'NTree',
  'NList',
  'NListItem',
  'NDescriptions',
  'NDescriptionsItem',
  'NStatistic',
  'NCountdown',
  'NNumberAnimation',
  'NCalendar',
  'NImage',
  'NImageGroup',
  'NAvatar',
  'NAvatarGroup',
  'NBadge',
  'NTag',
  'NProgress',
  'NTimeline',
  'NTimelineItem',
  'NCollapse',
  'NCollapseItem',
  'NCollapseTransition',
  'NScrollbar',
  'NEmpty',
  'NResult',
  'NThing',
  'NLog',
  'NCode',
  'NEquation',
  'NQrCode',
  'NWatermark',
  'NEllipsis',
  // 导航组件
  'NMenu',
  'NDropdown',
  'NBreadcrumb',
  'NBreadcrumbItem',
  'NPagination',
  'NSteps',
  'NStep',
  'NTabs',
  'NTabPane',
  'NAnchor',
  'NAnchorLink',
  'NBackTop',
  'NAffix',
  // 反馈组件
  'NAlert',
  'NModal',
  'NDrawer',
  'NDrawerContent',
  'NPopover',
  'NTooltip',
  'NPopconfirm',
  'NPopselect',
  'NNotificationProvider',
  'NMessageProvider',
  'NDialogProvider',
  'NLoadingBarProvider',
  'NSpin',
  'NSkeleton',
  'NFloatButton',
  'NFloatButtonGroup',
  // 卡片容器
  'NCard',
  'NCarousel',
  'NCarouselItem',
  // 配置
  'NConfigProvider',
  'NElement',
  'NGlobalStyle'
] as const;

/**
 * soybean-admin 自定义组件映射
 */
export const customComponents: Record<string, Component> = {
  // 自定义组件
  SvgIcon,
  ButtonIcon,
  CountTo,
  BetterScroll,
  WaveBg,
  VueECharts,
  // 通用组件
  DarkModeContainer,
  ExceptionBase,
  FullScreen,
  IconTooltip,
  LangSwitch,
  MenuToggler,
  PinToggler,
  ReloadButton,
  SystemLogo,
  ThemeSchemaSwitch,
  // Header 通知组件
  HeaderNotification,
  // 布局模块组件
  GlobalSearch,
  ThemeButton,
  UserAvatar,
  // 高级组件
  TableHeaderOperation,
  TableColumnSetting,
  // JSON 渲染相关组件
  SchemaEditor,
  ErrorBoundary,
  JsonDataTable,
  // 业务组件
  IconPicker,
  FlowEditor,
  MarkdownEditor,
  RichEditor
};

/**
 * 获取 NaiveUI 组件映射
 * @returns NaiveUI 组件名称到组件的映射
 */
export function getNaiveUIComponents(): Record<string, Component> {
  const components: Record<string, Component> = {};
  const naiveUIModule = NaiveUI as unknown as Record<string, unknown>;

  for (const name of naiveUIComponentNames) {
    const component = naiveUIModule[name];
    if (component && typeof component === 'object') {
      components[name] = component as Component;
    }
  }

  return components;
}

/**
 * 获取所有注册的组件
 * @returns 所有组件的映射（NaiveUI + 自定义组件）
 */
export function getAllComponents(): Record<string, Component> {
  return {
    ...getNaiveUIComponents(),
    ...customComponents
  };
}

/**
 * 设置 JSON 渲染器插件
 * @param app - Vue 应用实例
 */
export function setupJsonRenderer(app: App): void {
  // 获取所有需要注册的组件
  const allComponents = getAllComponents();

  // 创建并安装 VSchema 插件
  const plugin = createVSchemaPlugin({
    // 基础配置
    baseURL: jsonRendererConfig.baseURL,
    responseDataPath: jsonRendererConfig.responseDataPath,
    defaultHeaders: jsonRendererConfig.defaultHeaders,
    // API 响应格式配置（业务状态码判断）
    responseFormat: jsonRendererConfig.responseFormat,
    // 统一鉴权：让 schema 内的 fetch/initApi/uiApi 等请求也能自动携带 token（令牌）
    requestInterceptor: (config: RendererRequestConfig) => {
      const next: RendererRequestConfig = { ...config, headers: { ...(config.headers || {}) } };

      if (jsonRendererConfig.withToken) {
        const token = localStg.get('token');
        if (token) {
          const headerName = jsonRendererConfig.tokenHeaderName || 'Authorization';
          const prefix = jsonRendererConfig.tokenPrefix || '';
          next.headers[headerName] = prefix ? `${prefix}${token}` : token;
        }
      }

      return next;
    },
    // 注册组件
    components: allComponents
  });

  app.use(plugin);
}

/**
 * 检查组件是否已注册
 * @param componentName - 组件名称
 * @returns 是否已注册
 */
export function isComponentRegistered(componentName: string): boolean {
  const allComponents = getAllComponents();
  return Object.prototype.hasOwnProperty.call(allComponents, componentName);
}

/**
 * 获取已注册组件的名称列表
 * @returns 组件名称数组
 */
export function getRegisteredComponentNames(): string[] {
  return Object.keys(getAllComponents());
}
