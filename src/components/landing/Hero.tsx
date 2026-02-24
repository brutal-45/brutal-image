'use client'

import { motion } from 'framer-motion'
import { Sparkles, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface HeroProps {
  onOpenEditor: () => void
}

export function Hero({ onOpenEditor }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid-pattern">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-transparent" />
      
      {/* Glowing orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink/10 rounded-full blur-3xl"
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-cyan/30 bg-cyan/5 mb-6"
            >
              <Sparkles className="w-4 h-4 text-cyan" />
              <span className="text-sm text-cyan font-medium tracking-wider uppercase">AI-Powered Editor</span>
            </motion.div>
            
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl md:text-8xl font-black tracking-tighter mb-4"
            >
              <span className="brutal-gradient-text">BRUTAL</span>
              <br />
              <span className="text-white">IMAGE</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl font-bold text-muted-foreground mb-6"
            >
              Edit Photos.{' '}
              <span className="text-cyan brutal-glow-text-cyan">Brutally</span>{' '}
              Perfect.
            </motion.p>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Professional-grade image editing powered by cutting-edge AI. 
              Remove backgrounds, enhance colors, and transform your photos 
              with precision and speed.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                onClick={onOpenEditor}
                size="lg"
                className="btn-brutal bg-cyan text-black font-bold text-lg px-8 py-6 rounded-sm hover:bg-cyan/90 brutal-glow-cyan"
              >
                <Zap className="mr-2 h-5 w-5" />
                Start Editing Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-pink/50 text-pink hover:bg-pink/10 font-bold text-lg px-8 py-6 rounded-sm"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 grid grid-cols-3 gap-8"
            >
              <div className="text-center lg:text-left">
                <div className="text-3xl font-black text-cyan">10M+</div>
                <div className="text-sm text-muted-foreground">Images Edited</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-black text-pink">500K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-black text-white">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right side - Editor mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Glow effect behind mockup */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan/20 to-pink/20 blur-3xl rounded-lg" />
              
              {/* Mockup container */}
              <div className="relative bg-card border border-border rounded-sm overflow-hidden brutal-border-glow">
                {/* Window header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
                  <div className="w-3 h-3 rounded-full bg-pink" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-sm text-muted-foreground font-mono">BRUTALIMAGE Editor</span>
                </div>
                
                {/* Mockup content */}
                <div className="relative aspect-video">
                  <Image
                    src="/download/images/editor-mockup.png"
                    alt="BRUTALIMAGE Editor Interface"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 px-4 py-2 bg-pink text-white text-sm font-bold rounded-sm brutal-glow-pink"
              >
                AI Enhanced
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 px-4 py-2 bg-cyan text-black text-sm font-bold rounded-sm brutal-glow-cyan"
              >
                Real-time Preview
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-cyan/50 rounded-full flex items-start justify-center p-1"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-3 bg-cyan rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
