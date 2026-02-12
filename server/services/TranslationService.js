import { HfInference } from '@huggingface/inference';
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';
import { pipeline } from '@xenova/transformers';
import { transliterate } from 'transliteration';
import process from 'process';

class TranslationService {
  constructor() {
    this.hf = new HfInference(); // Free Hugging Face API
    this.nllbTranslator = null; // Lazy initialization
    this.awsClient = null;
    this.localNllbDisabled = process.env.DISABLE_LOCAL_NLLB === 'true';
    this.languageMap = {
      'hindi': 'hin_Deva',
      'tamil': 'tam_Taml',
      'telugu': 'tel_Telu', 
      'bengali': 'ben_Beng',
      'gujarati': 'guj_Gujr',
      'punjabi': 'pan_Guru',
      'kannada': 'kan_Knda',
      'malayalam': 'mal_Mlym',
      'marathi': 'mar_Deva',
      'urdu': 'urd_Arab',
      'japanese': 'jpn_Jpan',
      'chinese': 'zho_Hans',
      'korean': 'kor_Hang',
      'arabic': 'arb_Arab',
      'hebrew': 'heb_Hebr',
      'thai': 'tha_Thai',
      'russian': 'rus_Cyrl',
      'greek': 'ell_Grek'
    };
    this.awsLanguageMap = {
      'hindi': 'hi',
      'tamil': 'ta',
      'telugu': 'te',
      'bengali': 'bn',
      'gujarati': 'gu',
      'punjabi': 'pa',
      'kannada': 'kn',
      'malayalam': 'ml',
      'marathi': 'mr',
      'urdu': 'ur',
      'japanese': 'ja',
      'chinese': 'zh',
      'korean': 'ko',
      'arabic': 'ar',
      'hebrew': 'he',
      'thai': 'th',
      'russian': 'ru',
      'greek': 'el'
    };
  }

  // Initialize NLLB translator lazily
  async initializeNLLB() {
    if (this.localNllbDisabled) {
      throw new Error('Local NLLB is disabled');
    }
    if (!this.nllbTranslator) {
      try {
        console.log('Initializing NLLB translator...');
        this.nllbTranslator = await pipeline(
          'translation', 
          'Xenova/nllb-200-distilled-600M',
          { device: 'cpu' }
        );
        console.log('NLLB translator initialized successfully');
      } catch (error) {
        console.error('Failed to initialize NLLB translator:', error);
        throw new Error('Translation service initialization failed');
      }
    }
    return this.nllbTranslator;
  }

  // Translate text using Hugging Face API
  async translateWithHuggingFace(text, targetLanguage) {
    try {
      const targetLangCode = this.languageMap[targetLanguage.toLowerCase()];
      if (!targetLangCode) {
        throw new Error(`Unsupported language: ${targetLanguage}`);
      }

      const response = await this.hf.translation({
        model: 'facebook/nllb-200-distilled-600M',
        inputs: text,
        parameters: {
          src_lang: 'eng_Latn', // English source
          tgt_lang: targetLangCode
        }
      });

      if (response && response.translation_text) {
        return {
          translatedText: response.translation_text,
          pronunciation: this.generatePronunciation(response.translation_text, targetLanguage),
          method: 'huggingface'
        };
      } else {
        throw new Error('Invalid response from Hugging Face API');
      }
    } catch (error) {
      console.error('Hugging Face translation error:', error);
      
      // Fallback to NLLB if Hugging Face fails (when enabled)
      if (!this.localNllbDisabled) {
        return await this.translateWithNLLB(text, targetLanguage);
      }
      throw error;
    }
  }

