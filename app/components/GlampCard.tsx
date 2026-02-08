'use client'

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
  features: string[]
  discountEnabled?: boolean
  discountPercent?: number
  finalPrice?: number
}

export default function GlampCard({
  id,
  name,
  image,
  description,
  capacity,
  price,
  features,
  discountEnabled,
  discountPercent,
  finalPrice,
}: GlampCardProps) {
  const isNumericId = /^[0-9]+$/.test(id || '')
  const isUUID = id && id.includes('-') && id.length > 10

  if (!id || id === 'undefined' || id === 'null') return null
  if (isNumericId || !isUUID) return null

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-smooth animate-fade-in">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover hover-zoom transition-smooth"
        />
        {/* Discount Badge */}
        {discountEnabled && discountPercent && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {discountPercent}% OFF
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-serif text-2xl font-bold text-green mb-2">
          {name}
        </h3>

        <p className="text-text-light mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center gap-1 mb-4 text-sm text-text-light">
          <span>Up to {capacity} guests</span>
        </div>

        {/* ✅ FEATURES (Listing Page Only) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-cream text-green px-3 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
          {features.length > 3 && (
            <span className="text-xs text-text-light">
              +{features.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div>
            {discountEnabled ? (
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 line-through">
                  PKR {price}
                </span>
                <div>
                  <span className="text-2xl font-bold text-green">
                    PKR {finalPrice || price}
                  </span>
                  <span className="text-text-light text-sm"> /night</span>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-2xl font-bold text-green">
                  {typeof price === 'number' ? `PKR ${price}` : price}
                </span>
                <span className="text-text-light text-sm"> /night</span>
              </div>
            )}
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
