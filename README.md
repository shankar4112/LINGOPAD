# LingoPad - AI-Powered Language Translation App

A modern, full-stack translation application that translates English text into a wide variety of world languages, displaying translations in native scripts with English pronunciation guides.

## 🌟 Features

- **Free AI Translation**: Uses Hugging Face's free pretrained models for accurate translations
- **Native Script Support**: All translations display in proper native scripts (Hindi, Tamil, Chinese, Arabic, etc.)
- **Pronunciation Guides**: English phonetic pronunciation for all translations
- **Multi-Language Support**: Hindi, Tamil, Telugu, Bengali, Gujarati, Punjabi, Kannada, Malayalam, Marathi, Japanese, Chinese, Korean, Arabic, Hebrew, Thai, Russian, Greek, and Urdu
- **Translation History**: Save and manage your translation history locally
- **Modern UI**: Beautiful, responsive interface with glassmorphism design
- **100% Free**: No API keys required, completely free translation service

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd LINGOPAD
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   ```

3. **Start the application**
   ```bash
   # Terminal 1: Start the backend server
   cd server
   npm run dev
   
   # Terminal 2: Start the frontend (from root directory)
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173 (or http://localhost:5174 if 5173 is busy)
   - Backend API: http://localhost:3001

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Local database for translation history
- **Hugging Face Inference API** - Free AI translation models

### AI Models Used
- **Helsinki-NLP/opus-mt-en-mul** - General multilingual translation
- **facebook/nllb-200-distilled-600M** - Enhanced support for Indian languages and native scripts

## 🌐 Supported Languages

- Hindi (Devanagari)
- Tamil (Tamil script)
- Telugu (Telugu script)
- Bengali (Bengali)
- Gujarati (Gujarati)
- Punjabi (Gurmukhi)
- Kannada (Kannada)
- Malayalam (Malayalam)
- Marathi (Devanagari)
- Japanese (Kanji / Hiragana / Katakana)
- Chinese (Hanzi)
- Korean (Hangul)
- Arabic (Arabic)
- Hebrew (Hebrew)
- Thai (Thai)
- Russian (Cyrillic)
- Greek (Greek)
- Urdu (Arabic script)

## 📁 Project Structure

```
LINGOPAD/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── Home.jsx       # Landing page
│   │   ├── GetStarted.jsx # Translation interface
│   │   └── Navbar.jsx     # Navigation component
│   ├── assets/            # Images and static assets
│   └── App.jsx            # Main React app
├── server/                # Backend source code
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   ├── setup.js           # Environment setup script
│   └── .env               # Environment variables
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## 🔧 Configuration

### Simple Setup - No Configuration Required!

LingoPad works out of the box with no API keys or configuration needed. Simply:

1. Clone the repository
2. Install dependencies
3. Start the servers
4. Begin translating!

### Optional Environment Variables

Create a `.env` file in the `server/` directory if you need custom settings:

```env
# Server Configuration
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Setup Script
Run the interactive setup script if you need custom configuration:
```bash
cd server
npm run setup
```

## 🎯 Usage

1. **Navigate to the translation page** by clicking "Get Started"
2. **Enter your text** in the input field
3. **Select target language** from the dropdown
4. **AI Translation**: Uses Hugging Face's free NLLB model - no API key required
5. **Click "Translate"** to get your translation
6. **Save translations** to your local history
7. **View saved translations** in the sidebar

## 🔄 Recent Updates

- ✅ **Simplified Architecture** - Removed AWS dependencies for cleaner, simpler codebase
- ✅ **100% Free Translation** - No API keys or paid services required
- ✅ **Integrated Hugging Face models** - Free, high-quality NLLB model
- ✅ **Enhanced native script support** - Better display for Indian languages
- ✅ **Improved pronunciation generation** - More accurate phonetic guides
- ✅ **Streamlined UI** - Single translation service for simplicity
- ✅ **Cleaner codebase** - Removed unused dependencies and complexity

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hugging Face** for providing free access to pretrained translation models
- **Helsinki-NLP** for the opus-mt multilingual translation models  
- **Facebook/Meta** for the NLLB-200 model with excellent Indian language support
- The open-source community for the amazing tools and libraries used in this project

---

**Happy Translating! 🌍✨**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
