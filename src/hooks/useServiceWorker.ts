'use client'

import { useEffect, useState, useCallback } from 'react'

interface UseServiceWorkerReturn {
  isRegistered: boolean
  isUpdateAvailable: boolean
  registration: ServiceWorkerRegistration | null
  updateServiceWorker: () => void
}

export function useServiceWorker(): UseServiceWorkerReturn {
  const [isRegistered, setIsRegistered] = useState(false)
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    const registerServiceWorker = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })
        
        setRegistration(reg)
        setIsRegistered(true)
        console.log('[PWA] Service Worker registered:', reg.scope)

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setIsUpdateAvailable(true)
                console.log('[PWA] Update available')
              }
            })
          }
        })

        // Check for updates periodically
        setInterval(() => {
          reg.update()
        }, 60 * 60 * 1000) // Check every hour

      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error)
      }
    }

    // Register service worker after the page loads
    if (document.readyState === 'complete') {
      registerServiceWorker()
    } else {
      window.addEventListener('load', registerServiceWorker)
    }

    // Handle controller change (new version activated)
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[PWA] New version activated')
    })

  }, [])

  const updateServiceWorker = useCallback(() => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }, [registration])

  return {
    isRegistered,
    isUpdateAvailable,
    registration,
    updateServiceWorker
  }
}
