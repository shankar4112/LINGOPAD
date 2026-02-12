import express from 'express';
import AppController from '../controllers/AppController.js';

const router = express.Router();
const appController = new AppController();

// App routes
router.get('/', appController.getApiRoot);
router.get('/health', appController.getHealthCheck);
router.get('/stats', appController.getStats);

export default router;
