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

  it('uses logo path as-is', () => {
    window.__LARTRIX_CONFIG__ = {
      apiPrefix: '/api/admin',
      appTitle: 'Custom Admin',
      logo: '/uploads/thinkrix/20260630/logo.png'
    };
    vi.spyOn(localStg, 'get').mockImplementation(key => (key === 'themeSettings' ? null : null));
    document.body.innerHTML = '<div id="app"></div>';

    setupLoading();

    expect(document.getElementById('app')?.innerHTML).toContain('src="/uploads/thinkrix/20260630/logo.png"');
    expect(document.getElementById('app')?.innerHTML).not.toContain('/admin/uploads/thinkrix');
  });

  it('falls back to admin favicon when no logo is configured', () => {
    window.__LARTRIX_CONFIG__ = {
      apiPrefix: '/api/admin',
      appTitle: 'Custom Admin',
      logo: ''
    };
    vi.spyOn(localStg, 'get').mockReturnValue(null);
    document.body.innerHTML = '<div id="app"></div>';

    setupLoading();

    expect(document.getElementById('app')?.innerHTML).toContain('src="/admin/favicon.svg"');
  });
});
