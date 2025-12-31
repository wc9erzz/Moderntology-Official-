import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Moderntology - Advanced Astrology & Numerology';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
                {/* Background Gradients (Blobs) */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-20%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '1000px',
                        height: '1000px',
                        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-20%',
                        right: '-10%',
                        width: '800px',
                        height: '800px',
                        background: 'radial-gradient(circle, rgba(225, 29, 72, 0.2) 0%, transparent 70%)',
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
                            paddingBottom: '10px', // Prevent clip cutoff
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
                            paddingBottom: '10px', // Prevent clip cutoff
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
