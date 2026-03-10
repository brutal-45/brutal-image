'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { 
  Eraser, 
  Palette, 
  Layers, 
  Wand2, 
  Zap, 
  Sparkles, 
  Copy, 
  Download,
  Cpu,
  Shield,
  Globe,
  LucideIcon
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useMemo } from 'react'

const features: Array<{
  icon: LucideIcon
  title: string
  description: string
  color: 'cyan' | 'pink'
}> = [
  {
    icon: Eraser,
    title: 'AI Background Remover',
    description: 'Instantly remove backgrounds with AI precision. Perfect for product photos and portraits.',
    color: 'cyan'
  },
  {
    icon: Palette,
    title: 'Pro Color Grading',
    description: 'Professional color tools including curves, levels, and HSL adjustments.',
    color: 'pink'
  },
  {
    icon: Layers,
    title: 'Advanced Layers',
    description: 'Full layer system with blend modes, opacity control, and non-destructive editing.',
    color: 'cyan'
  },
  {
    icon: Wand2,
    title: 'Smart Retouch Tools',
    description: 'AI-powered retouching for portraits. Remove blemishes, smooth skin, enhance features.',
    color: 'pink'
  },
  {
    icon: Zap,
    title: 'Lightning Fast Performance',
    description: 'Optimized canvas rendering for smooth editing even on low-end devices.',
    color: 'cyan'
  },
  {
    icon: Sparkles,
    title: 'One-Click Enhance',
    description: 'Let AI analyze and enhance your photos automatically with a single click.',
    color: 'pink'
  },
  {
    icon: Copy,
    title: 'Batch Processing',
    description: 'Apply edits to multiple images at once. Save hours of repetitive work.',
    color: 'cyan'
  },
  {
    icon: Download,
    title: 'Export Any Format',
    description: 'Export in PNG, JPG, WEBP with customizable quality and size options.',
    color: 'pink'
  }
]

const highlights = [
  { icon: Cpu, label: 'Works on Low-End Devices', color: 'cyan' },
  { icon: Shield, label: 'Privacy Focused', color: 'pink' },
  { icon: Globe, label: 'No Installation', color: 'cyan' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
}

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: 'cyan' | 'pink'
  index: number
}

function FeatureCard({ icon: Icon, title, description, color, index }: FeatureCardProps) {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <motion.div
      variants={itemVariants}
      whileHover={prefersReducedMotion ? {} : { 
        y: -5, 
        transition: { duration: 0.2 } 
      }}
      className="h-full"
    >
      <Card className="card-brutal bg-card/50 backdrop-blur-sm border-border h-full rounded-sm group relative overflow-hidden will-change-transform">
        {/* Hover glow effect */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          color === 'cyan' ? 'bg-cyan/5' : 'bg-pink/5'
        }`} />
        
        {/* Animated border on hover */}
        <motion.div 
          className={`absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity`}
          style={{
            background: `linear-gradient(90deg, transparent, ${color === 'cyan' ? 'rgba(0,255,255,0.3)' : 'rgba(255,0,102,0.3)'}, transparent)`,
          }}
          animate={prefersReducedMotion ? {} : {
            x: ['-100%', '100%'],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        
        <CardContent className="p-6 relative z-10">
          <motion.div 
            className={`w-12 h-12 rounded-sm flex items-center justify-center mb-4 transition-all duration-300 ${
              color === 'cyan' 
                ? 'bg-cyan/10 border border-cyan/30 group-hover:bg-cyan/20 group-hover:border-cyan/50' 
                : 'bg-pink/10 border border-pink/30 group-hover:bg-pink/20 group-hover:border-pink/50'
            }`}
            whileHover={{ rotate: 5 }}
          >
            <Icon className={`w-6 h-6 ${color === 'cyan' ? 'text-cyan' : 'text-pink'} transition-transform group-hover:scale-110`} />
          </motion.div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan transition-colors">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          
          {/* Index number */}
          <div className={`absolute top-4 right-4 text-4xl font-black opacity-10 ${
            color === 'cyan' ? 'text-cyan' : 'text-pink'
          }`}>
            {String(index + 1).padStart(2, '0')}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Features() {
  const prefersReducedMotion = useReducedMotion()
  
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink/50 to-transparent" />
      
      {/* Animated background shapes */}
      <motion.div
        animate={prefersReducedMotion ? {} : {
          rotate: [0, 360],
        }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-20 -right-20 w-96 h-96 border border-cyan/10 rounded-full"
        style={{ transform: 'translateZ(0)' }}
      />
      <motion.div
        animate={prefersReducedMotion ? {} : {
          rotate: [360, 0],
        }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-20 -left-20 w-80 h-80 border border-pink/10 rounded-full"
        style={{ transform: 'translateZ(0)' }}
      />
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/30 bg-cyan/5 mb-6"
          >
            <Sparkles className="w-4 h-4 text-cyan" />
            <span className="text-sm text-cyan font-medium">POWERFUL TOOLS</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-white">POWERFUL </span>
            <span className="brutal-gradient-text">FEATURES</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for professional image editing, powered by cutting-edge AI technology.
          </p>
          
          {/* Quick highlights */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            {highlights.map((item, i) => (
              <div 
                key={i}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10"
              >
                <item.icon className={`w-4 h-4 ${item.color === 'cyan' ? 'text-cyan' : 'text-pink'}`} />
                <span className="text-sm text-white/70">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              index={index}
            />
          ))}
        </motion.div>
        
        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            And many more features to discover...
          </p>
          <motion.div 
            className="inline-flex items-center gap-2 text-cyan cursor-pointer hover:gap-3 transition-all"
            whileHover={{ x: 5 }}
            onClick={() => document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="font-medium">Try it now - it&apos;s free</span>
            <Zap className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
