import React from 'react'

const tech = [
  { label: 'React', row: 1 },
  { label: 'TypeScript', row: 2 },
  { label: 'Node.js', row: 3 },
  { label: 'MongoDB', row: 4 },
  { label: 'UI/UX', row: 5 },
  { label: 'DevOps', row: 2 },
  { label: 'AI/ML', row: 4 },
]

const FloatingTech = () => {
  return (
    <div className="floating-tech">
      {tech.map((item, index) => (
        <div
          key={item.label + index}
          className={`tech-pill tech-row-${item.row}`}
          style={{ animationDelay: `${index * 0.3}s` }}
        >
          <span className="tech-dot" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default FloatingTech
