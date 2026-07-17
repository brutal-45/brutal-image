'use client'

import { motion } from 'framer-motion'
import { Github, Twitter, Instagram, Mail } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '#' },
    { label: 'Roadmap', href: '#' }
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Tutorials', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Blog', href: '#' }
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Press Kit', href: '#' }
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'GDPR', href: '#' }
  ]
}

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: '#', label: 'Email' }
]

interface FooterLinkColumnProps {
  title: string
  links: Array<{ label: string; href: string }>
}

function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
  return (
    <div>
      <h4 className="text-white font-bold mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-muted-foreground hover:text-cyan transition-colors text-sm"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-black brutal-gradient-text mb-4">BRUTALIMAGE</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                Professional image editing powered by AI. Edit photos, brutally perfect.
              </p>
              
              {/* Social links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-cyan hover:border-cyan transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Link columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FooterLinkColumn title="Product" links={footerLinks.product} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FooterLinkColumn title="Resources" links={footerLinks.resources} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <FooterLinkColumn title="Company" links={footerLinks.company} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <FooterLinkColumn title="Legal" links={footerLinks.legal} />
          </motion.div>
        </div>
        
        {/* Bottom bar */}
        <div className="py-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} BRUTALIMAGE. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-cyan text-sm font-medium tracking-wide">Developed under brutaltools</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span className="text-muted-foreground text-sm">Made with</span>
            <span className="text-pink font-bold">♥</span>
            <span className="text-muted-foreground text-sm">for creators</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
