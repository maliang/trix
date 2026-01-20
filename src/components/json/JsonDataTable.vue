<script setup lang="ts">
/**
 * JsonDataTable - 适配 vue-json-schema 的数据表格组件
 * 
 * 封装 NDataTable，支持通过 JSON schema 的 slots 配置来渲染自定义列内容
 * 将 slots 配置转换为 NDataTable 需要的 render 函数
 */
import { computed, h, useSlots, type VNode } from 'vue';
import { NDataTable } from 'naive-ui';
import type { DataTableColumn } from 'naive-ui';

// 定义 props
interface Column {
  key: string;
  title?: string;
  width?: number | string;
  fixed?: 'left' | 'right';
  type?: 'selection' | 'expand';
  [key: string]: any;
}

interface Props {
  /** 表格数据 */
  data?: any[];
  /** 列配置 */
  columns?: Column[];
  /** 是否加载中 */
  loading?: boolean;
  /** 行 key */
  rowKey?: (row: any) => string | number;
  /** 选中的行 keys */
  checkedRowKeys?: (string | number)[];
  /** 展开的行 keys */
  expandedRowKeys?: (string | number)[];
  /** 是否默认展开所有行 */
  defaultExpandAll?: boolean;
  /** 横向滚动宽度 */
  scrollX?: number | string;
  /** 其他 NDataTable 支持的 props */
  [key: string]: any;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  loading: false,
  checkedRowKeys: () => [],
  expandedRowKeys: () => [],
  defaultExpandAll: false,
});

const emit = defineEmits<{
  'update:checked-row-keys': [keys: (string | number)[]];
  'update:expanded-row-keys': [keys: (string | number)[]];
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
function handleCheckedRowKeysChange(keys: (string | number)[]) {
  emit('update:checked-row-keys', keys);
}

// 处理展开行变化
function handleExpandedRowKeysChange(keys: (string | number)[]) {
  emit('update:expanded-row-keys', keys);
}
</script>

<template>
  <NDataTable
    :data="data"
    :columns="processedColumns"
    :loading="loading"
    :row-key="rowKey"
    :checked-row-keys="checkedRowKeys"
    :expanded-row-keys="expandedRowKeys"
    :default-expand-all="defaultExpandAll"
    :scroll-x="scrollX"
    v-bind="$attrs"
    @update:checked-row-keys="handleCheckedRowKeysChange"
    @update:expanded-row-keys="handleExpandedRowKeysChange"
  />
</template>
