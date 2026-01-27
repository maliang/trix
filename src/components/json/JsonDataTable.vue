<script setup lang="ts">
/**
 * JsonDataTable - 适配 vue-json-schema 的数据表格组件
 *
 * 封装 NDataTable，支持通过 JSON schema 的 slots 配置来渲染自定义列内容
 * 将 slots 配置转换为 NDataTable 需要的 render 函数
 *
 * 注意：当 flexHeight 为 true 时，需要确保父容器有明确高度
 */
import { computed, useSlots } from 'vue';
import { NDataTable } from 'naive-ui';
import type {
  DataTableColumn,
  PaginationProps,
  DataTableCreateSummary,
  DataTableCreateRowClassName,
  DataTableCreateRowProps,
  ScrollbarProps,
  PopoverProps,
  SpinProps
} from 'naive-ui';
import type { VNodeChild } from 'vue';

// RenderExpandIcon 类型在 naive-ui 内部定义但未导出，这里手动定义
type RenderExpandIcon = (info: { expanded: boolean; rowData: any }) => VNodeChild;

// 定义 props
interface Column {
  key: string;
  title?: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  type?: 'selection' | 'expand';
  [key: string]: any;
}

type RowKey = string | number;

interface Props {
  /** 表格数据 */
  data?: any[];
  /** 列配置 */
  columns?: Column[];
  /** 是否加载中 */
  loading?: boolean;
  /** 行 key */
  rowKey?: (row: any) => RowKey;
  /** 选中的行 keys */
  checkedRowKeys?: RowKey[];
  /** 默认选中的行 keys */
  defaultCheckedRowKeys?: RowKey[];
  /** 展开的行 keys */
  expandedRowKeys?: RowKey[];
  /** 默认展开的行 keys */
  defaultExpandedRowKeys?: RowKey[];
  /** 是否默认展开所有行 */
  defaultExpandAll?: boolean;
  /** 横向滚动宽度 */
  scrollX?: number | string;
  /** 弹性高度，为 true 时表格高度自适应父容器 */
  flexHeight?: boolean;

  // ========== 分页相关 ==========
  /** 分页配置，false 表示不显示分页 */
  pagination?: false | PaginationProps;
  /** 当表格数据只有一页时是否显示分页 */
  paginateSinglePage?: boolean;
  /** 是否使用远程分页/排序/过滤 */
  remote?: boolean;
  /** 过滤时分页行为：'first' 跳转到第一页，'current' 保持当前页 */
  paginationBehaviorOnFilter?: 'first' | 'current';

  // ========== 尺寸/样式相关 ==========
  /** 表格尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否显示底部边框 */
  bottomBordered?: boolean;
  /** 是否显示斑马纹 */
  striped?: boolean;
  /** 是否单行显示（不换行） */
  singleLine?: boolean;
  /** 是否单列模式 */
  singleColumn?: boolean;
  /** 表格最小高度 */
  minHeight?: number | string;
  /** 表格最大高度 */
  maxHeight?: number | string;
  /** 表格布局方式 */
  tableLayout?: 'auto' | 'fixed';

  // ========== 虚拟滚动相关 ==========
  /** 是否启用虚拟滚动 */
  virtualScroll?: boolean;
  /** 是否启用横向虚拟滚动 */
  virtualScrollX?: boolean;
  /** 是否启用表头虚拟滚动 */
  virtualScrollHeader?: boolean;
  /** 表头高度（虚拟滚动时使用） */
  headerHeight?: number;
  /** 行高计算函数（虚拟滚动时使用） */
  heightForRow?: (rowData: any, index: number) => number;
  /** 最小行高（虚拟滚动时使用） */
  minRowHeight?: number;

  // ========== 树形/层级相关 ==========
  /** 是否级联选择子节点 */
  cascade?: boolean;
  /** 子节点字段名 */
  childrenKey?: string;
  /** 树形结构缩进 */
  indent?: number;
  /** 是否允许选中未加载的节点 */
  allowCheckingNotLoaded?: boolean;
  /** 展开行是否吸顶 */
  stickyExpandedRows?: boolean;

  // ========== 行配置相关 ==========
  /** 行类名 */
  rowClassName?: string | DataTableCreateRowClassName<any>;
  /** 行属性 */
  rowProps?: DataTableCreateRowProps<any>;

  // ========== 汇总行相关 ==========
  /** 汇总行配置 */
  summary?: DataTableCreateSummary<any>;
  /** 汇总行位置 */
  summaryPlacement?: 'top' | 'bottom';

