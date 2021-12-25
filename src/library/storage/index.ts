/**
 * 本地缓存类
 */
export default class Storage {
    /**
     * 如果没取到值, 默认返回undefined
     * @param key 
     * @param defaultValue 
     * @returns 
     */
    static get<T>(key: string = '', defaultValue: T | undefined = undefined): T | undefined {
        key = `${key}-${location.href}`

        let storageStr = localStorage.getItem(key)
        if (storageStr === null) {
            return defaultValue
        }
        try {
            let storage = JSON.parse(storageStr)
            return storage
        } catch (e) {
            return defaultValue
        }
    }
    static set(key: string, value: any[] | { [key: string]: any }) {
        key = `${key}-${location.href}`

        let storageStr = JSON.stringify(value)

        try {
            localStorage.setItem(key, storageStr)
        } catch (e) {
            // 存储异常, 说明Storage满了

            // Storage缓存key并没有规律, 清除一半也有漏网之鱼
            // 不如直接自动清除之前所有缓存
            let totalStorageKey = localStorage.length
            for (let i = 0; i < totalStorageKey; i++) {
                let needRemoveKey = localStorage.key(i)
                if (typeof needRemoveKey === 'string') {
                    localStorage.removeItem(needRemoveKey)
                }
            }
        }

        return true
    }
    static remove(key: string) {
        key = `${key}-${location.href}`

        localStorage.removeItem(key)
        return true
    }
}