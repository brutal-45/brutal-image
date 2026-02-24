# 🖼️ BRUTALIMAGE

**Professional AI-Powered Image Editor** - A full-featured, browser-based image editing application with advanced AI tools, layer support, and a brutalist design aesthetic.

![Version](https://img.shields.io/badge/version-2.5.0-cyan?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-pink?style=flat-square)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Android%20%7C%20iOS-cyan?style=flat-square)

## ✨ Features

### 🎨 Professional Editing Tools
- **Brush Engine** - Size, opacity, hardness, flow controls with pressure sensitivity
- **Pencil & Airbrush** - Precise drawing tools for detailed work
- **Eraser** - Multiple eraser modes with adjustable hardness
- **Clone Stamp** - Copy pixels from one area to another
- **Healing Tools** - Spot healing and patch tools for retouching
- **Dodge & Burn** - Lighten and darken specific areas with range control

### 🔧 Selection & Transform
- **Selection Tools** - Rectangle, ellipse, lasso, polygon lasso, magnetic lasso
- **Magic Wand** - Intelligent selection with tolerance and feather controls
- **Quick Select** - AI-assisted object selection
- **Crop Tool** - Aspect ratio presets with rule of thirds overlay
- **Transform** - Flip horizontal/vertical, rotate, scale

### 📐 Shape & Vector Tools
- **Shapes** - Rectangle, ellipse, polygon, line, triangle, star, heart
- **Fill & Stroke** - Customizable fill colors and stroke widths
- **Gradient Tool** - Linear, radial, angular, and diamond gradients

### ✏️ Text Tool
- **Font Selection** - Multiple font families with size and style controls
- **Text Styling** - Bold, italic, underline options
- **Color Control** - Full color picker for text

### 🎚️ Image Adjustments
- **Light** - Exposure, contrast, highlights, shadows, whites, blacks
- **Color** - Temperature, tint, saturation, vibrance, hue
- **Effects** - Sharpen, clarity, dehaze
- **Filter Presets** - Vintage, B&W, Sepia, Cyberpunk, Brutal, Warm, Cool, Fade, Vibrant

### 📚 Layer System
- **Layer Management** - Add, delete, duplicate, reorder layers
- **Blend Modes** - 16+ blend modes (Normal, Multiply, Screen, Overlay, etc.)
- **Layer Opacity** - Per-layer opacity control
- **Lock & Visibility** - Lock layers and toggle visibility

### 🤖 AI-Powered Tools
- **Auto Enhance** - One-click image enhancement
- **Background Removal** - AI-powered background extraction
- **Object Removal** - Remove unwanted objects from photos
- **Sky Replacement** - Replace skies automatically
- **Portrait Retouch** - Skin smoothing and facial enhancement
- **Upscaling** - 2X and 4X image upscaling
- **Denoise** - Remove noise while preserving detail
- **Color Grade** - Automatic color grading
- **Depth Blur** - Simulated depth of field effect
- **Style Transfer** - Vintage and cinematic looks

### 📱 Mobile Optimized
- **Touch-Friendly UI** - Large touch targets and gesture support
- **Full Tool Access** - All PC tools available on mobile
- **Pinch to Zoom** - Natural touch navigation
- **Slide-Up Panels** - Easy access to tool options

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun start
```

Open [http://localhost:3000](http://localhost:3000) to start editing.

## 📥 Download

### Web App (PWA)
Use instantly in your browser - no download required. Install as a Progressive Web App for offline access.

### Desktop Apps
| Platform | Format | Size |
|----------|--------|------|
| Windows | .EXE | 87 MB |
| macOS | .DMG | 95 MB |
| Linux | .AppImage | 90 MB |

### Mobile Apps
| Platform | Format | Size |
|----------|--------|------|
| Android | .APK | 52 MB |
| iOS | App Store | 60 MB |

## 🛠️ Technology Stack

### Core
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management

### UI Components
- **shadcn/ui** - Accessible component library
- **Lucide React** - Beautiful icons
- **Framer Motion** - Smooth animations

### Canvas & Graphics
- **HTML5 Canvas** - High-performance rendering
- **OffscreenCanvas** - Double buffering for smooth updates

### AI Integration
- **z-ai-web-dev-sdk** - AI model integration for image processing

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main landing page
│   ├── layout.tsx         # Root layout
│   └── api/               # API routes
│       └── ai/            # AI processing endpoints
├── components/
│   ├── editor/            # Editor components
│   │   ├── Editor.tsx     # Main editor
│   │   └── tools.ts       # Tool definitions
│   ├── landing/           # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── DownloadSection.tsx
│   │   └── ...
│   └── ui/                # shadcn/ui components
├── store/
│   └── editorStore.ts     # Zustand store
└── lib/
    └── utils.ts           # Utility functions
```

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| V | Move Tool |
| B | Brush Tool |
| E | Eraser Tool |
| G | Gradient/Fill |
| T | Text Tool |
| P | Pen Tool |
| U | Shape Tools |
| I | Eyedropper |
| H | Hand Tool |
| Z | Zoom Tool |
| J | Healing Tools |
| S | Clone Stamp |
| O | Dodge/Burn |
| X | Swap Colors |
| D | Default Colors |
| [ | Decrease Brush Size |
| ] | Increase Brush Size |
| Ctrl+Z | Undo |
| Ctrl+Shift+Z | Redo |
| Ctrl+S | Export |
| Ctrl+O | Open Image |
| Ctrl+N | New Canvas |
| Ctrl+0 | Fit to Screen |
| Ctrl+1 | Actual Size |
| Space | Pan (hold) |
| Shift+Drag | Straight Line |

## 🎨 Design Philosophy

BRUTALIMAGE embraces a **brutalist design aesthetic** with:
- High contrast color scheme (cyan, pink, white, black)
- Bold typography and sharp edges
- Transparent glassmorphism panels
- Minimal decorative elements
- Focus on functionality over decoration

## 📄 License

MIT License - Use freely for personal and commercial projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

**BRUTALIMAGE** - Professional image editing, reimagined. 🚀
