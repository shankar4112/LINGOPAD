import React from 'react'
import backgroundImage from '../assets/background.png'

const Features = () => {
  const features = [
    {
      icon: "🌍",
      title: "Supported Languages",
      description: "Translate between Hindi, Tamil, Telugu, Bengali, Gujarati, Punjabi, Kannada, Malayalam, Marathi, Japanese, Chinese, Korean, Arabic, Hebrew, Thai, Russian, Greek, and Urdu."
    },
    {
      icon: "🤖",
      title: "AI-Powered Translation",
      description: "Powered by Hugging Face's advanced NLLB (No Language Left Behind) AI models for accurate and contextual translations."
    },
    {
      icon: "🔊",
      title: "Text-to-Speech Pronunciation",
      description: "Listen to proper pronunciation of translated text with our built-in text-to-speech functionality to improve your language learning."
    },
    {
      icon: "💾",
      title: "Translation History",
      description: "Save and access your translation history anytime. Keep track of words and phrases you've learned for easy reference."
    },
    {
      icon: "📱",
      title: "Mobile-Friendly",
      description: "Access LingoPad from any device - desktop, tablet, or mobile phone with a responsive design that works seamlessly across all platforms."
    },
    {
      icon: "🚀",
      title: "Fast & Reliable",
      description: "Get instant translations with high accuracy. No account required - start translating immediately without any setup or registration."
    },
    {
      icon: "🔒",
      title: "Privacy-First",
      description: "Your translations are processed locally and securely. We don't store or share your personal translation data with third parties."
    },
    {
      icon: "💡",
      title: "Smart Error Correction",
      description: "Built-in smart error correction helps fix common translation mistakes and provides more natural-sounding results."
    }
  ];

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
        <div className='text-center mb-8 sm:mb-16'>
          <h1 className='text-white text-4xl sm:text-5xl lg:text-6xl font-normal font-[Google_Sans] mb-4 sm:mb-6 opacity-90 hover:opacity-100 transition-opacity duration-300'>
            Features
          </h1>
          <p className='text-white text-lg sm:text-xl font-[Google_Sans] opacity-70 max-w-3xl mx-auto px-4'>
            Discover the powerful features that make LingoPad your perfect language translation companion
          </p>
        </div>

        {/* Features Grid */}
        <div className='max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
          {features.map((feature, index) => (
            <div 
              key={index}
              className='bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white border-opacity-20 hover:border-opacity-40 hover:bg-opacity-50 transition-all duration-300 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]'
            >
              <div className='text-3xl sm:text-4xl mb-3 sm:mb-4'>{feature.icon}</div>
              <h3 className='text-white text-lg sm:text-xl font-semibold font-[Google_Sans] mb-2 sm:mb-3 opacity-90'>
                {feature.title}
              </h3>
              <p className='text-white text-xs sm:text-sm font-[Google_Sans] opacity-70 leading-relaxed'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className='text-center mt-8 sm:mt-12 lg:mt-16'>
          <div className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4'>
            <a 
              href="/get-started"
              className='w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-full font-[Google_Sans] font-medium opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] hover:from-blue-600 hover:to-blue-500 transition-all duration-300 text-center'
            >
              Try LingoPad Now
            </a>
            <a 
              href="/"
              className='w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent border border-blue-400 text-white rounded-full font-[Google_Sans] font-medium opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:bg-white hover:text-black transition-all duration-300 text-center'
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features
