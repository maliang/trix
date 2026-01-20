<script setup lang="ts">
/**
 * IconPicker - 图标选择器组件
 *
 * 基于 @iconify/vue 封装，支持：
 * - 多图标系列切换
 * - 从 Iconify API 动态获取图标列表
 * - 自定义图标系列和图标
 * - 搜索过滤、分页加载
 * - 暗色主题适配
 */
import { ref, computed, watch, onMounted } from 'vue';
import { NPopover, NInput, NSpin, NPagination, useThemeVars } from 'naive-ui';
import { Icon } from '@iconify/vue';
import { useThemeStore } from '@/store/modules/theme';

// 图标系列配置
export interface IconSet {
  /** 系列前缀（唯一标识） */
  prefix: string;
  /** 系列名称 */
  name: string;
  /** 系列图标 */
  icon: string;
  /** 自定义图标列表（如果提供则不从 API 加载） */
  icons?: string[];
}

interface Props {
  /** 绑定值 */
  modelValue?: string;
  /** 占位文本 */
  placeholder?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 弹出框宽度 */
  popoverWidth?: number;
  /** 自定义图标系列（会追加到默认系列后面） */
  customSets?: IconSet[];
  /** 额外的图标（会追加到对应系列中） */
  extraIcons?: Record<string, string[]>;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请选择图标',
  disabled: false,
  popoverWidth: 486,
  customSets: () => [],
  extraIcons: () => ({})
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
}>();

// 主题相关
const themeStore = useThemeStore();
const themeVars = useThemeVars();

// 默认图标系列列表
const defaultIconSets: IconSet[] = [
  { prefix: 'tabler', name: 'Tabler', icon: 'tabler:brand-tabler' },
  { prefix: 'mdi', name: 'Material Design', icon: 'mdi:material-design' },
  { prefix: 'carbon', name: 'Carbon', icon: 'carbon:carbon' },
  { prefix: 'lucide', name: 'Lucide', icon: 'lucide:feather' },
  { prefix: 'ph', name: 'Phosphor', icon: 'ph:phosphor-logo' },
  { prefix: 'ri', name: 'Remix Icon', icon: 'ri:remixicon-line' }
];

// 合并后的图标系列
const iconSets = computed(() => [...defaultIconSets, ...props.customSets]);

// 状态
const showPopover = ref(false);
const searchText = ref('');
const currentSet = ref(defaultIconSets[0].prefix);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = 100; // 10列 x 10行

// 图标缓存
const iconCache = ref<Record<string, string[]>>({});

// 当前系列的所有图标（包含额外图标）
const allIcons = computed(() => {
  const cached = iconCache.value[currentSet.value] || [];
  const extra = props.extraIcons[currentSet.value] || [];
  // 合并并去重
  return [...new Set([...cached, ...extra])];
});

// 过滤后的图标
const filteredIcons = computed(() => {
  if (!searchText.value) return allIcons.value;
  const keyword = searchText.value.toLowerCase();
  return allIcons.value.filter(icon => icon.toLowerCase().includes(keyword));
});

// 分页后的图标
const pagedIcons = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredIcons.value.slice(start, start + pageSize);
});

// 总页数
const totalPages = computed(() => Math.ceil(filteredIcons.value.length / pageSize));

// 加载图标列表
async function loadIcons(prefix: string) {
  if (iconCache.value[prefix]) return;
  
  // 检查是否是自定义系列（有预设图标）
  const customSet = props.customSets.find(s => s.prefix === prefix);
  if (customSet?.icons) {
    iconCache.value[prefix] = customSet.icons;
    return;
  }
  
  loading.value = true;
  try {
    const response = await fetch(`https://api.iconify.design/collection?prefix=${prefix}`);
    const data = await response.json();
    
    if (data.uncategorized) {
      iconCache.value[prefix] = data.uncategorized.map((name: string) => `${prefix}:${name}`);
    } else if (data.categories) {
      const icons: string[] = [];
      for (const category of Object.values(data.categories) as string[][]) {
        icons.push(...category.map(name => `${prefix}:${name}`));
      }
      iconCache.value[prefix] = icons;
    }
  } catch (error) {
    console.error('加载图标失败:', error);
    iconCache.value[prefix] = [];
  } finally {
    loading.value = false;
  }
}

// 预加载所有系列
async function preloadAllSets() {
  await Promise.all(iconSets.value.map(set => loadIcons(set.prefix)));
}

// 选择图标
function selectIcon(icon: string) {
  emit('update:modelValue', icon);
  emit('change', icon);
  showPopover.value = false;
}

// 切换系列
function switchSet(prefix: string) {
  currentSet.value = prefix;
  currentPage.value = 1;
  searchText.value = '';
}

// 清除选择
function clearIcon() {
  emit('update:modelValue', '');
  emit('change', '');
}

// 监听搜索重置分页
watch(searchText, () => {
  currentPage.value = 1;
});

