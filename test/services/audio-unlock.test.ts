import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAudioUnlock } from '@/service/audio/unlock';

describe('audio unlock service', () => {
  beforeEach(() => {
    useAudioUnlock().resetForTest();
  });

  it('queues sound before unlock and flushes it after the first user gesture', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const play = vi.fn()
      .mockRejectedValueOnce(new Error('gesture required'))
      .mockResolvedValue(undefined)
      .mockResolvedValue(undefined);

    useAudioUnlock().setAudioFactory((src?: string) => ({
      src: src || '',
      play
    }) as unknown as HTMLAudioElement);
    useAudioUnlock().install();

    await useAudioUnlock().play('/sounds/audit.mp3');

    expect(useAudioUnlock().isUnlocked).toBe(false);
    expect(useAudioUnlock().pendingCount).toBe(1);

    await useAudioUnlock().unlock();

    expect(useAudioUnlock().isUnlocked).toBe(true);
    expect(useAudioUnlock().pendingCount).toBe(0);
    expect(play).toHaveBeenCalledTimes(3);

    warn.mockRestore();
  });

  it('keeps repeated sound requests before unlock', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const play = vi.fn()
      .mockRejectedValueOnce(new Error('gesture required'))
      .mockRejectedValueOnce(new Error('gesture required'))
      .mockRejectedValueOnce(new Error('gesture required'))
      .mockResolvedValue(undefined)
      .mockResolvedValue(undefined)
      .mockResolvedValue(undefined)
      .mockResolvedValue(undefined);

    useAudioUnlock().setAudioFactory((src?: string) => ({
      src: src || '',
      play
    }) as unknown as HTMLAudioElement);

    await useAudioUnlock().play('/sounds/audit.mp3');
    await useAudioUnlock().play('/sounds/audit.mp3');
    await useAudioUnlock().play('/sounds/audit.mp3');

    expect(useAudioUnlock().isUnlocked).toBe(false);
    expect(useAudioUnlock().pendingCount).toBe(3);

    await useAudioUnlock().unlock();

    expect(useAudioUnlock().isUnlocked).toBe(true);
    expect(useAudioUnlock().pendingCount).toBe(0);
    expect(play).toHaveBeenCalledTimes(7);

    warn.mockRestore();
  });

  it('plays immediately after audio is unlocked', async () => {
    const play = vi.fn().mockResolvedValue(undefined);

    useAudioUnlock().setAudioFactory((src?: string) => ({
      src: src || '',
      play
    }) as unknown as HTMLAudioElement);

    await useAudioUnlock().unlock();
    await useAudioUnlock().play('/sounds/audit.mp3');

    expect(useAudioUnlock().isUnlocked).toBe(true);
    expect(play).toHaveBeenCalledTimes(2);
  });
});
