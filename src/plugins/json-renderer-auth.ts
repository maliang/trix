import { jsonRendererConfig } from '@/config/json-renderer';
import { localStg } from '@/utils/storage';

export interface JsonRendererAuthConfig {
  withToken?: boolean;
  tokenKey?: string;
  tokenHeaderName?: string;
  tokenPrefix?: string;
}

export type JsonRendererHeaders = Record<string, string>;

export function getJsonRendererToken(
  config: Pick<JsonRendererAuthConfig, 'tokenKey'> = jsonRendererConfig
): string | null {
  const tokenKey = config.tokenKey || 'token';

  return localStg.get(tokenKey as keyof StorageType.Local) as string | null;
}

export function buildJsonRendererAuthHeaders(
  headers: JsonRendererHeaders | undefined,
  config: JsonRendererAuthConfig = jsonRendererConfig,
  getToken: () => string | null | undefined = () => getJsonRendererToken(config)
): JsonRendererHeaders {
  const explicitHeaders = { ...(headers || {}) };

  if (config.withToken === false) {
    return explicitHeaders;
  }

  const token = getToken();
  if (!token) {
    return explicitHeaders;
  }

  const headerName = config.tokenHeaderName || 'Authorization';
  const prefix = config.tokenPrefix || '';

  return {
    [headerName]: prefix ? `${prefix}${token}` : token,
    ...explicitHeaders
  };
}
