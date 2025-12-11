import SectionHeading from '../components/SectionHeading'
import GlampGrid from '../components/GlampGrid'
import PageHeader from '../components/PageHeader'
import { glamps } from '../data/glamps'

export const metadata = {
  title: 'Our Glamps - Soulter Glamps',
  description: 'Explore our collection of luxury glamping accommodations',
}

export default function GlampsPage() {
  return (
    <div className="min-h-screen">
      {/* Page Header - Now using centralized component */}
      <PageHeader 
        title="Our Glamps"
        subtitle="Discover your perfect luxury escape in nature"
        height="medium"
        overlayOpacity="medium"
      />

      {/* Filter Section (Future Enhancement) */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <p className="text-text-light">
                Showing <span className="font-semibold text-green">{glamps.length}</span> accommodations
              </p>
            </div>
            <div className="flex gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent">
                <option>All Types</option>
                <option>Tents</option>
                <option>Domes</option>
                <option>Cabins</option>
                <option>Treehouses</option>
                <option>Yurts</option>
                <option>Pods</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Capacity</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Glamps Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <GlampGrid glamps={glamps} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="What's Included"
            subtitle="Every accommodation comes with premium amenities"
            centered
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Free WiFi</h4>
              <p className="text-sm text-text-light">Stay connected</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Premium Bedding</h4>
              <p className="text-sm text-text-light">Luxury linens</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Climate Control</h4>
              <p className="text-sm text-text-light">Always comfortable</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">24/7 Support</h4>
              <p className="text-sm text-text-light">We're here for you</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Secure Booking</h4>
              <p className="text-sm text-text-light">Safe & protected</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Fresh Towels</h4>
              <p className="text-sm text-text-light">Daily housekeeping</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Stargazing</h4>
              <p className="text-sm text-text-light">Dark sky views</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Nature Trails</h4>
              <p className="text-sm text-text-light">Hiking access</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Can't Decide?
          </h2>
          <p className="text-xl text-cream/90 mb-8">
            Contact our team for personalized recommendations based on your preferences and needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="bg-yellow text-green px-8 py-4 rounded-full font-semibold hover:bg-yellow-light transition-smooth text-center"
            >
              Contact Us
            </a>
            <a 
              href="tel:+15551234567" 
              className="bg-transparent border-2 border-cream text-cream px-8 py-4 rounded-full font-semibold hover:bg-cream hover:text-green transition-smooth text-center"
            >
              Call: (555) 123-4567
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
