import express from 'express';
import cors from 'cors';
import { HfInference } from '@huggingface/inference';
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';
import { pipeline } from '@xenova/transformers';
import dotenv from 'dotenv';
import process from 'process';
import { transliterate } from 'transliteration';
import nodemailer from 'nodemailer';

// NEW: Import Sequelize database configuration and models
import { initializeDatabase } from './config/database.js';
import TranslationRepository from './models/TranslationRepository.js';

// Load environment variables
dotenv.config();

const app = express();

// Initialize APIs
const hf = new HfInference(); // Free Hugging Face API (no key required for public models)
let nllbTranslator = null; // Will be initialized lazily for NLLB model
let awsTranslateClient = null;
let localNllbDisabled = process.env.DISABLE_LOCAL_NLLB === 'true';

// Initialize database on startup
async function initDB() {
  try {
    const initialized = await initializeDatabase();
    if (initialized) {
      console.log('✓ Database initialized successfully');
    } else {
      console.error('✗ Failed to initialize database');
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Database initialization error:', error);
    process.exit(1);
  }
}

// Middleware
app.use(cors({
  origin: '*',
  credentials: false
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to LingoPad API');
});

app.get('/get-started', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to LingoPad! Get started with our onboarding process.',
    data: {
      steps: [
        {
          step: 1,
          title: 'Choose Your Language',
          description: 'Select the language you want to learn.',
          action: 'Select Language'
        },
        {
          step: 2,
          title: 'Set Your Goals',
          description: 'Define your learning goals and time commitment.',
          action: 'Set Goals'
        },
        {
          step: 3,
          title: 'Start Learning',
          description: 'Begin your language learning journey with personalized content.',
          action: 'Start Learning'
        }
      ]
    }
  });
});

