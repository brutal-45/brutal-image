import { NextRequest, NextResponse } from 'next/server'

// Generate downloadable files for different platforms
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'info'
  
  // Base URL for the app
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'
  
  if (format === 'apk') {
    // Generate a simple HTML page that can be saved and works as Android web app
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>BRUTALIMAGE</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="theme-color" content="#00ffff">
  <link rel="manifest" href="${baseUrl}/manifest.json">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body, html { width: 100%; height: 100%; overflow: hidden; }
    iframe { width: 100%; height: 100%; border: none; }
  </style>
</head>
<body>
  <iframe src="${baseUrl}" allow="camera; microphone; fullscreen"></iframe>
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': 'attachment; filename="BRUTALIMAGE.html"'
      }
    })
  }
  
  if (format === 'exe' || format === 'dmg' || format === 'AppImage') {
    // Generate a desktop launcher HTML file
    const platformName = format === 'exe' ? 'Windows' : format === 'dmg' ? 'macOS' : 'Linux'
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>BRUTALIMAGE - Desktop Launcher</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 60px 40px;
      background: rgba(255,255,255,0.02);
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.1);
      max-width: 500px;
      margin: 20px;
    }
    .logo {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #00ffff, #ff0066);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 36px;
      font-weight: bold;
      color: #000;
    }
    h1 {
      font-size: 28px;
      margin-bottom: 12px;
      background: linear-gradient(90deg, #00ffff, #ff0066);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #888;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(90deg, #00ffff, #00ffff);
      color: #000;
      padding: 16px 48px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
    }
    .note {
      margin-top: 32px;
      font-size: 13px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">B</div>
    <h1>BRUTALIMAGE</h1>
    <p>Professional Image Editor<br>${platformName} Desktop Launcher</p>
    <a class="btn" href="${baseUrl}">Launch Editor</a>
    <p class="note">Save this file and open it anytime to launch BRUTALIMAGE.<br>For best experience, install as PWA from your browser.</p>
  </div>
</body>
</html>`

    const filename = format === 'exe' 
      ? 'BRUTALIMAGE-Setup.html' 
      : format === 'dmg' 
        ? 'BRUTALIMAGE.html' 
        : 'BRUTALIMAGE.html'

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  }
  
  // Default: return download info
  return NextResponse.json({ 
    name: 'BRUTALIMAGE',
    version: '2.0.0',
    downloads: {
      windows: { format: 'EXE', url: `${baseUrl}/api/download?format=exe`, size: 'Launcher' },
      macos: { format: 'DMG', url: `${baseUrl}/api/download?format=dmg`, size: 'Launcher' },
      linux: { format: 'AppImage', url: `${baseUrl}/api/download?format=AppImage`, size: 'Launcher' },
      android: { format: 'APK', url: `${baseUrl}/api/download?format=apk`, size: 'Launcher' },
      pwa: { format: 'PWA', url: baseUrl, size: '~5 MB cached' }
    },
    note: 'For native desktop apps, install as PWA from your browser for the best experience.'
  })
}
