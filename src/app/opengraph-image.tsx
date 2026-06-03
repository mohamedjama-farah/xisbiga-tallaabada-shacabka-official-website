import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Xisbiga Tallaabada Shacabka — XTS Party Somalia';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #060c1e 0%, #1a2454 60%, #0d1835 100%)',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Gold border frame */}
        <div style={{
          position: 'absolute', inset: '20px',
          border: '2px solid #c9a227',
          borderRadius: '16px',
          opacity: 0.4,
          display: 'flex',
        }} />

        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: '0', left: '50%',
          transform: 'translateX(-50%)',
          width: '200px', height: '4px',
          background: '#c9a227',
          borderRadius: '0 0 4px 4px',
          display: 'flex',
        }} />

        {/* Logo circle */}
        <div style={{
          width: '120px', height: '120px',
          borderRadius: '50%',
          background: '#1a2454',
          border: '3px solid #c9a227',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '32px',
          fontSize: '42px',
          fontWeight: '900',
          color: '#c9a227',
          letterSpacing: '-1px',
        }}>
          XTS
        </div>

        {/* Party name */}
        <div style={{
          fontSize: '52px',
          fontWeight: '900',
          color: '#c9a227',
          marginBottom: '12px',
          textAlign: 'center',
          letterSpacing: '-1px',
          display: 'flex',
        }}>
          Xisbiga Tallaabada Shacabka
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: '24px',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: '40px',
          textAlign: 'center',
          display: 'flex',
        }}>
          Building Tomorrow&apos;s Somalia Together
        </div>

        {/* Three pillars */}
        <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
          {['Justice', 'Unity', 'Progress'].map((word) => (
            <div key={word} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
            }}>
              <div style={{
                width: '8px', height: '8px',
                borderRadius: '50%',
                background: '#c9a227',
                display: 'flex',
              }} />
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                display: 'flex',
              }}>
                {word}
              </div>
            </div>
          ))}
        </div>

        {/* URL badge */}
        <div style={{
          position: 'absolute', bottom: '40px',
          fontSize: '16px',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '2px',
          display: 'flex',
        }}>
          xts-party.so
        </div>
      </div>
    ),
    { ...size }
  );
}
