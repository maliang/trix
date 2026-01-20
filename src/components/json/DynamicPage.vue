<script setup lang="ts">
/**
 * 动态页面组件
 * 根据路由配置的 schemaSource 加载 JSON Schema 并使用 VSchema 渲染页面
 */
import { computed, resolveComponent, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { NSpin, NResult, NButton, NSpace } from 'naive-ui';
import type { JsonNode } from '@maliang47/vschema';
import { useSchemaLoader } from '@/hooks';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useAuthStore } from '@/store/modules/auth';
const authStore = useAuthStore();

// 使用 resolveComponent 获取全局注册的 VSchema 组件
const VSchema = resolveComponent('VSchema');

defineOptions({
  name: 'DynamicPage'
});

// Props 定义
interface Props {
  /** 直接传入的 schema，优先级高于路由配置 */
  schema?: JsonNode;
  /** 直接传入的 schema 来源，优先级高于路由配置 */
  schemaSource?: string;
}

const props = defineProps<Props>();

// Emits 定义
const emit = defineEmits<{
  /** Schema 加载成功 */
  loaded: [schema: JsonNode];
  /** Schema 加载失败 */
  error: [error: Error];
  /** 开始加载 */
  loading: [];
}>();

// 路由和 Store
const route = useRoute();
const appStore = useAppStore();
const themeStore = useThemeStore();

/**
 * 计算 schema 来源
 * 优先使用 props 传入的值，其次使用路由配置
 */
const computedSchemaSource = computed(() => {
  return props.schemaSource || (route.meta.schemaSource as string | undefined);
});

const shouldLoadFromSource = computed(() => !props.schema);
const loaderSource = computed(() => (shouldLoadFromSource.value ? computedSchemaSource.value : null));

const {
  schema: loadedSchema,
  loading,
  error,
  retryCount,
  maxRetries,
  retry
} = useSchemaLoader({
  source: loaderSource,
  watchSource: true,
  immediate: true,
  requireSource: shouldLoadFromSource,
  missingSourceMessage: 'Schema 来源未配置',
  maxRetries: 3,
  initialLoading: !props.schema,
  onLoading: () => emit('loading'),
  onLoaded: (schema) => emit('loaded', schema),
  onError: (err) => {
    console.error('[DynamicPage] Schema 加载失败:', err);
    emit('error', err);
  }
});

/**
 * 计算最终使用的 schema
 * 使用 shallowRef 缓存，只在 loadedSchema 真正变化时才更新
 * 避免每次渲染都创建新对象导致 VSchema 重新渲染
 */
const finalSchema = shallowRef<JsonNode | null>(null);

// 监听 schema 变化，只在真正变化时更新 finalSchema
watch(
  [() => props.schema, loadedSchema],
  ([propsSchema, loaded]) => {
    if (propsSchema) {
      finalSchema.value = enrichSchema(propsSchema);
    } else if (loaded) {
      finalSchema.value = enrichSchema(loaded);
    } else {
      finalSchema.value = null;
    }
  },
  { immediate: true }
);

/**
 * 注入全局状态到 schema
 * @param schema 原始 schema
 * @returns 注入全局状态后的 schema
 */
function enrichSchema(schema: JsonNode): JsonNode {
  return {
    ...schema,
    data: {
      ...schema.data,
      // 注入全局状态
      $app: {
        locale: appStore.locale,
        isMobile: appStore.isMobile
      },
      $theme: {
        darkMode: themeStore.darkMode,
        themeColor: themeStore.themeColor,
        layoutMode: themeStore.layout.mode
      },
      // TODO: 集成认证 Store 后添加用户和权限信息
      $user: authStore.userInfo,
      $permissions: authStore.permissions,
    }
  };
}

/**
 * 返回上一页
 */
function goBack() {
  window.history.back();
}
</script>

<template>
  <div class="dynamic-page h-full">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container h-full flex items-center justify-center">
      <NSpin size="large">
        <template #description>
          <span class="text-gray-500">加载中...</span>
        </template>
      </NSpin>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container h-full flex items-center justify-center">
      <NResult status="error" :title="error" :description="retryCount >= maxRetries ? '已达到最大重试次数' : ''">
        <template #footer>
          <NSpace>
            <NButton @click="goBack">返回</NButton>
            <NButton
              v-if="retryCount < maxRetries"
              type="primary"
              @click="retry"
            >
              重试 ({{ retryCount }}/{{ maxRetries }})
            </NButton>
          </NSpace>
        </template>
      </NResult>
    </div>

    <!-- 渲染 Schema -->
    <VSchema v-else-if="finalSchema" :schema="finalSchema" />

    <!-- 无 Schema -->
    <div v-else class="empty-container h-full flex items-center justify-center">
      <NResult status="info" title="无内容" description="未配置页面 Schema">
        <template #footer>
          <NButton @click="goBack">返回</NButton>
        </template>
      </NResult>
    </div>
  </div>
</template>

<style scoped>
.dynamic-page {
  min-height: 200px;
}

.loading-container,
.error-container,
.empty-container {
  min-height: 300px;
}
</style>
