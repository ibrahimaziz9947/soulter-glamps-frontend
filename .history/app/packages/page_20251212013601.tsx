import Image from 'next/image'
import Link from 'next/link'
import SectionHeading from '../components/SectionHeading'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import { packages } from '../data/glamps'

export const metadata = {
  title: 'Packages - Soulter Glamps',
  description: 'Explore our curated glamping packages and special experiences',
}

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header - Now using centralized component */}
      <PageHeader 
        title="Our Packages"
        subtitle="Curated experiences designed for unforgettable getaways"
        height="medium"
        overlayOpacity="medium"
      />

      {/* Packages Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {packages.map((pkg, index) => (
              <div 
                key={pkg.id} 
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-smooth animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="relative h-64">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-yellow text-green px-4 py-2 rounded-full font-bold">
                    {pkg.duration}
                  </div>
                </div>
                
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold text-green mb-3">
                    {pkg.name}
                  </h2>
                  <p className="text-text-light mb-6">{pkg.description}</p>
                  
                  <div className="mb-6">
                    <h3 className="font-semibold text-green mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {pkg.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-text-dark">
                          <svg className="w-4 h-4 text-green flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div>
                      <span className="text-sm text-text-light">Starting from</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-3xl font-bold text-green">
                          {pkg.price}
                        </span>
                      </div>
                    </div>
                    <Link href="/booking">
                      <Button variant="primary" size="medium">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Packages */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Custom Packages"
            subtitle="Create your perfect glamping experience"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-8 bg-cream rounded-lg">
              <div className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-3">Group Retreats</h3>
              <p className="text-text-light mb-4">
                Perfect for corporate teams, yoga retreats, or friend groups. Customize activities and meals.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="small">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="text-center p-8 bg-cream rounded-lg">
              <div className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-3">Special Celebrations</h3>
              <p className="text-text-light mb-4">
                Anniversaries, proposals, birthdays. We'll help create magical moments with special touches.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="small">
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="text-center p-8 bg-cream rounded-lg">
              <div className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-3">Private Events</h3>
              <p className="text-text-light mb-4">
                Host intimate weddings, family reunions, or corporate events in a stunning natural setting.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="small">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Available Add-ons"
            subtitle="Enhance any package with these extras"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Gourmet Meals</h4>
              <p className="text-text-light text-sm mb-3">Farm-to-table dining</p>
              <p className="font-bold text-green">$25-75/person</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Private Guide</h4>
              <p className="text-text-light text-sm mb-3">Expert nature tours</p>
              <p className="font-bold text-green">$150/half day</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Spa Services</h4>
              <p className="text-text-light text-sm mb-3">Massage & treatments</p>
              <p className="font-bold text-green">$80-200/session</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Photography</h4>
              <p className="text-text-light text-sm mb-3">Professional photos</p>
              <p className="font-bold text-green">$250/session</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Yoga Classes</h4>
              <p className="text-text-light text-sm mb-3">Private or group</p>
              <p className="font-bold text-green">$50-100/class</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Live Music</h4>
              <p className="text-text-light text-sm mb-3">Acoustic performances</p>
              <p className="font-bold text-green">$300/evening</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Event Planning</h4>
              <p className="text-text-light text-sm mb-3">Full coordination</p>
              <p className="font-bold text-green">Custom pricing</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Welcome Basket</h4>
              <p className="text-text-light text-sm mb-3">Local treats & wine</p>
              <p className="font-bold text-green">$50-150</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Need Help Choosing?
          </h2>
          <p className="text-xl text-cream/90 mb-8">
            Our team can help you select the perfect package for your needs and customize it to make your stay unforgettable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="secondary" size="large">
                Contact Us
              </Button>
            </Link>
            <Link href="/booking">
              <Button variant="outline" size="large">
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
