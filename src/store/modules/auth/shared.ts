import { localStg } from '@/utils/storage';

/**
 * 获取 Token
 * @returns Token 字符串
 */
export function getToken(): string {
  return localStg.get('token') || '';
}

/**
 * 清除认证相关的存储
 */
export function clearAuthStorage(): void {
  localStg.remove('token');
  localStg.remove('refreshToken');
}
