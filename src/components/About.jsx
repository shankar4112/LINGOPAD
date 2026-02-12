import React from 'react'
import backgroundImage from '../assets/background.png'

const About = () => {
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
            About LingoPad
          </h1>
          <p className='text-white text-lg sm:text-xl font-[Google_Sans] opacity-70 max-w-3xl mx-auto px-4'>
            Breaking down language barriers with cutting-edge AI technology
          </p>
        </div>

        {/* Main Content */}
        <div className='max-w-4xl mx-auto space-y-6 sm:space-y-8 lg:space-y-12'>
          {/* Mission Section */}
          <div className='bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-white border-opacity-20 hover:border-opacity-40 hover:bg-opacity-50 transition-all duration-300'>
            <h2 className='text-white text-2xl sm:text-3xl font-semibold font-[Google_Sans] mb-4 sm:mb-6 opacity-90'>
              Our Mission
            </h2>
            <p className='text-white text-base sm:text-lg font-[Google_Sans] opacity-80 leading-relaxed mb-4'>
              LingoPad was created with a simple yet powerful mission: to make language translation accessible, accurate, and instant for everyone. We believe that language should never be a barrier to communication, learning, or understanding.
            </p>
            <p className='text-white text-base sm:text-lg font-[Google_Sans] opacity-80 leading-relaxed'>
              Whether you're a student learning a new language, a traveler exploring different cultures, a business professional working globally, or simply someone curious about languages, LingoPad is designed to be your reliable translation companion.
            </p>
          </div>

          {/* Technology Section */}
          <div className='bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-white border-opacity-20 hover:border-opacity-40 hover:bg-opacity-50 transition-all duration-300'>
            <h2 className='text-white text-2xl sm:text-3xl font-semibold font-[Google_Sans] mb-4 sm:mb-6 opacity-90'>
              Powered by Advanced AI
            </h2>
            <p className='text-white text-base sm:text-lg font-[Google_Sans] opacity-80 leading-relaxed mb-4'>
              LingoPad leverages the power of Hugging Face's state-of-the-art NLLB (No Language Left Behind) models, which represent the latest breakthrough in neural machine translation. These AI models provide accurate, contextual translations across the supported languages.
            </p>
            <p className='text-white text-base sm:text-lg font-[Google_Sans] opacity-80 leading-relaxed'>
              Our technology stack includes React for a smooth user interface, Node.js for reliable backend processing, and advanced error correction algorithms to ensure the highest quality translations possible.
            </p>
          </div>

          {/* Features Highlight */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
            <div className='bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white border-opacity-20 hover:border-opacity-40 hover:bg-opacity-50 transition-all duration-300'>
              <h3 className='text-white text-xl sm:text-2xl font-semibold font-[Google_Sans] mb-3 sm:mb-4 opacity-90'>
                🌟 Why Choose LingoPad?
              </h3>
              <ul className='text-white text-sm sm:text-base font-[Google_Sans] opacity-80 space-y-2'>
                <li>• Free to use with no registration required</li>
                <li>• Instant translations with high accuracy</li>
                <li>• Mobile-friendly responsive design</li>
                <li>• Privacy-focused - your data stays secure</li>
                <li>• Regular updates with new features</li>
              </ul>
            </div>

            <div className='bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white border-opacity-20 hover:border-opacity-40 hover:bg-opacity-50 transition-all duration-300'>
              <h3 className='text-white text-xl sm:text-2xl font-semibold font-[Google_Sans] mb-3 sm:mb-4 opacity-90'>
                🚀 Our Vision
              </h3>
              <p className='text-white text-sm sm:text-base font-[Google_Sans] opacity-80 leading-relaxed'>
                We envision a world where language differences don't limit human connection and understanding. LingoPad is just the beginning of our journey to create more inclusive and accessible language tools for everyone.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className='bg-black bg-opacity-40 backdrop-blur-md rounded-2xl p-4 sm:p-6 lg:p-8 border border-white border-opacity-20 hover:border-opacity-40 hover:bg-opacity-50 transition-all duration-300'>
            <h2 className='text-white text-2xl sm:text-3xl font-semibold font-[Google_Sans] mb-4 sm:mb-6 opacity-90'>
              Built with ❤️
            </h2>
            <p className='text-white text-base sm:text-lg font-[Google_Sans] opacity-80 leading-relaxed mb-4'>
              LingoPad is developed by passionate developers who believe in the power of technology to bring people together. Our team combines expertise in artificial intelligence, web development, and user experience design to create tools that make a real difference.
            </p>
            <p className='text-white text-base sm:text-lg font-[Google_Sans] opacity-80 leading-relaxed'>
              We're constantly working to improve LingoPad based on user feedback and the latest advances in AI technology. Your input helps us make LingoPad better for everyone.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className='text-center mt-8 sm:mt-12 lg:mt-16'>
          <div className='flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 px-4'>
            <a 
              href="/get-started"
              className='w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-full font-[Google_Sans] font-medium opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] hover:from-blue-600 hover:to-blue-500 transition-all duration-300 text-center'
            >
              Start Translating
            </a>
            <a 
              href="/features"
              className='w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent border border-blue-400 text-white rounded-full font-[Google_Sans] font-medium opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:bg-white hover:text-black transition-all duration-300 text-center'
            >
              Explore Features
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
