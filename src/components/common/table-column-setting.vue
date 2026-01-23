<script setup lang="ts" generic="T extends Record<string, unknown>, K = never">
import { computed } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import type { ButtonProps } from 'naive-ui';
import { $t } from '@/locales';

defineOptions({
  name: 'TableColumnSetting'
});

// Props 定义
interface Props {
  /** 按钮大小 */
  size?: ButtonProps['size'];
  /** 按钮类型 */
  type?: ButtonProps['type'];
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 自定义图标 */
  icon?: string;
  /** 按钮文字（为空则使用默认文字） */
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  type: 'default',
  showIcon: true,
  icon: 'ant-design:setting-outlined',
  text: ''
});

const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  required: true
});

// 插槽定义
defineSlots<{
  /** 默认插槽：自定义按钮内容 */
  default?: () => any;
  /** 自定义列表项前缀 */
  itemPrefix?: (props: { item: NaiveUI.TableColumnCheck }) => any;
  /** 自定义列表项后缀 */
  itemSuffix?: (props: { item: NaiveUI.TableColumnCheck }) => any;
}>();

// 计算按钮文字
const buttonText = computed(() => props.text || $t('common.columnSetting'));
</script>

<template>
  <NPopover placement="bottom-end" trigger="click">
    <template #trigger>
      <NButton :size="size" :type="type">
        <template v-if="showIcon" #icon>
          <SvgIcon :icon="icon" class="text-icon" />
        </template>
        <!-- 默认插槽：自定义按钮内容 -->
        <slot>{{ buttonText }}</slot>
      </NButton>
    </template>
    <VueDraggable v-model="columns" :animation="150" filter=".none_draggable">
      <div
        v-for="item in columns"
        :key="item.key"
        class="h-36px flex-y-center rd-4px hover:(bg-primary bg-opacity-20)"
        :class="{ hidden: !item.visible }"
      >
        <!-- 列表项前缀插槽 -->
        <slot name="itemPrefix" :item="item">
          <SvgIcon icon="mdi:drag" class="mr-8px h-full cursor-move text-icon" />
        </slot>
        <NCheckbox v-model:checked="item.checked" class="none_draggable flex-1">
          <template v-if="typeof item.title === 'function'">
            <component :is="item.title" />
          </template>
          <template v-else>{{ item.title }}</template>
        </NCheckbox>
        <!-- 列表项后缀插槽 -->
        <slot name="itemSuffix" :item="item" />
      </div>
    </VueDraggable>
  </NPopover>
</template>

<style scoped></style>
