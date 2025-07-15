# LingoPad Backend

A Node.js/Express backend API for the LingoPad language learning application.

## Setup

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` 
   - Update the values as needed

3. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Get Started Routes

- `GET /api/get-started` - Get onboarding information
- `POST /api/get-started/language` - Set target language
- `POST /api/get-started/goals` - Set learning goals  
- `POST /api/get-started/assessment` - Submit assessment
- `POST /api/get-started/complete` - Complete onboarding

### Translation Routes

- `POST /api/translate` - Translate text
- `GET /api/translate/languages` - Get supported languages

### General

- `GET /api/health` - Health check

## Example Usage

### Start Onboarding
```bash
curl http://localhost:5000/api/get-started
```

### Set Language Preference
```bash
curl -X POST http://localhost:5000/api/get-started/language \
  -H "Content-Type: application/json" \
  -d '{"languageCode": "es", "nativeLanguage": "en"}'
```

### Translate Text
```bash
curl -X POST http://localhost:5000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text": "hello", "from": "en", "to": "es"}'
```

## Project Structure

```
server/
├── routes/
│   ├── getStarted.js    # Onboarding routes
│   └── translate.js     # Translation routes
├── server.js            # Main server file
├── package.json         # Dependencies
└── .env                 # Environment variables
```
