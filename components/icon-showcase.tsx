// components/icon-showcase.tsx
'use client'

import { Card, Input } from '@/components/ui'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import * as Icons from '@/lib/icons'
import { cn } from '@/lib/utils'
import type React from 'react'
import { useState } from 'react'

export function IconShowcase() {
  const [search, setSearch] = useState('')
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>('md')

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  // Get only the icon names, not the component functions
  const iconNames = Object.keys(Icons).filter(
    (key) =>
      key !== 'default' &&
      !key.includes('Icons') &&
      key[0] === key[0].toUpperCase() &&
      typeof Icons[key as keyof typeof Icons] === 'function',
  )

  const filteredIcons = iconNames.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase()),
  )

  const categories = {
    Navigation: [
      'Menu',
      'X',
      'ChevronDown',
      'ChevronUp',
      'ChevronLeft',
      'ChevronRight',
      'ArrowRight',
      'ArrowLeft',
    ],
    Features: [
      'Star',
      'QrCode',
      'Shield',
      'Zap',
      'Users',
      'Mail',
      'MessageSquare',
      'Globe',
      'BarChart3',
    ],
    Status: ['CheckCircle', 'XCircle', 'AlertCircle', 'Info', 'Clock'],
    Actions: ['Copy', 'Check', 'Plus', 'Minus', 'Edit', 'Trash2', 'Download', 'Upload', 'Share2'],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Icon-Bibliothek</h3>
        <div className="flex gap-2">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                'rounded px-3 py-1 text-sm',
                selectedSize === size
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80',
              )}
            >
              {size.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <Input
        type="search"
        placeholder="Icon suchen..."
        value={search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Alle Icons</TabsTrigger>
          {Object.keys(categories).map((category) => (
            <TabsTrigger key={category} value={category.toLowerCase()}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {filteredIcons.map((name) => {
              const Icon = Icons[name as keyof typeof Icons] as React.ComponentType<{
                className?: string
              }>
              return (
                <Card
                  key={name}
                  className="flex flex-col items-center justify-center p-4 hover:border-primary"
                >
                  <Icon className={cn(sizeClasses[selectedSize], 'mb-2')} />
                  <span className="text-xs text-muted-foreground">{name}</span>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {Object.entries(categories).map(([category, iconNames]) => (
          <TabsContent key={category} value={category.toLowerCase()} className="mt-4">
            <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
              {iconNames
                .filter((name) => name.toLowerCase().includes(search.toLowerCase()))
                .map((name) => {
                  const Icon = Icons[name as keyof typeof Icons] as React.ComponentType<{
                    className?: string
                  }>
                  if (typeof Icon !== 'function') return null
                  return (
                    <Card
                      key={name}
                      className="flex flex-col items-center justify-center p-4 hover:border-primary"
                    >
                      <Icon className={cn(sizeClasses[selectedSize], 'mb-2')} />
                      <span className="text-xs text-muted-foreground">{name}</span>
                    </Card>
                  )
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
