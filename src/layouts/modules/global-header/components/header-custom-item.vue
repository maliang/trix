<script setup lang="ts">
import { ref, onMounted, resolveComponent } from 'vue';
import { NBadge, NButton, NTooltip } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { get } from '@/service/request';
import type { JsonNode } from 'vschema-ui';

interface Props {
  /** Iconify 图标名（简单图标按钮模式） */
  icon?: string;
  /** 鼠标悬停提示 */
  tooltip?: string;
  /** 徽标计数 API */
  badgeApi?: string;
  /** 徽标颜色 */
  badgeColor?: string;
  /** 点击行为类型 */
  click?: 'link' | 'modal' | 'drawer' | 'none';
  /** 点击目标 */
  clickTarget?: string;
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

/** 徽标计数 */
const badgeCount = ref(0);
/** Schema 模式：由 API 返回的 schema 节点 */
const schemaNode = ref<JsonNode | null>(null);
/** 是否为 Schema 渲染模式 */
const isSchemaMode = ref(false);

/** 加载徽标数 */
async function loadBadge() {
  if (!props.badgeApi || isSchemaMode.value) return;
  try {
    const { data } = await get<{ count: number }>(props.badgeApi);
    if (data && typeof data.count === 'number') {
      badgeCount.value = data.count;
    }
  } catch {
    // 静默失败
  }
}

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
function handleClick() {
  if (props.click === 'link' && props.clickTarget) {
    window.open(props.clickTarget, '_blank');
  }
}

onMounted(() => {
  if (props.schemaApi) {
    loadSchema();
  } else {
    loadBadge();
    if (props.badgeApi) {
      setInterval(loadBadge, 30000);
    }
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
              :value="badgeCount"
              :max="99"
              :show="badgeCount > 0"
              :style="badgeColor ? { '--n-badge-color': badgeColor } : {}"
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
          :value="badgeCount"
          :max="99"
          :show="badgeCount > 0"
          :style="badgeColor ? { '--n-badge-color': badgeColor } : {}"
        >
          <Icon :icon="icon" width="20" height="20" />
        </NBadge>
      </template>
    </NButton>
  </template>
</template>
