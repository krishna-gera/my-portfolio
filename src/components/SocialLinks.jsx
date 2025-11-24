import React from 'react'

const links = [
  { name: 'GitHub', url: 'https://github.com/your-username', tag: '@your-username' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/your-profile', tag: 'Say hi 👋' },
  { name: 'X / Twitter', url: 'https://x.com/your-handle', tag: '#devlogs' },
]

const SocialLinks = () => {
  return (
    <div className="social">
      <span className="social-label">Meanwhile, find me here</span>
      <div className="social-row">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="social-chip"
          >
            <span>{link.name}</span>
            <span className="social-tag">{link.tag}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default SocialLinks