  // Translate text using local NLLB model
  async translateWithNLLB(text, targetLanguage) {
    try {
      const translator = await this.initializeNLLB();
      const targetLangCode = this.languageMap[targetLanguage.toLowerCase()];
      
      if (!targetLangCode) {
        throw new Error(`Unsupported language: ${targetLanguage}`);
      }

      const result = await translator(text, {
        src_lang: 'eng_Latn',
        tgt_lang: targetLangCode
      });

      if (result && result.length > 0) {
        const translatedText = result[0].translation_text;
        return {
          translatedText,
          pronunciation: this.generatePronunciation(translatedText, targetLanguage),
          method: 'nllb'
        };
      } else {
        throw new Error('No translation result from NLLB');
      }
    } catch (error) {
      if (String(error.message || '').toLowerCase().includes('bad allocation')) {
        this.localNllbDisabled = true;
        console.error('NLLB translation error: out of memory. Disabling local NLLB for this process.');
      } else {
        console.error('NLLB translation error:', error);
      }
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  // Initialize AWS Translate client lazily
  initializeAWS() {
    if (!this.awsClient) {
      const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
      if (!region) {
        throw new Error('AWS_REGION is required for AWS Translate');
      }
      if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error('AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required for AWS Translate');
      }
      this.awsClient = new TranslateClient({ region });
    }
    return this.awsClient;
  }

  // Translate text using AWS Translate
  async translateWithAWS(text, targetLanguage) {
    try {
      const targetLangCode = this.awsLanguageMap[targetLanguage.toLowerCase()];
      if (!targetLangCode) {
        throw new Error(`Unsupported language for AWS Translate: ${targetLanguage}`);
      }

      const client = this.initializeAWS();
      const command = new TranslateTextCommand({
        Text: text,
        SourceLanguageCode: 'en',
        TargetLanguageCode: targetLangCode
      });

      const response = await client.send(command);
      if (response && response.TranslatedText) {
        return {
          translatedText: response.TranslatedText,
          pronunciation: this.generatePronunciation(response.TranslatedText, targetLanguage),
          method: 'aws'
        };
      }

      throw new Error('Invalid response from AWS Translate');
    } catch (error) {
      console.error('AWS Translate error:', error);
      throw new Error(`AWS Translate failed: ${error.message}`);
    }
  }

  // Main translation method
  async translate(text, targetLanguage, method = 'huggingface') {
    if (!text || !targetLanguage) {
      throw new Error('Text and target language are required');
    }

    try {
      let result;
      
      if (method === 'huggingface') {
        result = await this.translateWithHuggingFace(text, targetLanguage);
      } else if (method === 'nllb') {
        result = await this.translateWithNLLB(text, targetLanguage);
      } else if (method === 'aws') {
        result = await this.translateWithAWS(text, targetLanguage);
      } else {
        throw new Error(`Unsupported translation method: ${method}`);
      }

      return {
        originalText: text,
        translatedText: result.translatedText,
        pronunciation: result.pronunciation,
        sourceLanguage: 'english',
        targetLanguage: targetLanguage,
        translationMethod: result.method
      };
    } catch (error) {
      console.error('Translation service error:', error);
      throw error;
    }
  }

  // Generate pronunciation helper
  generatePronunciation(text, targetLanguage) {
    try {
      const lowerText = String(text || '').toLowerCase();
      if (lowerText.includes('translation temporarily unavailable') || lowerText.includes('ai translation temporarily unavailable')) {
        return '';
      }
      // For languages that use Latin script or can be transliterated
      const latinScriptLanguages = ['hindi', 'bengali', 'gujarati', 'punjabi', 'kannada', 'malayalam', 'marathi', 'tamil', 'telugu', 'urdu'];
      
      if (latinScriptLanguages.includes(targetLanguage.toLowerCase())) {
        // Use transliteration for Indic languages
        return transliterate(text);
      } else if (targetLanguage.toLowerCase() === 'arabic') {
        // For Arabic, return the original text as pronunciation guide
        return text + ' (Arabic script)';
      } else if (targetLanguage.toLowerCase() === 'chinese') {
        // For Chinese, return the original text
        return text + ' (Chinese characters)';
      } else if (targetLanguage.toLowerCase() === 'japanese') {
        // For Japanese, return the original text
        return text + ' (Japanese script)';
      } else if (targetLanguage.toLowerCase() === 'korean') {
        // For Korean, return the original text
        return text + ' (Korean script)';
      } else if (targetLanguage.toLowerCase() === 'thai') {
        // For Thai, return the original text
        return text + ' (Thai script)';
      } else if (targetLanguage.toLowerCase() === 'russian') {
        // For Russian, try transliteration
        return transliterate(text);
      } else if (targetLanguage.toLowerCase() === 'greek') {
        // For Greek, try transliteration
        return transliterate(text);
      } else if (targetLanguage.toLowerCase() === 'hebrew') {
        // For Hebrew, return the original text
        return text + ' (Hebrew script)';
      } else {
        // For other languages, return the translated text as pronunciation
        return text;
      }
    } catch (error) {
      console.error('Pronunciation generation error:', error);
      return text; // Fallback to original text
    }
  }

  // Get supported languages
  getSupportedLanguages() {
    return Object.keys(this.languageMap);
  }

  // Check if language is supported
  isLanguageSupported(language) {
    return Object.prototype.hasOwnProperty.call(this.languageMap, language.toLowerCase());
  }
}

export default TranslationService;
