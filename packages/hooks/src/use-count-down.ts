import { computed, onScopeDispose, ref } from 'vue';
import { useRafFn } from '@vueuse/core';

/**
 * 倒计时 Hook，使用 requestAnimationFrame 实现平滑精确的计时
 *
 * @param initialSeconds - 倒计时总秒数
 */
export default function useCountDown(initialSeconds: number) {
  const remainingSeconds = ref(0);

  const count = computed(() => Math.ceil(remainingSeconds.value));

  const isCounting = computed(() => remainingSeconds.value > 0);

  const { pause, resume } = useRafFn(
    ({ delta }) => {
      // delta: 自上一帧以来经过的毫秒数

      // 如果倒计时已经到达或低于零，确保它为 0 并停止
      if (remainingSeconds.value <= 0) {
        remainingSeconds.value = 0;
        pause();
        return;
      }

      // 计算自上一帧以来经过的秒数
      const secondsPassed = delta / 1000;
      remainingSeconds.value -= secondsPassed;

      // 如果递减后倒计时已完成
      if (remainingSeconds.value <= 0) {
        remainingSeconds.value = 0;
        pause();
      }
    },
    { immediate: false } // 计时器不会自动启动
  );

  /**
   * 开始倒计时
   *
   * @param [updatedSeconds=initialSeconds] - 可选，使用新的持续时间开始。默认为 `initialSeconds`
   */
  function start(updatedSeconds: number = initialSeconds) {
    remainingSeconds.value = updatedSeconds;
    resume();
  }

  /** 停止倒计时并将剩余时间重置为 0 */
  function stop() {
    remainingSeconds.value = 0;
    pause();
  }

  // 确保在组件卸载时清理 rAF 循环
  onScopeDispose(() => {
    pause();
  });

  return {
    count,
    isCounting,
    start,
    stop
  };
}
