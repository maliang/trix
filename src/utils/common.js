/**
 * 将记录转换为选项数组
 *
 * @example
 *   ```ts
 *   const record = {
 *     key1: 'label1',
 *     key2: 'label2'
 *   };
 *   const options = transformRecordToOption(record);
 *   // [
 *   //   { value: 'key1', label: 'label1' },
 *   //   { value: 'key2', label: 'label2' }
 *   // ]
 *   ```;
 *
 * @param record 记录对象
 */
export function transformRecordToOption(record) {
    return Object.entries(record).map(([value, label]) => ({
        value,
        label
    }));
}
/**
 * 切换 HTML 元素的 class
 * @param className - class 名称
 */
export function toggleHtmlClass(className) {
    function add() {
        document.documentElement.classList.add(className);
    }
    function remove() {
        document.documentElement.classList.remove(className);
    }
    return {
        add,
        remove
    };
}
/**
 * 从错误对象中提取 HTTP 状态码
 * 支持 Error、ApiError 以及自定义附加了 status 属性的错误对象
 * @param err 错误对象
 * @returns HTTP 状态码或 null
 */
export function getHttpErrorStatus(err) {
    if (err && typeof err === 'object' && 'status' in err) {
        const status = err.status;
        if (typeof status === 'number')
            return status;
        if (typeof status === 'string') {
            const parsed = Number(status);
            if (!isNaN(parsed))
                return parsed;
        }
    }
    return null;
}
