import Link from 'next/link'
import Button from './Button'

/**
 * Hero Component - Home Page
 * 
 * Full-screen hero section with enhanced readability and styling.
 * Image path: /public/images/hero/main-hero.jpg
 * 
 * Features:
 * - Auto-adjusting text contrast with shadows
 * - Responsive design (mobile to desktop)
 * - Smooth animations
 * - Enhanced button visibility
 */
export default function Hero() {
  // Centralized hero image - update this path to change the hero image globally
  const heroImageUrl = '/images/hero/main-hero.jpg'

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Enhanced Loading */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 z-0"
        style={{
          backgroundImage: `url('${heroImageUrl}')`,
          backgroundPosition: 'center center',
        }}
      >
        {/* Minimal overlay for text readability while keeping image original */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
      </div>

      {/* Content with enhanced text shadows */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 animate-fade-in max-w-6xl mx-auto">
        <h1 
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-cream mb-6 animate-slide-up leading-tight"
          style={{
            textShadow: '0 4px 12px rgba(0,0,0,0.5), 0 8px 24px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          Luxury Meets Nature
        </h1>
        <p 
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-cream/95 mb-10 max-w-3xl mx-auto animate-slide-up leading-relaxed" 
          style={{
            animationDelay: '0.2s',
            textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)'
          }}
        >
          Experience the perfect blend of comfort and wilderness at Soulter Glamps
        </p>
        
        {/* Buttons with enhanced visibility */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" 
          style={{animationDelay: '0.4s'}}
        >
          <Link href="/glamps">
            <Button 
              variant="primary" 
              size="large"
              className="shadow-2xl hover:shadow-yellow/50 transition-all duration-300"
            >
              Explore Glamps
            </Button>
          </Link>
          <Link href="/booking">
            <Button 
              variant="secondary" 
              size="large"
              className="shadow-2xl hover:shadow-green/50 transition-all duration-300"
            >
              Book Your Stay
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator with enhanced visibility */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
        }}
      >
        <svg
          className="w-6 h-6 sm:w-8 sm:h-8 text-cream"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      {/* Bottom gradient for smooth content transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent z-0"></div>
    </section>
  )
}
