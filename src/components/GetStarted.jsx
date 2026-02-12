import React, { useState, useEffect } from 'react'
import backgroundImage from '../assets/background.png'
import config from '../config.js'

const GetStarted = () => {
  const [formData, setFormData] = useState({
    inputText: '',
    targetLanguage: '',
    translationMethod: 'huggingface' // Default to AI translation
  })
  
  const [translations, setTranslations] = useState([])
  const [isTranslating, setIsTranslating] = useState(false)
  const [savedTranslations, setSavedTranslations] = useState([])
  const [isSpeaking, setIsSpeaking] = useState({})

  // Load saved translations on component mount
  useEffect(() => {
    loadSavedTranslations()
  }, [])

  const loadSavedTranslations = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/saved-translations`)
      const result = await response.json()
      if (result.status === 'success') {
        setSavedTranslations(result.data)
      }
    } catch (error) {
      console.error('Error loading saved translations:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.inputText || !formData.targetLanguage) {
      alert('Please fill in all fields')
      return
    }
    
    setIsTranslating(true)
    
    try {
      // Get translation
      const response = await fetch(`${config.API_BASE_URL}/get-started`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      
      if (result.status === 'success') {
        // Add new translation to the list
        const newTranslation = {
          id: Date.now(),
          inputText: formData.inputText,
          translatedText: result.data.translatedText,
          pronunciation: result.data.pronunciation,
          targetLanguage: formData.targetLanguage,
          translationMethod: formData.translationMethod,
          timestamp: new Date().toISOString()
        }
        
        setTranslations(prev => [newTranslation, ...prev])
        
        // Clear input text for next translation
        setFormData(prev => ({
          ...prev,
          inputText: ''
        }))
      } else {
        alert('Translation failed. Please try again.')
      }
      
    } catch (error) {
      console.error('Error translating:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSaveTranslation = async (translation) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/save-translation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputText: translation.inputText,
          translatedText: translation.translatedText,
          pronunciation: translation.pronunciation,
          targetLanguage: translation.targetLanguage,
          translationMethod: translation.translationMethod
        })
      })
      
      const result = await response.json()
      
      if (result.status === 'success') {
        alert('Translation saved successfully!')
        loadSavedTranslations() // Refresh saved translations
      } else {
        alert('Failed to save translation')
      }
      
    } catch (error) {
      console.error('Error saving translation:', error)
      alert('Failed to save translation')
    }
  }

  const handleClearTranslations = async () => {
    if (window.confirm('Are you sure you want to clear all translations?')) {
      try {
        const response = await fetch(`${config.API_BASE_URL}/clear-translations`, {
          method: 'DELETE'
        })
        
        const result = await response.json()
        
        if (result.status === 'success') {
          setTranslations([])
          setSavedTranslations([])
          alert('All translations cleared!')
        } else {
          alert('Failed to clear translations')
        }
        
      } catch (error) {
        console.error('Error clearing translations:', error)
        alert('Failed to clear translations')
      }
    }
  }

  // Text-to-Speech functionality
  const speakPronunciation = async (translationId, text, targetLanguage) => {
    try {
      setIsSpeaking(prev => ({ ...prev, [translationId]: true }))
      
      // First, get the pronunciation from the server
      const response = await fetch(`${config.API_BASE_URL}/speak-pronunciation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          targetLanguage: targetLanguage
        })
      })
      
      const result = await response.json()
      
      if (result.status === 'success') {
        // Use browser's speech synthesis API
        const speechText = result.data.speechText
        const utterance = new SpeechSynthesisUtterance(speechText)
        
        // Configure speech settings
        utterance.rate = 0.8 // Slower speech for pronunciation
        utterance.pitch = 1
        utterance.volume = 1
        
        // Try to find a voice that matches the target language
        const voices = speechSynthesis.getVoices()
        const targetVoice = voices.find(voice => 
          voice.lang.toLowerCase().includes(getLanguageCode(targetLanguage)) ||
          voice.name.toLowerCase().includes(targetLanguage.toLowerCase())
        )
        
        if (targetVoice) {
          utterance.voice = targetVoice
        }
        
        // Handle speech events
        utterance.onend = () => {
          setIsSpeaking(prev => ({ ...prev, [translationId]: false }))
        }
        
        utterance.onerror = () => {
          setIsSpeaking(prev => ({ ...prev, [translationId]: false }))
          alert('Speech synthesis failed')
        }
        
        // Start speaking
        speechSynthesis.speak(utterance)
      } else {
        throw new Error('Failed to prepare pronunciation')
      }
      
    } catch (error) {
      console.error('Error with text-to-speech:', error)
      setIsSpeaking(prev => ({ ...prev, [translationId]: false }))
      alert('Failed to speak pronunciation')
    }
  }

  // Helper function to get language code for speech synthesis
  const getLanguageCode = (language) => {
    const languageMap = {
      'hindi': 'hi-IN',
      'tamil': 'ta-IN',
      'telugu': 'te-IN',
      'bengali': 'bn-IN',
      'gujarati': 'gu-IN',
      'punjabi': 'pa-IN',
      'kannada': 'kn-IN',
      'malayalam': 'ml-IN',
      'marathi': 'mr-IN',
      'urdu': 'ur-PK',
      'japanese': 'ja-JP',
      'chinese': 'zh-CN',
      'korean': 'ko-KR',
      'arabic': 'ar-SA',
      'hebrew': 'he-IL',
      'thai': 'th-TH',
      'russian': 'ru-RU',
      'greek': 'el-GR'
    }
    
    return languageMap[language.toLowerCase()] || 'en-US'
  }

  return (
    <div className='relative min-h-screen pt-16'>
      {/* Background Image */}
      <div 
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/20'></div>

      {/* Header */}
      <div className='relative z-10 text-center py-4 sm:py-8'>
        <h1 className='text-white text-3xl sm:text-4xl lg:text-5xl font-normal font-[Google_Sans] mb-1 opacity-90 hover:opacity-100 hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-all duration-300'>
          LingoPad
        </h1>
        <p className='text-white text-lg sm:text-xl font-normal font-[Google_Sans] opacity-70 px-4'>
          Translate with AI precision
        </p>
      </div>

      {/* Main Content - Two Cards Layout */}
      <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8'>
          
          {/* Left Card - Translation Form */}
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl'>
            <h2 className='text-white text-xl sm:text-2xl font-[Google_Sans] mb-4 sm:mb-6 text-center'>
              Translate Text
            </h2>
            
            <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
              {/* Input Text Field */}
              <div className='relative'>
                <textarea
                  name='inputText'
                  value={formData.inputText}
                  onChange={handleInputChange}
                  rows='4'
                  className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/15 backdrop-blur-lg border border-white/20 rounded-xl text-white text-base sm:text-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 resize-none font-[Google_Sans]'
                  placeholder='Enter text to translate...'
                  required
                />
              </div>

              {/* Language and Method Selection */}
              <div className='grid grid-cols-1 gap-4'>
                {/* Target Language */}
                <div className='relative'>
                  <select
                    name='targetLanguage'
                    value={formData.targetLanguage}
                    onChange={handleInputChange}
                    className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/15 backdrop-blur-lg border border-white/20 rounded-xl text-white text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 font-[Google_Sans] appearance-none cursor-pointer'
                    required
                  >
                    <option value='' className='bg-gray-900'>Select Language</option>
                    
                    {/* Indian Languages */}
                    <optgroup label="Indian Languages" className='bg-gray-800'>
                      <option value='hindi' className='bg-gray-900'>Hindi (Devanagari) ��</option>
                      <option value='tamil' className='bg-gray-900'>Tamil (Tamil script) ��</option>
                      <option value='telugu' className='bg-gray-900'>Telugu (Telugu script) ��</option>
                      <option value='bengali' className='bg-gray-900'>Bengali (Bengali) 🇮�</option>
                      <option value='gujarati' className='bg-gray-900'>Gujarati (Gujarati) ��</option>
                      <option value='punjabi' className='bg-gray-900'>Punjabi (Gurmukhi) 🇮🇳</option>
                      <option value='kannada' className='bg-gray-900'>Kannada (Kannada) 🇮🇳</option>
                      <option value='malayalam' className='bg-gray-900'>Malayalam (Malayalam) �🇳</option>
                      <option value='marathi' className='bg-gray-900'>Marathi (Devanagari) ��</option>
                      <option value='urdu' className='bg-gray-900'>Urdu (Arabic script) ��</option>
                    </optgroup>
                    
                    {/* East Asian Languages */}
                    <optgroup label="East Asian Languages" className='bg-gray-800'>
                      <option value='japanese' className='bg-gray-900'>Japanese (Kanji/Hiragana/Katakana) ��</option>
                      <option value='chinese' className='bg-gray-900'>Chinese (Hanzi) �🇳</option>
                      <option value='korean' className='bg-gray-900'>Korean (Hangul) ��</option>
                    </optgroup>
                    
                    {/* Middle Eastern Languages */}
                    <optgroup label="Middle Eastern Languages" className='bg-gray-800'>
                      <option value='arabic' className='bg-gray-900'>Arabic (Arabic) ��</option>
                      <option value='hebrew' className='bg-gray-900'>Hebrew (Hebrew) 🇮�</option>
                    </optgroup>
                    
                    {/* Other Languages */}
                    <optgroup label="Other Languages" className='bg-gray-800'>
                      <option value='thai' className='bg-gray-900'>Thai (Thai) ��</option>
                      <option value='russian' className='bg-gray-900'>Russian (Cyrillic) ��</option>
                      <option value='greek' className='bg-gray-900'>Greek (Greek) 🇬�</option>
                    </optgroup>
                  </select>
                </div>

                {/* Translation Method */}
                <div className='relative'>
                  <select
                    name='translationMethod'
                    value={formData.translationMethod}
                    onChange={handleInputChange}
                    className='w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/15 backdrop-blur-lg border border-white/20 rounded-xl text-white text-sm sm:text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 font-[Google_Sans] appearance-none cursor-pointer'
                  >
                    <option value='huggingface' className='bg-gray-900'>AI Translation (NLLB Model) - Recommended</option>
                    <option value='aws' className='bg-gray-900'>AWS Translate (requires AWS credentials)</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isTranslating}
                className='w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-base sm:text-lg rounded-xl font-[Google_Sans] font-medium opacity-90 hover:opacity-100 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isTranslating ? 'Translating...' : 'Translate'}
              </button>
            </form>
          </div>

          {/* Right Card - Translation Results */}
          <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-white text-2xl font-[Google_Sans]'>
                Translation Results
              </h2>
              <button
                onClick={handleClearTranslations}
                className='px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white text-sm rounded-lg font-[Google_Sans] transition-all duration-300'
              >
                Clear All
              </button>
            </div>

            {/* Translation Results List */}
            <div className='space-y-4 max-h-96 overflow-y-auto'>
              {translations.length === 0 ? (
                <div className='text-center text-white/60 py-8'>
                  <p className='text-lg font-[Google_Sans]'>No translations yet</p>
                  <p className='text-sm'>Start translating to see results here</p>
                </div>
              ) : (
                translations.map((translation) => (
                  <div
                    key={translation.id}
                    className='bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-4'
                  >
                    <div className='mb-3'>
                      <div className='text-white/80 text-sm font-[Google_Sans] mb-1'>
                        Original ({translation.translationMethod}):
                      </div>
                      <div className='text-white text-base font-[Google_Sans]'>
                        {translation.inputText}
                      </div>
                    </div>
                    
                    <div className='mb-3'>
                      <div className='text-white/80 text-sm font-[Google_Sans] mb-1'>
                        Translated ({translation.targetLanguage}):
                      </div>
                      <div className='text-white text-base font-[Google_Sans]'>
                        {translation.translatedText}
                      </div>
                      {translation.pronunciation && (
                        <div className='flex items-center justify-between mt-1'>
                          <div className='text-white/60 text-sm font-[Google_Sans] italic'>
                            Pronunciation: {translation.pronunciation}
                          </div>
                          <button
                            onClick={() => speakPronunciation(translation.id, translation.translatedText, translation.targetLanguage)}
                            disabled={isSpeaking[translation.id]}
                            className='ml-2 px-2 py-1 bg-blue-600/80 hover:bg-blue-600 text-white text-xs rounded-lg font-[Google_Sans] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
                          >
                            {isSpeaking[translation.id] ? (
                              <>
                                <svg className='w-3 h-3 mr-1 animate-spin' fill='none' viewBox='0 0 24 24'>
                                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                  <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                </svg>
                                Speaking...
                              </>
                            ) : (
                              <>
                                <svg className='w-3 h-3 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12h6m-6 0a3 3 0 003-3V7a3 3 0 00-6 0v2a3 3 0 003 3z'></path>
                                </svg>
                                Speak
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className='flex justify-between items-center'>
                      <div className='text-white/60 text-xs font-[Google_Sans]'>
                        {new Date(translation.timestamp).toLocaleString()}
                      </div>
                      <button
                        onClick={() => handleSaveTranslation(translation)}
                        className='px-3 py-1 bg-green-600/80 hover:bg-green-600 text-white text-xs rounded-lg font-[Google_Sans] transition-all duration-300'
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Saved Translations Section */}
            {savedTranslations.length > 0 && (
              <div className='mt-8 pt-6 border-t border-white/20'>
                <h3 className='text-white text-lg font-[Google_Sans] mb-4'>
                  Saved Translations ({savedTranslations.length})
                </h3>
                <div className='space-y-3 max-h-64 overflow-y-auto'>
                  {savedTranslations.map((translation) => (
                    <div
                      key={translation.id}
                      className='bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4'
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <div className='flex-1'>
                          <div className='text-white/80 text-sm font-[Google_Sans] mb-1'>
                            {translation.input_text}
                          </div>
                          <div className='text-white text-base font-[Google_Sans]'>
                            {translation.translated_text}
                            {translation.pronunciation && (
                              <div className='flex items-center justify-between mt-1'>
                                <span className='text-white/60 text-sm'>
                                  ({translation.pronunciation})
                                </span>
                                <button
                                  onClick={() => speakPronunciation(`saved-${translation.id}`, translation.translated_text, translation.target_language)}
                                  disabled={isSpeaking[`saved-${translation.id}`]}
                                  className='ml-2 px-2 py-1 bg-blue-600/80 hover:bg-blue-600 text-white text-xs rounded-lg font-[Google_Sans] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
                                >
                                  {isSpeaking[`saved-${translation.id}`] ? (
                                    <>
                                      <svg className='w-3 h-3 mr-1 animate-spin' fill='none' viewBox='0 0 24 24'>
                                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                                      </svg>
                                      Speaking...
                                    </>
                                  ) : (
                                    <>
                                      <svg className='w-3 h-3 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12h6m-6 0a3 3 0 003-3V7a3 3 0 00-6 0v2a3 3 0 003 3z'></path>
                                      </svg>
                                      Speak
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='text-white/60 text-xs font-[Google_Sans] ml-4'>
                          {new Date(translation.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className='flex justify-between items-center'>
                        <div className='text-white/50 text-xs font-[Google_Sans]'>
                          {translation.target_language} • {translation.translation_method}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className='text-center mt-8 sm:mt-12'>
          <a 
            href='/'
            className='text-white/70 hover:text-white text-base sm:text-lg font-[Google_Sans] transition-colors duration-200 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]'
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default GetStarted
