<script setup lang="ts">
import { computed, onMounted, ref, resolveComponent } from 'vue';
import { NBadge, NButton, NTooltip } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import { get } from '@/service/request';
import type { JsonNode } from 'vschema-ui';
import { resolveNotificationBadgeCount } from '@/service/notification/badge';

interface Props {
  /** Iconify 图标名（简单图标按钮模式） */
  icon?: string;
  /** 鼠标悬停提示 */
  tooltip?: string;
  /** 徽标配置：可绑定通知未读数 */
  badge?: Api.Route.MenuBadgeConfig;
  /** 点击行为类型 */
  click?: 'route' | 'link' | 'modal' | 'drawer' | 'none';
  /** 点击目标 */
  clickTarget?: string;
  /** link 模式下的打开目标 */
  target?: '_blank' | '_self' | string;
  /** Schema API 地址（高级模式：返回任意 schema 节点完全控制渲染） */
  schemaApi?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'carbon:dot-mark',
  tooltip: '',
  click: 'none',
  clickTarget: ''
});

const VSchema = resolveComponent('VSchema');
const router = useRouter();

/** Schema 模式：由 API 返回的 schema 节点 */
const schemaNode = ref<JsonNode | null>(null);
/** 是否为 Schema 渲染模式 */
const isSchemaMode = ref(false);
/** 最终徽标数量 */
const resolvedBadgeCount = computed(() => resolveNotificationBadgeCount(props.badge));
/** 最终徽标模式 */
const resolvedBadgeMode = computed(() => props.badge?.mode || 'count');
/** 是否显示徽标 */
const shouldShowBadge = computed(() => Boolean(props.badge?.showZero) || resolvedBadgeCount.value > 0);
/** 最终徽标颜色（NBadge 通过 color 属性自定义背景色） */
const resolvedBadgeColor = computed(() => props.badge?.color || undefined);

/** 加载 Schema（高级模式） */
async function loadSchema() {
  if (!props.schemaApi) return;
  try {
    const { data } = await get<JsonNode>(props.schemaApi);
    if (data) {
      schemaNode.value = data;
      isSchemaMode.value = true;
    }
  } catch {
    console.warn('[HeaderCustomItem] schema_api 加载失败:', props.schemaApi);
  }
}

/** 点击处理（简单模式） */
async function handleClick() {
  if (!props.clickTarget) return;

  if (props.click === 'route') {
    await router.push(props.clickTarget);
    return;
  }

  if (props.click === 'link') {
    const target = props.target || '_blank';
    if (target === '_self') {
      window.location.href = props.clickTarget;
      return;
    }
    window.open(props.clickTarget, target);
  }
}

onMounted(() => {
  if (props.schemaApi) {
    loadSchema();
  }
});
</script>

<template>
  <!-- Schema 模式：由 API 返回的 schema 完全控制渲染 -->
  <component v-if="isSchemaMode && schemaNode" :is="VSchema" :schema="schemaNode" />

  <!-- 简单图标按钮模式 -->
  <template v-else>
    <NTooltip v-if="tooltip" :trigger="'hover'" placement="bottom">
      <template #trigger>
        <NButton quaternary circle @click="handleClick">
          <template #icon>
            <NBadge
              :value="resolvedBadgeMode === 'dot' ? undefined : resolvedBadgeCount"
              :dot="resolvedBadgeMode === 'dot'"
              :max="badge?.max ?? 99"
              :show="shouldShowBadge"
              :color="resolvedBadgeColor"
            >
              <Icon :icon="icon" width="20" height="20" />
            </NBadge>
          </template>
        </NButton>
      </template>
      {{ tooltip }}
    </NTooltip>
    <NButton v-else quaternary circle @click="handleClick">
      <template #icon>
        <NBadge
          :value="resolvedBadgeMode === 'dot' ? undefined : resolvedBadgeCount"
          :dot="resolvedBadgeMode === 'dot'"
          :max="badge?.max ?? 99"
          :show="shouldShowBadge"
          :color="resolvedBadgeColor"
        >
          <Icon :icon="icon" width="20" height="20" />
        </NBadge>
      </template>
    </NButton>
  </template>
</template>
