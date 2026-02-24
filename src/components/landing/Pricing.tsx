'use client'

import { motion } from 'framer-motion'
import { Check, Zap, Building2, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    icon: Zap,
    popular: false,
    features: [
      'Basic editing tools',
      '5 exports per day',
      '720p max resolution',
      'Community support',
      'Basic filters',
      'Standard processing speed'
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    icon: Crown,
    popular: true,
    features: [
      'All Free features',
      'Unlimited exports',
      '4K resolution support',
      'AI background removal',
      'AI image enhancement',
      'Priority processing',
      'Advanced filters',
      'Batch processing'
    ],
    buttonText: 'Go Pro',
    buttonVariant: 'default' as const
  },
  {
    name: 'Enterprise',
    price: '$49.99',
    period: '/month',
    icon: Building2,
    popular: false,
    features: [
      'All Pro features',
      'API access',
      'Custom branding',
      'Team collaboration',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'Training sessions'
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

interface PricingCardProps {
  name: string
  price: string
  period: string
  icon: React.ElementType
  popular: boolean
  features: string[]
  buttonText: string
  buttonVariant: 'outline' | 'default'
}

function PricingCard({ name, price, period, icon: Icon, popular, features, buttonText, buttonVariant }: PricingCardProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className={`relative h-full rounded-sm ${
        popular 
          ? 'border-cyan brutal-glow-cyan bg-card' 
          : 'border-border bg-card/50'
      } card-brutal`}>
        {popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan text-black text-sm font-bold rounded-sm">
            MOST POPULAR
          </div>
        )}
        
        <CardHeader className="text-center pb-2">
          <div className={`w-14 h-14 mx-auto rounded-sm flex items-center justify-center mb-4 ${
            popular ? 'bg-cyan/20' : 'bg-secondary'
          }`}>
            <Icon className={`w-7 h-7 ${popular ? 'text-cyan' : 'text-muted-foreground'}`} />
          </div>
          <h3 className="text-2xl font-black text-white">{name}</h3>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-black text-white">{price}</span>
            <span className="text-muted-foreground">{period}</span>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <ul className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <Check className={`w-4 h-4 shrink-0 ${popular ? 'text-cyan' : 'text-muted-foreground'}`} />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Button
            variant={buttonVariant}
            className={`w-full font-bold rounded-sm ${
              popular 
                ? 'bg-cyan text-black hover:bg-cyan/90' 
                : 'border-pink/50 text-pink hover:bg-pink/10'
            }`}
          >
            {buttonText}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Pricing() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-secondary/30">
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
            <span className="text-white">SIMPLE </span>
            <span className="brutal-gradient-text">PRICING</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </motion.div>
        
        {/* Pricing cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {plans.map((plan, index) => (
            <PricingCard
              key={index}
              {...plan}
            />
          ))}
        </motion.div>
        
        {/* Money-back guarantee */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground text-sm mt-8"
        >
          30-day money-back guarantee. No questions asked.
        </motion.p>
      </div>
    </section>
  )
}
