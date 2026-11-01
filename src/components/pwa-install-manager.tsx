'use client';

import { useState, useEffect } from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

import {
  isIOS,
  isAndroid,
  isWebView,
  isStandalone,
  openInBrowser,
  isPwaInstalled,
  isMobileBrowser,
  openInstalledApp,
  type BeforeInstallPromptEvent,
} from '@/lib/pwa-install';
import { Button } from '@/components/ui/button';

type ManagerState = 'ios' | 'hidden' | 'browser' | 'install' | 'installed';

export function PwaInstallManager() {
  const [isVi, setIsVi] = useState(false);
  const [state, setState] = useState<ManagerState>('hidden');
  const [showInstructions, setShowInstructions] = useState(false);
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  const isBrowserAction = state === 'browser';

  useEffect(() => {
    setIsVi(typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('vi'));

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

    if (!isMobileBrowser(userAgent) || isStandalone()) return;

    let cancelled = false;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      try {
        window.localStorage.removeItem('pwa-installed');
      } catch {
        // Ignore storage access errors.
      }
      setPrompt(event as BeforeInstallPromptEvent);

      if (!isWebView(userAgent)) {
        setState('install');
      }
    };

    const handleAppInstalled = () => {
      try {
        window.localStorage.setItem('pwa-installed', '1');
      } catch {
        // Ignore storage access errors.
      }
      setPrompt(null);
      setState('installed');
      setShowInstructions(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    const initializeState = async () => {
      const installed = await isPwaInstalled();
      if (cancelled) return;
      if (installed) {
        setState('installed');
        return;
      }

      if (isWebView(userAgent)) {
        setState('browser');
      } else if (isMobileBrowser(userAgent)) {
        setState(isIOS(userAgent) ? 'ios' : 'install');
      }
    };

    void initializeState();

    return () => {
      cancelled = true;
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (!isMobileBrowser(typeof navigator !== 'undefined' ? navigator.userAgent : '')) return null;
  if (isStandalone()) return null;

  if (state === 'hidden') return null;

  const handleAction = async () => {
    if (state === 'installed') {
      if (openInstalledApp() === 'instructions') setShowInstructions(true);
      return;
    }

    if (isBrowserAction) {
      const result = openInBrowser();
      if (result === 'instructions') setShowInstructions(true);
      else {
        window.setTimeout(() => {
          if (document.visibilityState === 'visible') setShowInstructions(true);
        }, 500);
      }
      return;
    }

    if (state === 'ios') {
      setShowInstructions(true);
      return;
    }

    if (await isPwaInstalled()) {
      setState('hidden');
      return;
    }

    if (!prompt) {
      setShowInstructions(true);
      return;
    }

    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === 'accepted') {
        try {
          window.localStorage.setItem('pwa-installed', '1');
        } catch {
          // Ignore storage access errors.
        }
        setState('installed');
      }
    } catch {
      setShowInstructions(true);
    } finally {
      setPrompt(null);
    }
  };

  const isViLang = isVi;
  const labels = isViLang
    ? {
        installTitle: 'Cài đặt ứng dụng',
        openTitle: 'Mở ứng dụng',
        browserTitle: 'Mở bằng trình duyệt',
        close: 'Đóng',
        howTo: 'Cách tiếp tục',
      }
    : {
        installTitle: 'Install App',
        openTitle: 'Open App',
        browserTitle: 'Open in Browser',
        close: 'Close',
        howTo: 'How to continue',
      };

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const instructions = isBrowserAction
    ? isAndroid(ua)
      ? isViLang
        ? 'Nhấn Mở. Nếu không có gì xảy ra, mở menu trình duyệt và chọn "Mở bằng Chrome/trình duyệt mặc định".'
        : 'Tap Open. If nothing happens, open the browser menu and choose "Open in Chrome/default browser".'
      : isViLang
        ? 'Nhấn Mở. Nếu không mở Safari, nhấn nút Chia sẻ rồi chọn "Mở trong Safari".'
        : 'Tap Open. If Safari does not open, tap the Share button and choose "Open in Safari".'
    : state === 'ios'
      ? isViLang
        ? 'Nhấn nút Chia sẻ, sau đó chọn "Thêm vào Màn hình chính".'
        : 'Tap the Share button, then choose "Add to Home Screen".'
      : isViLang
        ? 'Mở menu trình duyệt (⋮) và chọn "Cài đặt ứng dụng" hoặc "Thêm vào Màn hình chính".'
        : 'Open the browser menu (⋮) and choose "Install app" or "Add to Home screen".';

  return (
    <aside className="fixed bottom-4 left-1/2 z-50 flex w-fit max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-xl border bg-background p-3 text-foreground shadow-lg">
      {isBrowserAction ? (
        <ExternalLink className="mx-2 size-5 shrink-0" />
      ) : (
        <Download className="mx-2 size-5 shrink-0" />
      )}
      <Button size="sm" onClick={handleAction}>
        {state === 'installed'
          ? labels.openTitle
          : isBrowserAction
            ? labels.browserTitle
            : labels.installTitle}
      </Button>
      <Button
        aria-label={labels.close}
        size="icon"
        variant="ghost"
        onClick={() => setState('hidden')}
      >
        <X />
      </Button>
      {showInstructions && (
        <div className="absolute bottom-full left-1/2 mb-2 w-[400px] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border bg-background p-4 text-sm shadow-lg">
          <p className="font-semibold">{labels.howTo}</p>
          <p className="mt-2">{instructions}</p>
          <Button className="mt-3" size="sm" onClick={() => setShowInstructions(false)}>
            {isVi ? 'Đã hiểu' : 'Got it'}
          </Button>
        </div>
      )}
    </aside>
  );
}
