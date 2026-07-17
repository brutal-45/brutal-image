'use client'

import { motion } from 'framer-motion'
import { Globe, Smartphone, Monitor, Download, LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const platforms: Array<{
  icon: LucideIcon
  title: string
  description: string
  status: string
  statusColor: 'cyan' | 'pink'
}> = [
  {
    icon: Globe,
    title: 'Web App',
    description: 'Access BRUTALIMAGE from any modern browser. No installation needed.',
    status: 'Available Now',
    statusColor: 'cyan'
  },
  {
    icon: Smartphone,
    title: 'Mobile Optimized',
    description: 'Fully responsive design that works beautifully on any screen size.',
    status: 'Available Now',
    statusColor: 'pink'
  },
  {
    icon: Download,
    title: 'PWA Install',
    description: 'Install as a Progressive Web App for offline access and native feel.',
    status: 'Available Now',
    statusColor: 'cyan'
  },
  {
    icon: Monitor,
    title: 'Desktop Version',
    description: 'Native desktop applications for Windows, macOS, and Linux.',
    status: 'Coming Soon',
    statusColor: 'pink'
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

interface PlatformCardProps {
  icon: LucideIcon
  title: string
  description: string
  status: string
  statusColor: 'cyan' | 'pink'
}

function PlatformCard({ icon: Icon, title, description, status, statusColor }: PlatformCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full rounded-sm border-border bg-card/50 card-brutal text-center">
        <CardContent className="p-8">
          <div className={`w-16 h-16 mx-auto rounded-sm flex items-center justify-center mb-6 ${
            statusColor === 'cyan' ? 'bg-cyan/10 border border-cyan/30' : 'bg-pink/10 border border-pink/30'
          }`}>
            <Icon className={`w-8 h-8 ${statusColor === 'cyan' ? 'text-cyan' : 'text-pink'}`} />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-4">{description}</p>
          
          <div className={`inline-block px-4 py-1.5 rounded-sm text-sm font-bold ${
            statusColor === 'cyan' 
              ? 'bg-cyan/20 text-cyan border border-cyan/30' 
              : 'bg-pink/20 text-pink border border-pink/30'
          }`}>
            {status}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Platform() {
  return (
    <section className="py-24 relative overflow-hidden bg-secondary/30">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      
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
            <span className="text-white">EDIT </span>
            <span className="brutal-gradient-text">ANYWHERE</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            BRUTALIMAGE works wherever you are. Multiple platforms, one seamless experience.
          </p>
        </motion.div>
        
        {/* Platform cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {platforms.map((platform, index) => (
            <PlatformCard
              key={index}
              {...platform}
            />
          ))}
        </motion.div>
        
        {/* Browser compatibility */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground text-sm mb-4">COMPATIBLE WITH</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              { name: 'Chrome', version: 'v90+' },
              { name: 'Firefox', version: 'v88+' },
              { name: 'Safari', version: 'v14+' },
              { name: 'Edge', version: 'v90+' }
            ].map((browser) => (
              <div key={browser.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-white font-medium">{browser.name}</span>
                <span className="text-muted-foreground text-sm">{browser.version}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
