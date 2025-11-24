import React, { useState } from 'react'

const EmailForm = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | success | error

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      return
    }

    // Here you can integrate with your backend / Mailchimp / Resend etc.
    console.log('Captured email:', email)
    setStatus('success')
    setEmail('')
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <form className="email-form" onSubmit={handleSubmit}>
      <label className="email-label">Be the first to know</label>
      <div className="email-row">
        <input
          type="email"
          placeholder="Enter your email"
          className="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="email-button" type="submit">
          Notify me
        </button>
      </div>
      {status === 'success' && (
        <p className="email-message email-success">Got it! You&apos;ll hear from me soon ✨</p>
      )}
      {status === 'error' && (
        <p className="email-message email-error">Please enter a valid email address.</p>
      )}
    </form>
  )
}

export default EmailForm
