<script setup lang="ts">
import { computed, h, ref, resolveComponent, provide } from 'vue';
import type { VNode } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { useRouter } from 'vue-router';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';
import { get, post } from '@/service/request';
import type { JsonNode } from '@maliang47/vschema';

defineOptions({
  name: 'UserAvatar'
});

/** 下拉菜单项配置 */
interface MenuItemConfig {
  /** 菜单项 key */
  key: string;
  /** 菜单项标签 */
  label: string;
  /** 菜单项图标 */
  icon?: string;
  /** 是否为分割线 */
  divider?: boolean;
  /** 点击跳转的路由 */
  route?: string;
  /** 点击执行的动作：logout-登出, modal-打开弹窗 */
  action?: 'logout' | 'modal';
  /** 弹窗配置（action 为 modal 时有效） */
  modal?: {
    /** 弹窗标题 */
    title?: string;
    /** 弹窗宽度 */
    width?: string | number;
    /** 弹窗内容的 UI API 地址 */
    uiApi?: string;
    /** 提交 API 地址 */
    submitApi?: string;
  };
}

interface Props {
  /** 自定义下拉菜单配置 */
  menuItems?: MenuItemConfig[];
}

const props = withDefaults(defineProps<Props>(), {
  menuItems: undefined
});

const authStore = useAuthStore();
const router = useRouter();

// 获取全局注册的 VSchema 组件
const VSchemaComponent = resolveComponent('VSchema');

// 弹窗状态
const modalVisible = ref(false);
const modalTitle = ref('');
const modalWidth = ref<string | number>(600);
const modalSchema = ref<JsonNode | null>(null);
const modalLoading = ref(false);
const currentModalConfig = ref<MenuItemConfig['modal'] | null>(null);

function loginOrRegister() {
  router.push('/login');
}

type DropdownOption =
  | {
      key: string;
      label: string;
      icon?: () => VNode;
    }
  | {
      type: 'divider';
      key: string;
    };

/** 默认菜单配置 */
const defaultMenuItems: MenuItemConfig[] = [
  {
    key: 'logout',
    label: 'common.logout',
    action: 'logout'
  }
];

/** 渲染图标 */
function renderIcon(iconName: string) {
  return () => h(SvgIcon, { icon: iconName, class: 'text-icon' });
}

/** 转换菜单配置为下拉选项 */
const options = computed<DropdownOption[]>(() => {
  const items = props.menuItems ?? defaultMenuItems;
  
  return items.map(item => {
    if (item.divider) {
      return {
        type: 'divider' as const,
        key: item.key
      };
    }
    
    const option: DropdownOption = {
      key: item.key,
      // 如果 label 包含 . 则使用 $t 翻译
      label: item.label.includes('.') ? $t(item.label as never) : item.label
    };
    
    if (item.icon) {
      option.icon = renderIcon(item.icon);
    }
    
    return option;
  });
});

/** 菜单项配置映射，用于快速查找 */
const menuItemsMap = computed(() => {
  const items = props.menuItems ?? defaultMenuItems;
  const map = new Map<string, MenuItemConfig>();
  items.forEach(item => map.set(item.key, item));
  return map;
});

function logout() {
  window.$dialog?.info({
    title: $t('common.tip'),
    content: $t('common.logoutConfirm'),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: () => {
      authStore.resetStore();
    }
  });
}

/** 关闭弹窗 */
function closeModal() {
  modalVisible.value = false;
  modalSchema.value = null;
  currentModalConfig.value = null;
}

/** 提交表单 */
async function submitForm(formData?: Record<string, any>) {
  const config = currentModalConfig.value;
  if (!config?.submitApi) {
    // 没有配置提交 API，直接关闭弹窗
    closeModal();
    return;
  }

  // 使用系统标准请求
  const { error } = await post(config.submitApi, formData || {}, {
    showErrorMessage: false
  });

  if (error) {
    console.error('[UserAvatar] 提交表单失败:', error.message);
    window.$message?.error('提交失败');
    return;
  }

  window.$message?.success('保存成功');
  closeModal();
}

/** 提供给 JsonRenderer 的方法 */
const modalMethods = {
  closeModal,
  submitForm
};

/** 打开弹窗并加载内容 */
async function openModal(item: MenuItemConfig) {
  if (!item.modal) return;

  modalTitle.value = item.modal.title || item.label;
  modalWidth.value = item.modal.width || 600;
  modalSchema.value = null;
  currentModalConfig.value = item.modal;
  modalVisible.value = true;

  // 如果有 uiApi，加载 Schema
  if (item.modal.uiApi) {
    modalLoading.value = true;
    // 使用系统标准请求
    const { data, error } = await get<JsonNode>(item.modal.uiApi, {}, {
      showErrorMessage: false
    });

    if (error) {
      console.error('[UserAvatar] 加载弹窗内容失败:', error.message);
      modalSchema.value = {
        com: 'NResult',
        props: {
          status: 'error',
          title: '加载失败',
          description: '无法加载弹窗内容'
        }
      };
    } else {
      modalSchema.value = data;
    }
    modalLoading.value = false;
  }
}

function handleDropdown(key: string) {
  const item = menuItemsMap.value.get(key);
  if (!item) return;

  // 处理预定义动作
  if (item.action === 'logout') {
    logout();
    return;
  }

  // 处理弹窗
  if (item.action === 'modal') {
    openModal(item);
    return;
  }

  // 处理路由跳转
  if (item.route) {
    router.push(item.route);
  }
}
</script>

<template>
  <NButton v-if="!authStore.isLogin" quaternary @click="loginOrRegister">
    {{ $t('page.login.common.loginOrRegister') }}
  </NButton>
  <NDropdown v-else placement="bottom" trigger="click" :options="options" @select="handleDropdown">
    <div>
      <ButtonIcon>
        <SvgIcon icon="ph:user-circle" class="text-icon-large" />
        <span class="text-16px font-medium">{{ authStore.userInfo.userName }}</span>
      </ButtonIcon>
    </div>
  </NDropdown>

  <!-- 弹窗 -->
  <NModal
    v-model:show="modalVisible"
    preset="card"
    :title="modalTitle"
    :trap-focus="false"
    :style="{ width: typeof modalWidth === 'number' ? `${modalWidth}px` : modalWidth }"
  >
    <NSpin :show="modalLoading">
      <component 
        v-if="modalSchema" 
        :is="VSchemaComponent" 
        :schema="modalSchema"
        :methods="modalMethods"
        @close="closeModal"
        @submit="submitForm"
      />
      <NEmpty v-else description="暂无内容" />
    </NSpin>
  </NModal>
</template>

<style scoped></style>