  // ========== 渲染相关 ==========
  /** 单元格渲染函数 */
  renderCell?: (value: any, rowData: any, column: any) => VNodeChild;
  /** 展开图标渲染函数 */
  renderExpandIcon?: RenderExpandIcon;
  /** 加载动画配置 */
  spinProps?: SpinProps;
  /** 滚动条配置 */
  scrollbarProps?: ScrollbarProps;
  /** 过滤图标弹出框配置 */
  filterIconPopoverProps?: PopoverProps;

  // ========== 导出相关 ==========
  /** 获取 CSV 单元格内容 */
  getCsvCell?: (value: any, rowData: any, column: any) => string;
  /** 获取 CSV 表头内容 */
  getCsvHeader?: (column: any) => string;

  // ========== 异步加载相关 ==========
  /** 异步加载子节点数据的回调函数（用于树形数据） */
  onLoad?: (rowData: any) => Promise<void>;

  /** 其他 NDataTable 支持的 props */
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  loading: false,
  checkedRowKeys: undefined,
  defaultCheckedRowKeys: () => [],
  expandedRowKeys: undefined,
  defaultExpandedRowKeys: () => [],
  defaultExpandAll: false,
  flexHeight: false,
  // 分页相关
  pagination: false,
  paginateSinglePage: true,
  remote: false,
  paginationBehaviorOnFilter: 'current',
  // 尺寸/样式相关
  size: 'medium',
  bordered: undefined,
  bottomBordered: undefined,
  striped: false,
  singleLine: true,
  singleColumn: false,
  tableLayout: 'auto',
  // 虚拟滚动相关
  virtualScroll: false,
  virtualScrollX: false,
  virtualScrollHeader: false,
  headerHeight: 28,
  minRowHeight: 28,
  // 树形/层级相关
  cascade: true,
  childrenKey: 'children',
  indent: 16,
  allowCheckingNotLoaded: false,
  stickyExpandedRows: false,
  // 汇总行相关
  summaryPlacement: 'bottom',
  // 渲染相关
  spinProps: () => ({}),
});

type RowKeyType = string | number;

const emit = defineEmits<{
  'update:checked-row-keys': [keys: RowKeyType[]];
  'update:expanded-row-keys': [keys: RowKeyType[]];
  'update:page': [page: number];
  'update:page-size': [pageSize: number];
  'update:sorter': [sorter: any];
  'update:filters': [filters: any];
  'scroll': [e: Event];
}>();

// 获取 slots - vue-json-schema 传递的是函数形式的 slots
const slots = useSlots();

// 处理列配置，将 slots 转换为 render 函数
const processedColumns = computed<DataTableColumn[]>(() => {
  if (!props.columns || props.columns.length === 0) {
    return [];
  }

  return props.columns.map(col => {
    // 复制列配置，排除可能冲突的属性
    const { render: _render, type, ...restCol } = col;
    
    // 基础列配置
    const column: Record<string, any> = {
      ...restCol,
      key: col.key,
      title: col.title,
    };

    // 如果有 type（selection/expand），单独处理
    if (type) {
      column.type = type;
    }

    // 如果存在对应的 slot，使用 slot 渲染
    const slotName = col.key;
    const slotFn = slots[slotName];
    
    if (slotFn && typeof slotFn === 'function') {
      column.render = (row: any, rowIndex: number) => {
        // vue-json-schema 的 slot 函数接收 slotProps 参数
        // 我们传递 { row, rowIndex, $row, $index } 作为 slotProps
        try {
          const result = slotFn({ 
            row, 
            rowIndex, 
            $row: row, 
            $index: rowIndex 
          });
          return result;
        } catch (error) {
          console.error(`[JsonDataTable] Error rendering slot "${slotName}":`, error);
          return null;
        }
      };
    }

    return column as DataTableColumn;
  });
});

// 处理选中行变化
function handleCheckedRowKeysChange(keys: RowKeyType[]) {
  emit('update:checked-row-keys', keys);
}

// 处理展开行变化
function handleExpandedRowKeysChange(keys: RowKeyType[]) {
  emit('update:expanded-row-keys', keys);
}

// 处理页码变化
function handlePageChange(page: number) {
  emit('update:page', page);
}

// 处理每页条数变化
function handlePageSizeChange(pageSize: number) {
  emit('update:page-size', pageSize);
}

// 处理排序变化
function handleSorterChange(sorter: any) {
  emit('update:sorter', sorter);
}

// 处理过滤变化
function handleFiltersChange(filters: any) {
  emit('update:filters', filters);
}

// 处理滚动事件
function handleScroll(e: Event) {
  emit('scroll', e);
}
</script>

