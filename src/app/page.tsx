'use client'

import { useState, useCallback, useEffect, useReducer } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { Navigation } from '@/components/Navigation'
import { AuthModal } from '@/components/auth/AuthModal'
import { Editor } from '@/components/editor/Editor'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Showcase } from '@/components/landing/Showcase'
import { WhyChoose } from '@/components/landing/WhyChoose'
import { Pricing } from '@/components/landing/Pricing'
import { Testimonials } from '@/components/landing/Testimonials'
import { Platform } from '@/components/landing/Platform'
import { DownloadSection } from '@/components/landing/DownloadSection'
import { Footer } from '@/components/landing/Footer'

type ViewMode = 'landing' | 'editor'

type AuthState = {
  isAuthenticated: boolean
  user: { email: string; name: string } | null
  isHydrated: boolean
}

type AuthAction = 
  | { type: 'HYDRATE'; user: { email: string; name: string } | null }
  | { type: 'LOGIN'; user: { email: string; name: string } }
  | { type: 'LOGOUT' }

// Reducer for auth state - avoids calling setState directly in effect
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        isAuthenticated: !!action.user,
        user: action.user,
        isHydrated: true,
      }
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.user,
      }
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      }
    default:
      return state
  }
}

// Custom hook for auth state - SSR safe with proper hydration
function useAuthState() {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    isHydrated: false,
  })

  // Load auth state from localStorage after hydration (client-side only)
  useEffect(() => {
    let userData: { email: string; name: string } | null = null
    try {
      const savedAuth = localStorage.getItem('brutalimage_auth')
      if (savedAuth) {
        userData = JSON.parse(savedAuth)
      }
    } catch {
      // Invalid saved auth or localStorage not available
    }
    dispatch({ type: 'HYDRATE', user: userData })
  }, [])

  const updateAuth = useCallback((auth: boolean, userData?: { email: string; name: string }) => {
    try {
      if (auth && userData) {
        localStorage.setItem('brutalimage_auth', JSON.stringify(userData))
        dispatch({ type: 'LOGIN', user: userData })
      } else {
        localStorage.removeItem('brutalimage_auth')
        dispatch({ type: 'LOGOUT' })
      }
    } catch {
      // localStorage not available
    }
  }, [])

  return { ...state, updateAuth }
}

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { isAuthenticated, user, updateAuth } = useAuthState()

  const handleLogout = useCallback(() => {
    updateAuth(false)
    setViewMode('landing')
  }, [updateAuth])

  // CRITICAL: No auth required to access editor - open directly
  const handleOpenEditor = useCallback(() => {
    setViewMode('editor')
  }, [])

  const handleBackToLanding = useCallback(() => {
    setViewMode('landing')
  }, [])

  const handleAuthChange = useCallback((auth: boolean, userData?: { email: string; name: string }) => {
    updateAuth(auth, userData)
  }, [updateAuth])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AnimatePresence mode="wait">
        {viewMode === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Navigation
              isAuthenticated={isAuthenticated}
              user={user}
              onLoginClick={() => setShowAuthModal(true)}
              onLogout={handleLogout}
              onOpenEditor={handleOpenEditor}
              isEditorMode={false}
            />

            <div className="pt-16">
              <Hero onOpenEditor={handleOpenEditor} />
              <Features />
              <Showcase />
              <WhyChoose />
              <Pricing />
              <Testimonials />
              <Platform />
              <DownloadSection />
              <Footer />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-screen"
          >
            <Editor onBack={handleBackToLanding} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth modal is optional - for saving to cloud in future */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthChange={handleAuthChange}
      />
    </main>
  )
}
