import { vi, it, expect, describe } from 'vitest';

import {
  RefreshQueue,
  getCurrentPath,
  redirectToLogin,
  isRefreshEndpoint,
} from './api-client-helpers';

describe('api-client helpers', () => {
  it('resolves every queued request and clears the queue', async () => {
    const queue = new RefreshQueue();
    const first = vi.fn();
    const second = vi.fn();

    queue.add({ resolve: first, reject: vi.fn() });
    queue.add({ resolve: second, reject: vi.fn() });
    queue.resolve();
    queue.resolve();

    expect(first).toHaveBeenCalledOnce();
    expect(second).toHaveBeenCalledOnce();
  });

  it('rejects every queued request and clears the queue', () => {
    const queue = new RefreshQueue();
    const firstReject = vi.fn();
    const secondReject = vi.fn();
    const error = new Error('refresh failed');

    queue.add({ resolve: vi.fn(), reject: firstReject });
    queue.add({ resolve: vi.fn(), reject: secondReject });
    queue.reject(error);

    expect(firstReject).toHaveBeenCalledWith(error);
    expect(secondReject).toHaveBeenCalledWith(error);
  });

  it('identifies only login and refresh endpoints', () => {
    expect(isRefreshEndpoint('/auth/login')).toBe(true);
    expect(isRefreshEndpoint('/auth/refresh')).toBe(true);
    expect(isRefreshEndpoint('/users/me')).toBe(false);
    expect(isRefreshEndpoint()).toBe(false);
  });

  it('does not redirect during server-side execution', () => {
    expect(() => redirectToLogin('/sessions')).not.toThrow();
  });

  it('returns the server fallback path', () => {
    expect(getCurrentPath()).toBe('/');
  });
});
