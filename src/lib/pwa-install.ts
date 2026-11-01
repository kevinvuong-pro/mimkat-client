const MOBILE_USER_AGENT =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Silk|Kindle|Tablet/i;
const IN_APP_USER_AGENT =
  /FBAN|FBAV|FB_IAB|FBSV|Instagram|Zalo|Line\/|TikTok|Bytedance|musically|MicroMessenger|WeChat|Twitter|LinkedInApp|Snapchat|Pinterest|Reddit|WebView|\bwv\b|;\s*wv\)/i;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const getUserAgent = (userAgent?: string): string => {
  if (userAgent !== undefined) return userAgent;
  if (typeof navigator !== 'undefined') return navigator.userAgent;
  return '';
};

const isTouchMac = (userAgent: string): boolean =>
  /Macintosh/i.test(userAgent) &&
  typeof navigator !== 'undefined' &&
  Number((navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints) > 1;

const isMobileBrowser = (userAgent?: string): boolean => {
  const ua = getUserAgent(userAgent);
  if (MOBILE_USER_AGENT.test(ua)) return true;
  return isTouchMac(ua);
};

const isIOS = (userAgent?: string): boolean => {
  const ua = getUserAgent(userAgent);
  return /iPad|iPhone|iPod/i.test(ua) || isTouchMac(ua);
};

const isAndroid = (userAgent?: string): boolean => /Android/i.test(getUserAgent(userAgent));

const isWebView = (userAgent?: string): boolean => {
  const ua = getUserAgent(userAgent);
  if (IN_APP_USER_AGENT.test(ua)) return true;

  const ios = isIOS(ua);
  if (
    ios &&
    /AppleWebKit/i.test(ua) &&
    !/Safari/i.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|Brave/i.test(ua)
  )
    return true;

  // Android WebView heuristic. Default Android WebView user agents contain
  // "Version/" in addition to "Chrome/", while regular Chrome does not.
  if (
    /Android/i.test(ua) &&
    /AppleWebKit/i.test(ua) &&
    /Version\//i.test(ua) &&
    !/SamsungBrowser/i.test(ua) &&
    !/Edg/i.test(ua) &&
    !/OPR/i.test(ua) &&
    !/CocCoc/i.test(ua) &&
    !/CriOS/i.test(ua) &&
    !/Brave/i.test(ua) &&
    !/Firefox\//i.test(ua)
  ) {
    return true;
  }

  // Android WebView / unknown in-app browser heuristic.
  if (
    /Android/i.test(ua) &&
    /AppleWebKit/i.test(ua) &&
    !/Chrome\//i.test(ua) &&
    !/Firefox\//i.test(ua) &&
    !/SamsungBrowser/i.test(ua) &&
    !/Edg/i.test(ua) &&
    !/OPR/i.test(ua) &&
    !/CocCoc/i.test(ua) &&
    !/Brave/i.test(ua) &&
    !/CriOS/i.test(ua)
  ) {
    return true;
  }

  return false;
};

const isStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      window.matchMedia('(display-mode: window-controls-overlay)').matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone) ||
      document.referrer.startsWith('android-app://')
    );
  } catch {
    return false;
  }
};

export type OpenInBrowserResult = 'intent' | 'instructions';
export type OpenInstalledAppResult = 'opened' | 'instructions';

const openInBrowser = (targetUrl?: string): OpenInBrowserResult => {
  if (typeof window === 'undefined') return 'instructions';
  const url = targetUrl || window.location.href;
  const ua = navigator.userAgent;

  if (isAndroid(ua)) {
    try {
      const parsed = new URL(url, window.location.href);
      const intentUrl =
        `intent://${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}` +
        `#Intent;scheme=${parsed.protocol.replace(':', '')};` +
        'action=android.intent.action.VIEW;' +
        `S.browser_fallback_url=${encodeURIComponent(url)};end`;
      window.location.href = intentUrl;
      return 'intent';
    } catch {
      window.location.href = url;
      return 'intent';
    }
  }

  if (isIOS(ua)) {
    try {
      const parsed = new URL(url, window.location.href);
      const scheme = parsed.protocol === 'https:' ? 'x-safari-https' : 'x-safari-http';
      window.location.href = `${scheme}://${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`;
      return 'intent';
    } catch {
      // Fall through to best-effort window.open.
    }
  }

  try {
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (opened) return 'intent';
  } catch {
    // Ignore and fall back to instructions.
  }
  return 'instructions';
};

const openInstalledApp = (targetUrl?: string): OpenInstalledAppResult => {
  if (typeof window === 'undefined') return 'instructions';

  const url = targetUrl || window.location.origin;
  try {
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (opened) return 'opened';
  } catch {
    // Fall through to the current tab.
  }

  try {
    window.location.assign(url);
    return 'opened';
  } catch {
    return 'instructions';
  }
};

const isPwaInstalled = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  if (isStandalone()) return true;

  if (typeof navigator !== 'undefined' && 'getInstalledRelatedApps' in navigator) {
    try {
      const apps = await (
        navigator as Navigator & {
          getInstalledRelatedApps?: () => Promise<unknown[]>;
        }
      ).getInstalledRelatedApps?.();
      return Array.isArray(apps) && apps.length > 0;
    } catch {
      return false;
    }
  }

  return false;
};

export {
  isIOS,
  isAndroid,
  isWebView,
  isStandalone,
  openInBrowser,
  isPwaInstalled,
  isMobileBrowser,
  openInstalledApp,
  type BeforeInstallPromptEvent,
};
