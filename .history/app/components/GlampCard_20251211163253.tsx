import Image from 'next/image'
import Link from 'next/link'
import Button from './Button'

interface GlampCardProps {
  id: string
  name: string
  image: string
  description: string
  capacity: number
  price: string | number
  amenities: string[]
}

export default function GlampCard({
  id,
  name,
  image,
  description,
  capacity,
  price,
  amenities,
}: GlampCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-smooth animate-fade-in">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover hover-zoom transition-smooth"
        />
      </div>
      
      <div className="p-6">
        <h3 className="font-serif text-2xl font-bold text-green mb-2">{name}</h3>
        <p className="text-text-light mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-text-light">
          <div className="flex items-center gap-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Up to {capacity} guests</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {amenities.slice(0, 3).map((amenity, index) => (
            <span
              key={index}
              className="text-xs bg-cream text-green px-3 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
          {amenities.length > 3 && (
            <span className="text-xs text-text-light">+{amenities.length - 3} more</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-green">{typeof price === 'number' ? `$${price}` : price}</span>
            {typeof price === 'number' && <span className="text-text-light text-sm">/night</span>}
          </div>
          <Link href={`/glamps/${id}`}>
            <Button variant="primary" size="small">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
