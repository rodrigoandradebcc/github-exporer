import { ApiError } from '../client';

describe('ApiError', () => {
  it('extends Error', () => {
    const err = new ApiError(404, 'Not Found');
    expect(err).toBeInstanceOf(Error);
  });

  it('stores status and message', () => {
    const err = new ApiError(404, 'Not Found');
    expect(err.status).toBe(404);
    expect(err.message).toBe('Not Found');
    expect(err.name).toBe('ApiError');
  });

  it('defaults isRateLimit to false', () => {
    const err = new ApiError(500, 'Server Error');
    expect(err.isRateLimit).toBe(false);
  });

  it('sets isRateLimit when explicitly passed', () => {
    const err = new ApiError(403, 'Forbidden', true);
    expect(err.isRateLimit).toBe(true);
  });

  it('detects rate limit on 429', () => {
    const err = new ApiError(429, 'Too Many Requests', true);
    expect(err.isRateLimit).toBe(true);
    expect(err.status).toBe(429);
  });
});
