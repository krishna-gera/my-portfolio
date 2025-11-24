import React, { useEffect, useState } from 'react'

const getTimeLeft = (targetDate) => {
  const now = new Date().getTime()
  const distance = targetDate.getTime() - now

  if (distance <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true }
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((distance / (1000 * 60)) % 60)
  const seconds = Math.floor((distance / 1000) % 60)

  return { days, hours, minutes, seconds, isOver: false }
}

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (timeLeft.isOver) {
    return (
      <div className="countdown">
        <span className="countdown-label">Launch status</span>
        <div className="countdown-value">We&apos;re live 🚀</div>
      </div>
    )
  }

  const items = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <div className="countdown">
      <span className="countdown-label">Launching in</span>
      <div className="countdown-grid">
        {items.map((item) => (
          <div key={item.label} className="countdown-item">
            <div className="countdown-number">{String(item.value).padStart(2, '0')}</div>
            <div className="countdown-text">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Countdown
