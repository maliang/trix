type AudioFactory = (src?: string) => HTMLAudioElement;

const UNLOCK_EVENTS = ['pointerdown', 'keydown', 'touchstart', 'click'] as const;
const SILENT_WAV =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQQAAAAAAA==';

function createAudioElement(src?: string): HTMLAudioElement {
  return new Audio(src);
}

function createAudioUnlock() {
  let installed = false;
  let unlocked = false;
  let audioFactory: AudioFactory = createAudioElement;
  const pendingSources: string[] = [];

  function removeListeners(): void {
    UNLOCK_EVENTS.forEach(eventName => {
      window.removeEventListener(eventName, unlockByUserGesture);
    });
  }

  async function tryPlay(src: string): Promise<void> {
    const audio = audioFactory(src);
    await audio.play();
  }

  async function flushPending(): Promise<void> {
    const sources = pendingSources.splice(0, pendingSources.length);
    for (const src of sources) {
      try {
        await tryPlay(src);
      } catch (error) {
        console.warn('[AudioUnlock] pending sound play failed:', error);
      }
    }
  }

  async function unlock(): Promise<boolean> {
    if (unlocked) return true;

    try {
      await tryPlay(SILENT_WAV);
      unlocked = true;
      removeListeners();
      await flushPending();
      return true;
    } catch (error) {
      console.warn('[AudioUnlock] audio unlock failed:', error);
      return false;
    }
  }

  function unlockByUserGesture(): void {
    void unlock();
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

    await tryPlay(src);
  }

  function setAudioFactory(factory: AudioFactory): void {
    audioFactory = factory;
  }

  function resetForTest(): void {
    removeListeners();
    installed = false;
    unlocked = false;
    pendingSources.splice(0, pendingSources.length);
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
