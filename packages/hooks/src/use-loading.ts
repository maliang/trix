import useBoolean from './use-boolean';

/**
 * Loading 状态管理 Hook
 *
 * @param initValue 初始值
 */
export default function useLoading(initValue = false) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(initValue);

  return {
    loading,
    startLoading,
    endLoading
  };
}
