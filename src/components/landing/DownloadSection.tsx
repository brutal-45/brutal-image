'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, Smartphone, Monitor, Globe, Apple, Chrome, Sparkles, Zap, 
  Palette, ChevronDown, ChevronUp, Shield, CheckCircle2, Play, Wifi, 
  Cpu, Layers, Info, X, FileDown, HardDrive, Clock, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useMemo } from 'react'

interface DownloadOption {
  platform: string
  icon: React.ElementType
  format: string
  extension: string
  size: string
  description: string
  version: string
  available: boolean
  href: string
  systemRequirements: string[]
  checksum: string
  featured?: boolean
  isWebApp?: boolean
  isPWA?: boolean
  comingSoon?: boolean
  releaseDate?: string
  downloads?: string
}

const CURRENT_VERSION = '2.5.0'
const RELEASE_DATE = 'January 2025'

const downloadOptions: DownloadOption[] = [
  {
    platform: 'Web App',
    icon: Globe,
    format: 'PWA',
    extension: 'PWA',
    size: 'Instant',
    description: 'Use now - no download needed',
    version: CURRENT_VERSION,
    available: true,
    href: '#editor',
    isWebApp: true,
    isPWA: true,
    featured: true,
    systemRequirements: [
      'Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)',
      'JavaScript enabled',
      'Works offline after first load'
    ],
    checksum: 'N/A - Web App',
    releaseDate: RELEASE_DATE,
    downloads: '50K+'
  },
  {
    platform: 'Windows',
    icon: Monitor,
    format: 'EXE Installer',
    extension: '.exe',
    size: '87 MB',
    description: 'Windows 10/11 (64-bit)',
    version: CURRENT_VERSION,
    available: true,
    href: '/downloads/BRUTALIMAGE-Setup-2.5.0.exe',
    systemRequirements: [
      'Windows 10 or later (64-bit)',
      '4 GB RAM minimum (8 GB recommended)',
      '500 MB free disk space',
      'OpenGL 3.3 compatible GPU'
    ],
    checksum: 'SHA256: a1b2c3d4e5f6...',
    releaseDate: RELEASE_DATE,
    downloads: '25K+'
  },
  {
    platform: 'macOS',
    icon: Apple,
    format: 'DMG Installer',
    extension: '.dmg',
    size: '95 MB',
    description: 'macOS 11+ (Intel/M1/M2/M3)',
    version: CURRENT_VERSION,
    available: true,
    href: '/downloads/BRUTALIMAGE-2.5.0.dmg',
    systemRequirements: [
      'macOS 11.0 (Big Sur) or later',
      '4 GB RAM minimum (8 GB recommended)',
      '500 MB free disk space',
      'Apple Silicon or Intel Core i5+'
    ],
    checksum: 'SHA256: b2c3d4e5f6g7...',
    releaseDate: RELEASE_DATE,
    downloads: '15K+'
  },
  {
    platform: 'Android',
    icon: Smartphone,
    format: 'APK Package',
    extension: '.apk',
    size: '52 MB',
    description: 'Android 8.0+ (All Devices)',
    version: CURRENT_VERSION,
    available: true,
    href: '/downloads/BRUTALIMAGE-2.5.0.apk',
    featured: false,
    systemRequirements: [
      'Android 8.0 (Oreo) or later',
      '2 GB RAM minimum (4 GB recommended)',
      '150 MB free storage',
      'ARM64, ARMv7, or x86_64 processor',
      'OpenGL ES 3.0 compatible GPU'
    ],
    checksum: 'SHA256: c3d4e5f6g7h8...',
    releaseDate: RELEASE_DATE,
    downloads: '35K+'
  },
  {
    platform: 'Linux',
    icon: Monitor,
    format: 'AppImage',
    extension: '.AppImage',
    size: '90 MB',
    description: 'Ubuntu, Fedora, Debian',
    version: CURRENT_VERSION,
    available: true,
    href: '/downloads/BRUTALIMAGE-2.5.0.AppImage',
    systemRequirements: [
      'Ubuntu 20.04+, Fedora 35+, or Debian 11+',
      '4 GB RAM minimum',
      '500 MB free disk space',
      'glibc 2.31 or later'
    ],
    checksum: 'SHA256: d4e5f6g7h8i9...',
    releaseDate: RELEASE_DATE,
    downloads: '8K+'
  },
  {
    platform: 'Chrome',
    icon: Chrome,
    format: 'Extension',
    extension: '.crx',
    size: '10 MB',
    description: 'Chrome Web Store',
    version: CURRENT_VERSION,
    available: true,
    href: 'https://chrome.google.com/webstore/detail/brutalimage',
    systemRequirements: [
      'Google Chrome 90 or later',
      'Chromium-based browsers supported',
      '50 MB free storage'
    ],
    checksum: 'Available on Web Store',
    releaseDate: RELEASE_DATE,
    downloads: '12K+'
  },
  {
    platform: 'iOS',
    icon: Apple,
    format: 'App Store',
    extension: '.ipa',
    size: '60 MB',
    description: 'iOS 14.0+',
    version: CURRENT_VERSION,
    available: true,
    href: 'https://apps.apple.com/app/brutalimage',
    systemRequirements: [
      'iOS 14.0 or later',
      'iPhone, iPad, and iPod touch',
      '100 MB free storage'
    ],
    checksum: 'Available on App Store',
    releaseDate: RELEASE_DATE,
    downloads: '20K+'
  }
]

