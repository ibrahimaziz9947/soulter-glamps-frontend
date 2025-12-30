import SectionHeading from '../../components/SectionHeading'
import PageHeader from '../../components/PageHeader'

export const metadata = {
  title: 'Facilities - Soulter Glamps',
  description: 'Explore all the facilities and amenities available at Soulter Glamps',
}

export const dynamic = 'force-dynamic'

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header - Now using centralized component */}
      <PageHeader 
        title="Our Facilities"
        subtitle="Everything you need for a comfortable stay in nature"
        height="medium"
        overlayOpacity="medium"
      />

      {/* Facilities Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Premium Amenities"
            subtitle="Included with every glamp"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Breakfast */}
            <div className="bg-cream rounded-lg p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-4">Complimentary Breakfast</h3>
              <p className="text-text-light mb-4">
                Start your day with a delicious breakfast for two guests, included with every booking. Enjoy fresh local cuisine prepared with care.
              </p>
              <ul className="space-y-2 text-sm text-text-dark">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  For two guests daily
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fresh local ingredients
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Served at your convenience
                </li>
              </ul>
            </div>

            {/* Parking */}
            <div className="bg-cream rounded-lg p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-4">Free Car Parking</h3>
              <p className="text-text-light mb-4">
                Secure, complimentary parking available for all guests. Park right near your glamp for easy access and peace of mind.
              </p>
              <ul className="space-y-2 text-sm text-text-dark">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free for all guests
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure parking area
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Close to glamps
                </li>
              </ul>
            </div>

            {/* Room Service */}
            <div className="bg-cream rounded-lg p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-4">Room Service</h3>
              <p className="text-text-light mb-4">
                Enjoy the convenience of room service throughout your stay. Order meals, snacks, or refreshments delivered to your glamp.
              </p>
              <ul className="space-y-2 text-sm text-text-dark">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Available during operating hours
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fresh meals on demand
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Delivered to your glamp
                </li>
              </ul>
            </div>

            {/* Private Lawn */}
            <div className="bg-cream rounded-lg p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-4">Private Lawn Access</h3>
              <p className="text-text-light mb-4">
                Every glamp includes a private lawn area where you can relax, enjoy outdoor meals, or simply soak in the stunning hill-top views.
              </p>
              <ul className="space-y-2 text-sm text-text-dark">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Exclusive to your glamp
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Outdoor seating included
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Perfect for stargazing
                </li>
              </ul>
            </div>

            {/* Bonfire Nights */}
            <div className="bg-cream rounded-lg p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-4">Bonfire Nights</h3>
              <p className="text-text-light mb-4">
                Create unforgettable memories around a cozy bonfire under the stars. Available on request for a magical evening experience.
              </p>
              <ul className="space-y-2 text-sm text-text-dark">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Available on request
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Included in select packages
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Weather dependent
                </li>
              </ul>
            </div>

            {/* Extra Mattress */}
            <div className="bg-cream rounded-lg p-8 shadow-lg hover:shadow-xl transition-smooth">
              <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-4">Extra Mattress Policy</h3>
              <p className="text-text-light mb-4">
                Need extra sleeping space? We provide one additional mattress with quilt and pillow at no extra charge for your comfort.
              </p>
              <ul className="space-y-2 text-sm text-text-dark">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1 extra mattress included
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete bedding provided
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Request at booking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Facilities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Additional Amenities"
            subtitle="More comforts for your stay"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Backup Electricity</h4>
              <p className="text-text-light text-sm">Power supply with timing-dependent backup</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">WiFi Access</h4>
              <p className="text-text-light text-sm">Internet connectivity (signal dependent)</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Hot Water</h4>
              <p className="text-text-light text-sm">Morning hot water (light dependent)</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Heater / Fan</h4>
              <p className="text-text-light text-sm">Climate control for your comfort</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">All Toiletries</h4>
              <p className="text-text-light text-sm">Complete bathroom essentials provided</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Towels & Slippers</h4>
              <p className="text-text-light text-sm">Fresh linens and indoor comfort</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Electric Kettle</h4>
              <p className="text-text-light text-sm">Hot beverages at your convenience</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-smooth">
              <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h4 className="font-semibold text-green mb-2">Drinking Water</h4>
              <p className="text-text-light text-sm">Fresh bottled water available</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
