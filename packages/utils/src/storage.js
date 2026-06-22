import localforage from 'localforage';
export function createStorage(type, storagePrefix) {
    const stg = type === 'session' ? window.sessionStorage : window.localStorage;
    const storage = {
        /** 设置存储 */
        set(key, value) {
            const json = JSON.stringify(value);
            stg.setItem(`${storagePrefix}${key}`, json);
        },
        /** 获取存储 */
        get(key) {
            const json = stg.getItem(`${storagePrefix}${key}`);
            if (json) {
                let storageData = null;
                try {
                    storageData = JSON.parse(json);
                }
                catch { }
                if (storageData !== null) {
                    return storageData;
                }
            }
            stg.removeItem(`${storagePrefix}${key}`);
            return null;
        },
        remove(key) {
            stg.removeItem(`${storagePrefix}${key}`);
        },
        clear() {
            stg.clear();
        }
    };
    return storage;
}
export function createLocalforage(driver) {
    const driverMap = {
        local: localforage.LOCALSTORAGE,
        indexedDB: localforage.INDEXEDDB,
        webSQL: localforage.WEBSQL
    };
    localforage.config({
        driver: driverMap[driver]
    });
    return localforage;
}
