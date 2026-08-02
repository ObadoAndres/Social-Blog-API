import rateLimit, { MemoryStore } from 'express-rate-limit';

const buildHandler = (message = 'Too many requests. Please try again later.') => {
  return (_req, res) => {
    res.status(429).json({
      success: false,
      message,
    });
  };
};

const createRateLimiter = ({
  windowMs,
  maxEnvKey,
  defaultMax,
  message,
  skipSuccessfulRequests = false,
}) => {
  const store = new MemoryStore();
  const limiter = rateLimit({
    windowMs,
    max: (req, res) => Number(process.env[maxEnvKey] || defaultMax),
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: buildHandler(message),
    store,
  });

  limiter.store = store;
  return limiter;
};

// Apply a general limiter to the whole API so repeated traffic is throttled early.
export const generalLimiter = createRateLimiter({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  maxEnvKey: 'RATE_LIMIT_MAX',
  defaultMax: 100,
  message: 'Too many requests. Please try again later.',
});

// Use a stricter limit on authentication endpoints because these are common brute-force targets.
export const authLimiter = createRateLimiter({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  maxEnvKey: 'AUTH_RATE_LIMIT_MAX',
  defaultMax: 10,
  message: 'Too many authentication attempts. Please wait a moment before trying again.',
  skipSuccessfulRequests: true,
});

export const resetRateLimitStores = () => {
  generalLimiter.store?.resetAll?.();
  authLimiter.store?.resetAll?.();
};
