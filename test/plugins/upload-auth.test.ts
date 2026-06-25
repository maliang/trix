import { describe, expect, it } from 'vitest';
import { buildUploadHeaders } from '@/plugins/upload-auth';

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
});
