# LingoPad Translation Server

A powerful, free translation server powered by Hugging Face AI models with support for a defined set of languages.

## Features

- **100% Free Translation**: Hugging Face AI models with no API keys required
- **Native Script Support**: Proper display of Hindi, Tamil, Chinese, Arabic scripts
- **Pronunciation Guide**: Automatic pronunciation generation for translated text
- **SQLite Database**: Local storage for translation history
- **AI-Powered**: Advanced NLLB model for accurate translations
- **Real-time Translation**: Instant translation with AI model integration
- **Enhanced Indian Languages**: Specialized support for Indian language scripts

## AI Models Used

- **Helsinki-NLP/opus-mt-en-mul**: General multilingual translation
- **facebook/nllb-200-distilled-600M**: Enhanced Indian language support with native scripts
- **AWS Translate (optional)**: Cloud translation provider when configured

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Configure server** (Optional)
   ```bash
   npm run setup
   ```
   This will guide you through basic server configuration.
   **Note**: No API keys needed - translation works out of the box!

3. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## Translation Service

### Hugging Face AI Models (Free)
- **Helsinki-NLP/opus-mt-en-mul**: Multilingual translation model
- **facebook/nllb-200-distilled-600M**: Specialized for Indian languages with native scripts
- **No API key required** for public models
- Supports Hindi, Tamil, Telugu, Bengali, Gujarati, Punjabi, Kannada, Malayalam, Marathi, Japanese, Chinese, Korean, Arabic, Hebrew, Thai, Russian, Greek, and Urdu
- Automatic pronunciation generation
- Native script display support

## Environment Variables

Your `.env` file should contain:

```env
# Server Configuration
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Optional: Hugging Face API (only for private models)
# HUGGINGFACE_API_KEY=your_huggingface_key_here

# Optional: AWS Translate
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your_access_key_id
# AWS_SECRET_ACCESS_KEY=your_secret_access_key
# AWS_SESSION_TOKEN=your_session_token
```

## API Endpoints

### Translation Routes

- `POST /api/translate` - Translate text
- `GET /api/translate/languages` - Get supported languages
- `GET /api/translate/history` - Get translation history
- `POST /api/translate/save` - Save translation to history

### General

- `GET /api/health` - Health check

## Example Usage

### Translate Text
```bash
curl -X POST http://localhost:3001/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "hello", "targetLanguage": "hi", "translationMethod": "huggingface"}'
```

### Save Translation
```bash
curl -X POST http://localhost:3001/api/translate/save \
  -H "Content-Type: application/json" \
  -d '{
    "originalText": "hello",
    "translatedText": "नमस्ते",
    "targetLanguage": "hi",
    "pronunciation": "namaste"
  }'
```

### Get Translation History
```bash
curl http://localhost:3001/api/translate/history
```

## Project Structure

```
server/
├── routes/
│   ├── getStarted.js    # Onboarding routes
│   └── translate.js     # Translation routes
├── server.js            # Main server file with AI translation
├── translations.db      # SQLite database
├── package.json         # Dependencies
└── .env                 # Environment variables
```
