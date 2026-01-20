<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PageTab } from '@trix/materials';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useTabStore } from '@/store/modules/tab';

defineOptions({
  name: 'GlobalTab'
});

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const themeStore = useThemeStore();
const tabStore = useTabStore();

const tabWrapperRef = ref<HTMLElement>();

const TAB_DATA_ID = 'data-tab-id';
const MIDDLE_MOUSE_BUTTON = 1;
const RIGHT_MOUSE_BUTTON = 2;
const SCROLL_STEP = 200;

/** 是否显示左侧滚动按钮 */
const showLeftArrow = ref(false);
/** 是否显示右侧滚动按钮 */
const showRightArrow = ref(false);

/** 检查是否需要显示滚动按钮 */
function checkScrollArrows() {
  const el = tabWrapperRef.value;
  if (!el) return;
  
  const { scrollLeft, scrollWidth, clientWidth } = el;
  showLeftArrow.value = scrollLeft > 0;
  showRightArrow.value = scrollLeft + clientWidth < scrollWidth - 1;
}

/** 向左滚动 */
function scrollLeft() {
  const el = tabWrapperRef.value;
  if (!el) return;
  
  el.scrollTo({
    left: Math.max(0, el.scrollLeft - SCROLL_STEP),
    behavior: 'smooth'
  });
}

/** 向右滚动 */
function scrollRight() {
  const el = tabWrapperRef.value;
  if (!el) return;
  
  el.scrollTo({
    left: el.scrollLeft + SCROLL_STEP,
    behavior: 'smooth'
  });
}

/** 滚动到当前激活的标签页 */
function scrollToActiveTab() {
  nextTick(() => {
    const el = tabWrapperRef.value;
    if (!el) return;
    
    const activeTab = el.querySelector(`[${TAB_DATA_ID}="${tabStore.activeTabId}"]`) as HTMLElement;
    if (!activeTab) return;
    
    const { offsetLeft, offsetWidth } = activeTab;
    const { scrollLeft, clientWidth } = el;
    
    // 如果激活的标签在可视区域左侧
    if (offsetLeft < scrollLeft) {
      el.scrollTo({ left: offsetLeft - 10, behavior: 'smooth' });
    }
    // 如果激活的标签在可视区域右侧
    else if (offsetLeft + offsetWidth > scrollLeft + clientWidth) {
      el.scrollTo({ left: offsetLeft + offsetWidth - clientWidth + 10, behavior: 'smooth' });
    }
    
    checkScrollArrows();
  });
}

/** 处理鼠标滚轮事件 */
function handleWheel(e: WheelEvent) {
  const el = tabWrapperRef.value;
  if (!el) return;
  
  e.preventDefault();
  el.scrollLeft += e.deltaY;
  checkScrollArrows();
}

function handleCloseTab(tab: App.Global.Tab) {
  tabStore.removeTab(tab.id);
  
  // 如果关闭的是当前激活的标签页，跳转到首页或上一个标签页
  if (tab.id === tabStore.activeTabId) {
    const tabs = tabStore.tabs;
    if (tabs.length > 0) {
      const lastTab = tabs[tabs.length - 1];
      router.push(lastTab.fullPath);
    }
  }
  
  nextTick(checkScrollArrows);
}

function handleMousedown(e: MouseEvent, tab: App.Global.Tab) {
  const isMiddleClick = e.button === MIDDLE_MOUSE_BUTTON;
  if (!isMiddleClick) {
    return;
  }

  if (tabStore.isTabRetain(tab.id)) {
    return;
  }

  e.preventDefault();
  handleCloseTab(tab);
}

function switchTab(e: MouseEvent, tab: App.Global.Tab) {
  if ([MIDDLE_MOUSE_BUTTON, RIGHT_MOUSE_BUTTON].includes(e.button)) return;

  tabStore.setActiveTabId(tab.id);
  router.push(tab.fullPath);
}

async function refresh() {
  appStore.reloadPage(500);
}

