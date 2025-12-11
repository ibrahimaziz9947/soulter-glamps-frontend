import Link from 'next/link'
import Button from './Button'

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920')",
        }}
      >
        <div className="absolute inset-0 bg-green-dark/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 animate-fade-in">
        <h1 className="font-serif text-5xl md:text-7xl font-bold text-cream mb-6 animate-slide-up">
          Luxury Meets Nature
        </h1>
        <p className="text-xl md:text-2xl text-cream/90 mb-8 max-w-2xl mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
          Experience the perfect blend of comfort and wilderness at Soulter Glamps
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{animationDelay: '0.4s'}}>
          <Link href="/glamps">
            <Button variant="primary" size="large">
              Explore Glamps
            </Button>
          </Link>
          <Link href="/booking">
            <Button variant="secondary" size="large">
              Book Your Stay
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-cream"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  )
}
