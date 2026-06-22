import { ref, toValue, watch } from 'vue';
import { fetchSchema } from '@/service/api';
import { getHttpErrorStatus } from '@/utils/common';
export function useSchemaLoader(options) {
    const schema = ref(null);
    const loading = ref(Boolean(options.initialLoading));
    const error = ref(null);
    const errorStatus = ref(null);
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
            if (currentId !== requestId)
                return;
            schema.value = finalSchema;
            retryCount.value = 0;
            options.onLoaded?.(finalSchema);
        }
        catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            if (currentId !== requestId)
                return;
            error.value = err.message;
            errorStatus.value = getHttpErrorStatus(err) || null;
            schema.value = null;
            options.onError?.(err);
        }
        finally {
            if (currentId !== requestId)
                return;
            loading.value = false;
        }
    }
    function retry() {
        if (retryCount.value >= maxRetries)
            return;
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
        watch(() => toValue(options.source), () => {
            // 交由 watch 自身的变更检测控制触发；immediate 时也需要执行一次 load。
            void load();
        }, { immediate: options.immediate ?? false });
    }
    else if (options.immediate) {
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
