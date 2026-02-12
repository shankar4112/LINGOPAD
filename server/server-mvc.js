import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import process from 'process';
import { initializeDatabase } from './config/database.js';

// Import middleware
import { requestLogger, responseTime, securityHeaders, corsConfig, validateInput } from './middleware/common.js';
import { generalLimiter } from './middleware/rateLimiter.js';

// Import routes
import appRoutes from './routes/appRoutes.js';
import translationRoutes from './routes/translationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Import controllers for error handling
import AppController from './controllers/AppController.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Initialize controllers
const appController = new AppController();

// Basic middleware setup
app.set('trust proxy', 1); // Trust first proxy
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Security and logging middleware
app.use(securityHeaders);
app.use(requestLogger);
app.use(responseTime);

// CORS configuration
app.use(cors(corsConfig));

// Input validation and rate limiting
app.use(validateInput);
app.use(generalLimiter);

// Routes
app.use('/', appRoutes);
app.use('/', translationRoutes);
app.use('/', contactRoutes);

// 404 handler
app.use('*', appController.handleNotFound);

// Global error handler
app.use(appController.handleError);

// Start server
async function startServer() {
  try {
    await initializeDatabase();
    const server = app.listen(PORT, HOST, () => {
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║                         LingoPad Server                        ║
║                      MVC Architecture v2.0                     ║
╠════════════════════════════════════════════════════════════════╣
║  🌐 Server running on: http://localhost:${PORT}                    ║
║  🔗 Network access:    http://0.0.0.0:${PORT}                      ║
║  📊 Environment:       ${process.env.NODE_ENV || 'development'}                        ║
║  🚀 Features:          Supported languages, AI translation     ║
║  📧 Email service:     ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}                       ║
╠════════════════════════════════════════════════════════════════╣
║  API Endpoints:                                                ║
║  • GET  /              - API documentation                     ║
║  • GET  /health        - Health check                          ║
║  • POST /get-started   - Translation service                   ║
║  • POST /contact       - Contact form                          ║
║  • GET  /saved-translations - Translation history             ║
╚════════════════════════════════════════════════════════════════╝
  `);
    });

    server.on('error', (err) => {
      console.error('Server startup error:', err);
      process.exit(1);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`${signal} received, shutting down gracefully`);
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      console.error('Unhandled promise rejection:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught exception:', error);
      shutdown('uncaughtException');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
