import { it, expect, describe } from 'vitest';

import { canOpenExternalBrowser, isWebView, isMobileBrowser } from './pwa-install';

describe('pwa environment detection', () => {
  it('detects mobile browsers', () => {
    expect(isMobileBrowser('Mozilla/5.0 (Linux; Android 14) Mobile')).toBe(true);
    expect(isMobileBrowser('Mozilla/5.0 (X11; Linux x86_64) Chrome/120')).toBe(false);
  });

  it('detects common Android and iOS webviews', () => {
    expect(isWebView('Mozilla/5.0 (Linux; Android 14; wv) AppleWebKit/537.36')).toBe(true);
    expect(
      isWebView('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'),
    ).toBe(true);
    expect(
      isWebView(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1',
      ),
    ).toBe(false);
  });

  it('only offers external browser opening for Android webviews', () => {
    expect(canOpenExternalBrowser('Mozilla/5.0 (Linux; Android 14; wv) AppleWebKit/537.36')).toBe(
      true,
    );
    expect(
      canOpenExternalBrowser(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
      ),
    ).toBe(false);
    expect(canOpenExternalBrowser('Mozilla/5.0 (Linux; Android 14) Chrome/120')).toBe(false);
  });
});