// POST route for form submission
app.post('/get-started', async (req, res) => {
  try {
    const { inputText, targetLanguage, translationMethod } = req.body;

    // Validate required fields
    if (!inputText || !targetLanguage || !translationMethod) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }

    // Translate using selected method
    const translationResult = await translateText(inputText, targetLanguage, translationMethod);
    const pronunciation = await generatePronunciation(translationResult.translatedText, targetLanguage);

    // Send success response
    res.status(200).json({
      status: 'success',
      message: 'Translation successful!',
      data: {
        inputText,
        translatedText: translationResult.translatedText,
        pronunciation: pronunciation,
        targetLanguage,
        translationMethod,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Translation error:', error);
    // Return more detailed error message to help with debugging
    const errorMessage = error.message || 'Translation failed. Please try again.';
    res.status(500).json({
      status: 'error',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// POST route for saving translation
app.post('/save-translation', async (req, res) => {
  try {
    const { inputText, translatedText, pronunciation, targetLanguage, translationMethod } = req.body;

    if (!inputText || !translatedText || !targetLanguage || !translationMethod) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }

    // Save to database using new Sequelize repository
    const savedTranslation = await TranslationRepository.save({
      inputText,
      translatedText,
      pronunciation: pronunciation || null,
      targetLanguage,
      translationMethod
    });

    res.status(200).json({
      status: 'success',
      message: 'Translation saved successfully!',
      data: savedTranslation
    });

  } catch (error) {
    console.error('Save translation error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to save translation'
    });
  }
});

// GET route for retrieving saved translations
app.get('/saved-translations', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1000;
    const offset = parseInt(req.query.offset) || 0;

    const translations = await TranslationRepository.getAll(limit, offset);

    res.status(200).json({
      status: 'success',
      data: translations
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to retrieve translations'
    });
  }
});

// DELETE route for clearing all translations
app.delete('/clear-translations', async (req, res) => {
  try {
    const result = await TranslationRepository.clearAll();

    res.status(200).json({
      status: 'success',
      message: 'All translations cleared successfully!',
      data: result
    });
  } catch (error) {
    console.error('Clear translations error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to clear translations'
    });
  }
});

// POST route for text-to-speech pronunciation
app.post('/speak-pronunciation', async (req, res) => {
  try {
    const { text, targetLanguage } = req.body;

    if (!text) {
      return res.status(400).json({
        status: 'error',
        message: 'Text is required for speech synthesis'
      });
    }

    // Generate pronunciation guide for display purposes
    const pronunciation = await generatePronunciation(text, targetLanguage || 'english');
    
    // For speech synthesis, use the original translated text directly
    // This allows the browser's native TTS to pronounce it correctly in the target language
    const speechText = text; // Use the actual translated text for speech
    
    res.status(200).json({
      status: 'success',
      message: 'Text ready for speech synthesis',
      data: {
        originalText: text,
        pronunciation: pronunciation, // For display/learning purposes
        speechText: speechText, // The actual translated text for TTS
        targetLanguage: targetLanguage || 'english',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Speech synthesis error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to prepare text for speech'
    });
  }
});

// Main translation function - Supports multiple providers
async function translateText(text, targetLanguage, method) {
  console.log(`Translating "${text}" using ${method} to ${targetLanguage}`);
  
  try {
    if (method === 'aws') {
      return await translateWithAWS(text, targetLanguage);
    }
    if (method === 'nllb') {
      return await translateWithNLLB(text, targetLanguage);
    }
    // Default to Hugging Face (NLLB)
    return await translateWithHuggingFace(text, targetLanguage);
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to mock translation on error
    try {
      console.log('Trying fallback translation...');
      return await mockTranslateText(text, targetLanguage);
    } catch (fallbackError) {
      console.error('All translation services failed:', fallbackError);
      return { 
        translatedText: `AI translation temporarily unavailable for "${text}" to ${targetLanguage}. Please try again in a moment.` 
      };
    }
  }
}

function getAwsTranslateClient() {
  if (!awsTranslateClient) {
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    // Check for AWS region
    if (!region) {
      throw new Error(
        'AWS_REGION is required for AWS Translate. ' +
        'Set it in server/.env file (e.g., AWS_REGION=ap-south-1)'
      );
    }

    // Check for required AWS credentials
    if (!accessKeyId || !secretAccessKey) {
      throw new Error(
        'AWS credentials are not configured. ' +
        'Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in server/.env file. ' +
        'See server/AWS_SETUP_GUIDE.md for instructions on how to get AWS credentials. ' +
        'If you don\'t want to use AWS Translate, leave these empty and the app will use Hugging Face API instead.'
      );
    }

    // Create client with explicit credentials
    try {
      awsTranslateClient = new TranslateClient({ 
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
          sessionToken: process.env.AWS_SESSION_TOKEN || undefined // Optional for temporary credentials
        }
      });
      console.log('AWS Translate client initialized successfully with region:', region);
    } catch (error) {
      throw new Error(
        `Failed to initialize AWS Translate client: ${error.message}. ` +
        `Make sure your AWS credentials are valid and not expired. ` +
        `See server/AWS_SETUP_GUIDE.md for help.`
      );
    }
  }
  return awsTranslateClient;
}

function getAwsLanguageCode(language) {
  const awsCodes = {
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

  return awsCodes[language.toLowerCase()];
}

async function translateWithAWS(text, targetLanguage) {
  try {
    console.log(`Using AWS Translate for ${targetLanguage}...`);
    const targetLangCode = getAwsLanguageCode(targetLanguage);
    if (!targetLangCode) {
      throw new Error(`Unsupported language for AWS Translate: ${targetLanguage}`);
    }

    const client = getAwsTranslateClient();
    const command = new TranslateTextCommand({
      Text: text,
      SourceLanguageCode: 'en',
      TargetLanguageCode: targetLangCode
    });

    const response = await client.send(command);
    const translatedText = response?.TranslatedText;

    if (translatedText && translatedText !== text && translatedText.trim().length > 0) {
      return { translatedText };
    }

    throw new Error('AWS Translate returned invalid translation');
  } catch (error) {
    console.error('AWS Translate error:', error.message);
    
    // Provide helpful error messages for common issues
    if (error.name === 'UnrecognizedClientException' || error.message.includes('security token')) {
      throw new Error(
        'AWS Translate failed: Invalid or expired AWS credentials. ' +
        'Please check your AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_SESSION_TOKEN in server/.env. ' +
        'Session tokens expire after a few hours and need to be refreshed. ' +
        'See server/.env for instructions on how to get fresh credentials.'
      );
    }
    
    if (error.message.includes('Access Denied')) {
      throw new Error(
        'AWS Translate failed: Your AWS credentials do not have permission for AWS Translate service. ' +
        'Make sure your IAM user/role has "translate:TranslateText" permission.'
      );
    }

    throw error;
  }
}

// NLLB Translation using @xenova/transformers (local inference)
async function translateWithNLLB(text, targetLanguage) {
  try {
    if (localNllbDisabled) {
      throw new Error('Local NLLB is disabled');
    }
    console.log(`Using NLLB for ${targetLanguage} translation...`);
    
    // Initialize NLLB translator if not already done
    if (!nllbTranslator) {
      console.log('Initializing NLLB translator...');
      nllbTranslator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M', { 
        quantized: true // Use quantized version for better performance
      });
      console.log('NLLB translator initialized successfully');
    }
    
    // Get proper language codes for NLLB
    const sourceLangCode = 'eng_Latn'; // English
    const targetLangCode = getLanguageCode(targetLanguage);
    
    console.log(`Translating from ${sourceLangCode} to ${targetLangCode}: "${text}"`);
    
    // Perform translation
    const result = await nllbTranslator(text, {
      src_lang: sourceLangCode,
      tgt_lang: targetLangCode,
      max_length: 200
    });
    
    const translatedText = result[0]?.translation_text || result.translation_text;
    
    if (translatedText && translatedText !== text && translatedText.trim().length > 0) {
      console.log(`NLLB translation successful: "${text}" -> "${translatedText}"`);
      
      // Apply word corrections to fix common AI translation errors
      const correctedText = correctCommonTranslationErrors(translatedText, text, targetLanguage);
      
      return { translatedText: correctedText };
    } else {
      throw new Error('NLLB returned invalid translation');
    }
    
  } catch (error) {
    if (String(error.message || '').toLowerCase().includes('bad allocation')) {
      localNllbDisabled = true;
      console.error('NLLB Translation error: out of memory. Disabling local NLLB for this process.');
    } else {
      console.error('NLLB Translation error:', error.message);
    }
    throw error;
  }
}

// Hugging Face Translation - Enhanced with NLLB fallback
async function translateWithHuggingFace(text, targetLanguage) {
  try {
    console.log(`Using Hugging Face for ${targetLanguage} translation...`);
    
    // First try NLLB local inference (preferred method)
    if (!localNllbDisabled) {
      try {
        return await translateWithNLLB(text, targetLanguage);
      } catch (nllbError) {
        console.log(`NLLB failed: ${nllbError.message}, trying Hugging Face API...`);
      }
    }
    
    // Fallback to Hugging Face API models
    try {
      console.log(`Trying Helsinki NLP translation model...`);
      
      // Use Helsinki-NLP models for supported language pairs when available
      const modelMap = {
        'russian': 'Helsinki-NLP/opus-mt-en-ru',
        'chinese': 'Helsinki-NLP/opus-mt-en-zh',
        'japanese': 'Helsinki-NLP/opus-mt-en-jap',
        // For Indian languages, try available models
        'hindi': 'Helsinki-NLP/opus-mt-en-hi',
        'bengali': 'Helsinki-NLP/opus-mt-en-bn'
      };
      
      const model = modelMap[targetLanguage.toLowerCase()];
      if (model) {
        const result = await hf.translation({
          model: model,
          inputs: text
        });
        
        let translatedText = result.translation_text || result[0]?.translation_text;
        
        if (translatedText && translatedText !== text && translatedText.trim().length > 0) {
          console.log(`Helsinki translation successful: "${text}" -> "${translatedText}"`);
          
          // Apply word corrections to fix common AI translation errors
          const correctedText = correctCommonTranslationErrors(translatedText, text, targetLanguage);
          
          return { translatedText: correctedText };
        }
      }
    } catch (error) {
      console.log(`Helsinki translation failed: ${error.message}`);
    }
    
    // Try using T5 model for translation
    try {
      console.log(`Trying T5 translation model...`);
      
      const result = await hf.translation({
        model: 't5-small',
        inputs: text,
        parameters: {
          task: 'translate English to ' + targetLanguage
        }
      });
      
      let translatedText = result.translation_text || result[0]?.translation_text;
      
      if (translatedText && translatedText !== text && translatedText.trim().length > 0) {
        console.log(`T5 translation successful: "${text}" -> "${translatedText}"`);
        
        // Apply word corrections to fix common AI translation errors
        const correctedText = correctCommonTranslationErrors(translatedText, text, targetLanguage);
        
        return { translatedText: correctedText };
      }
    } catch (error) {
      console.log(`T5 translation failed: ${error.message}`);
    }
    
    // If all models fail, fallback to enhanced mock translation
    console.log(`All Hugging Face models failed, using enhanced mock translation for ${targetLanguage}`);
    return await mockTranslateText(text, targetLanguage);
    
  } catch (error) {
    console.error('Hugging Face Translation error:', error);
    // Fallback to mock translation
    return await mockTranslateText(text, targetLanguage);
  }
}

// Helper function to get NLLB language codes for supported languages only
function getLanguageCode(language) {
  const nllbCodes = {
    // Indian Languages (with proper scripts)
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
    
    // East Asian Languages
    'japanese': 'jpn_Jpan',
    'chinese': 'zho_Hans',
    'korean': 'kor_Hang',
    
    // Middle Eastern Languages
    'arabic': 'arb_Arab',
    'hebrew': 'heb_Hebr',
    
    // Other Languages
    'thai': 'tha_Thai',
    'russian': 'rus_Cyrl',
    'greek': 'ell_Grek'
  };
  
  return nllbCodes[language.toLowerCase()] || 'hin_Deva'; // Default to Hindi if not found
}

// Simple fallback for error cases only - no static translations
async function mockTranslateText(text, targetLanguage) {
  console.log(`Fallback error translation for ${targetLanguage}: "${text}"`);
  
  // Return an error message indicating translation failed
  return {
    translatedText: `Translation temporarily unavailable for "${text}" to ${targetLanguage}. Please try again.`
  };
}

// Word correction system to fix common AI translation errors
function correctCommonTranslationErrors(translatedText, originalText, targetLanguage) {
  console.log(`Checking for translation corrections: "${originalText}" -> "${translatedText}"`);
  
  // Define common word corrections for specific languages
  const corrections = {
    tamil: {
      // Fruits and vegetables - common AI translation errors
      'banana': {
        wrong: ['வெங்காயம்', 'பானை', 'பனானா'], // onion, pot, banana (transliterated)
        correct: 'வாழைப்பழம்' // correct Tamil word for banana
      },
      'apple': {
        wrong: ['ஆப்பிள்', 'அப்பிள்'],
        correct: 'ஆப்பிள்'
      },
      'tomato': {
        wrong: ['தக்காளி', 'டமாட்டோ'],
        correct: 'தக்காளி'
      },
      'onion': {
        wrong: ['வாழைப்பழம்'], // if it mistakenly translates onion as banana
        correct: 'வெங்காயம்'
      }
    },
    hindi: {
      'banana': {
        wrong: ['प्याज', 'बर्तन'], // onion, pot
        correct: 'केला'
      },
      'apple': {
        wrong: ['एप्पल'],
        correct: 'सेब'
      },
      'tomato': {
        wrong: ['टमाटर', 'टोमेटो'],
        correct: 'टमाटर'
      }
    }
  };

  const langCorrections = corrections[targetLanguage.toLowerCase()];
  if (!langCorrections) {
    return translatedText; // No corrections available for this language
  }

  // Check each word in the original text
  const originalWords = originalText.toLowerCase().split(/\s+/);
  let correctedText = translatedText;

  for (const word of originalWords) {
    const correction = langCorrections[word];
    if (correction) {
      // Check if the translated text contains any of the wrong translations
      for (const wrongTranslation of correction.wrong) {
        if (correctedText.includes(wrongTranslation)) {
          console.log(`Correcting translation error: "${wrongTranslation}" -> "${correction.correct}" for word "${word}"`);
          correctedText = correctedText.replace(wrongTranslation, correction.correct);
        }
      }
    }
  }

  if (correctedText !== translatedText) {
    console.log(`Translation corrected: "${translatedText}" -> "${correctedText}"`);
  }

  return correctedText;
}



// Dynamic pronunciation function using transliteration library - enhanced for natural English reading
async function generatePronunciation(translatedText, targetLanguage) {
  console.log(`Generating easy-to-read pronunciation for "${translatedText}" in ${targetLanguage}`);
  
  // If text is empty, return empty string
  if (!translatedText || translatedText.trim() === '') {
    return '';
  }

  // Skip pronunciation for fallback error messages
  const lowerText = translatedText.toLowerCase();
  if (lowerText.includes('translation temporarily unavailable') || lowerText.includes('ai translation temporarily unavailable')) {
    return '';
  }
  
  try {
    // Use the transliteration library as the base
    const transliteratedText = transliterate(translatedText);
    
    // Always enhance the pronunciation regardless of script
    // Apply language-specific enhancements for more natural reading
    const enhancedPronunciation = enhanceForNaturalReading(transliteratedText, targetLanguage);
    console.log(`Enhanced natural pronunciation: ${enhancedPronunciation}`);
    return enhancedPronunciation;
  } catch (error) {
    console.error(`Error generating pronunciation: ${error.message}`);
    // Fallback to simple pronunciation
    return generateSimplePronunciation(translatedText);
  }
}

// Enhance transliteration for more natural English-based reading
function enhanceForNaturalReading(transliterated, targetLanguage) {
  // Apply language-specific enhancements to make it read naturally in English
  let enhanced = transliterated;
  
  // Process based on target language
  switch(targetLanguage.toLowerCase()) {
    case 'hindi':
      enhanced = enhanceIndianLanguage(enhanced);
      break;
    case 'tamil': 
    case 'telugu':
    case 'malayalam':
    case 'kannada':
    case 'bengali':
    case 'gujarati':
    case 'punjabi':
    case 'marathi':
    case 'urdu':
      enhanced = enhanceIndianLanguage(enhanced);
      break;
    case 'arabic':
    case 'hebrew':
      enhanced = enhanceMiddleEasternLanguage(enhanced);
      break;
    case 'chinese':
      enhanced = enhanceChineseLanguage(enhanced);
      break;
    case 'japanese':
      enhanced = enhanceJapaneseLanguage(enhanced);
      break;
    case 'korean':
      enhanced = enhanceKoreanLanguage(enhanced);
      break;
    case 'russian':
    case 'greek':
    case 'thai':
      enhanced = enhanceOtherLanguage(enhanced);
      break;
    default:
      // For other languages, apply general enhancements
      enhanced = enhanceGeneralPronunciation(enhanced);
  }
  
  // Add spaces between syllables for better readability
  enhanced = addReadableSyllables(enhanced);
  
  // Format the pronunciation guide with brackets
  return `[${enhanced}]`;
}

// Helper function to check if a character is a vowel
function isVowel(char) {
  return /[aeiouAEIOU]/.test(char);
}

// Add more natural syllable breaks for readability
function addReadableSyllables(text) {
  // Split into words and clean them up
  const words = text.split(/\s+/);
  
  // Process each word to make it more readable
  const processedWords = words.map(word => {
    // Remove any existing separators and clean
    const cleanWord = word.replace(/[-_]/g, '');
    
    // For very short words, just return as is
    if (cleanWord.length <= 2) {
      return cleanWord;
    }
    
    // For longer words, add natural breaks at consonant clusters
    let result = '';
    for (let i = 0; i < cleanWord.length; i++) {
      result += cleanWord[i];
      
      // Add space before consonant clusters in longer words
      if (i < cleanWord.length - 1 && 
          cleanWord.length > 4 &&
          !isVowel(cleanWord[i]) && 
          !isVowel(cleanWord[i + 1]) &&
          i > 0) {
        result += ' ';
      }
    }
    
    return result;
  });
  
  return processedWords.join(' ').toUpperCase();
}

// Clean pronunciation by removing excessive repetitions and simplifying
function cleanPronunciation(text) {
  return text
    // Remove excessive repetitive patterns like HAHNA -> NA, HAHKA -> KA
    .replace(/([A-Z]A)H+\1/g, '$1')
    .replace(/([A-Z])AH+([A-Z])/g, '$1$2')
    // Remove repeated AH patterns
    .replace(/AH+/g, 'A')
    .replace(/EH+/g, 'E')
    .replace(/OH+/g, 'O')
    .replace(/UH+/g, 'U')
    // Clean up double letters
    .replace(/([A-Z])\1+/g, '$1')
    // Remove excessive H's
    .replace(/H{2,}/g, 'H')
    // Clean up word boundaries
    .replace(/\s+/g, ' ')
    .trim();
}

// Enhance Indian languages pronunciation (Hindi, Tamil, etc.)
function enhanceIndianLanguage(text) {
  return cleanPronunciation(text
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'i')
    .replace(/oo/g, 'u')
    .replace(/ai/g, 'ey')
    .replace(/au/g, 'ow')
    .replace(/sh/g, 'sh')
    .replace(/ch/g, 'ch')
    .replace(/th/g, 't')
    .replace(/kh/g, 'k')
    .replace(/gh/g, 'g')
    .replace(/bh/g, 'b')
    .replace(/dh/g, 'd')
    .replace(/jh/g, 'j')
    .replace(/ph/g, 'p')
    .replace(/a/g, 'a')
    .replace(/e/g, 'e')
    .replace(/i/g, 'i')
    .replace(/o/g, 'o')
    .replace(/u/g, 'u'))
    .toUpperCase();
}

