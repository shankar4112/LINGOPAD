import React, { useState, useEffect } from 'react'
import backgroundImage from '../assets/background.png'

const SavedTranslations = () => {
  const [savedTranslations, setSavedTranslations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLanguage, setFilterLanguage] = useState('all')

  // Mock data for demonstration - in a real app, this would come from localStorage or a database
  const mockTranslations = [
    {
      id: 1,
      originalText: "Hello, how are you?",
      translatedText: "नमस्ते, आप कैसे हैं?",
      fromLanguage: "English",
      toLanguage: "Hindi",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      isFavorite: true
    },
    {
      id: 2,
      originalText: "Good morning",
      translatedText: "காலை வணக்கம்",
      fromLanguage: "English",
      toLanguage: "Tamil",
      timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      isFavorite: false
    },
    {
      id: 3,
      originalText: "Thank you very much",
      translatedText: "どうもありがとうございます",
      fromLanguage: "English",
      toLanguage: "Japanese",
      timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      isFavorite: true
    },
    {
      id: 4,
      originalText: "Where is the restaurant?",
      translatedText: "أين المطعم؟",
      fromLanguage: "English",
      toLanguage: "Arabic",
      timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      isFavorite: false
    },
    {
      id: 5,
      originalText: "I love learning languages",
      translatedText: "나는 언어를 배우는 것을 좋아해요",
      fromLanguage: "English",
      toLanguage: "Korean",
      timestamp: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      isFavorite: true
    },
    {
      id: 6,
      originalText: "What time is it?",
      translatedText: "Сколько сейчас времени?",
      fromLanguage: "English",
      toLanguage: "Russian",
      timestamp: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
      isFavorite: false
    }
  ]

  useEffect(() => {
    // Load saved translations from localStorage or API
    setSavedTranslations(mockTranslations)
  }, [])

  // Filter translations based on search term and language filter
  const filteredTranslations = savedTranslations.filter(translation => {
    const matchesSearch = translation.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         translation.translatedText.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLanguage = filterLanguage === 'all' || 
                           translation.toLanguage.toLowerCase() === filterLanguage.toLowerCase()
    return matchesSearch && matchesLanguage
  })

  const toggleFavorite = (id) => {
    setSavedTranslations(prev =>
      prev.map(translation =>
        translation.id === id
          ? { ...translation, isFavorite: !translation.isFavorite }
          : translation
      )
    )
  }

  const deleteTranslation = (id) => {
    setSavedTranslations(prev => prev.filter(translation => translation.id !== id))
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const getLanguageFlag = (language) => {
    const flags = {
      'English': '🇺🇸',
      'Hindi': '🇮🇳',
      'Tamil': '🇮🇳',
      'Telugu': '🇮🇳',
      'Bengali': '🇮🇳',
      'Gujarati': '🇮🇳',
      'Punjabi': '🇮🇳',
      'Kannada': '🇮🇳',
      'Malayalam': '🇮🇳',
      'Marathi': '🇮🇳',
      'Urdu': '🇵🇰',
      'Japanese': '🇯🇵',
      'Chinese': '🇨🇳',
      'Korean': '🇰🇷',
      'Arabic': '🇸🇦',
      'Hebrew': '🇮🇱',
      'Thai': '🇹🇭',
      'Russian': '🇷🇺',
      'Greek': '🇬🇷'
    }
    return flags[language] || '🌍'
  }

  const uniqueLanguages = [...new Set(savedTranslations.map(t => t.toLanguage))]

  return (
    <div className='relative flex flex-col min-h-screen pt-16'>
      {/* Background Image */}
      <div 
        className='absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Content Container */}
      <div className='relative z-10 flex-grow px-4 py-8 sm:py-12'>
        {/* Header Section */}
        <div className='text-center mb-8 sm:mb-12'>
          <h1 className='text-white text-4xl sm:text-5xl lg:text-6xl font-normal font-[Google_Sans] mb-4 sm:mb-6 opacity-90 hover:opacity-100 transition-opacity duration-300'>
            💾 Saved Translations
          </h1>
          <p className='text-white text-lg sm:text-xl font-[Google_Sans] opacity-70 max-w-3xl mx-auto px-4'>
            Access your translation history and manage your favorite phrases
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className='max-w-4xl mx-auto mb-8 sm:mb-12'>
          <div className='bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white border-opacity-20'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              {/* Search Input */}
              <div className='relative'>
                <input
                  type="text"
                  placeholder="Search translations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-70 font-[Google_Sans] focus:outline-none focus:border-opacity-60 focus:bg-opacity-20 transition-all duration-300'
                />
                <div className='absolute right-3 top-3 text-white opacity-50'>
                  🔍
                </div>
              </div>

              {/* Language Filter */}
              <div className='relative'>
                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className='w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-30 rounded-xl text-white font-[Google_Sans] focus:outline-none focus:border-opacity-60 focus:bg-opacity-20 transition-all duration-300 appearance-none'
                >
                  <option value="all" className='bg-gray-800'>All Languages</option>
                  {uniqueLanguages.map(language => (
                    <option key={language} value={language} className='bg-gray-800'>
                      {getLanguageFlag(language)} {language}
                    </option>
                  ))}
                </select>
                <div className='absolute right-3 top-3 text-white opacity-50 pointer-events-none'>
                  ⌄
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className='max-w-4xl mx-auto mb-8 sm:mb-12'>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div className='bg-black bg-opacity-40 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20 text-center'>
              <div className='text-2xl sm:text-3xl font-bold text-white opacity-90 font-[Google_Sans]'>
                {savedTranslations.length}
              </div>
              <div className='text-white opacity-70 font-[Google_Sans] text-sm'>
                Total Translations
              </div>
            </div>
            <div className='bg-black bg-opacity-40 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20 text-center'>
              <div className='text-2xl sm:text-3xl font-bold text-white opacity-90 font-[Google_Sans]'>
                {savedTranslations.filter(t => t.isFavorite).length}
              </div>
              <div className='text-white opacity-70 font-[Google_Sans] text-sm'>
                Favorites
              </div>
            </div>
            <div className='bg-black bg-opacity-40 backdrop-blur-md rounded-xl p-4 border border-white border-opacity-20 text-center'>
              <div className='text-2xl sm:text-3xl font-bold text-white opacity-90 font-[Google_Sans]'>
                {uniqueLanguages.length}
              </div>
              <div className='text-white opacity-70 font-[Google_Sans] text-sm'>
                Languages Used
              </div>
            </div>
          </div>
        </div>

        {/* Translations List */}
        <div className='max-w-4xl mx-auto'>
          {filteredTranslations.length === 0 ? (
            <div className='bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 text-center'>
              <div className='text-4xl mb-4'>📭</div>
              <h3 className='text-white text-xl font-[Google_Sans] opacity-90 mb-2'>
                No translations found
              </h3>
              <p className='text-white opacity-70 font-[Google_Sans] mb-6'>
                {searchTerm || filterLanguage !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start translating to see your saved translations here'}
              </p>
              <a 
                href="/get-started"
                className='inline-block px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-full font-[Google_Sans] font-medium opacity-80 hover:opacity-100 transition-all duration-300'
              >
                Start Translating
              </a>
            </div>
          ) : (
            <div className='space-y-4 sm:space-y-6'>
              {filteredTranslations.map((translation) => (
                <div 
                  key={translation.id}
                  className='bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white border-opacity-20 hover:border-opacity-40 hover:bg-opacity-50 transition-all duration-300'
                >
                  <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4'>
                    <div className='flex items-center space-x-2'>
                      <span className='text-lg'>{getLanguageFlag(translation.fromLanguage)}</span>
                      <span className='text-white opacity-70 font-[Google_Sans] text-sm'>
                        {translation.fromLanguage}
                      </span>
                      <span className='text-white opacity-50 mx-2'>→</span>
                      <span className='text-lg'>{getLanguageFlag(translation.toLanguage)}</span>
                      <span className='text-white opacity-70 font-[Google_Sans] text-sm'>
                        {translation.toLanguage}
                      </span>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <span className='text-white opacity-50 font-[Google_Sans] text-xs'>
                        {formatDate(translation.timestamp)}
                      </span>
                      <button
                        onClick={() => toggleFavorite(translation.id)}
                        className='text-lg hover:scale-110 transition-transform duration-200'
                      >
                        {translation.isFavorite ? '⭐' : '☆'}
                      </button>
                      <button
                        onClick={() => deleteTranslation(translation.id)}
                        className='text-red-400 hover:text-red-300 hover:scale-110 transition-all duration-200'
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <div className='bg-white bg-opacity-5 rounded-xl p-3 sm:p-4'>
                      <div className='text-white opacity-60 font-[Google_Sans] text-xs mb-2'>
                        Original
                      </div>
                      <div className='text-white opacity-90 font-[Google_Sans] text-sm sm:text-base'>
                        {translation.originalText}
                      </div>
                    </div>
                    <div className='bg-white bg-opacity-5 rounded-xl p-3 sm:p-4'>
                      <div className='text-white opacity-60 font-[Google_Sans] text-xs mb-2'>
                        Translation
                      </div>
                      <div className='text-white opacity-90 font-[Google_Sans] text-sm sm:text-base'>
                        {translation.translatedText}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className='text-center mt-12 sm:mt-16'>
          <div className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4'>
            <a 
              href="/get-started"
              className='w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-full font-[Google_Sans] font-medium opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] hover:from-blue-600 hover:to-blue-500 transition-all duration-300 text-center transform hover:scale-105'
            >
              🚀 Translate More
            </a>
            <a 
              href="/about"
              className='w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent border border-green-400 text-white rounded-full font-[Google_Sans] font-medium opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:bg-green-400 hover:text-black transition-all duration-300 text-center transform hover:scale-105'
            >
              📖 About LingoPad
            </a>
            <a 
              href="/"
              className='w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent border border-purple-400 text-white rounded-full font-[Google_Sans] font-medium opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:bg-purple-400 hover:text-black transition-all duration-300 text-center transform hover:scale-105'
            >
              🏠 Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SavedTranslations
