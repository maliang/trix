import { defineComponent, h, useAttrs } from 'vue';
import { NUpload } from 'naive-ui';
import { jsonRendererConfig } from '@/config/json-renderer';
import { localStg } from '@/utils/storage';

interface UploadAuthConfig {
  withToken: boolean;
  tokenHeaderName: string;
  tokenPrefix?: string;
}

type UploadHeaders = Record<string, string>;

export function buildUploadHeaders(
  headers: UploadHeaders | undefined,
  getToken: () => string | null | undefined = () => localStg.get('token'),
  config: UploadAuthConfig = jsonRendererConfig
): UploadHeaders {
  const explicitHeaders = { ...(headers || {}) };

  if (!config.withToken) {
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

export const AuthUpload = defineComponent({
  name: 'AuthUpload',
  inheritAttrs: false,
  setup(_, { slots }) {
    const attrs = useAttrs();

    return () => {
      const { headers, ...restAttrs } = attrs;

      return h(
        NUpload,
        {
          ...restAttrs,
          headers: buildUploadHeaders(headers as UploadHeaders | undefined)
        },
        slots
      );
    };
  }
});
