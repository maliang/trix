import type NProgress from 'nprogress';
import type { NotificationApiInjection } from 'naive-ui/lib/notification/src/NotificationProvider';
import type { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider';
import type { DialogApiInjection } from 'naive-ui/lib/dialog/src/DialogProvider';
import type { LoadingBarApiInjection } from 'naive-ui/lib/loading-bar/src/LoadingBarProvider';

declare global {
  interface Window {
    /** NProgress 实例 */
    NProgress: typeof NProgress;
    /** NaiveUI 通知 API */
    $notification?: NotificationApiInjection;
    /** NaiveUI 消息 API */
    $message?: MessageApiInjection;
    /** NaiveUI 对话框 API */
    $dialog?: DialogApiInjection;
    /** NaiveUI 加载条 API */
    $loadingBar?: LoadingBarApiInjection;
  }
}

/** Vue 单文件组件模块声明 */
declare module '*.vue' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: any;
  export default component;
}

export {};