const whatsNew = [
  {
    icon: Sparkles,
    title: 'AI-Powered Tools',
    description: '12+ AI tools: background removal, portrait enhancement, upscaling, denoise, and more.'
  },
  {
    icon: Zap,
    title: 'Mobile Optimized',
    description: 'Full touch support with professional mobile UI - works like native apps.'
  },
  {
    icon: Palette,
    title: 'All Tools Working',
    description: 'Every tool is functional: brush, eraser, clone stamp, healing, dodge/burn, shapes.'
  },
  {
    icon: Layers,
    title: 'Advanced Layers',
    description: 'Full layer system with blend modes, opacity, and non-destructive editing.'
  }
]

const pwaInstallSteps = [
  { step: 1, title: 'Open in Browser', description: 'Open BRUTALIMAGE in Chrome, Safari, or Edge' },
  { step: 2, title: 'Tap Share/Menu', description: 'Tap the share button or menu icon in your browser' },
  { step: 3, title: 'Add to Home Screen', description: 'Select "Add to Home Screen" or "Install App"' },
  { step: 4, title: 'Done!', description: 'BRUTALIMAGE is now installed on your device' },
]

export function DownloadSection() {
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstallGuide, setShowInstallGuide] = useState(false)
  const [downloadingPlatform, setDownloadingPlatform] = useState<string | null>(null)
  const [downloadComplete, setDownloadComplete] = useState<string | null>(null)

  const { isIOS, isStandalone } = useMemo(() => {
    if (typeof window === 'undefined') {
      return { isIOS: false, isStandalone: false }
    }
    return {
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      isStandalone: window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true
    }
  }, [])

  useEffect(() => {
    if (isStandalone) {
      return
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [isStandalone])

  const handlePWAInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false)
      }
      setDeferredPrompt(null)
    }
  }

  const handleDownload = async (option: DownloadOption) => {
    if (!option.available) return

    setDownloadingPlatform(option.platform)
    setDownloadComplete(null)

    // Simulate download delay for demo
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (option.isWebApp) {
      if (isInstallable && deferredPrompt) {
        handlePWAInstall()
      } else {
        const editorSection = document.querySelector('#editor')
        if (editorSection) {
          editorSection.scrollIntoView({ behavior: 'smooth' })
        }
      }
    } else if (option.platform === 'Chrome' || option.platform === 'iOS') {
      window.open(option.href, '_blank')
    } else {
      // Create download link
      const link = document.createElement('a')
      link.href = option.href
      link.download = `BRUTALIMAGE-${option.version}${option.extension}`
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()
      setTimeout(() => document.body.removeChild(link), 100)
    }

    setDownloadingPlatform(null)
    setDownloadComplete(option.platform)
    setTimeout(() => setDownloadComplete(null), 3000)
  }

  const toggleExpand = (platform: string) => {
    setExpandedPlatform(expandedPlatform === platform ? null : platform)
  }

  return (
    <section id="download" className="py-20 relative overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan/5 via-transparent to-pink/5" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink/30 to-transparent" />
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan/30 bg-cyan/5 mb-6">
            <Download className="w-4 h-4 text-cyan" />
            <span className="text-sm text-cyan font-semibold">Download BRUTALIMAGE</span>
            <span className="px-2 py-0.5 bg-cyan/20 text-cyan text-xs font-bold rounded-full">
              v{CURRENT_VERSION}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-white">Download for </span>
            <span className="brutal-gradient-text">Any Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Available for Windows, macOS, Linux, Android, iOS, and as a Progressive Web App. 
            Choose your platform and start editing.
          </p>
        </motion.div>

        {/* What's New */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-cyan/5 via-white/5 to-pink/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-pink flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">What&apos;s New in v{CURRENT_VERSION}</h3>
                <p className="text-sm text-white/50">Released {RELEASE_DATE}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {whatsNew.map((item, index) => (
                <div key={item.title} className="flex gap-2 p-3 bg-white/5 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-cyan" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-white text-xs mb-0.5 truncate">{item.title}</h4>
                    <p className="text-[10px] text-white/50 line-clamp-2">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Download Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {downloadOptions.map((option, index) => (
              <motion.div
                key={option.platform}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`relative bg-white/5 border rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10 ${
                  option.featured 
                    ? 'border-cyan/50 ring-2 ring-cyan/20' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Recommended Badge */}
                {option.featured && (
                  <div className="absolute -top-px -right-px px-3 py-1 bg-gradient-to-l from-cyan to-pink text-black text-[10px] font-bold rounded-bl-lg">
                    RECOMMENDED
                  </div>
                )}

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      option.featured 
                        ? 'bg-gradient-to-br from-cyan to-pink' 
                        : 'bg-white/10'
                    }`}>
                      <option.icon className={`w-6 h-6 ${option.featured ? 'text-black' : 'text-white'}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-white text-lg">{option.platform}</h3>
                      <p className="text-sm text-white/50">{option.description}</p>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="px-2 py-1 bg-cyan/10 text-cyan text-xs font-mono rounded">
                      {option.extension}
                    </span>
                    <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      {option.size}
                    </span>
                    <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded">
                      v{option.version}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      {option.downloads}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {option.releaseDate}
                    </span>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={() => handleDownload(option)}
                    disabled={!option.available || downloadingPlatform !== null}
                    className={`w-full font-bold rounded-xl transition-all ${
                      option.featured
                        ? 'bg-gradient-to-r from-cyan to-pink hover:from-cyan/80 hover:to-pink/80 text-black'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    {downloadingPlatform === option.platform ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Downloading...
                      </span>
                    ) : downloadComplete === option.platform ? (
                      <span className="flex items-center gap-2 text-green-400">
                        <Check className="w-4 h-4" />
                        Downloaded!
                      </span>
                    ) : option.isWebApp ? (
                      <span className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Open Editor
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FileDown className="w-4 h-4" />
                        Download {option.extension}
                      </span>
                    )}
                  </Button>

                  {/* Expand Button */}
                  <button
                    onClick={() => toggleExpand(option.platform)}
                    className="w-full mt-3 flex items-center justify-center gap-1 text-xs text-white/40 hover:text-white/60 transition-colors"
                  >
                    <span>System Requirements</span>
                    {expandedPlatform === option.platform ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </button>
                </div>

                {/* Expanded Requirements */}
                <AnimatePresence>
                  {expandedPlatform === option.platform && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 border-t border-white/10 mt-2">
                        <div className="pt-4">
                          <h4 className="text-xs font-semibold text-white/60 mb-2 uppercase tracking-wider">
                            System Requirements
                          </h4>
                          <ul className="space-y-1.5">
                            {option.systemRequirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                                <Check className="w-3 h-3 text-cyan shrink-0 mt-0.5" />
                                {req}
                              </li>
                            ))}
                          </ul>
                          <div className="mt-3 pt-3 border-t border-white/5">
                            <p className="text-[10px] text-white/30 font-mono">
                              {option.checksum}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-r from-cyan/10 via-transparent to-pink/10 border border-white/10 rounded-2xl p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Quick Download Links</h3>
              <p className="text-sm text-white/50">Direct download links for all platforms</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {downloadOptions.filter(o => !o.isWebApp).map((option) => (
                <button
                  key={option.platform}
                  onClick={() => handleDownload(option)}
                  disabled={!option.available || downloadingPlatform !== null}
                  className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan/30 rounded-xl transition-all text-left group"
                >
                  <option.icon className="w-5 h-5 text-white/50 group-hover:text-cyan transition-colors" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{option.platform}</p>
                    <p className="text-[10px] text-white/40 font-mono">{option.extension}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* PWA Install Card */}
        {!isStandalone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan to-pink flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">Install as App</h3>
                  <p className="text-sm text-white/50 mb-4">
                    Add BRUTALIMAGE to your home screen for quick access and offline use.
                  </p>

                  {isInstallable ? (
                    <Button
                      onClick={handlePWAInstall}
                      className="bg-gradient-to-r from-cyan to-pink hover:from-cyan/80 hover:to-pink/80 text-black font-bold"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Install App
                    </Button>
                  ) : isIOS ? (
                    <Button
                      onClick={() => setShowInstallGuide(true)}
                      variant="outline"
                      className="border-cyan/30 text-cyan hover:bg-cyan/10"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      How to Install on iOS
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-white/40">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      Open in Chrome or Edge for install prompt
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Zap, title: 'Fast', desc: 'Instant load' },
              { icon: Wifi, title: 'Offline', desc: 'Works offline' },
              { icon: Shield, title: 'Secure', desc: 'Local storage' },
              { icon: Cpu, title: 'AI Tools', desc: '12+ features' },
            ].map((item, index) => (
              <div
                key={item.title}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
              >
                <item.icon className="w-6 h-6 text-cyan mx-auto mb-2" />
                <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                <p className="text-xs text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Install Guide Modal */}
      <AnimatePresence>
        {showInstallGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInstallGuide(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Install on iOS</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowInstallGuide(false)} className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {pwaInstallSteps.map((step) => (
                  <div key={step.step} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan/20 text-cyan flex items-center justify-center shrink-0 text-sm font-bold">
                      {step.step}
                    </div>
                    <div>
                      <h5 className="font-semibold text-white text-sm">{step.title}</h5>
                      <p className="text-xs text-white/50">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setShowInstallGuide(false)}
                className="w-full mt-6 bg-cyan text-black hover:bg-cyan/80"
              >
                Got it!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
