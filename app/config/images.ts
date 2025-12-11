/**
 * Centralized Image Configuration
 * 
 * This file manages all image paths for the Soulter Glamps project.
 * Update image paths here to reflect changes across all pages.
 */

export const images = {
  // Hero/Header Images - Used on main landing pages
  hero: {
    // Main hero image for home page
    main: '/images/hero/main-hero.jpg',
    // Fallback to Unsplash if local image not found (remove after upload)
    mainFallback: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920',
  },

  // Glamping Accommodation Images
  glamps: {
    // Individual glamp photos go in /public/images/glamps/
    // Example: luxury-tent.jpg, geodesic-dome.jpg, etc.
  },

  // Package Images
  packages: {
    // Package promotional images go in /public/images/packages/
    // Example: romantic-getaway.jpg, adventure-package.jpg, etc.
  },

  // Facility Images
  facilities: {
    // Facility photos go in /public/images/facilities/
    // Example: restaurant.jpg, spa.jpg, pool.jpg, etc.
  },

  // Gallery Images
  gallery: {
    // Gallery photos go in /public/images/gallery/
    // Organized by category if needed
  },
}

/**
 * Helper function to get hero image with fallback
 */
export function getHeroImage(): string {
  // Try to use local image first, fallback to Unsplash
  // Once you upload the image to /public/images/hero/main-hero.jpg, it will automatically use that
  return images.hero.main
}
