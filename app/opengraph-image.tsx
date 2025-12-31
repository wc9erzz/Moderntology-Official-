import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Moderntology - Advanced Astrology & Numerology';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    const tagline = 'Bridging Spirituality & Society';

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
                    backgroundColor: '#000',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background Gradients */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '1200px',
                        height: '1200px',
                        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 60%)',
                        pointerEvents: 'none',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-20%',
                        right: '10%',
                        width: '800px',
                        height: '800px',
                        background: 'radial-gradient(circle, rgba(225, 29, 72, 0.15) 0%, transparent 60%)',
                        pointerEvents: 'none',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        zIndex: 10,
                    }}
                >
                    {/* Main Brand Title */}
                    <h1
                        style={{
                            fontSize: '80px',
                            fontWeight: 800,
                            color: 'white',
                            margin: 0,
                            letterSpacing: '-2px',
                            lineHeight: 1,
                            textAlign: 'center',
                        }}
                    >
                        Moderntology
                    </h1>

                    {/* Gradient Tagline */}
                    <div
                        style={{
                            display: 'flex',
                            fontSize: '48px',
                            fontWeight: 700,
                            background: 'linear-gradient(to right, #818cf8, #c084fc, #fb7185)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginTop: '10px',
                        }}
                    >
                        {tagline}
                    </div>

                    <p
                        style={{
                            fontSize: '24px',
                            color: '#a1a1aa',
                            marginTop: '30px',
                            maxWidth: '800px',
                            textAlign: 'center',
                            lineHeight: 1.5,
                        }}
                    >
                        The convergence of ancient wisdom and modern data. Unlock exclusive insights with our unified ideology tool.
                    </p>
                </div>

                {/* Bottom Bar decoration */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(to right, #4f46e5, #9333ea, #e11d48)',
                    }}
                />
            </div>
        ),
        {
            ...size,
        }
    );
}
