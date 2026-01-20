<script setup lang="ts">
import { computed } from 'vue';
import type { PopoverPlacement } from 'naive-ui';
import { $t } from '@/locales';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({ name: 'ThemeSchemaSwitch' });

interface Props {
  /** 主题模式（可选，默认从 store 获取） */
  themeSchema?: UnionKey.ThemeScheme;
  /** 显示提示 */
  showTooltip?: boolean;
  /** 提示位置 */
  tooltipPlacement?: PopoverPlacement;
}

const props = withDefaults(defineProps<Props>(), {
  themeSchema: undefined,
  showTooltip: true,
  tooltipPlacement: 'bottom'
});

interface Emits {
  (e: 'switch'): void;
}

const emit = defineEmits<Emits>();

const themeStore = useThemeStore();

/** 当前主题模式 */
const currentThemeSchema = computed(() => props.themeSchema ?? themeStore.themeScheme);

function handleSwitch() {
  themeStore.toggleThemeScheme();
  emit('switch');
}

const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto'
};

const icon = computed(() => icons[currentThemeSchema.value]);

const tooltipContent = computed(() => {
  if (!props.showTooltip) return '';

  return $t('icon.themeSchema');
});
</script>

<template>
  <ButtonIcon
    :icon="icon"
    :tooltip-content="tooltipContent"
    :tooltip-placement="tooltipPlacement"
    @click="handleSwitch"
  />
</template>

<style scoped></style>
