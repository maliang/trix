import { createStorage } from '@trix/utils';
const storagePrefix = import.meta.env.VITE_STORAGE_PREFIX || 'TRIX_';
export const localStg = createStorage('local', storagePrefix);
export const sessionStg = createStorage('session', storagePrefix);
