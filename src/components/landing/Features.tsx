'use client'

import { motion } from 'framer-motion'
import { 
  Eraser, 
  Palette, 
  Layers, 
  Wand2, 
  Zap, 
  Sparkles, 
  Copy, 
  Download,
  LucideIcon
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

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
    description: 'Optimized canvas rendering for smooth editing even with large images.',
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: 'cyan' | 'pink'
}

function FeatureCard({ icon: Icon, title, description, color }: FeatureCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="card-brutal bg-card border-border h-full rounded-sm">
        <CardContent className="p-6">
          <div className={`w-12 h-12 rounded-sm flex items-center justify-center mb-4 ${
            color === 'cyan' 
              ? 'bg-cyan/10 border border-cyan/30' 
              : 'bg-pink/10 border border-pink/30'
          }`}>
            <Icon className={`w-6 h-6 ${color === 'cyan' ? 'text-cyan' : 'text-pink'}`} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink/50 to-transparent" />
      
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-white">POWERFUL </span>
            <span className="brutal-gradient-text">FEATURES</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for professional image editing, powered by cutting-edge AI technology.
          </p>
        </motion.div>
        
        {/* Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
