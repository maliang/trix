<script setup lang="ts">
/**
 * FlowEditor - 流程图编辑器组件
 *
 * 基于 Vue Flow 封装，支持：
 * - 通过 JSON 配置渲染流程图
 * - 使用 Vue 组件作为自定义节点
 * - 节点拖拽、连线、缩放等功能
 * - 小地图、控制面板等扩展
 */
import { ref, computed, watch, markRaw } from 'vue';
import { VueFlow, MarkerType } from '@vue-flow/core';
import { Background, BackgroundVariant } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import type { Node, Edge, Connection, NodeMouseEvent, EdgeMouseEvent } from '@vue-flow/core';
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

// 自定义节点组件
import TaskNode from './nodes/TaskNode.vue';
import ApprovalNode from './nodes/ApprovalNode.vue';

// 节点类型映射（使用 markRaw 避免响应式警告）
const nodeTypes = {
  task: markRaw(TaskNode),
  approval: markRaw(ApprovalNode)
};

interface Props {
  /** 画布宽度 */
  width?: number | string;
  /** 画布高度 */
  height?: number | string;
  /** 节点数据 */
  nodes?: Node[];
  /** 边数据 */
  edges?: Edge[];
  /** 是否只读 */
  readonly?: boolean;
  /** 是否显示背景 */
  showBackground?: boolean;
  /** 背景类型 */
  backgroundVariant?: 'dots' | 'lines';
  /** 是否显示控制面板 */
  showControls?: boolean;
  /** 是否显示小地图 */
  showMiniMap?: boolean;
  /** 默认边类型 */
  defaultEdgeType?: 'default' | 'straight' | 'step' | 'smoothstep' | 'bezier';
  /** 是否可连接 */
  connectable?: boolean;
  /** 是否可缩放 */
  zoomable?: boolean;
  /** 是否可平移 */
  pannable?: boolean;
  /** 最小缩放 */
  minZoom?: number;
  /** 最大缩放 */
  maxZoom?: number;
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: 500,
  nodes: () => [],
  edges: () => [],
  readonly: false,
  showBackground: true,
  backgroundVariant: 'dots',
  showControls: true,
  showMiniMap: false,
  defaultEdgeType: 'smoothstep',
  connectable: true,
  zoomable: true,
  pannable: true,
  minZoom: 0.5,
  maxZoom: 2
});

const emit = defineEmits<{
  'update:nodes': [nodes: Node[]];
  'update:edges': [edges: Edge[]];
  'node-click': [node: Node];
  'node-double-click': [node: Node];
  'edge-click': [edge: Edge];
  'pane-click': [];
  connect: [connection: Connection];
  ready: [];
}>();

// 内部节点和边状态
const flowNodes = ref<Node[]>([...props.nodes]);
const flowEdges = ref<Edge[]>([...props.edges]);

// 容器样式
const containerStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}));

// 默认边选项
const defaultEdgeOptions = computed(() => ({
  type: props.defaultEdgeType,
  markerEnd: MarkerType.ArrowClosed,
  animated: false
}));

// 背景变体
const bgVariant = computed(() => {
  return props.backgroundVariant === 'lines' ? BackgroundVariant.Lines : BackgroundVariant.Dots;
});

// 事件处理
function onNodeClick(event: NodeMouseEvent) {
  emit('node-click', event.node);
}

function onNodeDoubleClick(event: NodeMouseEvent) {
  emit('node-double-click', event.node);
}

function onEdgeClick(event: EdgeMouseEvent) {
  emit('edge-click', event.edge);
}

function onPaneClick() {
  emit('pane-click');
}

function onConnect(connection: Connection) {
  emit('connect', connection);
  // 自动添加边
  if (!props.readonly && connection.source && connection.target) {
    const newEdge: Edge = {
      id: `e${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle || undefined,
      targetHandle: connection.targetHandle || undefined,
      type: props.defaultEdgeType,
      markerEnd: MarkerType.ArrowClosed
    };
    flowEdges.value = [...flowEdges.value, newEdge];
  }
}

function onNodesChange() {
  emit('update:nodes', flowNodes.value);
}

function onEdgesChange() {
  emit('update:edges', flowEdges.value);
}

// 监听 props 变化
watch(() => props.nodes, (newNodes) => {
  if (newNodes) {
    flowNodes.value = [...newNodes];
  }
}, { deep: true, immediate: true });

watch(() => props.edges, (newEdges) => {
  if (newEdges) {
    flowEdges.value = [...newEdges];
  }
}, { deep: true, immediate: true });

// 暴露方法
defineExpose({
  /** 获取所有节点 */
  getNodes: () => flowNodes.value,
  /** 获取所有边 */
  getEdges: () => flowEdges.value,
  /** 设置节点 */
  setNodes: (nodes: Node[]) => { flowNodes.value = nodes; },
  /** 设置边 */
  setEdges: (edges: Edge[]) => { flowEdges.value = edges; },
  /** 添加节点 */
  addNodes: (nodes: Node[]) => { flowNodes.value = [...flowNodes.value, ...nodes]; },
  /** 添加边 */
  addEdges: (edges: Edge[]) => { flowEdges.value = [...flowEdges.value, ...edges]; }
});
</script>

<template>
  <div class="flow-editor" :style="containerStyle">
    <VueFlow
      v-model:nodes="flowNodes"
      v-model:edges="flowEdges"
      :node-types="(nodeTypes as any)"
      :default-edge-options="defaultEdgeOptions"
      :nodes-connectable="connectable && !readonly"
      :nodes-draggable="!readonly"
      :elements-selectable="!readonly"
      :zoom-on-scroll="zoomable"
      :pan-on-scroll="pannable"
      :pan-on-drag="pannable"
      :min-zoom="minZoom"
      :max-zoom="maxZoom"
      :fit-view-on-init="true"
      @node-click="onNodeClick"
      @node-double-click="onNodeDoubleClick"
      @edge-click="onEdgeClick"
      @pane-click="onPaneClick"
      @connect="onConnect"
      @nodes-change="onNodesChange"
      @edges-change="onEdgesChange"
    >
      <!-- 背景 -->
      <Background v-if="showBackground" :variant="bgVariant" />
      
      <!-- 控制面板 -->
      <Controls v-if="showControls" :show-interactive="!readonly" />
      
      <!-- 小地图 -->
      <MiniMap v-if="showMiniMap" />
    </VueFlow>
  </div>
</template>

<style scoped>
.flow-editor {
  width: 100%;
  height: 100%;
  border: 1px solid var(--n-border-color, #e0e0e0);
  border-radius: 4px;
  overflow: hidden;
}

/* Vue Flow 样式覆盖 */
:deep(.vue-flow__node) {
  border-radius: 8px;
}

:deep(.vue-flow__edge-path) {
  stroke-width: 2;
}

:deep(.vue-flow__controls) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.vue-flow__minimap) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
