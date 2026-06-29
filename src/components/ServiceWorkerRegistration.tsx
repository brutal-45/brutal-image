'use client'

import { useEffect } from 'react'
import { useServiceWorker } from '@/hooks/useServiceWorker'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'

export function ServiceWorkerRegistration() {
  const { isRegistered, isUpdateAvailable, updateServiceWorker } = useServiceWorker()
  const { toast } = useToast()

  useEffect(() => {
    if (isUpdateAvailable) {
      toast({
        title: 'Update Available',
        description: 'A new version of BRUTALIMAGE is available. Refresh to update.',
        duration: 0, // Don't auto-dismiss
        action: (
          <button
            onClick={() => {
              updateServiceWorker()
              window.location.reload()
            }}
            className="px-3 py-1 bg-cyan text-black text-sm font-semibold rounded hover:bg-cyan/80 transition-colors"
          >
            Update Now
          </button>
        )
      })
    }
  }, [isUpdateAvailable, updateServiceWorker, toast])

  useEffect(() => {
    if (isRegistered) {
      console.log('[PWA] BRUTALIMAGE is ready to work offline')
    }
  }, [isRegistered])

  return null
}
