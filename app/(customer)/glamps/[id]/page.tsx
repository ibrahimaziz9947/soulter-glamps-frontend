'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '../../../components/Button'
import BookingWidget from '../../../components/BookingWidget'
import ImageGallery from '../../../components/ImageGallery'
import { getGlampById, type Glamp } from '@/src/services'

export const dynamic = 'force-dynamic'

export default function GlampDetailPage({ params }: { params: { id: string } }) {
  const [glamp, setGlamp] = useState<Glamp | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGlamp = async () => {
      console.log('[Glamp Details] Params received:', params)
      console.log('[Glamp Details] ID type:', typeof params.id, 'Value:', params.id)
      
      // Validate ID before making API call
      if (!params.id || params.id === 'undefined' || params.id === 'null' || params.id.trim() === '') {
        console.error('[Glamp Details] Invalid ID detected:', {
          id: params.id,
          type: typeof params.id,
          isEmpty: !params.id,
          isUndefined: params.id === 'undefined'
        })
        setError(`Invalid glamp ID: ${params.id}`)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        console.log('[Glamp Details] Fetching glamp with UUID:', params.id)
        const response = await getGlampById(params.id)
        
        // Map backend id (could be 'id' or '_id') to frontend
        const glampData = {
          ...response.data,
          id: response.data.id || response.data._id
        }
        
        console.log('[Glamp Details] Successfully received glamp:', {
          id: glampData.id,
          name: glampData.name,
          hasId: !!response.data.id,
          has_id: !!response.data._id
        })
        setGlamp(glampData)
      } catch (err: any) {
        console.error('[Glamp Details] Failed to fetch glamp:', err)
        setError(err.message || 'Glamp not found')
      } finally {
        setLoading(false)
      }
    }

    fetchGlamp()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-green mb-4"></div>
          <p className="text-text-light">Loading accommodation details...</p>
        </div>
      </div>
    )
  }

  if (error || !glamp) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg className="w-20 h-20 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="font-serif text-3xl font-bold text-green mb-4">Glamp Not Found</h1>
          <p className="text-text-light mb-6">{error || 'The accommodation you are looking for does not exist.'}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/glamps">
              <Button variant="primary" size="medium">
                View All Glamps
              </Button>
            </Link>
            <Link href="/">
              <Button variant="secondary" size="medium">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Image Gallery */}
      {glamp.images && glamp.images.length > 0 ? (
        <ImageGallery images={glamp.images} name={glamp.name} />
      ) : (
        <div className="relative h-96 bg-green flex items-center justify-center">
          <div className="text-center text-cream">
            <svg className="w-20 h-20 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-lg">Images coming soon</p>
          </div>
        </div>
      )}

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
                <div className="mb-6">
                  <h1 className="font-serif text-4xl md:text-5xl font-bold text-green mb-4">
                    {glamp.name}
                  </h1>
                  <div className="flex items-center gap-6 text-text-light">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Up to {glamp.capacity || 3} guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Nature Valley, CA</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="font-serif text-2xl font-bold text-green mb-4">About This Glamp</h2>
                  <p className="text-text-light leading-relaxed mb-4">
                    {glamp.description}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-8 mb-8">
                  <h2 className="font-serif text-2xl font-bold text-green mb-6">Amenities</h2>
                  {glamp.amenities && glamp.amenities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {glamp.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-yellow flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-text-dark">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-text-light italic">Amenity information coming soon.</p>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <h2 className="font-serif text-2xl font-bold text-green mb-6">House Rules</h2>
                  <div className="space-y-4 text-text-light">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-text-dark">Check-in: 3:00 PM - 8:00 PM</p>
                        <p className="text-sm">Late check-in available upon request</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="font-semibold text-text-dark">Check-out: 11:00 AM</p>
                        <p className="text-sm">Late check-out subject to availability</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <div>
                        <p className="font-semibold text-text-dark">No smoking</p>
                        <p className="text-sm">Smoking is prohibited inside all accommodations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      <div>
                        <p className="font-semibold text-text-dark">Quiet hours: 10:00 PM - 7:00 AM</p>
                        <p className="text-sm">Please respect other guests</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Similar Glamps - Hidden for now, will be implemented with backend pagination */}
              {/* <div className="bg-white rounded-lg p-8 shadow-lg">
                <h2 className="font-serif text-2xl font-bold text-green mb-6">You Might Also Like</h2>
                <p className="text-text-light italic">More accommodations coming soon!</p>
              </div> */}
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
                  <div className="mb-6">
                    {glamp.discountEnabled && (glamp.discountPercent ?? 0) > 0 ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-2 text-text-light/80 line-through">
                          <span className="font-serif text-lg font-bold">
                            PKR {glamp.pricePerNight?.toLocaleString() || 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-4xl font-bold text-green">
                            PKR {(
                              (glamp.pricePerNight || 0) * 
                              (1 - (glamp.discountPercent ?? 0) / 100)
                            ).toLocaleString()}
                          </span>
                          <span className="text-text-light">/night</span>
                          <span className="bg-yellow/20 text-yellow-700 text-xs px-2 py-1 rounded font-bold ml-2">
                            {glamp.discountPercent}% OFF
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-4xl font-bold text-green">
                          PKR {glamp.pricePerNight?.toLocaleString() || 'N/A'}
                        </span>
                        <span className="text-text-light">/night</span>
                      </div>
                    )}
                  </div>
                  <BookingWidget glampId={glamp.id || glamp._id} glampName={glamp.name} />
                </div>

                <div className="bg-green text-cream rounded-lg p-6 shadow-lg">
                  <h3 className="font-serif text-xl font-bold mb-4">Need Help?</h3>
                  <p className="text-cream/90 text-sm mb-4">
                    Our team is here to assist you with any questions about this accommodation.
                  </p>
                  <Link href="/contact">
                    <Button variant="secondary" size="medium" className="w-full">
                      Contact Us
                    </Button>
                  </Link>
                  <div className="mt-4 pt-4 border-t border-cream/20">
                    <p className="text-cream/90 text-sm mb-2">Call us directly:</p>
                    <a href="tel:03395069280" className="text-yellow font-semibold hover:text-yellow-light transition-smooth">
                      0339 506 9280
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}