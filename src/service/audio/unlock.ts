type AudioFactory = (src?: string) => HTMLAudioElement;

const UNLOCK_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'click'] as const;
const SILENT_WAV =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQQAAAAAAA==';
// 单条声音的最长等待时间（毫秒），避免音频卡住导致队列永久阻塞
const MAX_PLAYBACK_WAIT = 30000;

function createAudioElement(src?: string): HTMLAudioElement {
  return new Audio(src);
}

function createAudioUnlock() {
  let installed = false;
  let unlocked = false;
  let audioFactory: AudioFactory = createAudioElement;
  const pendingSources: string[] = [];
  // 播放串行队列：保证所有声音逐个播放，互不重叠
  let playbackTail: Promise<void> = Promise.resolve();

  function removeListeners(): void {
    UNLOCK_EVENTS.forEach(eventName => {
      window.removeEventListener(eventName, unlockByUserGesture);
    });
  }

  /** 开始播放并等待其真正开始（用于解锁检测，play() 被拒绝即代表未解锁） */
  async function startPlayback(src: string): Promise<HTMLAudioElement> {
    const audio = audioFactory(src);
    const result = audio.play() as unknown;
    if (result && typeof (result as Promise<void>).then === 'function') {
      await result;
    }
    return audio;
  }

  /** 等待音频播放结束（不支持事件的环境/测试 mock 立即返回） */
  function waitForPlaybackEnd(audio: HTMLAudioElement): Promise<void> {
    if (typeof audio.addEventListener !== 'function') return Promise.resolve();

    return new Promise<void>(resolve => {
      let settled = false;
      let timer: ReturnType<typeof setTimeout> | null = null;

      const finish = () => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        audio.removeEventListener?.('ended', finish);
        audio.removeEventListener?.('error', finish);
        resolve();
      };

      audio.addEventListener('ended', finish, { once: true });
      audio.addEventListener('error', finish, { once: true });
      timer = setTimeout(finish, MAX_PLAYBACK_WAIT);
    });
  }

  /** 完整播放一段声音：开始 -> 等待结束 */
  async function playToEnd(src: string): Promise<void> {
    const audio = await startPlayback(src);
    await waitForPlaybackEnd(audio);
  }

  /** 把一次播放加入串行队列，前一个播放结束后才会开始下一个 */
  function enqueuePlayback(src: string): Promise<void> {
    const run = playbackTail.then(() => playToEnd(src));
    // 吞掉错误以保持队列继续运行，但把结果返回给调用方
    playbackTail = run.catch(() => {});
    return run;
  }

  async function flushPending(): Promise<void> {
    const sources = pendingSources.splice(0, pendingSources.length);
    for (const src of sources) {
      try {
        await enqueuePlayback(src);
      } catch (error) {
        console.warn('[AudioUnlock] pending sound play failed:', error);
      }
    }
  }

  async function unlock(fromUserGesture = false): Promise<boolean> {
    if (unlocked) return true;

    try {
      // 解锁只需让静音音频成功开始播放即可，无需等待结束
      await startPlayback(SILENT_WAV);
      unlocked = true;
      removeListeners();
      await flushPending();
      return true;
    } catch (error) {
      // 用户尚未与页面交互前的失败属于预期（浏览器自动播放策略），声音会排队等待解锁；
      // 仅在“用户手势已触发却仍失败”这种意外情况下才告警。
      if (fromUserGesture) {
        console.warn('[AudioUnlock] audio unlock failed after user gesture:', error);
      }
      return false;
    }
  }

  function unlockByUserGesture(): void {
    void unlock(true);
  }

  function install(): void {
    if (installed || typeof window === 'undefined') return;
    installed = true;
    UNLOCK_EVENTS.forEach(eventName => {
      window.addEventListener(eventName, unlockByUserGesture, { once: true, passive: true });
    });
  }

  async function play(src: string): Promise<void> {
    if (!unlocked) {
      pendingSources.push(src);
      const didUnlock = await unlock();
      if (!didUnlock) return;
      return;
    }

    await enqueuePlayback(src);
  }

  function setAudioFactory(factory: AudioFactory): void {
    audioFactory = factory;
  }

  function resetForTest(): void {
    removeListeners();
    installed = false;
    unlocked = false;
    pendingSources.splice(0, pendingSources.length);
    playbackTail = Promise.resolve();
    audioFactory = createAudioElement;
  }

  return {
    install,
    unlock,
    play,
    setAudioFactory,
    resetForTest,
    get isUnlocked() {
      return unlocked;
    },
    get pendingCount() {
      return pendingSources.length;
    }
  };
}

const audioUnlock = createAudioUnlock();

export function useAudioUnlock() {
  return audioUnlock;
}