<template>
  <!-- 当 flexHeight 为 true 时，包裹一个 flex 容器确保高度正确传递 -->
  <div v-if="flexHeight" class="json-data-table-wrapper">
    <NDataTable
      :data="data"
      :columns="processedColumns"
      :loading="loading"
      :row-key="rowKey"
      :checked-row-keys="checkedRowKeys"
      :default-checked-row-keys="defaultCheckedRowKeys"
      :expanded-row-keys="expandedRowKeys"
      :default-expanded-row-keys="defaultExpandedRowKeys"
      :default-expand-all="defaultExpandAll"
      :scroll-x="scrollX"
      :flex-height="true"
      :pagination="pagination"
      :paginate-single-page="paginateSinglePage"
      :remote="remote"
      :pagination-behavior-on-filter="paginationBehaviorOnFilter"
      :size="size"
      :bordered="bordered"
      :bottom-bordered="bottomBordered"
      :striped="striped"
      :single-line="singleLine"
      :single-column="singleColumn"
      :min-height="minHeight"
      :max-height="maxHeight"
      :table-layout="tableLayout"
      :virtual-scroll="virtualScroll"
      :virtual-scroll-x="virtualScrollX"
      :virtual-scroll-header="virtualScrollHeader"
      :header-height="headerHeight"
      :height-for-row="heightForRow"
      :min-row-height="minRowHeight"
      :cascade="cascade"
      :children-key="childrenKey"
      :indent="indent"
      :allow-checking-not-loaded="allowCheckingNotLoaded"
      :sticky-expanded-rows="stickyExpandedRows"
      :row-class-name="rowClassName"
      :row-props="rowProps"
      :summary="summary"
      :summary-placement="summaryPlacement"
      :render-cell="renderCell"
      :render-expand-icon="renderExpandIcon"
      :spin-props="spinProps"
      :scrollbar-props="scrollbarProps"
      :filter-icon-popover-props="filterIconPopoverProps"
      :get-csv-cell="getCsvCell"
      :get-csv-header="getCsvHeader"
      :on-load="onLoad"
      v-bind="$attrs"
      @update:checked-row-keys="handleCheckedRowKeysChange"
      @update:expanded-row-keys="handleExpandedRowKeysChange"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
      @update:sorter="handleSorterChange"
      @update:filters="handleFiltersChange"
      @scroll="handleScroll"
    />
  </div>
  <NDataTable
    v-else
    :data="data"
    :columns="processedColumns"
    :loading="loading"
    :row-key="rowKey"
    :checked-row-keys="checkedRowKeys"
    :default-checked-row-keys="defaultCheckedRowKeys"
    :expanded-row-keys="expandedRowKeys"
    :default-expanded-row-keys="defaultExpandedRowKeys"
    :default-expand-all="defaultExpandAll"
    :scroll-x="scrollX"
    :pagination="pagination"
    :paginate-single-page="paginateSinglePage"
    :remote="remote"
    :pagination-behavior-on-filter="paginationBehaviorOnFilter"
    :size="size"
    :bordered="bordered"
    :bottom-bordered="bottomBordered"
    :striped="striped"
    :single-line="singleLine"
    :single-column="singleColumn"
    :min-height="minHeight"
    :max-height="maxHeight"
    :table-layout="tableLayout"
    :virtual-scroll="virtualScroll"
    :virtual-scroll-x="virtualScrollX"
    :virtual-scroll-header="virtualScrollHeader"
    :header-height="headerHeight"
    :height-for-row="heightForRow"
    :min-row-height="minRowHeight"
    :cascade="cascade"
    :children-key="childrenKey"
    :indent="indent"
    :allow-checking-not-loaded="allowCheckingNotLoaded"
    :sticky-expanded-rows="stickyExpandedRows"
    :row-class-name="rowClassName"
    :row-props="rowProps"
    :summary="summary"
    :summary-placement="summaryPlacement"
    :render-cell="renderCell"
    :render-expand-icon="renderExpandIcon"
    :spin-props="spinProps"
    :scrollbar-props="scrollbarProps"
    :filter-icon-popover-props="filterIconPopoverProps"
    :get-csv-cell="getCsvCell"
    :get-csv-header="getCsvHeader"
    :on-load="onLoad"
    v-bind="$attrs"
    @update:checked-row-keys="handleCheckedRowKeysChange"
    @update:expanded-row-keys="handleExpandedRowKeysChange"
    @update:page="handlePageChange"
    @update:page-size="handlePageSizeChange"
    @update:sorter="handleSorterChange"
    @update:filters="handleFiltersChange"
    @scroll="handleScroll"
  />
</template>

<style scoped>
.json-data-table-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.json-data-table-wrapper :deep(.n-data-table) {
  flex: 1 1 0%;
  min-height: 0;
}
</style>
