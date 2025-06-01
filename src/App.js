import React from 'react';
import Particles from 'react-particles';
import { loadFull } from 'tsparticles';
import { particlesOptions } from './config/particlesConfig';
import ContactForm from './components/ContactForm';
import SocialLinks from './components/SocialLinks';
import './App.css';

/**
 * Main App Component
 * Renders the portfolio website with particle background, header, social links, and contact form
 * @returns {JSX.Element} Main application component
 */
function App() {
  /**
   * Initializes the particles.js library
   * @param {Object} main - Particles engine instance
   */
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="app">
      {/* Particle background animation */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
      />
      
      {/* Main content */}
      <div className="content">
        <section className="container">
          {/* Header section with name and tagline */}
          <header className="header">
            <h1 className="header__title">Charles Hanna</h1>
            <p className="header__text">
              Engineering leader passionate about modern web technologies and team development.
            </p>
          </header>
          
          {/* Main content area */}
          <main>
            {/* Social media links */}
            <SocialLinks iconSize={24} />
            
            {/* Contact form */}
            <ContactForm />
          </main>
        </section>
      </div>
    </div>
  );
}

export default App;
