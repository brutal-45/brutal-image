'use client'

import { motion } from 'framer-motion'
import { 
  Zap, 
  Users, 
  Cpu, 
  Cloud, 
  MonitorSmartphone,
  LucideIcon
} from 'lucide-react'

const reasons = [
  {
    icon: Zap,
    title: 'Faster Than Traditional Editors',
    description: 'No bloatware, no lag. Pure editing speed optimized for modern hardware.',
    stat: '10x',
    statLabel: 'Faster'
  },
  {
    icon: Users,
    title: 'Beginner-Friendly + Pro Tools',
    description: 'Intuitive interface for beginners, powerful features for professionals.',
    stat: 'All',
    statLabel: 'Skill Levels'
  },
  {
    icon: Cpu,
    title: 'AI-Powered Automation',
    description: 'Smart tools that learn and adapt to your editing style.',
    stat: 'AI',
    statLabel: 'Enhanced'
  },
  {
    icon: Cloud,
    title: 'No Installation Required',
    description: 'Edit directly in your browser. No downloads, no updates, no hassle.',
    stat: '0',
    statLabel: 'Downloads'
  },
  {
    icon: MonitorSmartphone,
    title: 'Works On All Devices',
    description: 'Responsive design that works on desktop, tablet, and mobile.',
    stat: '100%',
    statLabel: 'Responsive'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5
    }
  }
}

interface ReasonCardProps {
  icon: LucideIcon
  title: string
  description: string
  stat: string
  statLabel: string
  index: number
}

function ReasonCard({ icon: Icon, title, description, stat, statLabel, index }: ReasonCardProps) {
  const isEven = index % 2 === 0
  
  return (
    <motion.div
      variants={itemVariants}
      className={`flex items-center gap-6 p-6 border border-border rounded-sm bg-card/50 card-brutal ${
        isEven ? 'border-l-cyan border-l-2' : 'border-l-pink border-l-2'
      }`}
    >
      <div className={`shrink-0 w-16 h-16 rounded-sm flex items-center justify-center ${
        isEven ? 'bg-cyan/10' : 'bg-pink/10'
      }`}>
        <Icon className={`w-8 h-8 ${isEven ? 'text-cyan' : 'text-pink'}`} />
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      
      <div className="text-right shrink-0 hidden sm:block">
        <div className={`text-2xl font-black ${isEven ? 'text-cyan' : 'text-pink'}`}>{stat}</div>
        <div className="text-xs text-muted-foreground">{statLabel}</div>
      </div>
    </motion.div>
  )
}

export function WhyChoose() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-1/2 h-px bg-gradient-to-r from-cyan/50 to-transparent" />
      <div className="absolute top-1/2 right-0 w-1/2 h-px bg-gradient-to-l from-pink/50 to-transparent" />
      
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
            <span className="text-white">WHY CHOOSE </span>
            <span className="brutal-gradient-text">BRUTALIMAGE</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for speed, designed for power. Experience the difference.
          </p>
        </motion.div>
        
        {/* Reasons list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto space-y-4"
        >
          {reasons.map((reason, index) => (
            <ReasonCard
              key={index}
              {...reason}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
