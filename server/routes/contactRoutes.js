import express from 'express';
import ContactController from '../controllers/ContactController.js';
import { contactLimiter, generalLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const contactController = new ContactController();

// Contact form routes with rate limiting
router.post('/contact', contactLimiter, contactController.submitContactForm);
router.post('/contact/newsletter', generalLimiter, contactController.subscribeNewsletter);

// Email verification route (less restrictive)
router.get('/contact/verify', generalLimiter, contactController.verifyEmailService);

export default router;
