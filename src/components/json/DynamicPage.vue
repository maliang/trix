<script setup lang="ts">
/**
 * 动态页面组件
 * 根据路由配置的 schemaSource 加载 JSON Schema 并使用 VSchema 渲染页面
 * 当加载失败时，在页面内部直接显示对应的错误页面 Schema
 * 
 * 提供以下内置方法供 Schema 调用（需要加 $methods. 前缀）：
 * - $methods.$nav.push(path) - 跳转页面（当前标签）
 * - $methods.$nav.replace(path) - 替换当前页面
 * - $methods.$nav.back() - 返回上一页
 * - $methods.$tab.close(tabId?) - 关闭标签（默认当前标签）
 * - $methods.$tab.open(path, title?) - 新建标签页
 * - $methods.$tab.openIframe(url, title) - 新建 iframe 标签页
 * - $methods.$tab.fix(tabId?) - 固定标签页
 * - $methods.$window.open(url) - 打开新浏览器窗口
 * - $methods.$message.success(content) - 成功消息
 * - $methods.$message.error(content) - 错误消息
 * - $methods.$dialog.warning(options) - 警告对话框
 * - $methods.$notification.success(options) - 成功通知
 * - $methods.$loadingBar.start() - 开始加载条
 */
import { computed, resolveComponent, shallowRef, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { NSpin, NResult, NButton, NSpace } from 'naive-ui';
import type { JsonNode } from 'vschema-ui';
import { useSchemaLoader, useSchemaMethods } from '@/hooks';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useAuthStore } from '@/store/modules/auth';
import { jsonRendererConfig } from '@/config/json-renderer';
import { getBaseUrl } from '@/store/modules/theme/shared';
const authStore = useAuthStore();

// 使用 resolveComponent 获取全局注册的 VSchema 组件
const VSchema = resolveComponent('VSchema');

// 获取 Schema 内置方法
const { schemaMethods } = useSchemaMethods();

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
const router = useRouter();
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
  errorStatus,
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
 * HTTP 状态码到内置路由名称的映射
 */
const errorRouteNameMap: Record<number, string> = {
  403: 'forbidden',
  404: 'not-found',
  500: 'server-error'
};

/**
 * 从内置路由获取错误页面的 schemaSource
 * 这样当后端更新内置路由配置后，会自动使用后端的地址
 */
function getErrorSchemaSource(status: number): string | null {
  const routeName = errorRouteNameMap[status] || errorRouteNameMap[500];
  if (!routeName) return null;
  
  // 从 router 中查找对应的内置路由
  const routes = router.getRoutes();
  const targetRoute = routes.find(r => r.name === routeName);
  
  if (targetRoute?.meta?.schemaSource) {
    return targetRoute.meta.schemaSource as string;
  }
  
  return null;
}

/**
 * 错误页面 Schema
 */
const errorSchema = shallowRef<JsonNode | null>(null);
const errorSchemaLoading = ref(false);

/**
 * 加载错误页面 Schema
 */
async function loadErrorSchema(status: number) {
  // 从内置路由获取 schemaSource
  const source = getErrorSchemaSource(status);
  if (!source) {
    errorSchema.value = null;
    return;
  }

  errorSchemaLoading.value = true;
  try {
    const baseURL = jsonRendererConfig.baseURL || '';
    // 判断是否为静态文件
    const isStatic = source.endsWith('.json') || source.startsWith('/mock/');
    // 静态文件需要添加 VITE_BASE_URL 前缀
    const url = isStatic ? getBaseUrl(source) : `${baseURL}${source}`;
    
    const response = await fetch(url);
    if (response.ok) {
      let schema = await response.json();
      
      // 如果是 API 响应，提取 data 字段
      if (!isStatic && schema.code !== undefined && schema.data) {
        schema = schema.data;
      }
      
      // 注入错误信息到 schema
      errorSchema.value = enrichSchema({
        ...schema,
        data: {
          ...schema.data,
          $error: {
            status,
            message: error.value
          }
        }
      });
    } else {
      errorSchema.value = null;
    }
  } catch (e) {
    // 加载错误 Schema 失败，使用默认显示
    console.warn('[DynamicPage] 加载错误页面 Schema 失败:', e);
    errorSchema.value = null;
  } finally {
    errorSchemaLoading.value = false;
  }
}

// 监听错误状态，加载对应的错误页面 Schema
watch(
  [error, errorStatus],
  ([err, status]) => {
    if (err && status && status >= 400) {
      loadErrorSchema(status);
    } else {
      errorSchema.value = null;
    }
  },
  { immediate: true }
);

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
  <div class="dynamic-page h-full flex flex-col">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container h-full flex items-center justify-center">
      <NSpin size="large">
        <template #description>
          <span class="text-gray-500">加载中...</span>
        </template>
      </NSpin>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container h-full">
      <!-- 加载错误页面 Schema 中 -->
      <div v-if="errorSchemaLoading" class="h-full flex items-center justify-center">
        <NSpin size="large" />
      </div>
      <!-- 使用自定义错误页面 Schema -->
      <VSchema v-else-if="errorSchema" :schema="errorSchema" :methods="schemaMethods" class="flex-1-hidden" />
      <!-- 默认错误显示（当错误 Schema 加载失败时） -->
      <div v-else class="h-full flex items-center justify-center">
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
    </div>

    <!-- 渲染 Schema -->
    <VSchema v-else-if="finalSchema" :schema="finalSchema" :methods="schemaMethods" class="flex-1-hidden" />

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
