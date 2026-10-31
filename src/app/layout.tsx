import type { Metadata } from 'next';

import './globals.css';
import { I18nProvider } from '@/context/i18n';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { PwaServiceWorker } from '@/components/pwa-service-worker';
import { PwaInstallManager } from '@/components/pwa-install-manager';

export const metadata: Metadata = {
  title: 'Mimkat',
  description: 'Mimkat Application',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/images/logo.png', apple: '/images/icon-192.png' },
  appleWebApp: { capable: true, title: 'Mimkat', statusBarStyle: 'default' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          enableSystem
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
        >
          <QueryProvider>
            <I18nProvider>{children}</I18nProvider>
          </QueryProvider>
          <Toaster position="top-center" />
          <PwaServiceWorker />
          <PwaInstallManager />
        </ThemeProvider>
      </body>
    </html>
  );
}