function init() {
  tabStore.initTabStore({
    name: route.name as string,
    path: route.path,
    fullPath: route.fullPath,
    meta: {
      title: route.meta.title as string,
      icon: route.meta.icon as string,
      localIcon: route.meta.localIcon as string
    }
  });
}

// 监听路由变化
watch(
  () => route.fullPath,
  () => {
    tabStore.addTab({
      name: route.name as string,
      path: route.path,
      fullPath: route.fullPath,
      meta: {
        title: route.meta.title as string,
        icon: route.meta.icon as string,
        localIcon: route.meta.localIcon as string
      }
    });
    scrollToActiveTab();
  }
);

// 监听标签页变化
watch(() => tabStore.tabs.length, () => {
  nextTick(checkScrollArrows);
});

// 监听窗口大小变化
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  checkScrollArrows();
  
  // 监听容器大小变化
  if (tabWrapperRef.value) {
    resizeObserver = new ResizeObserver(checkScrollArrows);
    resizeObserver.observe(tabWrapperRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

// init
init();
</script>

<template>
  <DarkModeContainer class="size-full flex-y-center px-16px shadow-tab">
    <!-- 左侧滚动按钮 -->
    <button
      v-show="showLeftArrow"
      class="tab-scroll-btn mr-4px"
      @click="scrollLeft"
    >
      <SvgIcon icon="mdi:chevron-left" class="text-16px" />
    </button>
    
    <!-- 标签容器 -->
    <div
      ref="tabWrapperRef"
      class="h-full flex-1 flex overflow-x-auto scrollbar-none"
      :class="[
        themeStore.tab.mode === 'chrome' || themeStore.tab.mode === 'slider' ? 'items-end' : 'items-center gap-12px'
      ]"
      @scroll="checkScrollArrows"
      @wheel="handleWheel"
    >
      <PageTab
        v-for="tab in tabStore.tabs"
        :key="tab.id"
        :[TAB_DATA_ID]="tab.id"
        :mode="themeStore.tab.mode"
        :dark-mode="themeStore.darkMode"
        :active="tab.id === tabStore.activeTabId"
        :active-color="themeStore.themeColor"
        :closable="!tabStore.isTabRetain(tab.id)"
        @pointerdown="switchTab($event, tab)"
        @mousedown="handleMousedown($event, tab)"
        @close="handleCloseTab(tab)"
      >
        <template #prefix>
          <SvgIcon :icon="tab.icon" :local-icon="tab.localIcon" class="inline-block align-text-bottom text-16px" />
        </template>
        <div class="max-w-240px ellipsis-text">{{ tab.label }}</div>
      </PageTab>
    </div>
    
    <!-- 右侧滚动按钮 -->
    <button
      v-show="showRightArrow"
      class="tab-scroll-btn ml-4px"
      @click="scrollRight"
    >
      <SvgIcon icon="mdi:chevron-right" class="text-16px" />
    </button>
    
    <ReloadButton class="tab-action-btn ml-8px" :loading="!appStore.reloadFlag" @click="refresh" />
    <FullScreen class="tab-action-btn" :full="appStore.fullContent" @click="appStore.toggleFullContent" />
  </DarkModeContainer>
</template>

<style scoped>
/* 隐藏标签栏滚动条 */
.scrollbar-none {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

/* 滚动按钮样式 */
.tab-scroll-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: var(--n-text-color, #666);
  transition: all 0.2s;
  flex-shrink: 0;
}

.tab-scroll-btn:hover {
  color: var(--primary-color, #646cff);
  background-color: var(--n-hover-color, rgba(0, 0, 0, 0.04));
}

.tab-scroll-btn:active {
  background-color: var(--n-pressed-color, rgba(0, 0, 0, 0.08));
}

/* 统一右侧操作按钮样式 */
:deep(.tab-action-btn) {
  height: 28px !important;
  width: 28px !important;
  padding: 0 !important;
}

:deep(.tab-action-btn .n-button__content) {
  font-size: 16px;
}
</style>
