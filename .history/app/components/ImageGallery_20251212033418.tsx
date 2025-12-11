'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  name: string
}

export default function ImageGallery({ images, name }: ImageGalleryProps) {
  const [showModal, setShowModal] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openModal = (index: number) => {
    setCurrentIndex(index)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Ensure we have at least 3 images for display
  const displayImages = images.length >= 3 ? images : [...images, ...images, ...images].slice(0, 4)

  return (
    <>
      {/* Gallery Grid */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Large Image */}
            <div 
              className="relative h-96 md:h-[600px] rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openModal(0)}
            >
              <Image
                src={displayImages[0]}
                alt={`${name} - Main view`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Smaller Grid Images */}
            <div className="grid grid-cols-2 gap-4">
              {displayImages.slice(1, 4).map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-44 md:h-72 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => openModal(idx + 1)}
                >
                  <Image
                    src={img}
                    alt={`${name} - View ${idx + 2}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              ))}

              {/* View All Button */}
              <div
                className="relative h-44 md:h-72 rounded-lg overflow-hidden bg-gradient-to-br from-green-dark to-green flex items-center justify-center cursor-pointer group hover:from-green hover:to-green-dark transition-all duration-300 shadow-lg"
                onClick={() => openModal(0)}
              >
                <div className="text-center text-cream transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 mx-auto mb-2 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-semibold">View All {images.length} Photos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Screen Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fade-in"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-yellow transition-colors z-50 p-2 rounded-full hover:bg-white/10"
            onClick={closeModal}
            aria-label="Close gallery"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              className="absolute left-4 text-white hover:text-yellow transition-colors z-50 p-3 rounded-full hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              aria-label="Previous image"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Main Image */}
          <div 
            className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex]}
              alt={`${name} - Photo ${currentIndex + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              className="absolute right-4 text-white hover:text-yellow transition-colors z-50 p-3 rounded-full hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              aria-label="Next image"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-3 rounded-lg max-w-[90vw] overflow-x-auto">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                    idx === currentIndex ? 'border-yellow scale-110' : 'border-transparent hover:border-white/50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentIndex(idx)
                  }}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
