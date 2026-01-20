<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import * as echarts from 'echarts';
import type { EChartsOption, ECharts } from 'echarts';
import { useElementSize } from '@vueuse/core';

defineOptions({
  name: 'VueECharts'
});

interface Props {
  /** ECharts 配置项 */
  option: EChartsOption;
  /** 主题，可选 'light' | 'dark' 或自定义主题名 */
  theme?: string | object;
  /** 是否自动调整大小 */
  autoresize?: boolean;
  /** 加载状态 */
  loading?: boolean;
  /** 加载配置 */
  loadingOptions?: object;
  /** 初始化配置 */
  initOptions?: {
    devicePixelRatio?: number;
    renderer?: 'canvas' | 'svg';
    width?: number | string;
    height?: number | string;
    locale?: string;
  };
  /** 更新配置时是否不合并 */
  notMerge?: boolean;
  /** 更新配置时是否不触发事件 */
  lazyUpdate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  theme: undefined,
  autoresize: true,
  loading: false,
  loadingOptions: () => ({}),
  initOptions: () => ({}),
  notMerge: false,
  lazyUpdate: false
});

const emit = defineEmits<{
  (e: 'init', chart: ECharts): void;
  (e: 'click', params: unknown): void;
  (e: 'dblclick', params: unknown): void;
  (e: 'mousedown', params: unknown): void;
  (e: 'mousemove', params: unknown): void;
  (e: 'mouseup', params: unknown): void;
  (e: 'mouseover', params: unknown): void;
  (e: 'mouseout', params: unknown): void;
  (e: 'legendselectchanged', params: unknown): void;
  (e: 'legendselected', params: unknown): void;
  (e: 'legendunselected', params: unknown): void;
  (e: 'datazoom', params: unknown): void;
  (e: 'datarangeselected', params: unknown): void;
  (e: 'brushselected', params: unknown): void;
}>();

const chartRef = ref<HTMLDivElement>();
const chart = shallowRef<ECharts>();

// 使用 vueuse 监听容器大小变化
const { width, height } = useElementSize(chartRef);

// 计算容器样式
const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
  minHeight: '200px'
}));

// 初始化图表
function initChart() {
  if (!chartRef.value) return;

  // 销毁已存在的实例
  if (chart.value) {
    chart.value.dispose();
  }

  // 创建新实例
  chart.value = echarts.init(chartRef.value, props.theme, props.initOptions);

  // 设置配置
  if (props.option) {
    chart.value.setOption(props.option, props.notMerge, props.lazyUpdate);
  }

  // 绑定事件
  bindEvents();

  // 触发初始化事件
  emit('init', chart.value);
}

// 绑定事件
function bindEvents() {
  if (!chart.value) return;

  const bindEvent = (eventName: string) => {
    chart.value?.on(eventName, (params: unknown) => {
      emit(eventName as keyof typeof emit, params);
    });
  };

  // 绑定常用事件
  const events = [
    'click',
    'dblclick',
    'mousedown',
    'mousemove',
    'mouseup',
    'mouseover',
    'mouseout',
    'legendselectchanged',
    'legendselected',
    'legendunselected',
    'datazoom',
    'datarangeselected',
    'brushselected'
  ];

  events.forEach(bindEvent);
}

// 监听 option 变化
watch(
  () => props.option,
  newOption => {
    if (chart.value && newOption) {
      chart.value.setOption(newOption, props.notMerge, props.lazyUpdate);
    }
  },
  { deep: true }
);

// 监听 loading 状态
watch(
  () => props.loading,
  loading => {
    if (!chart.value) return;
    if (loading) {
      chart.value.showLoading('default', props.loadingOptions);
    } else {
      chart.value.hideLoading();
    }
  }
);

// 监听主题变化（需要重新初始化）
watch(
  () => props.theme,
  () => {
    initChart();
  }
);

// 自动调整大小
watch(
  [width, height],
  () => {
    if (props.autoresize && chart.value) {
      chart.value.resize();
    }
  }
);

// 暴露方法供外部调用
defineExpose({
  /** 获取 ECharts 实例 */
  getChart: () => chart.value,
  /** 调整大小 */
  resize: () => chart.value?.resize(),
  /** 清空图表 */
  clear: () => chart.value?.clear(),
  /** 销毁图表 */
  dispose: () => chart.value?.dispose(),
  /** 设置配置 */
  setOption: (option: EChartsOption, notMerge?: boolean, lazyUpdate?: boolean) => {
    chart.value?.setOption(option, notMerge, lazyUpdate);
  },
  /** 获取图片 DataURL */
  getDataURL: (opts?: Parameters<ECharts['getDataURL']>[0]) => {
    return chart.value?.getDataURL(opts);
  },
  /** 触发图表行为 */
  dispatchAction: (payload: Parameters<ECharts['dispatchAction']>[0], opt?: Parameters<ECharts['dispatchAction']>[1]) => {
    chart.value?.dispatchAction(payload, opt);
  }
});

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  if (chart.value) {
    chart.value.dispose();
    chart.value = undefined;
  }
});
</script>

<template>
  <div ref="chartRef" :style="containerStyle" />
</template>

<style scoped></style>
