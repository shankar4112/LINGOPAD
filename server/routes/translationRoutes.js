import express from 'express';
import TranslationController from '../controllers/TranslationController.js';
import { translationLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const translationController = new TranslationController();

// Apply translation rate limiter to all routes
router.use(translationLimiter);

// Translation routes
router.get('/get-started', translationController.getTranslationPage);
router.post('/get-started', translationController.translateText);
router.get('/supported-languages', translationController.getSupportedLanguages);

// Saved translations routes
router.post('/save-translation', translationController.saveTranslation);
router.get('/saved-translations', translationController.getSavedTranslations);
router.delete('/clear-translations', translationController.clearTranslations);
router.delete('/translation/:id', translationController.deleteTranslation);

// Pronunciation route
router.post('/speak-pronunciation', translationController.speakPronunciation);

export default router;