// Enhance Middle Eastern languages pronunciation (Arabic, Hebrew)
function enhanceMiddleEasternLanguage(text) {
  return cleanPronunciation(text
    .replace(/aa/g, 'a')
    .replace(/ii/g, 'i')
    .replace(/uu/g, 'u')
    .replace(/kh/g, 'kh')
    .replace(/gh/g, 'gh')
    .replace(/dh/g, 'th')
    .replace(/sh/g, 'sh')
    .replace(/th/g, 'th')
    .replace(/ph/g, 'f'))
    .toUpperCase();
}

// Enhance Chinese language pronunciation
function enhanceChineseLanguage(text) {
  return cleanPronunciation(text
    .replace(/zh/g, 'j')
    .replace(/q/g, 'ch')
    .replace(/x/g, 'sh')
    .replace(/c/g, 'ts')
    .replace(/ai/g, 'ey')
    .replace(/ao/g, 'ow')
    .replace(/ei/g, 'ay')
    .replace(/ou/g, 'o')
    .replace(/ang/g, 'ang')
    .replace(/eng/g, 'ung')
    .replace(/ing/g, 'ing')
    .replace(/ong/g, 'ong'))
    .toUpperCase();
}

// Enhance Japanese language pronunciation
function enhanceJapaneseLanguage(text) {
  return cleanPronunciation(text
    .replace(/tsu/g, 'tsu')
    .replace(/shi/g, 'shi')
    .replace(/chi/g, 'chi')
    .replace(/fu/g, 'fu')
    .replace(/ja/g, 'ja')
    .replace(/ju/g, 'ju')
    .replace(/jo/g, 'jo')
    .replace(/za/g, 'za')
    .replace(/zu/g, 'zu')
    .replace(/zo/g, 'zo')
    .replace(/ga/g, 'ga')
    .replace(/gi/g, 'gi')
    .replace(/gu/g, 'gu')
    .replace(/ge/g, 'ge')
    .replace(/go/g, 'go'))
    .toUpperCase();
}

