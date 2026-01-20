import { createStorage } from '@trix/utils';

const storagePrefix = import.meta.env.VITE_STORAGE_PREFIX || 'TRIX_';

export const localStg = createStorage<StorageType.Local>('local', storagePrefix);

export const sessionStg = createStorage<StorageType.Session>('session', storagePrefix);
