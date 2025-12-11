import Image from 'next/image'
import Link from 'next/link'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'
import { packages } from '../../data/glamps'

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Live Music</h4>
              <p className="text-text-light text-sm">Acoustic performances</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Private Guide</h4>
              <p className="text-text-light text-sm">Expert nature tours</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Movie Night</h4>
              <p className="text-text-light text-sm">Outdoor cinema experience</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Bonfire</h4>
              <p className="text-text-light text-sm">Evening campfire setup</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Event Planning</h4>
              <p className="text-text-light text-sm">Full coordination services</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Photography</h4>
              <p className="text-text-light text-sm">Professional photo session</p>
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
