import rateLimit from 'express-rate-limit';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Translation rate limiter (more restrictive)
export const translationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limit each IP to 20 translation requests per 5 minutes
  message: {
    status: 'error',
    message: 'Too many translation requests. Please wait 5 minutes before trying again.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Contact form rate limiter (very restrictive)
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 contact form submissions per hour
  message: {
    status: 'error',
    message: 'Too many contact form submissions. Please wait an hour before submitting again.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
