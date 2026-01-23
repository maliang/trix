<script setup lang="ts">
/**
 * 登录页面
 * 使用 JSON Schema 布局，通过 script 动作调用外部方法
 */
import { computed, onMounted } from 'vue';
import { NSpin } from 'naive-ui';
import type { JsonNode } from 'vschema-ui';
import { useAuthStore } from '@/store/modules/auth';
import { useThemeStore } from '@/store/modules/theme';
import { setRouterGuardOptions } from '@/router/guard';
import { useSchemaLoader } from '@/hooks';

defineOptions({
  name: 'LoginPage'
});

const authStore = useAuthStore();
const themeStore = useThemeStore();

// 登录页面加载时获取远程主题配置
onMounted(async () => {
  const loaded = await themeStore.loadRemoteThemeConfig();
  // 如果加载成功，同步更新路由守卫的 appTitle
  if (loaded) {
    setRouterGuardOptions({ appTitle: themeStore.appTitle });
  }
});

const { schema: loginSchema, loading } = useSchemaLoader({
  source: computed(() => import.meta.env.VITE_LOGIN_SCHEMA_URL || '/mock/schema/login.json'),
  watchSource: false,
  immediate: true,
  requireSource: true,
  missingSourceMessage: '登录页 Schema 来源未配置',
  initialLoading: true,
  onError: (err) => {
    console.error('加载登录页 Schema 失败:', err);
  }
});

// 外部注入的方法，可在 JSON Schema 的 script 动作中通过 $methods 访问
const externalMethods = {
  login: async (username: string, password: string) => {
    await authStore.login(username, password);
  }
};
</script>

<template>
  <div class="login-page h-full">
    <!-- 加载状态 -->
    <div v-if="loading" class="h-full flex items-center justify-center min-h-screen">
      <NSpin size="large">
        <template #description>
          <span class="text-gray-500">加载中...</span>
        </template>
      </NSpin>
    </div>

    <!-- 渲染 Schema，注入外部方法 -->
    <VSchema v-else-if="loginSchema" :schema="loginSchema" :methods="externalMethods" />
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
}
</style>
