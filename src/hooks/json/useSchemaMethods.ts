/**
 * Schema 内置方法 Composable
 * 提供可在 VSchema 中调用的导航、标签页、窗口等方法
 * 
 * 使用方式：
 * - $nav.push(path) - 跳转页面
 * - $nav.replace(path) - 替换页面
 * - $nav.back() - 返回上一页
 * - $tab.close() - 关闭标签
 * - $tab.open(path, title?) - 新建标签页
 * - $tab.fix() - 固定标签页
 * - $window.open(url) - 打开新窗口
 */

import { useRoute, useRouter } from 'vue-router';
import { useTabStore } from '@/store/modules/tab';

/**
 * Schema 内置方法
 */
export function useSchemaMethods() {
  const route = useRoute();
  const router = useRouter();
  const tabStore = useTabStore();

  /**
   * 导航方法 - 页面跳转相关
   */
  const $nav = {
    /**
     * 跳转到指定路径（在当前标签内）
     * @param path 路由路径或路由配置对象
     */
    push(path: string | { path?: string; name?: string; query?: Record<string, any>; params?: Record<string, any> }) {
      router.push(path);
    },
    
    /**
     * 替换当前页面（不产生历史记录）
     * @param path 路由路径或路由配置对象
     */
    replace(path: string | { path?: string; name?: string; query?: Record<string, any>; params?: Record<string, any> }) {
      router.replace(path);
    },
    
    /**
     * 返回上一页
     * @param delta 返回的步数，默认 1
     */
    back(delta = 1) {
      router.go(-delta);
    },
    
    /**
     * 前进
     * @param delta 前进的步数，默认 1
     */
    forward(delta = 1) {
      router.go(delta);
    }
  };

  /**
   * 标签页方法 - 多标签管理
   */
  const $tab = {
    /**
     * 关闭标签页
     * @param tabId 标签 ID，默认关闭当前标签
     */
    close(tabId?: string) {
      const targetId = tabId || route.fullPath;
      
      // 获取当前标签列表
      const tabs = tabStore.tabs;
      const currentIndex = tabs.findIndex(t => t.id === targetId);
      
      // 如果关闭的是当前标签，需要跳转到其他标签
      if (targetId === route.fullPath && tabs.length > 1) {
        // 优先跳转到右侧标签，否则跳转到左侧
        const nextTab = tabs[currentIndex + 1] || tabs[currentIndex - 1];
        if (nextTab) {
          router.push(nextTab.fullPath);
        }
      }
      
      tabStore.removeTab(targetId);
    },
    
    /**
     * 关闭当前标签页并跳转到指定页面
     * @param path 跳转目标路径，默认首页
     */
    closeAndGo(path = '/') {
      const currentId = route.fullPath;
      // 先跳转，再关闭（避免关闭时自动跳转到相邻标签）
      router.push(path).then(() => {
        tabStore.removeTab(currentId);
      });
    },
    
    /**
     * 关闭其他标签页
     * @param tabId 保留的标签 ID，默认保留当前标签
     */
    closeOthers(tabId?: string) {
      const targetId = tabId || route.fullPath;
      tabStore.clearTabs([targetId]);
    },
    
    /**
     * 关闭左侧标签页
     * @param tabId 基准标签 ID，默认当前标签
     */
    closeLeft(tabId?: string) {
      const targetId = tabId || route.fullPath;
      tabStore.clearLeftTabs(targetId);
    },
    
    /**
     * 关闭右侧标签页
     * @param tabId 基准标签 ID，默认当前标签
     */
    closeRight(tabId?: string) {
      const targetId = tabId || route.fullPath;
      tabStore.clearRightTabs(targetId);
    },
    
    /**
     * 新建标签页并跳转
     * @param path 路由路径
     * @param title 标签标题（可选，默认从路由 meta 获取）
     */
    open(path: string, title?: string) {
      router.push(path).then(() => {
        // 如果指定了标题，更新标签标题
        if (title) {
          const tabs = tabStore.tabs;
          const tab = tabs.find(t => t.fullPath === path || t.routePath === path);
          if (tab) {
            tab.label = title;
          }
        }
      });
    },
    
    /**
     * 新建 iframe 标签页
     * @param url 外部 URL
     * @param title 标签标题
     */
    openIframe(url: string, title: string) {
      // 使用特殊路由打开 iframe
      const iframePath = `/iframe?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
      router.push(iframePath);
    },
    
    /**
     * 刷新当前标签页
     */
    refresh() {
      // 通过重新加载当前路由实现刷新
      const currentPath = route.fullPath;
      router.replace('/redirect' + currentPath);
    },
    
    /**
     * 固定标签页
     * @param tabId 标签 ID，默认固定当前标签
     */
    fix(tabId?: string) {
      const targetId = tabId || route.fullPath;
      tabStore.fixTab(targetId);
    },
    
    /**
     * 取消固定标签页
     * @param tabId 标签 ID，默认取消固定当前标签
     */
    unfix(tabId?: string) {
      const targetId = tabId || route.fullPath;
      tabStore.unfixTab(targetId);
    },
    
    /**
     * 判断标签页是否固定
     * @param tabId 标签 ID，默认当前标签
     */
    isFixed(tabId?: string): boolean {
      const targetId = tabId || route.fullPath;
      return tabStore.isTabRetain(targetId);
    }
  };

  /**
   * 窗口方法 - 浏览器窗口操作
   */
  const $window = {
    /**
     * 在新窗口打开 URL
     * @param url 目标 URL
     * @param target 窗口名称，默认 _blank
     * @param features 窗口特性
     */
    open(url: string, target = '_blank', features?: string) {
      window.open(url, target, features);
    },
    
    /**
     * 关闭当前窗口
     */
    close() {
      window.close();
    },
    
    /**
     * 打印当前页面
     */
    print() {
      window.print();
    }
  };

  /**
   * 返回所有方法集合
   * 在 Schema 中可通过 $methods.$nav.push() 等方式调用
   */
  const schemaMethods = {
    $nav,
    $tab,
    $window
  };

  return {
    $nav,
    $tab,
    $window,
    schemaMethods
  };
}
