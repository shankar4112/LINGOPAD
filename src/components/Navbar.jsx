import React, { useState } from 'react';
import logoImage from '../assets/profile.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
            <div className="ml-2 lg:ml-0">
              <a href='/' className="block">
                <img src={logoImage} alt='LingoPad Logo' className='h-8 w-auto object-contain hover:opacity-80 transition-opacity duration-300' />
              </a>
            </div>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200">
              Home
            </a>
            <a href="/get-started" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
              Translate
            </a>
            <a href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
              About & Features
            </a>
            <a href="/saved-translations" className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200">
              Saved Translations
            </a>
            <a href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
              Contact
            </a>
          </div>

          {/* Right side - Search/Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/95 backdrop-blur-md rounded-lg mt-2 border border-gray-800">
              <a 
                href="/" 
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="/get-started" 
                className="block px-3 py-2 text-blue-400 hover:text-blue-300 font-medium hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Translate
              </a>
              <a 
                href="/about" 
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About & Features
              </a>
              <a 
                href="/saved-translations" 
                className="block px-3 py-2 text-green-400 hover:text-green-300 font-medium hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Saved Translations
              </a>
              <a 
                href="/contact" 
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
