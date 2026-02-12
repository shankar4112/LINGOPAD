import React, { useState } from 'react'
import backgroundImage from '../assets/background.png'
import config from '../config'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(`${config.API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setIsSubmitted(true);
        setTimeout(() => {
          setFormData({ name: '', email: '', subject: '', message: '' });
          setIsSubmitted(false);
        }, 5000);
      } else {
        setSubmitError(result.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='relative flex flex-col min-h-screen pt-16'>
      <div 
        className='absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20'
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      <div className='relative z-10 flex-grow px-4 py-8 sm:py-12'>
        <div className='text-center mb-8 sm:mb-16'>
          <h1 className='text-white text-4xl sm:text-5xl lg:text-6xl font-normal font-[Google_Sans] mb-4 sm:mb-6 opacity-90 hover:opacity-100 transition-opacity duration-300'>
            Contact Us
          </h1>
          <p className='text-white text-lg sm:text-xl font-[Google_Sans] opacity-70 max-w-3xl mx-auto px-4'>
            We'd love to hear from you! Get in touch with questions, feedback, or suggestions
          </p>
        </div>

        <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
          <div className='space-y-6 lg:space-y-8'>
            <div className='backdrop-blur-md bg-white/10 p-6 sm:p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300'>
              <h2 className='text-white text-2xl sm:text-3xl font-[Google_Sans] mb-4 sm:mb-6 opacity-90'>
                Get in Touch
              </h2>
              <div className='space-y-4 sm:space-y-6'>
                <div className='flex items-start space-x-4'>
                  <div className='w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                    <span className='text-white text-sm'>✉</span>
                  </div>
                  <div>
                    <h3 className='text-white text-lg font-[Google_Sans] mb-2'>Email</h3>
                    <p className='text-gray-300 text-base'>shankar4112004@gmail.com</p>
                  </div>
                </div>
                
                <div className='flex items-start space-x-4'>
                  <div className='w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                    <span className='text-white text-sm'>💬</span>
                  </div>
                  <div>
                    <h3 className='text-white text-lg font-[Google_Sans] mb-2'>Support</h3>
                    <p className='text-gray-300 text-base'>We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <div className='w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1'>
                    <span className='text-white text-sm'>🌐</span>
                  </div>
                  <div>
                    <h3 className='text-white text-lg font-[Google_Sans] mb-2'>Online</h3>
                    <p className='text-gray-300 text-base'>Available 24/7 through this contact form</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='backdrop-blur-md bg-white/10 p-6 sm:p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300'>
              <h3 className='text-white text-xl sm:text-2xl font-[Google_Sans] mb-4 opacity-90'>
                Why Contact Us?
              </h3>
              <ul className='space-y-3 text-gray-300 text-sm sm:text-base'>
                <li className='flex items-center space-x-3'>
                  <span className='w-2 h-2 bg-blue-400 rounded-full flex-shrink-0'></span>
                  <span>Report bugs or technical issues</span>
                </li>
                <li className='flex items-center space-x-3'>
                  <span className='w-2 h-2 bg-green-400 rounded-full flex-shrink-0'></span>
                  <span>Request new language support</span>
                </li>
                <li className='flex items-center space-x-3'>
                  <span className='w-2 h-2 bg-purple-400 rounded-full flex-shrink-0'></span>
                  <span>Suggest feature improvements</span>
                </li>
                <li className='flex items-center space-x-3'>
                  <span className='w-2 h-2 bg-pink-400 rounded-full flex-shrink-0'></span>
                  <span>Business inquiries</span>
                </li>
              </ul>
            </div>
          </div>

          <div className='backdrop-blur-md bg-white/10 p-6 sm:p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300'>
            <h2 className='text-white text-2xl sm:text-3xl font-[Google_Sans] mb-4 sm:mb-6 opacity-90'>
              Send Message
            </h2>
            
            {isSubmitted ? (
              <div className='text-center py-8 sm:py-12'>
                <div className='w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-white text-2xl'>✓</span>
                </div>
                <h3 className='text-white text-lg sm:text-xl font-[Google_Sans] mb-2'>Message Sent Successfully!</h3>
                <p className='text-gray-300 text-sm sm:text-base'>Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
                <div>
                  <label htmlFor="name" className='block text-white text-sm font-[Google_Sans] mb-2'>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200'
                    placeholder='Enter your full name'
                  />
                </div>

                <div>
                  <label htmlFor="email" className='block text-white text-sm font-[Google_Sans] mb-2'>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200'
                    placeholder='Enter your email address'
                  />
                </div>

                <div>
                  <label htmlFor="subject" className='block text-white text-sm font-[Google_Sans] mb-2'>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className='w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200'
                    placeholder='What is this about?'
                  />
                </div>

                <div>
                  <label htmlFor="message" className='block text-white text-sm font-[Google_Sans] mb-2'>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className='w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 resize-none'
                    placeholder='Tell us more about your inquiry...'
                  />
                </div>

                {submitError && (
                  <div className='p-4 bg-red-500/20 border border-red-500/50 rounded-lg'>
                    <p className='text-red-300 text-sm'>{submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className='w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-[Google_Sans] rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200'
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className='mt-12 lg:mt-16 text-center'>
          <div className='backdrop-blur-md bg-white/10 p-6 sm:p-8 rounded-2xl border border-white/20 max-w-4xl mx-auto'>
            <h3 className='text-white text-xl sm:text-2xl font-[Google_Sans] mb-4 opacity-90'>
              Frequently Asked Questions
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-left'>
              <div>
                <h4 className='text-white font-[Google_Sans] mb-2 text-sm sm:text-base'>How accurate are the translations?</h4>
                <p className='text-gray-300 text-xs sm:text-sm'>Our AI-powered translation engine provides high accuracy for common languages and continues to improve with updates.</p>
              </div>
              <div>
                <h4 className='text-white font-[Google_Sans] mb-2 text-sm sm:text-base'>Is my data secure?</h4>
                <p className='text-gray-300 text-xs sm:text-sm'>Yes, we prioritize your privacy. Translations are processed securely and we don't store your personal content.</p>
              </div>
              <div>
                <h4 className='text-white font-[Google_Sans] mb-2 text-sm sm:text-base'>Can I request new languages?</h4>
                <p className='text-gray-300 text-xs sm:text-sm'>Absolutely! Contact us with your language requests and we'll consider adding them in future updates.</p>
              </div>
              <div>
                <h4 className='text-white font-[Google_Sans] mb-2 text-sm sm:text-base'>Is LingoPad free to use?</h4>
                <p className='text-gray-300 text-xs sm:text-sm'>Yes, LingoPad is completely free to use with all features available without any restrictions or premium tiers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
