// app/api/og/route.tsx
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || 'The List Before The List';
    const description = searchParams.get('description') || 'Beat The Auction! Unlock exclusive property insights and database access.';

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
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)',
          }}
        >
          {/* Logo/Icon Area */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            {/* Hexagon Shape */}
            <div
              style={{
                width: '80px',
                height: '80px',
                border: '3px solid',
                borderImage: 'linear-gradient(135deg, #ec4899, #ef4444) 1',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                display: 'flex',
              }}
            />
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 80px',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ec4899, #ef4444)',
                backgroundClip: 'text',
                color: 'transparent',
                margin: '0 0 20px 0',
                lineHeight: '1.1',
              }}
            >
              {title}
            </h1>
            
            <p
              style={{
                fontSize: '32px',
                color: '#d4d4d8',
                margin: '0',
                maxWidth: '900px',
                lineHeight: '1.4',
              }}
            >
              {description}
            </p>
          </div>

          {/* Bottom Badge */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(39, 39, 42, 0.8)',
              padding: '12px 24px',
              borderRadius: '999px',
              border: '1px solid rgba(82, 82, 91, 0.5)',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                color: '#d4d4d8',
                fontWeight: '600',
              }}
            >
              Property Research Platform
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
