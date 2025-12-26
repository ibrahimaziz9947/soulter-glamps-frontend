/*import Hero from '../components/Hero'
import SectionHeading from '../components/SectionHeading'
import GlampGrid from '../components/GlampGrid'
import Button from '../components/Button'
import Link from 'next/link'
import { glamps } from '../data/glamps'

export default function HomePage() {
  const featuredGlamps = glamps.slice(0, 3)

  return (
    <>
      {/* Hero Section *
      <Hero />

      {/* Featured Glamps Section *
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Featured Accommodations"
            subtitle="Discover our handpicked selection of luxury glamping experiences"
            centered
          />
          <GlampGrid glamps={featuredGlamps} />
          <div className="text-center mt-12">
            <Link href="/glamps">
              <Button variant="primary" size="large">
                View All Glamps
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section *
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Why Choose Soulter Glamps"
            subtitle="Escape to nature surrounded by breathtaking hill-top views"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-8 bg-cream rounded-lg animate-fade-in">
              <div className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-3">Hill-Top Views</h3>
              <p className="text-text-light">
                Wake up to breathtaking panoramic views from your private glamp. Every sunrise is a masterpiece surrounded by pure nature.
              </p>
            </div>

            <div className="text-center p-8 bg-cream rounded-lg animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-3">Complete Privacy</h3>
              <p className="text-text-light">
                Each glamp features a private lawn and sitting area. Enjoy peaceful moments away from city noise in total seclusion.
              </p>
            </div>

            <div className="text-center p-8 bg-cream rounded-lg animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-green mb-3">Premium Facilities</h3>
              <p className="text-text-light">
                Complimentary breakfast, WiFi, room service, hot water, backup electricity, and all modern comforts in nature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Widget Section *
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-green text-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Book Your Peaceful Escape
            </h2>
            <p className="text-xl text-cream/90 mb-6">
              Reserve your hill-top glamp today at PKR 25,000 per night and experience nature like never before.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>All 4 glamps at the same rate — PKR 25,000/night</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Complimentary breakfast for two guests</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Private lawn with every glamp</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-yellow flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Room service, parking & backup electricity included</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h3 className="font-serif text-3xl font-bold text-green mb-4 text-center">
              Ready to Book?
            </h3>
            <p className="text-text-light text-center mb-6">
              Experience the perfect blend of nature and comfort at Soulter Glamps
            </p>
            <Link href="/booking">
              <Button variant="primary" size="large" className="w-full mb-4">
                Book Your Stay Now
              </Button>
            </Link>
            <div className="text-center">
              <p className="text-sm text-text-light mb-2">Questions about booking?</p>
              <Link href="/contact" className="text-green hover:text-yellow transition-smooth font-semibold">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section *
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="The Soulter Experience"
            subtitle="Reconnect with nature in comfort and tranquility"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{backgroundImage: "url('https://images.unsplash.com/photo-1478827536904-bb2e675adb11?w=800')"}}
              >
                <div className="absolute inset-0 bg-green-dark/40 flex items-end p-8">
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-cream mb-2">Sunrise Views</h3>
                    <p className="text-cream/90">Watch the sun rise over the hills from your private lawn</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{backgroundImage: "url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800')"}}
              >
                <div className="absolute inset-0 bg-green-dark/40 flex items-end p-8">
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-cream mb-2">Nature Walks</h3>
                    <p className="text-cream/90">Explore the surrounding hills and valleys</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800')"}}
              >
                <div className="absolute inset-0 bg-green-dark/40 flex items-end p-8">
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-cream mb-2">Peaceful Relaxation</h3>
                    <p className="text-cream/90">Unwind in complete privacy away from city noise</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800')"}}
              >
                <div className="absolute inset-0 bg-green-dark/40 flex items-end p-8">
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-cream mb-2">Bonfire Nights</h3>
                    <p className="text-cream/90">Create memories under starlit skies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section *
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="What Our Guests Say"
            subtitle="Real experiences from real adventurers"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-cream p-8 rounded-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-text-light mb-4">
                "An absolutely magical experience! The geodesic dome was stunning, and waking up to mountain views was breathtaking. We'll definitely be back!"
              </p>
              <p className="font-semibold text-green">- Sarah & Mike</p>
            </div>

            <div className="bg-cream p-8 rounded-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-text-light mb-4">
                "Perfect family getaway! The treehouse suite had everything we needed. Kids loved it, and we enjoyed the peace and quiet of nature."
              </p>
              <p className="font-semibold text-green">- The Johnson Family</p>
            </div>

            <div className="bg-cream p-8 rounded-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-text-light mb-4">
                "Luxury camping at its finest. The safari tent exceeded all expectations. Great amenities, stunning location, and exceptional service."
              </p>
              <p className="font-semibold text-green">- David Chen</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} */









import Hero from '../components/Hero'
import SectionHeading from '../components/SectionHeading'
import GlampGrid from '../components/GlampGrid'
import Button from '../components/Button'
import Link from 'next/link'
import { glamps } from '../data/glamps'

export default function HomePage() {
  /**
   * 🔧 Normalize static glamps to match GlampGrid contract
   * Featured glamps are preview-only, so features can be empty safely
   
  const featuredGlamps = glamps.slice(0, 3).map((glamp) => ({
    ...glamp,
    features: glamp.features ?? [], // ✅ FIX: required by GlampGrid
  })) */

  const featuredGlamps = glamps.slice(0, 3).map((glamp) => ({
  ...glamp,
  features: [], // ✅ explicitly injected for GlampGrid contract
}))


  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Featured Glamps Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Featured Accommodations"
            subtitle="Discover our handpicked selection of luxury glamping experiences"
            centered
          />

          <GlampGrid glamps={featuredGlamps} />

          <div className="text-center mt-12">
            <Link href="/glamps">
              <Button variant="primary" size="large">
                View All Glamps
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Why Choose Soulter Glamps"
            subtitle="Escape to nature surrounded by breathtaking hill-top views"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-8 bg-cream rounded-lg animate-fade-in">
              <h3 className="font-serif text-2xl font-bold text-green mb-3">
                Hill-Top Views
              </h3>
              <p className="text-text-light">
                Wake up to panoramic hill views from your private glamp.
              </p>
            </div>

            <div
              className="text-center p-8 bg-cream rounded-lg animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <h3 className="font-serif text-2xl font-bold text-green mb-3">
                Complete Privacy
              </h3>
              <p className="text-text-light">
                Private lawns, seating areas, and peaceful surroundings.
              </p>
            </div>

            <div
              className="text-center p-8 bg-cream rounded-lg animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              <h3 className="font-serif text-2xl font-bold text-green mb-3">
                Premium Facilities
              </h3>
              <p className="text-text-light">
                Breakfast, Wi-Fi, room service, and modern comforts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
