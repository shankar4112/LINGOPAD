import React, { useState } from 'react'
import backgroundImage from '../assets/background.png'

const GetStarted = () => {
  const [formData, setFormData] = useState({
    inputText: '',
    targetLanguage: '',
    translationMethod: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Send data to backend
      const response = await fetch('http://localhost:3000/get-started', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      console.log('Form submitted:', result)
      
      // You can redirect or show success message here
      alert('Translation setup successful!')
      
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div className='relative min-h-screen flex items-center justify-center pt-16'>
      {/* Background Image */}
      <div 
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/20'></div>

      {/* Full Frame Form Container */}
      <div className='relative w-full max-w-2xl mx-auto px-6 z-10'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-white text-5xl font-normal font-[Google_Sans] mt-10 mb-1 opacity-90 hover:opacity-100 hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-all duration-300'>
            LingoPad
          </h1>
          <p className='text-white text-xl font-normal font-[Google_Sans] opacity-70'>
            Translate with AI precision
          </p>
        </div>

        {/* Lean Form */}
        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* Input Text Field - Full Width */}
          <div className='relative'>
            <textarea
              name='inputText'
              value={formData.inputText}
              onChange={handleInputChange}
              rows='6'
              className='w-full px-6 py-5 bg-white/15 backdrop-blur-lg border border-white/20 rounded-2xl text-white text-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 resize-none font-[Google_Sans] shadow-2xl'
              placeholder='Enter text to translate...'
              required
            />
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300'></div>
          </div>

          {/* Language Selection Row */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Target Language */}
            <div className='relative'>
              <select
                name='targetLanguage'
                value={formData.targetLanguage}
                onChange={handleInputChange}
                className='w-full px-6 py-4 bg-white/15 backdrop-blur-lg border border-white/20 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 font-[Google_Sans] shadow-xl appearance-none cursor-pointer'
                required
              >
                <option value='' className='bg-gray-900'>Select Language</option>
                <option value='spanish' className='bg-gray-900'>Spanish 🇪🇸</option>
                <option value='french' className='bg-gray-900'>French 🇫🇷</option>
                <option value='german' className='bg-gray-900'>German 🇩🇪</option>
                <option value='italian' className='bg-gray-900'>Italian 🇮🇹</option>
                <option value='portuguese' className='bg-gray-900'>Portuguese 🇵🇹</option>
                <option value='japanese' className='bg-gray-900'>Japanese 🇯🇵</option>
                <option value='korean' className='bg-gray-900'>Korean 🇰🇷</option>
                <option value='chinese' className='bg-gray-900'>Chinese 🇨🇳</option>
              </select>
              <div className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 pointer-events-none'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd' />
                </svg>
              </div>
            </div>

            {/* Translation Method */}
            <div className='relative'>
              <select
                name='translationMethod'
                value={formData.translationMethod}
                onChange={handleInputChange}
                className='w-full px-6 py-4 bg-white/15 backdrop-blur-lg border border-white/20 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-300 font-[Google_Sans] shadow-xl appearance-none cursor-pointer'
                required
              >
                <option value='' className='bg-gray-900'>Choose Service</option>
                <option value='aws' className='bg-gray-900'>AWS Translate</option>
                <option value='google-gemini' className='bg-gray-900'>Google Gemini</option>
              </select>
              <div className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 pointer-events-none'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd' />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-center pt-8'>
            <button
              type='submit'
              className='px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg rounded-2xl font-[Google_Sans] font-medium opacity-90 hover:opacity-100 hover:drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-2xl transform hover:scale-105'
            >
              Translate Now
            </button>
          </div>
        </form>

        {/* Back Link */}
        <div className='text-center mt-12'>
          <a 
            href='/'
            className='text-white/70 hover:text-white text-lg font-[Google_Sans] transition-colors duration-200 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]'
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}

export default GetStarted
