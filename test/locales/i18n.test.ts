import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import i18n, { $t, registerLocaleMessages } from '@/locales';
import { useAppStore } from '@/store/modules/app';

describe('application locale', () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
      clear: () => values.clear()
    });
    i18n.global.locale.value = 'zh-CN';
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('synchronizes and persists vue-i18n locale changes', () => {
    const store = useAppStore();

    store.changeLocale('en-US');

    expect(store.locale).toBe('en-US');
    expect(i18n.global.locale.value).toBe('en-US');
    expect(localStorage.getItem('trix-locale')).toBe('en-US');
  });

  it('registers a backend-provided locale without a frontend language module', () => {
    registerLocaleMessages('fr-FR', { icon: { lang: 'Langue' } });
    const store = useAppStore();

    store.changeLocale('fr-FR');

    expect(i18n.global.locale.value).toBe('fr-FR');
    expect($t('icon.lang')).toBe('Langue');
  });
});
