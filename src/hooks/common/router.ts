import { useRouter } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import { router as globalRouter } from '@/router';

/**
 * 路由跳转 Hook
 * 封装常用的路由跳转方法
 * @param inSetup 是否在 setup 中使用
 */
export function useRouterPush(inSetup = true) {
  const router = inSetup ? useRouter() : globalRouter;
  const route = globalRouter.currentRoute;

  const routerPush = router.push;
  const routerBack = router.back;

  /**
   * 根据路由 key 跳转
   * @param key 路由名称
   * @param options 路由参数
   */
  async function routerPushByKey(key: string, options?: App.Global.RouterPushOptions) {
    const { query, params } = options || {};

    const routeLocation: RouteLocationRaw = {
      name: key
    };

    if (Object.keys(query || {}).length) {
      routeLocation.query = query;
    }

    if (Object.keys(params || {}).length) {
      routeLocation.params = params;
    }

    return routerPush(routeLocation);
  }

  /**
   * 根据路由 key 跳转，并携带 meta 中定义的 query 参数
   * @param key 路由名称
   */
  function routerPushByKeyWithMetaQuery(key: string) {
    const allRoutes = router.getRoutes();
    const meta = allRoutes.find(item => item.name === key)?.meta || null;

    const query: Record<string, string> = {};

    if (meta?.query) {
      (meta.query as Array<{ key: string; value: string }>).forEach(item => {
        query[item.key] = item.value;
      });
    }

    return routerPushByKey(key, { query });
  }

  /**
   * 跳转到首页
   */
  async function toHome() {
    return routerPushByKey('home');
  }

  /**
   * 跳转到登录页
   * @param redirectUrl 登录后重定向地址
   */
  async function toLogin(redirectUrl?: string) {
    const options: App.Global.RouterPushOptions = {};

    const redirect = redirectUrl || route.value.fullPath;

    options.query = {
      redirect
    };

    return routerPushByKey('login', options);
  }

  /**
   * 登录后重定向
   * @param needRedirect 是否需要重定向
   */
  async function redirectFromLogin(needRedirect = true) {
    const redirect = route.value.query?.redirect as string;

    if (needRedirect && redirect) {
      await routerPush(redirect);
    } else {
      await toHome();
    }
  }

  return {
    routerPush,
    routerBack,
    routerPushByKey,
    routerPushByKeyWithMetaQuery,
    toLogin,
    redirectFromLogin
  };
}
