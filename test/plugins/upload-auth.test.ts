import { describe, expect, it, vi } from 'vitest';
import { getJsonRendererToken } from '@/plugins/json-renderer-auth';
import { buildUploadHeaders } from '@/plugins/upload-auth';
import { localStg } from '@/utils/storage';

describe('buildUploadHeaders', () => {
  it('adds the configured bearer token header for uploads', () => {
    const headers = buildUploadHeaders(
      { 'X-Trace-Id': 'trace-1' },
      () => 'abc123',
      {
        withToken: true,
        tokenHeaderName: 'Authorization',
        tokenPrefix: 'Bearer '
      }
    );

    expect(headers).toEqual({
      Authorization: 'Bearer abc123',
      'X-Trace-Id': 'trace-1'
    });
  });

  it('keeps explicit schema headers when they override auth', () => {
    const headers = buildUploadHeaders(
      { Authorization: 'Bearer custom', 'X-Trace-Id': 'trace-1' },
      () => 'abc123',
      {
        withToken: true,
        tokenHeaderName: 'Authorization',
        tokenPrefix: 'Bearer '
      }
    );

    expect(headers.Authorization).toBe('Bearer custom');
  });

  it('does not add auth when token is missing or disabled', () => {
    expect(
      buildUploadHeaders({}, () => '', {
        withToken: true,
        tokenHeaderName: 'Authorization',
        tokenPrefix: 'Bearer '
      })
    ).toEqual({});

    expect(
      buildUploadHeaders({}, () => 'abc123', {
        withToken: false,
        tokenHeaderName: 'Authorization',
        tokenPrefix: 'Bearer '
      })
    ).toEqual({});
  });

  it('reads token from the configured storage key', () => {
    const getSpy = vi.spyOn(localStg, 'get').mockImplementation(key => {
      return key === 'access_token' ? 'custom-key-token' : null;
    });

    const headers = buildUploadHeaders(undefined, undefined, {
      withToken: true,
      tokenKey: 'access_token',
      tokenHeaderName: 'Authorization',
      tokenPrefix: 'Bearer '
    });

    expect(headers.Authorization).toBe('Bearer custom-key-token');
    expect(getSpy).toHaveBeenCalledWith('access_token');

    getSpy.mockRestore();
  });

  it('exposes the json renderer token helper for shared auth callers', () => {
    const getSpy = vi.spyOn(localStg, 'get').mockImplementation(key => {
      return key === 'access_token' ? 'shared-token' : null;
    });

    expect(getJsonRendererToken({ tokenKey: 'access_token' })).toBe('shared-token');
    expect(getSpy).toHaveBeenCalledWith('access_token');

    getSpy.mockRestore();
  });
});
