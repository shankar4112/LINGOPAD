import Translation from '../models/Translation.js';
import TranslationService from '../services/TranslationService.js';

class TranslationController {
  constructor() {
    this.translationModel = new Translation();
    this.translationService = new TranslationService();
  }

  // GET /get-started - Render translation page
  getTranslationPage = (req, res) => {
    res.json({ 
      status: 'success', 
      message: 'Translation service is ready',
      supportedLanguages: this.translationService.getSupportedLanguages()
    });
  };

  // POST /get-started - Handle translation request
  translateText = async (req, res) => {
    try {
      const { inputText, targetLanguage, translationMethod = 'huggingface' } = req.body;

      if (!inputText || !targetLanguage) {
        return res.status(400).json({
          status: 'error',
          message: 'Input text and target language are required'
        });
      }

      // Check if language is supported
      if (!this.translationService.isLanguageSupported(targetLanguage)) {
        return res.status(400).json({
          status: 'error',
          message: `Unsupported language: ${targetLanguage}. Supported languages: ${this.translationService.getSupportedLanguages().join(', ')}`
        });
      }

      // Perform translation
      const result = await this.translationService.translate(
        inputText, 
        targetLanguage, 
        translationMethod
      );

      res.json({
        status: 'success',
        data: result
      });

    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Translation failed'
      });
    }
  };

  // POST /save-translation - Save translation to database
  saveTranslation = async (req, res) => {
    try {
      const {
        inputText,
        translatedText,
        pronunciation,
        sourceLanguage = 'english',
        targetLanguage,
        translationMethod
      } = req.body;

      if (!inputText || !translatedText || !targetLanguage) {
        return res.status(400).json({
          status: 'error',
          message: 'Input text, translated text, and target language are required'
        });
      }

      const savedTranslation = await this.translationModel.save({
        inputText,
        translatedText,
        pronunciation,
        sourceLanguage,
        targetLanguage,
        translationMethod
      });

      res.json({
        status: 'success',
        message: 'Translation saved successfully',
        data: savedTranslation
      });

    } catch (error) {
      console.error('Save translation error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to save translation'
      });
    }
  };

  // GET /saved-translations - Get all saved translations
  getSavedTranslations = async (req, res) => {
    try {
      const { language, search } = req.query;

      let translations;
      
      if (search) {
        translations = await this.translationModel.search(search);
      } else if (language) {
        translations = await this.translationModel.getByLanguage(language);
      } else {
        translations = await this.translationModel.getAll();
      }

      res.json({
        status: 'success',
        data: translations,
        count: translations.length
      });

    } catch (error) {
      console.error('Get saved translations error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to retrieve saved translations'
      });
    }
  };

  // DELETE /clear-translations - Clear all translations
  clearTranslations = async (req, res) => {
    try {
      const result = await this.translationModel.clearAll();

      res.json({
        status: 'success',
        message: result.message
      });

    } catch (error) {
      console.error('Clear translations error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to clear translations'
      });
    }
  };

  // DELETE /translation/:id - Delete specific translation
  deleteTranslation = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: 'error',
          message: 'Translation ID is required'
        });
      }

      const result = await this.translationModel.deleteById(id);

      if (result.changes === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Translation not found'
        });
      }

      res.json({
        status: 'success',
        message: result.message
      });

    } catch (error) {
      console.error('Delete translation error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to delete translation'
      });
    }
  };

  // POST /speak-pronunciation - Handle text-to-speech request
  speakPronunciation = async (req, res) => {
    try {
      const { text, language } = req.body;

      if (!text || !language) {
        return res.status(400).json({
          status: 'error',
          message: 'Text and language are required for pronunciation'
        });
      }

      // Generate pronunciation if not provided
      const pronunciation = this.translationService.generatePronunciation(text, language);

      res.json({
        status: 'success',
        data: {
          text,
          language,
          pronunciation,
          message: 'Use browser speech synthesis API on frontend'
        }
      });

    } catch (error) {
      console.error('Pronunciation error:', error);
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to generate pronunciation'
      });
    }
  };

  // GET /supported-languages - Get list of supported languages
  getSupportedLanguages = (req, res) => {
    try {
      const languages = this.translationService.getSupportedLanguages();
      
      res.json({
        status: 'success',
        data: languages,
        count: languages.length
      });

    } catch (error) {
      console.error('Get supported languages error:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve supported languages'
      });
    }
  };
}

export default TranslationController;
