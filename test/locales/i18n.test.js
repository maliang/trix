import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import i18n from '@/locales';
import { useAppStore } from '@/store/modules/app';
describe('application locale', () => {
    beforeEach(() => {
        const values = new Map();
        vi.stubGlobal('localStorage', {
            getItem: (key) => values.get(key) ?? null,
            setItem: (key, value) => values.set(key, value),
            removeItem: (key) => values.delete(key),
            clear: () => values.clear()
        });
        i18n.global.locale.value = 'zh-CN';
        setActivePinia(createPinia());
    });
    it('synchronizes and persists vue-i18n locale changes', () => {
        const store = useAppStore();
        store.changeLocale('en-US');
        expect(store.locale).toBe('en-US');
        expect(i18n.global.locale.value).toBe('en-US');
        expect(localStorage.getItem('trix-locale')).toBe('en-US');
    });
});