// 弹出框打开时预加载
watch(showPopover, async (show) => {
  if (show) {
    await preloadAllSets();
  }
});

// 初始化加载当前系列
onMounted(() => {
  loadIcons(currentSet.value);
});

// 计算样式
const sidebarBgColor = computed(() => themeStore.darkMode ? '#2d2d30' : '#f5f5f5');
const sidebarHoverColor = computed(() => themeStore.darkMode ? '#3d3d40' : '#e8e8e8');
const iconHoverColor = computed(() => themeStore.darkMode ? '#3d3d40' : '#f0f0f0');
const iconSelectedColor = computed(() => themeVars.value.primaryColor);
const contentBgColor = computed(() => themeStore.darkMode ? '#1e1e1e' : '#fff');
</script>

<template>
  <NPopover
    v-model:show="showPopover"
    trigger="click"
    placement="bottom-start"
    :disabled="disabled"
    :width="popoverWidth"
    raw
  >
    <template #trigger>
      <NInput
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        readonly
        clearable
        @clear="clearIcon"
      >
        <template v-if="modelValue" #prefix>
          <Icon :icon="modelValue" class="text-18px" />
        </template>
        <template #suffix>
          <Icon icon="mdi:chevron-down" class="text-16px" />
        </template>
      </NInput>
    </template>

    <div class="icon-picker-content" :style="{ backgroundColor: contentBgColor }">
      <!-- 侧边栏 - 紧凑单行布局 -->
      <div class="icon-sidebar" :style="{ backgroundColor: sidebarBgColor }">
        <div
          v-for="set in iconSets"
          :key="set.prefix"
          class="sidebar-item"
          :class="{ active: currentSet === set.prefix }"
          :style="{
            backgroundColor: currentSet === set.prefix ? iconSelectedColor : 'transparent',
            color: currentSet === set.prefix ? '#fff' : 'inherit'
          }"
          :title="set.name"
          @click="switchSet(set.prefix)"
          @mouseenter="($event.target as HTMLElement).style.backgroundColor = currentSet === set.prefix ? iconSelectedColor : sidebarHoverColor"
          @mouseleave="($event.target as HTMLElement).style.backgroundColor = currentSet === set.prefix ? iconSelectedColor : 'transparent'"
        >
          <Icon :icon="set.icon" class="sidebar-icon" />
          <span class="sidebar-text">{{ set.name }}</span>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="icon-main">
        <!-- 顶部：搜索框 + 统计信息 -->
        <div class="icon-header">
          <NInput v-model:value="searchText" placeholder="搜索图标..." clearable size="small" class="icon-search">
            <template #prefix>
              <Icon icon="mdi:magnify" />
            </template>
          </NInput>
          <span class="icon-count">
            共 {{ filteredIcons.length }} 个
          </span>
        </div>

        <!-- 图标网格 -->
        <div v-if="loading" class="icon-loading">
          <NSpin size="small" />
        </div>
        <div v-else class="icon-grid">
          <div
            v-for="icon in pagedIcons"
            :key="icon"
            class="icon-item"
            :class="{ selected: modelValue === icon }"
            :style="{
              backgroundColor: modelValue === icon ? iconSelectedColor : 'transparent',
              color: modelValue === icon ? '#fff' : 'inherit'
            }"
            :title="icon"
            @click="selectIcon(icon)"
            @mouseenter="($event.target as HTMLElement).style.backgroundColor = modelValue === icon ? iconSelectedColor : iconHoverColor"
            @mouseleave="($event.target as HTMLElement).style.backgroundColor = modelValue === icon ? iconSelectedColor : 'transparent'"
          >
            <Icon :icon="icon" />
          </div>
        </div>

        <!-- 底部分页 -->
        <div class="icon-pagination">
          <NPagination
            v-model:page="currentPage"
            :page-count="totalPages || 1"
            :page-slot="5"
            size="small"
          />
          <span class="page-info">{{ currentPage }} / {{ totalPages || 1 }}</span>
        </div>
      </div>
    </div>
  </NPopover>
</template>

<style scoped>
.icon-picker-content {
  display: flex;
  height: 440px;
  border-radius: 6px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

/* 侧边栏 - 紧凑布局 */
.icon-sidebar {
  width: 120px;
  padding: 8px 6px;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid var(--n-border-color, #e8e8e8);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  margin-bottom: 2px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.sidebar-text {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  min-width: 0;
  overflow: hidden;
}

/* 顶部搜索和统计 */
.icon-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.icon-search {
  flex: 1;
}

.icon-count {
  font-size: 12px;
  color: #888;
  white-space: nowrap;
}

.icon-loading {
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
  padding: 4px 4px 8px 4px;
  height: 348px;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 26px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.icon-item:hover {
  transform: scale(1.15);
}

/* 底部分页 */
.icon-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--n-border-color, #e8e8e8);
  flex-shrink: 0;
}

.page-info {
  font-size: 12px;
  color: #888;
  white-space: nowrap;
}
</style>
