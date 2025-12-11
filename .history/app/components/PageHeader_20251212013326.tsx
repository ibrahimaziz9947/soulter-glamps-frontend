import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  imageUrl?: string
  height?: 'small' | 'medium' | 'large' | 'full'
  overlayOpacity?: 'light' | 'medium' | 'dark' | 'darker'
  textColor?: 'cream' | 'white'
  className?: string
}

/**
 * PageHeader Component
 * 
 * A reusable header component for internal pages with:
 * - Automatic contrast adjustment
 * - Responsive design
 * - Customizable overlay darkness
 * - Flexible height options
 * 
 * Usage:
 * <PageHeader 
 *   title="Our Glamps" 
 *   subtitle="Discover luxury in nature"
 *   overlayOpacity="medium"
 * />
 */
export default function PageHeader({
  title,
  subtitle,
  imageUrl = '/images/hero/main-hero.jpg',
  height = 'medium',
  overlayOpacity = 'medium',
  textColor = 'cream',
  className = ''
}: PageHeaderProps) {
  // Height mapping
  const heightClasses = {
    small: 'h-64 sm:h-80',
    medium: 'h-80 sm:h-96',
    large: 'h-96 sm:h-[32rem]',
    full: 'h-screen'
  }

  // Overlay opacity for better text contrast
  const overlayClasses = {
    light: 'bg-green-dark/30',
    medium: 'bg-green-dark/50',
    dark: 'bg-green-dark/65',
    darker: 'bg-green-dark/80'
  }

  // Text color
  const textColorClass = textColor === 'cream' ? 'text-cream' : 'text-white'

  return (
    <section className={`relative ${heightClasses[height]} flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Image with Enhanced Loading */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105 hover:scale-100"
        style={{
          backgroundImage: `url('${imageUrl}')`,
          backgroundPosition: 'center center',
        }}
      >
        {/* Dark overlay for text readability with smooth gradient */}
        <div className={`absolute inset-0 ${overlayClasses[overlayOpacity]}`}>
          {/* Additional gradient for extra text contrast at the center */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>
        </div>
      </div>

      {/* Content with text shadow for maximum readability */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 
          className={`font-serif text-4xl sm:text-5xl md:text-6xl font-bold ${textColorClass} mb-4 animate-fade-in`}
          style={{
            textShadow: '0 2px 10px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2)'
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p 
            className={`text-lg sm:text-xl md:text-2xl ${textColorClass}/95 max-w-2xl mx-auto animate-slide-up leading-relaxed`}
            style={{
              animationDelay: '0.2s',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Subtle bottom gradient for smooth transition to content */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
    </section>
  )
}