// Enhance Korean language pronunciation
function enhanceKoreanLanguage(text) {
  return cleanPronunciation(text
    .replace(/eo/g, 'eo')
    .replace(/eu/g, 'eu')
    .replace(/ae/g, 'ae')
    .replace(/oe/g, 'oe')
    .replace(/ui/g, 'ui')
    .replace(/gw/g, 'gw')
    .replace(/kk/g, 'k')
    .replace(/tt/g, 't')
    .replace(/pp/g, 'p')
    .replace(/ss/g, 's')
    .replace(/jj/g, 'j'))
    .toUpperCase();
}

// Enhance other languages pronunciation
function enhanceOtherLanguage(text) {
  // General enhancements for most languages
  return enhanceGeneralPronunciation(text);
}

// General pronunciation enhancement for any language
function enhanceGeneralPronunciation(text) {
  return cleanPronunciation(text
    .replace(/aa/g, 'a')
    .replace(/ee/g, 'e')
    .replace(/ii/g, 'i')
    .replace(/oo/g, 'o')
    .replace(/uu/g, 'u'))
    .toUpperCase();
}

// Simple pronunciation generation as a fallback
function generateSimplePronunciation(text) {
  try {
    // Just return transliterated text with basic cleaning
    const simple = cleanPronunciation(transliterate(text));
    return `[${simple.toUpperCase()}]`;
  } catch {
    // If all else fails, just return the original text in brackets
    return `[${text.toUpperCase()}]`;
  }
}

