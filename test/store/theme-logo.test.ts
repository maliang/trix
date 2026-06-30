import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useThemeStore } from '@/store/modules/theme';
import { localStg } from '@/utils/storage';

describe('theme logo', () => {
  beforeEach(() => {
    vi.spyOn(localStg, 'get').mockReturnValue(null);
    vi.spyOn(localStg, 'set').mockImplementation(() => {});
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns configured logo path as-is', () => {
    const store = useThemeStore();

    store.logo = '/uploads/thinkrix/20260630/logo.png';

    expect(store.logo).toBe('/uploads/thinkrix/20260630/logo.png');
  });
});
