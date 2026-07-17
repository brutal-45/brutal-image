'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Apple, 
  Globe,
  Check,
  Loader2,
  Chrome
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const downloadOptions = [
  {
    platform: 'Web App',
    icon: Globe,
    description: 'Install as Progressive Web App on any device',
    extension: 'PWA',
    color: 'cyan',
    available: true,
    recommended: true,
  },
  {
    platform: 'Android',
    icon: Smartphone,
    description: 'Install directly on your Android phone',
    extension: '.apk',
    color: 'green',
    available: true,
    recommended: false,
  },
  {
    platform: 'Windows',
    icon: Monitor,
    description: 'Download for Windows 10/11',
    extension: '.exe',
    color: 'blue',
    available: true,
    recommended: false,
  },
  {
    platform: 'macOS',
    icon: Apple,
    description: 'Download for macOS (Intel & Apple Silicon)',
    extension: '.dmg',
    color: 'gray',
    available: true,
    recommended: false,
  },
  {
    platform: 'Linux',
    icon: Monitor,
    description: 'Download as AppImage or .deb package',
    extension: '.AppImage',
    color: 'orange',
    available: true,
    recommended: false,
  },
  {
    platform: 'Chrome Extension',
    icon: Chrome,
    description: 'Install as Chrome browser extension',
    extension: '.crx',
    color: 'yellow',
    available: true,
    recommended: false,
  },
]

export function Downloads() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [downloadingPlatform, setDownloadingPlatform] = useState<string | null>(null)
  const mounted = useRef(true)

  // Check if installed and listen for install prompt
  useEffect(() => {
    mounted.current = true
    
    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      if (mounted.current) {
        setInstallPrompt(e as BeforeInstallPromptEvent)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Check if already installed (deferred to avoid setState in effect)
    const checkInstalled = () => {
      if (typeof window !== 'undefined' && mounted.current) {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        setIsInstalled(isStandalone)
      }
    }
    
    // Use queueMicrotask to defer the check
    queueMicrotask(checkInstalled)

    return () => {
      mounted.current = false
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])

  const handlePWAInstall = async () => {
    if (!installPrompt) {
      // Fallback: show instructions
      alert('To install: Click the install icon in your browser address bar or use "Add to Home Screen" from the browser menu.')
      return
    }

    setIsInstalling(true)
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstalled(true)
    }
    
    setInstallPrompt(null)
    setIsInstalling(false)
  }

  const handleDownload = async (platform: string) => {
    setDownloadingPlatform(platform)
    
    // Simulate download preparation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For actual downloads, these would be real URLs
    const downloadUrls: Record<string, string> = {
      'Android': '/downloads/brutalimage-android.apk',
      'Windows': '/downloads/brutalimage-windows.exe',
      'macOS': '/downloads/brutalimage-macos.dmg',
      'Linux': '/downloads/brutalimage-linux.AppImage',
      'Chrome Extension': '/downloads/brutalimage-chrome.crx',
    }

    const url = downloadUrls[platform]
    
    if (url) {
      // Create download link
      const link = document.createElement('a')
      link.href = url
      link.download = `brutalimage-${platform.toLowerCase().replace(' ', '-')}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Fallback: open web app
      window.open('/', '_blank')
    }
    
    setDownloadingPlatform(null)
  }

  return (
    <section id="downloads" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/30 bg-cyan/5 mb-6"
          >
            <Download className="w-4 h-4 text-cyan" />
            <span className="text-sm text-cyan font-semibold">Available Everywhere</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6">
            <span className="text-white">Download </span>
            <span className="bg-gradient-to-r from-cyan to-pink bg-clip-text text-transparent">BRUTALIMAGE</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Available on all platforms. Download now and start editing like a pro.
          </p>
        </motion.div>

        {/* Download grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
        >
          {downloadOptions.map((option, index) => {
            const Icon = option.icon
            const isDownloading = downloadingPlatform === option.platform
            const isPWA = option.platform === 'Web App'
            const showInstalled = isPWA && isInstalled
            const canInstallPWA = isPWA && installPrompt && !isInstalled

            return (
              <motion.div
                key={option.platform}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`relative p-6 rounded-xl border transition-all duration-300 ${
                  option.recommended
                    ? 'border-cyan/50 bg-gradient-to-br from-cyan/5 to-pink/5'
                    : 'border-border/50 bg-card/50'
                } hover:border-cyan/30`}
              >
                {/* Recommended badge */}
                {option.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan text-black text-xs font-bold rounded-full">
                    RECOMMENDED
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  option.color === 'cyan' ? 'bg-cyan/10 text-cyan border border-cyan/20' :
                  option.color === 'green' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                  option.color === 'blue' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                  option.color === 'gray' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                  option.color === 'orange' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                  'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-1">{option.platform}</h3>
                <p className="text-sm text-muted-foreground mb-4">{option.description}</p>

                {/* Extension badge */}
                <div className="inline-flex items-center px-2 py-1 rounded bg-secondary text-xs text-muted-foreground mb-4">
                  {option.extension}
                </div>

                {/* Download button */}
                {showInstalled ? (
                  <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
                    <Check className="w-4 h-4" />
                    Installed
                  </div>
                ) : isPWA ? (
                  <Button
                    onClick={handlePWAInstall}
                    disabled={isInstalling || (!canInstallPWA && isInstalled)}
                    className="w-full bg-gradient-to-r from-cyan to-cyan/80 hover:from-cyan/90 hover:to-cyan/70 text-black font-bold"
                  >
                    {isInstalling ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Installing...
                      </>
                    ) : canInstallPWA ? (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Install App
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 mr-2" />
                        Open Web App
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleDownload(option.platform)}
                    disabled={isDownloading}
                    variant={option.recommended ? 'default' : 'outline'}
                    className={`w-full font-bold ${
                      option.recommended
                        ? 'bg-gradient-to-r from-cyan to-pink hover:from-cyan/90 hover:to-pink/90 text-black'
                        : 'border-border hover:border-cyan hover:text-cyan'
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </>
                    )}
                  </Button>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Info section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan" />
              <span>No Account Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan" />
              <span>Auto Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-cyan" />
              <span>Works Offline (PWA)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
