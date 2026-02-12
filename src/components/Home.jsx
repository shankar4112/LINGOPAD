import React, { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import backgroundImage from '../assets/background.png'

const Home = () => {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonsRef = useRef(null)
  const languagesRef = useRef(null)

  useEffect(() => {
    // Title animation
    animate(titleRef.current, {
      opacity: [0, 1],
      translateY: [-50, 0],
      scale: [0.8, 1],
      duration: 1200,
      easing: 'easeOutCubic',
      delay: 300
    })

    // Subtitle animation
    animate(subtitleRef.current, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 1000,
      easing: 'easeOutCubic',
      delay: 800
    })

    // Buttons animation
    animate(buttonsRef.current?.children, {
      opacity: [0, 1],
      translateY: [40, 0],
      scale: [0.9, 1],
      duration: 800,
      easing: 'easeOutBack',
      delay: stagger(200, {start: 1200})
    })

    // Language tags animation
    animate(languagesRef.current?.querySelectorAll('span'), {
      opacity: [0, 1],
      scale: [0.8, 1],
      rotate: [5, 0],
      duration: 600,
      easing: 'easeOutElastic(1, .8)',
      delay: stagger(100, {start: 1800})
    })

    // Continuous floating animation for title
    animate(titleRef.current, {
      translateY: [-5, 5, -5],
      duration: 4000,
      easing: 'easeInOutSine',
      loop: true,
      delay: 2000
    })

    // Hover effect setup
    const buttons = buttonsRef.current?.children
    if (buttons) {
      Array.from(buttons).forEach((button) => {
        button.addEventListener('mouseenter', () => {
          animate(button, {
            scale: 1.05,
            translateY: -2,
            duration: 300,
            easing: 'easeOutCubic'
          })
        })

        button.addEventListener('mouseleave', () => {
          animate(button, {
            scale: 1,
            translateY: 0,
            duration: 300,
            easing: 'easeOutCubic'
          })
        })
      })
    }
  }, [])

  return (
    <div className='relative flex flex-col items-center justify-center h-screen pt-16'>
      {/* Background Image */}
      <div 
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Title */}
      <h1 
        ref={titleRef}
        className='relative text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-center font-[Google_Sans] z-10 opacity-70 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-all duration-300 cursor-pointer px-4'
      >
        LingoPad
      </h1>

      {/* Subtitle */}
      <p 
        ref={subtitleRef}
        className='relative text-white text-lg sm:text-xl md:text-2xl font-normal text-center mt-4 font-[Google_Sans] z-10 opacity-40 hover:opacity-70 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] transition-all duration-300 cursor-pointer px-4'
      >
        <span>Type, translate, and learn</span>
      </p>

      <div 
        ref={buttonsRef}
        className='flex flex-col lg:flex-row items-center justify-center mt-8 space-y-4 lg:space-y-0 lg:space-x-6 px-4'
      >
        <a 
          href="/get-started"
          className='relative w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-full font-[Google_Sans] font-medium opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] hover:from-blue-600 hover:to-blue-500 transition-all duration-300 z-10 text-center transform hover:scale-105'
        >
          🚀 Start Translating
        </a>
        <a 
          href="/features"
          className='relative w-full sm:w-auto px-8 py-3 bg-transparent border border-green-400 text-white rounded-full font-[Google_Sans] font-medium opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:bg-green-400 hover:text-black transition-all duration-300 z-10 text-center transform hover:scale-105'
        >
          ✨ About & Features
        </a>
        <a 
          href="/saved-translations"
          className='relative w-full sm:w-auto px-8 py-3 bg-transparent border border-purple-400 text-white rounded-full font-[Google_Sans] font-medium opacity-80 hover:opacity-100 hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:bg-purple-400 hover:text-black transition-all duration-300 z-10 text-center transform hover:scale-105'
        >
          � Saved Translations
        </a>
      </div>

      {/* Language Showcase */}
      <div className='relative z-10 mt-12 px-4'>
        <p className='text-white text-sm sm:text-base font-[Google_Sans] opacity-60 text-center mb-6'>
          Supporting Hindi, Tamil, Telugu, Bengali, Gujarati, Punjabi, Kannada, Malayalam, Marathi, Japanese, Chinese, Korean, Arabic, Hebrew, Thai, Russian, Greek, and Urdu
        </p>
        <div 
          ref={languagesRef}
          className='flex flex-wrap justify-center items-center gap-3 sm:gap-4 max-w-4xl mx-auto'
        >
          <span className='px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-[Google_Sans] opacity-70 hover:opacity-100 transition-opacity duration-200'>🇮🇳 Hindi</span>
          <span className='px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-[Google_Sans] opacity-70 hover:opacity-100 transition-opacity duration-200'>🇮🇳 Tamil</span>
          <span className='px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-[Google_Sans] opacity-70 hover:opacity-100 transition-opacity duration-200'>🇯🇵 Japanese</span>
          <span className='px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-[Google_Sans] opacity-70 hover:opacity-100 transition-opacity duration-200'>🇨🇳 Chinese</span>
          <span className='px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-[Google_Sans] opacity-70 hover:opacity-100 transition-opacity duration-200'>🇰🇷 Korean</span>
          <span className='px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-[Google_Sans] opacity-70 hover:opacity-100 transition-opacity duration-200'>🇸🇦 Arabic</span>
          <span className='px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-[Google_Sans] opacity-70 hover:opacity-100 transition-opacity duration-200'>🇷🇺 Russian</span>
          <span className='px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-[Google_Sans] opacity-70 hover:opacity-100 transition-opacity duration-200'>🇹🇭 Thai</span>
          <span className='px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-[Google_Sans] opacity-70 hover:opacity-100 transition-opacity duration-200'>+ 10 more</span>
        </div>
      </div>
    </div>
  )
}

export default Home
