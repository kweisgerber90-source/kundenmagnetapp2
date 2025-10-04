// components/icons/social-icons.tsx
'use client'

import { cn } from '@/lib/utils'
import { Facebook, Linkedin, Mail, MessageSquare, Phone, Share2, Twitter } from 'lucide-react'

const socialPlatforms = {
  email: { icon: Mail, label: 'E-Mail' },
  phone: { icon: Phone, label: 'Telefon' },
  message: { icon: MessageSquare, label: 'Nachricht' },
  share: { icon: Share2, label: 'Teilen' },
  linkedin: { icon: Linkedin, label: 'LinkedIn' },
  twitter: { icon: Twitter, label: 'Twitter' },
  facebook: { icon: Facebook, label: 'Facebook' },
} as const

interface SocialIconProps {
  platform: keyof typeof socialPlatforms
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function SocialIcon({
  platform,
  className,
  showLabel = false,
  size = 'md',
}: SocialIconProps) {
  const { icon: Icon, label } = socialPlatforms[platform]

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Icon className={sizeClasses[size]} />
      {showLabel && <span className="text-sm">{label}</span>}
    </div>
  )
}

interface SocialLinksProps {
  className?: string
  platforms?: Array<keyof typeof socialPlatforms>
}

export function SocialLinks({
  className,
  platforms = ['email', 'phone', 'linkedin', 'twitter'],
}: SocialLinksProps) {
  const links: Record<keyof typeof socialPlatforms, string> = {
    email: 'mailto:support@kundenmagnet-app.de',
    phone: 'tel:+4917656141624',
    message: '#',
    share: '#',
    linkedin: 'https://linkedin.com/company/kundenmagnetapp',
    twitter: 'https://twitter.com/kundenmagnetapp',
    facebook: 'https://facebook.com/kundenmagnetapp',
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {platforms.map((platform) => (
        <a
          key={platform}
          href={links[platform]}
          target={platform === 'email' || platform === 'phone' ? undefined : '_blank'}
          rel={platform === 'email' || platform === 'phone' ? undefined : 'noopener noreferrer'}
          className="text-muted-foreground transition-colors hover:text-primary"
          aria-label={socialPlatforms[platform].label}
        >
          <SocialIcon platform={platform} size="md" />
        </a>
      ))}
    </div>
  )
}
