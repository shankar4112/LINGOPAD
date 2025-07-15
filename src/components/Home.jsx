import React from 'react'
import backgroundImage from '../assets/background.png'

const Home = () => {
  return (
    <div className='relative flex flex-col items-center justify-center h-screen pt-16'>
      {/* Background Image */}
      <div 
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Title */}
      <h1 className='relative text-white text-8xl font-normal text-center font-[Google_Sans] z-10 opacity-70 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all duration-300 cursor-pointer'>
        LingoPad
      </h1>

      {/* Subtitle */}
      <p className='relative text-white text-2xl font-normal text-center mt-4 font-[Google_Sans] z-10 opacity-40 hover:opacity-70 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300 cursor-pointer'>
        <span className="ml-4">Type, translate, and learn</span>
      </p>

      <div className='flex items-center justify-center mt-8 space-x-6'>
        <a 
          href="/get-started"
          className='relative px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-full font-[Google_Sans] font-medium opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] hover:from-blue-600 hover:to-blue-500 transition-all duration-300 z-10'
        >
          Get Started
        </a>
        <a 
          href="/translate"
          className='relative px-8 py-3 bg-transparent border border-blue-400 text-white rounded-full font-[Google_Sans] font-medium opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:bg-white hover:text-black transition-all duration-300 z-10'
        >
          Translate
        </a>
      </div>
    </div>
  )
}

export default Home;
