'use client';

import Link from 'next/link';
import Image from 'next/image';

import { getAccessToken } from '@/lib/auth-token-storage';
import { PwaInstallManager } from '@/components/pwa-install-manager';

const highlights = [
  ['Tài khoản của bạn', 'Quản lý hồ sơ và thông tin cá nhân dễ dàng.'],
  ['Bảo mật an tâm', 'Theo dõi các phiên đăng nhập trên mọi thiết bị.'],
  ['Trải nghiệm gọn gàng', 'Mọi thứ cần thiết được đặt đúng nơi bạn cần.'],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Mimkat"
              width={42}
              height={42}
              className="rounded-xl"
            />
            <span className="text-lg font-semibold tracking-tight">Mimkat</span>
          </Link>
          {!getAccessToken() && (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-3 py-2 text-sm text-slate-300 transition hover:text-white"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Đăng ký
              </Link>
            </div>
          )}
        </header>

        <section className="flex flex-1 items-center py-10">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Chào mừng đến với Mimkat
            </p>
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
              Một nơi đơn giản
              <span className="block text-cyan-300">cho tài khoản của bạn.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Quản lý hồ sơ, bảo mật và các phiên đăng nhập của bạn trong một trải nghiệm nhanh, rõ
              ràng và thân thiện.
            </p>
            {!getAccessToken() ? (
              <Link
                href="/register"
                className="mt-9 inline-block rounded-full bg-cyan-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Tạo tài khoản miễn phí
              </Link>
            ) : (
              <Link
                href="/home"
                className="mt-9 inline-block rounded-full bg-cyan-300 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Trang chủ
              </Link>
            )}
          </div>
        </section>

        <section className="grid gap-4 border-t border-white/10 py-8 md:grid-cols-3">
          {highlights.map(([title, description]) => (
            <article key={title} className="rounded-2xl bg-white/5 p-5">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </article>
          ))}
        </section>
      </div>
      <PwaInstallManager />
    </main>
  );
}
