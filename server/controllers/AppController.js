class AppController {
  // GET / - API root endpoint
  getApiRoot = (req, res) => {
    res.json({
      status: 'success',
      message: 'LingoPad API is running',
      version: '2.0.0',
      description: 'AI-powered translation service for supported languages',
      endpoints: {
        translation: {
          'GET /get-started': 'Get translation service info',
          'POST /get-started': 'Translate text',
          'GET /supported-languages': 'Get supported languages list'
        },
        savedTranslations: {
          'POST /save-translation': 'Save a translation',
          'GET /saved-translations': 'Get all saved translations',
          'DELETE /clear-translations': 'Clear all translations',
          'DELETE /translation/:id': 'Delete specific translation'
        },
        contact: {
          'POST /contact': 'Submit contact form',
          'GET /contact/verify': 'Verify email service',
          'POST /contact/newsletter': 'Subscribe to newsletter'
        },
        utilities: {
          'POST /speak-pronunciation': 'Get pronunciation data'
        }
      },
      features: [
        'Supported language set (Hindi, Tamil, Telugu, Bengali, Gujarati, Punjabi, Kannada, Malayalam, Marathi, Japanese, Chinese, Korean, Arabic, Hebrew, Thai, Russian, Greek, Urdu)',
        'AI-powered translation (Hugging Face NLLB)',
        'Pronunciation generation',
        'Translation history',
        'Contact form with email notifications',
        'RESTful API architecture'
      ],
      timestamp: new Date().toISOString()
    });
  };

  // GET /health - Health check endpoint
  getHealthCheck = (req, res) => {
    res.json({
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development'
    });
  };

  // GET /stats - API statistics (simple version)
  getStats = async (req, res) => {
    try {
      // TODO: Implement proper analytics
      res.json({
        status: 'success',
        data: {
          message: 'Statistics endpoint ready for implementation',
          availableMetrics: [
            'Total translations',
            'Popular languages',
            'API usage',
            'User engagement'
          ]
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve statistics'
      });
    }
  };

  // Handle 404 errors
  handleNotFound = (req, res) => {
    res.status(404).json({
      status: 'error',
      message: `Endpoint not found: ${req.method} ${req.path}`,
      availableEndpoints: '/api-docs for full documentation',
      timestamp: new Date().toISOString()
    });
  };

  // Global error handler
  handleError = (error, req, res, next) => {
    console.error('Global error handler:', error);
    
    // Don't log error if response was already sent
    if (res.headersSent) {
      return next(error);
    }

    res.status(500).json({
      status: 'error',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      timestamp: new Date().toISOString()
    });
  };
}

export default AppController;
