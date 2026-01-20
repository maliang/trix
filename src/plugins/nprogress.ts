import NProgress from 'nprogress';

/** 设置 NProgress 插件 */
export function setupNProgress() {
  NProgress.configure({ easing: 'ease', speed: 500 });

  // 挂载到 window
  window.NProgress = NProgress;
}
