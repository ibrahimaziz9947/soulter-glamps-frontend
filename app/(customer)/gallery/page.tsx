import Image from 'next/image'
import SectionHeading from '../../components/SectionHeading'

export const dynamic = 'force-dynamic'

const galleryImages = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    alt: 'Luxury camping tent at sunset',
    category: 'Accommodations',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1478827536904-bb2e675adb11?w=800',
    alt: 'Geodesic dome with mountain views',
    category: 'Accommodations',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    alt: 'Safari tent interior',
    category: 'Interiors',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
    alt: 'Lake and mountain scenery',
    category: 'Nature',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    alt: 'Mountain sunrise view',
    category: 'Nature',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1618767689160-da3fb810aad7?w=800',
    alt: 'Treehouse exterior',
    category: 'Accommodations',
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    alt: 'Cozy cabin in the woods',
    category: 'Accommodations',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800',
    alt: 'Hiking trail through forest',
    category: 'Activities',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1445308394109-4ec2920981b1?w=800',
    alt: 'Campfire at night',
    category: 'Activities',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800',
    alt: 'Luxury tent bedroom',
    category: 'Interiors',
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1533873984035-25970ab07461?w=800',
    alt: 'Outdoor seating area',
    category: 'Amenities',
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800',
    alt: 'Forest path',
    category: 'Nature',
  },
  {
    id: 13,
    src: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800',
    alt: 'Starry night sky',
    category: 'Nature',
  },
  {
    id: 14,
    src: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800',
    alt: 'Mountain landscape',
    category: 'Nature',
  },
  {
    id: 15,
    src: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800',
    alt: 'Kayaking activity',
    category: 'Activities',
  },
  {
    id: 16,
    src: 'https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=800',
    alt: 'Outdoor dining setup',
    category: 'Amenities',
  },
  {
    id: 17,
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    alt: 'Forest trail',
    category: 'Nature',
  },
  {
    id: 18,
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800',
    alt: 'Misty mountain morning',
    category: 'Nature',
  },
]

export const metadata = {
  title: 'Gallery - Soulter Glamps',
  description: 'Explore our stunning collection of glamping photos and nature scenery',
}

export default function GalleryPage() {
  const categories = ['All', 'Accommodations', 'Interiors', 'Nature', 'Activities', 'Amenities']

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
            Our Gallery
          </h1>
          <p className="text-xl text-cream/90 max-w-2xl mx-auto animate-slide-up">
            Experience the beauty of Soulter Glamps through our lens
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white sticky top-20 z-40 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full border-2 border-green text-green font-semibold hover:bg-green hover:text-cream transition-smooth"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div 
                key={image.id} 
                className="relative group overflow-hidden rounded-lg shadow-lg animate-fade-in hover-zoom cursor-pointer"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <div className="relative h-80">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-smooth group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-smooth">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-block bg-yellow text-green text-xs font-semibold px-3 py-1 rounded-full mb-2">
                        {image.category}
                      </span>
                      <p className="text-cream font-medium">{image.alt}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading
            title="Share Your Experience"
            subtitle="Tag us in your photos for a chance to be featured"
            centered
          />
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className="text-2xl font-bold text-green">#SoulterGlamps</span>
            <span className="text-xl text-text-light">|</span>
            <a 
              href="https://www.instagram.com/soultersglamps?igsh=MWw2bjh5eTYwbWZsbg==" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold text-yellow hover:text-yellow-light transition-smooth"
            >
              @SoulterGlamps
            </a>
          </div>
          <div className="mt-8">
            <a 
              href="https://www.instagram.com/soultersglamps?igsh=MWw2bjh5eTYwbWZsbg==" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green text-cream px-8 py-4 rounded-full font-semibold hover:bg-green-light transition-smooth"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow Us on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            title="Experience Soulter Glamps"
            subtitle="Watch our video tour"
            centered
          />
          <div className="mt-12 rounded-lg overflow-hidden shadow-2xl">
            <div className="relative bg-green-dark aspect-video flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-50"
                style={{backgroundImage: "url('https://images.unsplash.com/photo-1478827536904-bb2e675adb11?w=1200')"}}
              ></div>
              <button className="relative z-10 w-20 h-20 bg-yellow rounded-full flex items-center justify-center hover:bg-yellow-light transition-smooth hover-zoom">
                <svg className="w-10 h-10 text-green ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Ready to Create Your Own Memories?
          </h2>
          <p className="text-xl text-cream/90 mb-8">
            Book your stay and experience the magic of Soulter Glamps firsthand
          </p>
          <a 
            href="/booking" 
            className="inline-block bg-yellow text-green px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-light transition-smooth"
          >
            Book Your Stay
          </a>
        </div>
      </section>
    </div>
  )
}
