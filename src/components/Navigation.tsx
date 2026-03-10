'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Menu, X, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NavigationProps {
  isAuthenticated: boolean
  user: { email: string; name: string } | null
  onLoginClick: () => void
  onLogout: () => void
  onOpenEditor: () => void
  isEditorMode?: boolean
}

export function Navigation({
  isAuthenticated,
  user,
  onLoginClick,
  onLogout,
  onOpenEditor,
  isEditorMode = false,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => !isEditorMode && window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-cyan to-pink rounded-sm flex items-center justify-center brutal-glow-cyan">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black">
              <span className="brutal-gradient-text">BRUTAL</span>
              <span className="text-white">IMAGE</span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isEditorMode && (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-muted-foreground hover:text-cyan transition-colors font-medium"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('pricing')}
                  className="text-muted-foreground hover:text-cyan transition-colors font-medium"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection('download')}
                  className="text-muted-foreground hover:text-pink transition-colors font-medium flex items-center gap-1"
                >
                  Download
                </button>
              </>
            )}
          </div>

          {/* Auth Buttons - Auth is OPTIONAL */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-sm">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan to-pink rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-black" />
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <Button
                  onClick={onOpenEditor}
                  className="btn-brutal bg-cyan text-black font-bold hover:bg-cyan/90"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Open Editor
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="text-muted-foreground hover:text-pink"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                {/* NO AUTH REQUIRED - Direct access to editor */}
                <Button
                  onClick={onOpenEditor}
                  className="btn-brutal bg-cyan text-black font-bold hover:bg-cyan/90 brutal-glow-cyan"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Start Editing Free
                </Button>
                {/* Optional auth for cloud save */}
                <Button
                  variant="ghost"
                  onClick={onLoginClick}
                  className="text-muted-foreground hover:text-white"
                >
                  Login
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-card border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {!isEditorMode && (
                <>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="block w-full text-left py-2 text-muted-foreground hover:text-cyan transition-colors font-medium"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection('pricing')}
                    className="block w-full text-left py-2 text-muted-foreground hover:text-cyan transition-colors font-medium"
                  >
                    Pricing
                  </button>
                  <button
                    onClick={() => scrollToSection('download')}
                    className="block w-full text-left py-2 text-pink hover:text-pink/80 transition-colors font-medium"
                  >
                    Download App
                  </button>
                </>
              )}
              
              <div className="pt-4 border-t border-border space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-2 py-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan to-pink rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-black" />
                      </div>
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <Button
                      onClick={() => {
                        onOpenEditor()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full btn-brutal bg-cyan text-black font-bold"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Open Editor
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full border-pink/30 text-pink hover:bg-pink/10"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    {/* NO AUTH REQUIRED - Direct access */}
                    <Button
                      onClick={() => {
                        onOpenEditor()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full btn-brutal bg-cyan text-black font-bold"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Start Editing Free
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onLoginClick()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full border-border"
                    >
                      Login (Optional)
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
