import { afterEach, describe, expect, it, vi } from 'vitest';
import { setupLoading } from '@/plugins/loading';
import { localStg } from '@/utils/storage';

describe('setupLoading', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete window.__LARTRIX_CONFIG__;
    document.body.innerHTML = '';
  });

  it('uses injected backend title when cached theme title is missing', () => {
    window.__LARTRIX_CONFIG__ = {
      apiPrefix: '/api/admin',
      appTitle: 'Custom Admin',
      logo: '/admin/favicon.svg'
    };
    vi.spyOn(localStg, 'get').mockReturnValue(null);
    document.body.innerHTML = '<div id="app"></div>';

    setupLoading();

    expect(document.getElementById('app')?.innerHTML).toContain('Custom Admin');
  });
});