// Email configuration for contact form
const createTransporter = () => {
  // Use Gmail SMTP (you can change this to your preferred email service)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com', // Add this to your .env file
      pass: process.env.EMAIL_PASS || 'your-app-password'     // Add this to your .env file (use app password, not regular password)
    }
  });
};

// Contact form endpoint
app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address'
      });
    }

    // Create email transporter
    const transporter = createTransporter();

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@lingopad.app',
      to: 'shankar4112004@gmail.com', // Your email address
      subject: `LingoPad Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            New Contact Form Submission - LingoPad
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
            <p style="margin: 0; color: #065f46; font-size: 14px;">
              <strong>Reply to:</strong> ${email}<br>
              <strong>Received:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Success response
    res.status(200).json({
      status: 'success',
      message: 'Message sent successfully! Thank you for contacting us.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    // Check if it's an authentication error
    if (error.code === 'EAUTH') {
      res.status(500).json({
        status: 'error',
        message: 'Email service configuration error. Please try again later.'
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Failed to send message. Please try again later.'
      });
    }
  }
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Initialize database and start server
async function startServer() {
  try {
    // Initialize Sequelize database
    await initDB();

    // Start Express server
    const server = app.listen(PORT, HOST, () => {
      console.log(`Server is running on http://${HOST}:${PORT}`);
      console.log(`Translation services available: Hugging Face (Free)`);
      console.log(`Database: ${process.env.DATABASE_TYPE || 'sqlite'}`);
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
