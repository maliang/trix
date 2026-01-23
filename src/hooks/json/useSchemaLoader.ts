import { ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue';
import type { JsonNode } from 'vschema-ui';
import { fetchSchema } from '@/service/api';

export interface UseSchemaLoaderOptions {
  /** Schema 来源（静态字符串 / ref / getter）。 */
  source: MaybeRefOrGetter<string | null | undefined>;
  /**
   * 是否自动触发首次加载。
   * - 当 `watchSource: true` 时：作为 watch 的 `immediate` 选项。
   * - 当 `watchSource: false` 时：在初始化时主动调用一次 `load()`。
   */
  immediate?: boolean;
  /** 是否在 `source` 变化时自动重新加载。 */
  watchSource?: boolean;
  /**
   * 是否要求必须存在 source（用于提示“未配置 Schema 来源”）。
   * 允许传入 getter，便于在某些场景（例如 props.schema 直传）下动态禁用。
   */
  requireSource?: MaybeRefOrGetter<boolean>;
  /** source 缺失时的错误提示文案。 */
  missingSourceMessage?: MaybeRefOrGetter<string>;
  /** 最大重试次数。 */
  maxRetries?: number;
  /** 初始 loading 状态（用于避免首屏闪烁）。 */
  initialLoading?: boolean;
  /** 加载成功后可选的 schema 转换（例如注入全局状态）。 */
  transform?: (schema: JsonNode) => JsonNode;
  /** 回调：开始加载。 */
  onLoading?: () => void;
  /** 回调：加载成功。 */
  onLoaded?: (schema: JsonNode) => void;
  /** 回调：加载失败。 */
  onError?: (error: Error) => void;
}

export interface UseSchemaLoaderReturn {
  schema: Ref<JsonNode | null>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  /** HTTP 错误状态码 */
  errorStatus: Ref<number | null>;
  retryCount: Ref<number>;
  maxRetries: number;
  load: () => Promise<void>;
  retry: () => void;
  reset: () => void;
}

export function useSchemaLoader(options: UseSchemaLoaderOptions): UseSchemaLoaderReturn {
  const schema = ref<JsonNode | null>(null);
  const loading = ref(Boolean(options.initialLoading));
  const error = ref<string | null>(null);
  const errorStatus = ref<number | null>(null);
  const retryCount = ref(0);
  const maxRetries = options.maxRetries ?? 3;

  // last-call-wins（最后一次调用生效）：避免旧请求晚到时覆盖新请求结果。
  let requestId = 0;

  async function load() {
    const currentId = ++requestId;
    const source = toValue(options.source);
    const requireSource = Boolean(toValue(options.requireSource ?? false));

    if (!source) {
      if (requireSource) {
        error.value = toValue(options.missingSourceMessage ?? 'Schema 来源未配置');
      }
      schema.value = null;
      loading.value = false;
      errorStatus.value = null;
      return;
    }

    loading.value = true;
    error.value = null;
    errorStatus.value = null;
    options.onLoading?.();

    try {
      const raw = await fetchSchema(source);
      const finalSchema = options.transform ? options.transform(raw) : raw;

      if (currentId !== requestId) return;

      schema.value = finalSchema;
      retryCount.value = 0;
      options.onLoaded?.(finalSchema);
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));

      if (currentId !== requestId) return;

      error.value = err.message;
      // 提取 HTTP 状态码
      errorStatus.value = (err as any).status || null;
      schema.value = null;
      options.onError?.(err);
    } finally {
      if (currentId !== requestId) return;
      loading.value = false;
    }
  }

  function retry() {
    if (retryCount.value >= maxRetries) return;
    retryCount.value += 1;
    void load();
  }

  function reset() {
    requestId += 1; // 取消正在进行中的请求（逻辑取消）
    schema.value = null;
    loading.value = false;
    error.value = null;
    errorStatus.value = null;
    retryCount.value = 0;
  }

  if (options.watchSource) {
    watch(
      () => toValue(options.source),
      () => {
        // 交由 watch 自身的变更检测控制触发；immediate 时也需要执行一次 load。
        void load();
      },
      { immediate: options.immediate ?? false }
    );
  } else if (options.immediate) {
    void load();
  }

  return {
    schema,
    loading,
    error,
    errorStatus,
    retryCount,
    maxRetries,
    load,
    retry,
    reset
  };
}
