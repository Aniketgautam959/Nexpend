import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#18181b',
          borderRadius: 40,
        }}
      >
        <svg
          width='100'
          height='100'
          viewBox='0 0 24 24'
          fill='none'
        >
          <path
            d='M12 3v18M5 10l7-7 7 7'
            stroke='white'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
