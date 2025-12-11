import Image from 'next/image'
import SectionHeading from '../components/SectionHeading'

export const metadata = {
  title: 'About Us - Soulter Glamps',
  description: 'Learn about Soulter Glamps - your hill-top retreat surrounded by nature',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header */}
      <section className="relative h-96 flex items-center justify-center bg-green">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{backgroundImage: "url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920')"}}
        ></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-cream mb-4 animate-fade-in">
            About Soulter Glamps
          </h1>
          <p className="text-xl text-cream/90 max-w-2xl mx-auto animate-slide-up">
            Your peaceful escape to nature with breathtaking hill-top views
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading
                title="The Soulter Glamps Story"
                subtitle="Where nature meets comfort"
              />
              <div className="space-y-4 text-text-light">
                <p>
                  Nestled in the serene hills of Pakistan, Soulter Glamps was born from a simple vision: to create a sanctuary where guests can reconnect with nature without sacrificing comfort. Our name "Soulter" reflects our mission to provide a retreat for the soul.
                </p>
                <p>
                  Each of our four glamps has been thoughtfully designed to offer you the perfect blend of adventure and relaxation. Perched on hill-tops with panoramic views, our accommodations provide a front-row seat to nature&apos;s most spectacular shows — from sunrise to starlit skies.
                </p>
                <p>
                  What started as a dream to share the beauty of our hills has grown into a beloved destination for travelers seeking peace, privacy, and pure natural beauty. Every guest who stays with us becomes part of our story.
                </p>
              </div>
            </div>
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1478827536904-bb2e675adb11?w=800"
                alt="Soulter Glamps Story"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Our Mission & Vision"
            subtitle="Creating unforgettable experiences in nature"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-4">Our Mission</h3>
              <p className="text-text-light">
                To provide an exceptional glamping experience that brings people closer to nature while delivering premium comfort, authentic hospitality, and memories that last a lifetime. We strive to be the premier hill-top retreat where guests can escape the ordinary and discover extraordinary peace.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-4">Our Vision</h3>
              <p className="text-text-light">
                To become the most beloved glamping destination in Pakistan, known for our stunning locations, impeccable service, and commitment to sustainable tourism. We envision a future where more people experience the healing power of nature in comfort and style.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            title="Why Choose Soulter Glamps"
            subtitle="What makes us special"
            centered
          />
          <div className="space-y-6 mt-12">
            <div className="flex items-start gap-4 bg-cream rounded-lg p-6 animate-fade-in">
              <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Unbeatable Hill-Top Location</h3>
                <p className="text-text-light">
                  Every glamp offers breathtaking panoramic views. Wake up to misty mountains and fall asleep under starlit skies — nature&apos;s theater at your doorstep.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-cream rounded-lg p-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Complete Privacy & Comfort</h3>
                <p className="text-text-light">
                  Each glamp comes with a private lawn and sitting area. Enjoy your personal sanctuary without interruptions, perfect for couples, families, or solo travelers seeking solitude.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-cream rounded-lg p-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Premium Facilities Included</h3>
                <p className="text-text-light">
                  Complimentary breakfast for two, room service, backup electricity, hot water, WiFi (signal dependent), toiletries, and parking — all at PKR 25,000 per night across all four glamps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-cream rounded-lg p-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Transparent & Fair Pricing</h3>
                <p className="text-text-light">
                  One simple rate for all four glamps. No hidden fees, no seasonal price hikes. What you see is what you pay — PKR 25,000/night with all amenities included.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-cream rounded-lg p-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Warm Hospitality</h3>
                <p className="text-text-light">
                  Our team is dedicated to making your stay memorable. From check-in to check-out, we ensure every detail is handled with care and genuine Pakistani hospitality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Natural Beauty Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Location & Natural Beauty"
            subtitle="Surrounded by Pakistan&apos;s stunning hills"
            centered
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-12">
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                alt="Natural Beauty"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-serif text-3xl font-bold text-green mb-6">A Hill Station Paradise</h3>
              <div className="space-y-4 text-text-light">
                <p>
                  Soulter Glamps is situated in one of Pakistan&apos;s most beautiful hill stations, where rolling green hills meet clear blue skies. Our elevated position provides guests with uninterrupted views of the surrounding valleys and mountain ranges.
                </p>
                <p>
                  The area is rich with natural beauty — from pine forests and wildflower meadows to crystal-clear streams and scenic hiking trails. Whether you&apos;re watching the sunrise paint the hills golden or enjoying the cool evening breeze, every moment here is a reminder of nature&apos;s magnificence.
                </p>
                <p>
                  Beyond the views, our location offers peace and tranquility rarely found in today&apos;s busy world. The only sounds you&apos;ll hear are birdsong, rustling leaves, and the gentle whisper of the mountain wind — a true escape from urban chaos.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <div className="text-3xl font-bold text-green mb-2">1,500 meters+</div>
                  <div className="text-sm text-text-light">Elevation</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <div className="text-3xl font-bold text-green mb-2">360°</div>
                  <div className="text-sm text-text-light">Panoramic Views</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <div className="text-3xl font-bold text-green mb-2">4</div>
                  <div className="text-sm text-text-light">Premium Glamps</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <div className="text-3xl font-bold text-green mb-2">24/7</div>
                  <div className="text-sm text-text-light">Fresh Air</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
