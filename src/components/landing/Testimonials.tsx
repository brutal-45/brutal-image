'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials: Array<{
  name: string
  role: string
  avatar: string
  rating: number
  text: string
  color: 'cyan' | 'pink'
}> = [
  {
    name: 'Alex Chen',
    role: 'Professional Photographer',
    avatar: 'AC',
    rating: 5,
    text: 'BRUTALIMAGE has completely transformed my workflow. The AI background remover is incredibly precise - it saves me hours on every shoot.',
    color: 'cyan'
  },
  {
    name: 'Sarah Miller',
    role: 'Content Creator',
    avatar: 'SM',
    rating: 5,
    text: 'Finally, an editor that doesn&apos;t require a PhD to use! The one-click enhance feature is pure magic. My Instagram game has never been stronger.',
    color: 'pink'
  },
  {
    name: 'Marcus Johnson',
    role: 'E-commerce Owner',
    avatar: 'MJ',
    rating: 5,
    text: 'Batch processing is a game-changer for my product photos. What used to take days now takes minutes. Worth every penny!',
    color: 'cyan'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Graphic Designer',
    avatar: 'ER',
    rating: 5,
    text: 'The layer system is surprisingly powerful. I can do complex composites right in my browser. This is the future of image editing.',
    color: 'pink'
  },
  {
    name: 'David Kim',
    role: 'Marketing Director',
    avatar: 'DK',
    rating: 5,
    text: 'Our team loves BRUTALIMAGE. The collaboration features and consistent quality have made our brand visuals much more cohesive.',
    color: 'cyan'
  },
  {
    name: 'Lisa Wang',
    role: 'Social Media Manager',
    avatar: 'LW',
    rating: 5,
    text: 'I manage 10+ brand accounts and BRUTALIMAGE helps me create stunning content quickly. The export options are exactly what I need.',
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
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5
    }
  }
}

interface TestimonialCardProps {
  name: string
  role: string
  avatar: string
  rating: number
  text: string
  color: 'cyan' | 'pink'
}

function TestimonialCard({ name, role, avatar, rating, text, color }: TestimonialCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className={`h-full rounded-sm border-border bg-card/50 card-brutal ${
        color === 'cyan' ? 'hover:border-cyan' : 'hover:border-pink'
      }`}>
        <CardContent className="p-6">
          {/* Quote icon */}
          <Quote className={`w-8 h-8 mb-4 ${color === 'cyan' ? 'text-cyan/30' : 'text-pink/30'}`} />
          
          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < rating 
                    ? (color === 'cyan' ? 'text-cyan fill-cyan' : 'text-pink fill-pink')
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          
          {/* Text */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            &ldquo;{text}&rdquo;
          </p>
          
          {/* Author */}
          <div className="flex items-center gap-3">
            <Avatar className={`border-2 ${color === 'cyan' ? 'border-cyan/30' : 'border-pink/30'}`}>
              <AvatarImage src="" />
              <AvatarFallback className={`text-sm font-bold ${
                color === 'cyan' ? 'bg-cyan/20 text-cyan' : 'bg-pink/20 text-pink'
              }`}>
                {avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-bold text-white text-sm">{name}</div>
              <div className="text-xs text-muted-foreground">{role}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
      
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
            <span className="text-white">LOVED BY </span>
            <span className="brutal-gradient-text">CREATIVES</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of photographers, designers, and content creators.
          </p>
        </motion.div>
        
        {/* Testimonials grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              {...testimonial}
            />
          ))}
        </motion.div>
        
        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground text-sm mb-6">TRUSTED BY</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {['Adobe', 'Canva', 'Figma', 'Sketch', 'Affinity'].map((brand) => (
              <span key={brand} className="text-xl font-bold text-white">{brand}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
