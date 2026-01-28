import { computed, reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import { useLoading } from '@trix/hooks';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/store/plugins';
import { get, post } from '@/service/request';
import { clearAuthStorage, getToken } from './shared';
import { router } from '@/router';

/**
 * 用户信息接口
 */
export interface UserInfo {
  /** 用户 ID */
  userId: string;
  /** 用户名 */
  userName: string;
  /** 权限列表（包含页面权限和按钮权限） */
  permissions: string[];
}

/**
 * 登录 Token 接口
 */
export interface LoginToken {
  /** 访问 Token */
  token: string;
  /** 刷新 Token */
  refreshToken: string;
}

/**
 * 认证 Store
 * 管理用户认证状态、登录、登出等功能
 */
export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  /** Token */
  const token = ref(getToken());

  /** 用户信息 */
  const userInfo: UserInfo = reactive({
    userId: '',
    userName: '',
    permissions: []
  });

  /** 是否已登录 */
  const isLogin = computed(() => Boolean(token.value));

  /** 用户权限列表 */
  const permissions = computed(() => userInfo.permissions);

  /**
   * 重置 Store
   */
  async function resetStore() {
    recordUserId();
    clearAuthStorage();

    // 重置用户信息
    userInfo.userId = '';
    userInfo.userName = '';
    userInfo.permissions = [];
    token.value = '';

    // 如果当前路由需要认证，则跳转到登录页
    const currentRoute = router.currentRoute.value;
    if (currentRoute.meta.requiresAuth !== false) {
      await router.push('/login');
    }
  }

  /**
   * 记录上一次登录的用户 ID
   * 用于下次登录时比较，判断是否需要清除标签页
   */
  function recordUserId() {
    if (!userInfo.userId) {
      return;
    }
    localStg.set('userInfo', {
      userId: userInfo.userId,
      userName: userInfo.userName,
      permissions: userInfo.permissions
    });
  }

  /**
   * 检查是否需要清除标签页
   * 如果当前用户与上次登录用户不同，则清除标签页
   * @returns 是否清除了标签页
   */
  function checkTabClear(): boolean {
    if (!userInfo.userId) {
      return false;
    }

    const lastUserInfo = localStg.get('userInfo');

    if (!lastUserInfo || lastUserInfo.userId !== userInfo.userId) {
      return true;
    }

    return false;
  }

  /**
   * 通过 Token 登录
   * @param loginToken 登录 Token
   * @returns 是否登录成功
   */
  async function loginByToken(loginToken: LoginToken): Promise<boolean> {
    // 存储 Token
    localStg.set('token', loginToken.token);
    localStg.set('refreshToken', loginToken.refreshToken);

    // 获取用户信息
    const pass = await getUserInfo();

    if (pass) {
      token.value = loginToken.token;
      return true;
    }

    return false;
  }

  /**
   * 获取用户信息
   * @returns 是否获取成功
   */
  async function getUserInfo(): Promise<boolean> {
    // 如果是模拟模式，使用模拟数据
    if (import.meta.env.VITE_AUTH_MOCK === 'Y') {
      const mockUserInfo: UserInfo = {
        userId: '1',
        userName: 'Admin',
        permissions: ['admin', 'user:add', 'user:edit', 'user:delete', 'btn:add', 'btn:edit', 'btn:delete']
      };
      Object.assign(userInfo, mockUserInfo);
      return true;
    }

    // 正式模式：调用 API 获取用户信息
    const userInfoApi = import.meta.env.VITE_USER_INFO_API || '/user';
    const { data, error } = await get<{
      id: number;
      username: string;
      nickname: string;
      permissions: string[];
    }>(userInfoApi, {}, { showErrorMessage: false });

    if (error || !data) {
      console.error('获取用户信息失败:', error);
      return false;
    }

    Object.assign(userInfo, {
      userId: String(data.id),
      userName: data.nickname || data.username,
      permissions: data.permissions || []
    });

    return true;
  }

  /**
   * 初始化用户信息
   * 在应用启动时调用，检查是否有有效的 Token
   */
  async function initUserInfo() {
    const hasToken = getToken();

    if (hasToken) {
      const pass = await getUserInfo();

      if (!pass) {
        resetStore();
      }
    }
  }

  /**
   * 登录
   * @param userName 用户名
   * @param password 密码
   * @param redirect 是否重定向（默认 true）
   */
  async function login(userName: string, password: string, redirect = true) {
    startLoading();

    try {
      let loginToken: LoginToken;

      // 如果是模拟模式，使用模拟登录
      if (import.meta.env.VITE_AUTH_MOCK === 'Y') {
        // 模拟登录验证：用户名 admin，密码 123456
        if (userName !== 'admin' || password !== '123456') {
          window.$message?.error('用户名或密码错误');
          return;
        }
        loginToken = {
          token: 'mock-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now()
        };
      } else {
        // 正式模式：调用 API 登录
        const loginApi = import.meta.env.VITE_LOGIN_API || '/login';
        const { data, error } = await post<{
          token: string;
        }>(loginApi, { username: userName, password });

        if (error || !data) {
          return;
        }

        loginToken = {
          token: data.token,
          refreshToken: data.token
        };
      }

      const pass = await loginByToken(loginToken);

      if (!pass) {
        window.$message?.error('获取用户信息失败，请重试');
        return;
      }

      // 检查是否需要清除标签页（用户切换时）
      checkTabClear();

      // 登录成功后初始化路由
      const { useRouteStore } = await import('@/store/modules/route');
      const routeStore = useRouteStore();
      await routeStore.initAuthRoute();

      if (redirect) {
        // 重定向逻辑：
        // 1. 如果有 redirect 查询参数，跳转到该页面
        // 2. 否则根据 isDefaultAfterLogin 配置决定跳转目标
        const currentRoute = router.currentRoute.value;
        const queryRedirect = currentRoute.query.redirect as string;
        const defaultPath = routeStore.getDefaultRedirectPath();
        const redirectPath = queryRedirect || defaultPath;
        await router.push(redirectPath);
      }

      // 显示登录成功提示
      window.$notification?.success({
        title: '登录成功',
        content: `欢迎回来，${userInfo.userName}`,
        duration: 4500
      });
    } catch (error) {
      console.error('登录失败:', error);
      resetStore();
    } finally {
      endLoading();
    }
  }

  /**
   * 登出
   */
  async function logout() {
    await resetStore();
    await router.push('/login');
  }

  return {
    token,
    userInfo,
    isLogin,
    permissions,
    loginLoading,
    resetStore,
    login,
    logout,
    initUserInfo,
    getUserInfo,
    loginByToken
  };
});
