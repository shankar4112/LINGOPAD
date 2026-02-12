import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/Home'
import GetStarted from './components/GetStarted'
import AboutFeatures from './components/AboutFeatures'
import SavedTranslations from './components/SavedTranslations'
import Contact from './components/Contact'
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/about" element={<AboutFeatures />} />
        <Route path="/features" element={<AboutFeatures />} />
        <Route path="/saved-translations" element={<SavedTranslations />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  )
}

export default App
