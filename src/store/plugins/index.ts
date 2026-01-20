import type { PiniaPluginContext } from 'pinia';

/**
 * Store ID 枚举
 * 用于标识 setup 语法的 store
 */
export enum SetupStoreId {
  App = 'app',
  Theme = 'theme',
  Auth = 'auth',
  Route = 'route',
  Tab = 'tab'
}

/**
 * 深拷贝对象
 * @param obj 源对象
 * @returns 拷贝后的对象
 */
function jsonClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Pinia 插件：重置 setup 语法的 store 状态
 * @param context Pinia 插件上下文
 */
export function resetSetupStore(context: PiniaPluginContext) {
  const setupSyntaxIds = Object.values(SetupStoreId) as string[];

  if (setupSyntaxIds.includes(context.store.$id)) {
    const { $state } = context.store;

    const defaultStore = jsonClone($state);

    context.store.$reset = () => {
      context.store.$patch(defaultStore);
    };
  }
}
