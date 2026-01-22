<script setup lang="ts">
import { computed, resolveComponent } from 'vue';
import { NSpin } from 'naive-ui';
import type { JsonNode } from '@maliang47/vschema';
import { useSchemaLoader, useSchemaMethods } from '@/hooks';

defineOptions({
  name: 'HeaderRight'
});

interface Props {
  /** Schema 来源 URL */
  schemaSource?: string;
  /** 默认 Schema */
  defaultSchema?: JsonNode;
}

const props = withDefaults(defineProps<Props>(), {
  schemaSource: '',
  defaultSchema: undefined
});

// 使用 resolveComponent 获取全局注册的 VSchema 组件
const VSchemaComponent = resolveComponent('VSchema');

// 获取 Schema 内置方法
const { schemaMethods } = useSchemaMethods();

const { schema, loading } = useSchemaLoader({
  source: computed(() => props.schemaSource || null),
  watchSource: true,
  immediate: true,
  requireSource: false,
  initialLoading: false,
  onError: (err) => {
    console.error('[HeaderRight] 加载 Schema 失败:', err);
  }
});

/** 默认 Header 右侧配置 */
const defaultHeaderSchema: JsonNode = {
  com: 'div',
  props: { class: 'h-full flex-y-center gap-4px' },
  children: [
    { com: 'GlobalSearch', props: {} },
    { com: 'FullScreen', props: {} },
    { com: 'LangSwitch', props: {} },
    { com: 'ThemeSchemaSwitch', props: {} },
    { com: 'ThemeButton', props: {} },
    { com: 'UserAvatar', props: {} }
  ]
};

/** 最终使用的 Schema */
const finalSchema = computed<JsonNode | null>(() => {
  if (schema.value) {
    return schema.value;
  }
  if (props.defaultSchema) {
    return props.defaultSchema;
  }
  return defaultHeaderSchema;
});
</script>

<template>
  <div class="header-right h-full flex-y-center">
    <!-- 加载状态 -->
    <NSpin v-if="loading" size="small" />
    
    <!-- 渲染 Schema -->
    <component v-else-if="finalSchema" :is="VSchemaComponent" :schema="finalSchema" :methods="schemaMethods" />
  </div>
</template>

<style scoped>
.header-right {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
