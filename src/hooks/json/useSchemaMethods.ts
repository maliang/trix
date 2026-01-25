/**
 * Schema 内置方法 Composable
 * 提供可在 VSchema 中调用的导航、标签页、窗口等方法
 * 
 * 使用方式（需要加 $methods. 前缀）：
 * - $methods.$nav.push(path) - 跳转页面
 * - $methods.$nav.replace(path) - 替换页面
 * - $methods.$nav.back() - 返回上一页
 * - $methods.$tab.close() - 关闭标签
 * - $methods.$tab.open(path, title?) - 新建标签页
 * - $methods.$tab.fix() - 固定标签页
 * - $methods.$window.open(url) - 打开新窗口（相对路径自动添加 API baseURL）
 * - $methods.$download(url, filename, options?) - 下载文件（自动携带 token）
 * - $methods.$message.success(content) - 成功消息
 * - $methods.$message.error(content) - 错误消息
 * - $methods.$dialog.warning(options) - 警告对话框
 * - $methods.$notification.success(options) - 成功通知
 * - $methods.$loadingBar.start() - 开始加载条
 */

import { useRoute, useRouter } from 'vue-router';
import { useTabStore } from '@/store/modules/tab';
import { request } from '@/service';

// API 基础 URL
const API_BASE_URL = import.meta.env.VITE_SERVICE_BASE_URL || '';

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
     * @param url 目标 URL（相对路径自动添加 API baseURL）
     * @param target 窗口名称，默认 _blank
     * @param features 窗口特性
     */
    open(url: string, target = '_blank', features?: string) {
      // 如果是相对路径（以 / 开头但不是 //），自动添加 API baseURL
      const fullUrl = url.startsWith('/') && !url.startsWith('//') 
        ? `${API_BASE_URL}${url}` 
        : url;
      window.open(fullUrl, target, features);
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
   * 文件下载方法
   * 支持两种调用方式：
   * 1. $download(url, filename?, options?) - 自动发起带 token 的请求下载
   * 2. $download(blob, filename?) - 直接下载已有的 Blob 数据
   * 
   * @param urlOrBlob URL 字符串或 Blob 数据
   * @param filename 文件名（可选，默认从响应头或 URL 提取）
   * @param options 可选配置 { method, params, data }
   */
  async function $download(
    urlOrBlob: string | Blob,
    filename?: string,
    options?: {
      method?: 'GET' | 'POST';
      params?: Record<string, any>;
      data?: any;
    }
  ): Promise<void> {
    let blob: Blob;
    let finalFilename = filename;

    if (urlOrBlob instanceof Blob) {
      blob = urlOrBlob;
      finalFilename = finalFilename || 'download';
    } else {
      // 使用 service 层的 request，自动处理 baseURL 和 token
      const result = await request<Blob>({
        url: urlOrBlob,
        method: options?.method || 'GET',
        params: options?.params,
        data: options?.data,
        responseType: 'blob',
        showErrorMessage: true
      });

      if (result.error || !result.data) {
        throw result.error || new Error('Download failed');
      }

      blob = result.data;

      // 尝试从响应头提取文件名
      if (!finalFilename && result.response) {
        const disposition = result.response.headers?.get('Content-Disposition');
        if (disposition) {
          // 匹配 filename*=UTF-8''xxx 或 filename="xxx" 或 filename=xxx
          const utf8Match = disposition.match(/filename\*=UTF-8''([^;\s]+)/i);
          const quotedMatch = disposition.match(/filename="([^"]+)"/i);
          const plainMatch = disposition.match(/filename=([^;\s]+)/i);
          
          if (utf8Match) {
            finalFilename = decodeURIComponent(utf8Match[1]);
          } else if (quotedMatch) {
            finalFilename = quotedMatch[1];
          } else if (plainMatch) {
            finalFilename = plainMatch[1];
          }
        }
      }

      // 从 URL 提取文件名作为后备
      if (!finalFilename) {
        const urlPath = urlOrBlob.split('?')[0];
        const urlFilename = urlPath.split('/').pop();
        finalFilename = urlFilename || 'download';
      }
    }

    // 触发下载
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * NaiveUI 全局 API 包装器
   * 从 window 对象获取，由 app-provider.vue 注入
   * 使用包装函数避免直接暴露组件实例，防止 Vue 警告
   */
  const $message = {
    success: (content: string, options?: any) => window.$message?.success(content, options),
    error: (content: string, options?: any) => window.$message?.error(content, options),
    warning: (content: string, options?: any) => window.$message?.warning(content, options),
    info: (content: string, options?: any) => window.$message?.info(content, options),
    loading: (content: string, options?: any) => window.$message?.loading(content, options),
    destroyAll: () => window.$message?.destroyAll()
  };

  const $dialog = {
    success: (options: any) => window.$dialog?.success(options),
    error: (options: any) => window.$dialog?.error(options),
    warning: (options: any) => window.$dialog?.warning(options),
    info: (options: any) => window.$dialog?.info(options),
    create: (options: any) => window.$dialog?.create(options),
    destroyAll: () => window.$dialog?.destroyAll()
  };

  const $notification = {
    success: (options: any) => window.$notification?.success(options),
    error: (options: any) => window.$notification?.error(options),
    warning: (options: any) => window.$notification?.warning(options),
    info: (options: any) => window.$notification?.info(options),
    create: (options: any) => window.$notification?.create(options),
    destroyAll: () => window.$notification?.destroyAll()
  };

  const $loadingBar = {
    start: () => window.$loadingBar?.start(),
    finish: () => window.$loadingBar?.finish(),
    error: () => window.$loadingBar?.error()
  };

  /**
   * 返回所有方法集合
   * 在 Schema 中可通过 $methods.$nav.push() 等方式调用
   */
  const schemaMethods = {
    $nav,
    $tab,
    $window,
    $download,
    $message,
    $dialog,
    $notification,
    $loadingBar
  };

  return {
    $nav,
    $tab,
    $window,
    $download,
    $message,
    $dialog,
    $notification,
    $loadingBar,
    schemaMethods
  };
}
