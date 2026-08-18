'use client'

export const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/5 animate-float"
          style={{
            width: `${30 + i * 20}px`,
            height: `${30 + i * 20}px`,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${6 + i * 1.5}s`,
          }}
        />
      ))}
    </div>
  )
}
