// AnimatedDots.tsx
'use client'

export const AnimatedDots = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white/10 animate-float"
                    style={{
                        left: `${(i * 7) % 100}%`,
                        top: `${(i * 13) % 100}%`,
                        animationDelay: `${(i * 0.5) % 5}s`,
                        animationDuration: `${5 + (i % 5)}s`,
                    }}
                />
            ))}
        </div>
    )
}