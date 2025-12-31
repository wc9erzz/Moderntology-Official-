import { ImageResponse } from 'next/og';


export const alt = 'Moderntology - Advanced Astrology & Numerology';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    // Generate some static "stars" for the background
    const stars = Array.from({ length: 50 }).map((_, i) => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.5 + 0.2,
        size: Math.random() * 2 + 1,
    }));

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // Gradient Mesh Background from AnimatedBackground.tsx
                    background: 'linear-gradient(to bottom, #1a0a1a, #0a0a1a, #000000)',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Starfield Layer */}
                <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex' }}>
                    {stars.map((star, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute',
                                top: star.top,
                                left: star.left,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                borderRadius: '50%',
                                backgroundColor: '#fff',
                                opacity: star.opacity,
                                boxShadow: '0 0 2px rgba(255, 255, 255, 0.8)',
                            }}
                        />
                    ))}
                </div>

                {/* Animated Gradient Blobs (Static Representation) */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-10%',
                        left: '20%',
                        width: '800px',
                        height: '800px',
                        background: 'radial-gradient(circle, rgba(225, 29, 72, 0.15) 0%, transparent 70%)', // Rose
                        filter: 'blur(40px)',
                        pointerEvents: 'none',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: '20%',
                        right: '-10%',
                        width: '700px',
                        height: '700px',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)', // Indigo
                        filter: 'blur(40px)',
                        pointerEvents: 'none',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-20%',
                        left: '30%',
                        width: '900px',
                        height: '600px',
                        background: 'radial-gradient(circle, rgba(88, 28, 135, 0.2) 0%, transparent 70%)', // Purple
                        filter: 'blur(40px)',
                        pointerEvents: 'none',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        zIndex: 10,
                    }}
                >
                    {/* Line 1: Bridging Spirituality */}
                    <h1
                        style={{
                            fontSize: '80px',
                            fontWeight: 800,
                            margin: 0,
                            letterSpacing: '-2px',
                            lineHeight: 1.1,
                            background: 'linear-gradient(to bottom, #ffffff, #a1a1aa)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            paddingBottom: '10px',
                        }}
                    >
                        Bridging Spirituality
                    </h1>

                    {/* Line 2: & Society */}
                    <h1
                        style={{
                            fontSize: '80px',
                            fontWeight: 800,
                            margin: 0,
                            letterSpacing: '-2px',
                            lineHeight: 1.1,
                            background: 'linear-gradient(to right, #818cf8, #c084fc, #fb7185)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            paddingBottom: '10px',
                        }}
                    >
                        & Society
                    </h1>

                    {/* Subtitle / Description */}
                    <p
                        style={{
                            fontSize: '28px',
                            color: '#d4d4d8', // zinc-300
                            marginTop: '30px',
                            maxWidth: '900px',
                            textAlign: 'center',
                            lineHeight: 1.5,
                            fontWeight: 400,
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        }}
                    >
                        The convergence of ancient wisdom and modern data.
                    </p>

                    <p
                        style={{
                            fontSize: '20px',
                            color: '#71717a', // zinc-500
                            marginTop: '10px',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                        }}
                    >
                        Moderntology.com
                    </p>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
