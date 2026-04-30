import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

// Image generation 
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: 'linear-gradient(135deg, #00ffff, #ff0066)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
          borderRadius: '36px',
          fontWeight: 'bold',
        }}
      >
        B
      </div>
    ),
    {
      ...size,
    }
  )
}
