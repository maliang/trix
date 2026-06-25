import { defineComponent, h, useAttrs } from 'vue';
import { NUpload } from 'naive-ui';
import { jsonRendererConfig } from '@/config/json-renderer';
import {
  buildJsonRendererAuthHeaders,
  type JsonRendererAuthConfig,
  type JsonRendererHeaders
} from './json-renderer-auth';

type UploadAuthConfig = JsonRendererAuthConfig;
type UploadHeaders = JsonRendererHeaders;

export function buildUploadHeaders(
  headers: UploadHeaders | undefined,
  getToken?: () => string | null | undefined,
  config: UploadAuthConfig = jsonRendererConfig
): UploadHeaders {
  return buildJsonRendererAuthHeaders(headers, config, getToken);
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
