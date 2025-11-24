import React, { useState } from 'react'

const Layout = ({ children }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window
    const x = (e.clientX / innerWidth - 0.5) * 10 // -5 to 5
    const y = (e.clientY / innerHeight - 0.5) * -10 // -5 to 5 (invert)
    setTilt({ x, y })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div className="page" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div
        className="glass-card"
        style={{
          transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateZ(0)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Layout
