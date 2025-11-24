import React from 'react'
import Layout from './components/Layout.jsx'
import Countdown from './components/Countdown.jsx'
import EmailForm from './components/EmailForm.jsx'
import SocialLinks from './components/SocialLinks.jsx'
import FloatingTech from './components/FloatingTech.jsx'
import BackgroundOrbs from './components/BackgroundOrbs.jsx'

const App = () => {
  // Set your launch date here
  const launchDate = new Date('2026-01-01T00:00:00')

  return (
    <div className="app-root">
      <BackgroundOrbs />
      <Layout>
        <div className="hero-content">
          <div className="pill">
            <span className="pill-dot" />
            <span className="pill-text">Developer Portfolio v2.0</span>
          </div>

          <h1 className="hero-title">
            Something
            <span className="gradient-text"> cool </span>
            is coming
            <span className="cursor">_</span>
          </h1>

          <p className="hero-subtitle">
            I&apos;m rebuilding my digital playground — cleaner code, crazier ideas,
            and smoother experiences. Stay tuned.
          </p>

          <Countdown targetDate={launchDate} />

          <EmailForm />

          <SocialLinks />
        </div>

        <FloatingTech />
      </Layout>
    </div>
  )
}

export default App
