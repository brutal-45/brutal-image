'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

export function Showcase() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX)
  }
  
  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])
  
  return (
    <section className="py-24 relative overflow-hidden bg-secondary/30">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-white">SEE THE </span>
            <span className="brutal-gradient-text">DIFFERENCE</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Drag the slider to compare before and after results. Witness the power of AI editing.
          </p>
        </motion.div>
        
        {/* Before/After slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div
            ref={containerRef}
            className="relative aspect-[4/3] rounded-sm overflow-hidden border border-border cursor-ew-resize select-none brutal-border-glow"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
          >
            {/* After image (bottom layer) */}
            <div className="absolute inset-0">
              <Image
                src="/download/images/showcase-after.png"
                alt="After editing"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-cyan text-black text-sm font-bold rounded-sm">
                AFTER
              </div>
            </div>
            
            {/* Before image (top layer with clip) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <Image
                src="/download/images/showcase-before.png"
                alt="Before editing"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-pink text-white text-sm font-bold rounded-sm">
                BEFORE
              </div>
            </div>
            
            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-sm flex items-center justify-center brutal-glow-cyan">
                <SlidersHorizontal className="w-5 h-5 text-black" />
              </div>
            </div>
            
            {/* Drag instruction */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-sm rounded-sm text-sm text-white flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Drag to compare
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
        
        {/* Stats below showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto"
        >
          <div className="text-center p-4 border border-border rounded-sm bg-card/50">
            <div className="text-3xl font-black text-cyan">2x</div>
            <div className="text-sm text-muted-foreground">Faster Editing</div>
          </div>
          <div className="text-center p-4 border border-border rounded-sm bg-card/50">
            <div className="text-3xl font-black text-pink">100%</div>
            <div className="text-sm text-muted-foreground">Quality Preserved</div>
          </div>
          <div className="text-center p-4 border border-border rounded-sm bg-card/50">
            <div className="text-3xl font-black text-cyan">AI</div>
            <div className="text-sm text-muted-foreground">Powered</div>
          </div>
          <div className="text-center p-4 border border-border rounded-sm bg-card/50">
            <div className="text-3xl font-black text-pink">Pro</div>
            <div className="text-sm text-muted-foreground">Results</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
