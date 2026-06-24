import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1A1A2E',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
          }}
        >
          {/* 3 people silhouettes representing team */}
          <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FF6B35' }} />
              <div style={{ width: '6px', height: '7px', borderRadius: '3px 3px 0 0', background: '#FF6B35', marginTop: '1px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF6B35' }} />
              <div style={{ width: '7px', height: '8px', borderRadius: '3px 3px 0 0', background: '#FF6B35', marginTop: '1px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FF6B35' }} />
              <div style={{ width: '6px', height: '7px', borderRadius: '3px 3px 0 0', background: '#FF6B35', marginTop: '1px' }} />
            </div>
          </div>
          {/* Ground line */}
          <div style={{ width: '22px', height: '2px', background: '#FF6B35', borderRadius: '1px', marginTop: '1px' }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
