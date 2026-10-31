type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

class RefreshQueue {
  private queue: FailedRequest[] = [];

  add(request: FailedRequest): void {
    this.queue.push(request);
  }

  resolve(): void {
    this.flush();
  }

  reject(error: unknown): void {
    this.flush(error);
  }

  private flush(error?: unknown): void {
    const requests = this.queue;
    this.queue = [];

    requests.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else resolve();
    });
  }
}

const isRefreshEndpoint = (url?: string): boolean =>
  ['/auth/login', '/auth/refresh'].some((path) => url?.includes(path));

const getCurrentPath = (): string =>
  typeof window !== 'undefined' ? window.location.pathname : '/';

const redirectToLogin = (currentPath: string): void => {
  if (typeof window !== 'undefined') {
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  }
};

export { RefreshQueue, getCurrentPath, isRefreshEndpoint, redirectToLogin };
