import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="ml-2 lg:ml-0">
              <a href='/' className="block">
                <img src='src/assets/profile.png' alt='LingoPad Logo' className='h-30 w-auto object-contain hover:opacity-80 transition-opacity duration-300' />
              </a>
            </div>
          </div>
          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              Features
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
              About
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
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
      </div>
    </nav>
  );
};

export default Navbar;
