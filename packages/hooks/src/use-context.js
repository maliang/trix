import { inject, provide } from 'vue';
/**
 * 上下文 Hook，用于在组件树中共享状态
 *
 * @example
 *   ```ts
 *   // 有三个 Vue 文件: A.vue, B.vue, C.vue，A.vue 是 B.vue 和 C.vue 的父组件
 *
 *   // context.ts
 *   import { ref } from 'vue';
 *   import { useContext } from '@trix/hooks';
 *
 *   export const [provideDemoContext, useDemoContext] = useContext('demo', () => {
 *     const count = ref(0);
 *
 *     function increment() {
 *       count.value++;
 *     }
 *
 *     function decrement() {
 *       count.value--;
 *     }
 *
 *     return {
 *       count,
 *       increment,
 *       decrement
 *     };
 *   })
 *   ```
 *
 * @param contextName 上下文名称
 * @param composable 上下文函数
 */
export default function useContext(contextName, composable) {
    const key = Symbol(contextName);
    /**
     * 注入上下文值
     *
     * @param consumerName - 消费上下文的组件名称。如果提供，组件必须在上下文提供者内使用
     * @param defaultValue - 如果未提供上下文，则返回的默认值
     * @returns 上下文值
     */
    const useInject = (consumerName, defaultValue) => {
        const value = inject(key, defaultValue);
        if (consumerName && !value) {
            throw new Error(`\`${consumerName}\` must be used within \`${contextName}\``);
        }
        // @ts-expect-error - 如果值为 undefined 或 null，我们希望返回 null
        return value || null;
    };
    const useProvide = (...args) => {
        const value = composable(...args);
        provide(key, value);
        return value;
    };
    return [useProvide, useInject];
}
