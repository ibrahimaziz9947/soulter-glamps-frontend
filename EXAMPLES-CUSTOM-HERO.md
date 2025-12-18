/**
 * EXAMPLE: Using Different Hero Images for Different Pages
 * 
 * By default, all pages use /images/hero/main-hero.jpg
 * But you can easily customize individual pages if needed.
 */

// ============================================================
// EXAMPLE 1: Glamps Page with Custom Image
// ============================================================

// File: app/glamps/page.tsx
import PageHeader from '../components/PageHeader'

export default function GlampsPage() {
  return (
    <div className="min-h-screen">
      {/* Custom image for glamps page */}
      <PageHeader 
        title="Our Glamps"
        subtitle="Discover luxury in nature"
        imageUrl="/images/hero/glamps-hero.jpg"  // ← Custom image
        overlayOpacity="medium"
      />
      
      {/* Rest of page content */}
    </div>
  )
}

// ============================================================
// EXAMPLE 2: Contact Page with Darker Overlay
// ============================================================

// File: app/contact/page.tsx
import PageHeader from '../components/PageHeader'

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Same image but darker overlay for better text contrast */}
      <PageHeader 
        title="Get In Touch"
        subtitle="We're here to help"
        overlayOpacity="darker"  // ← Darker overlay
      />
      
      {/* Rest of page content */}
    </div>
  )
}

// ============================================================
// EXAMPLE 3: Packages Page with Taller Header
// ============================================================

// File: app/packages/page.tsx
import PageHeader from '../components/PageHeader'

export default function PackagesPage() {
  return (
    <div className="min-h-screen">
      {/* Taller header for dramatic effect */}
      <PageHeader 
        title="Our Packages"
        subtitle="Curated experiences"
        height="large"  // ← Taller header
        overlayOpacity="medium"
      />
      
      {/* Rest of page content */}
    </div>
  )
}

// ============================================================
// EXAMPLE 4: Gallery Page with Light Overlay
// ============================================================

// File: app/gallery/page.tsx
import PageHeader from '../components/PageHeader'

export default function GalleryPage() {
  return (
    <div className="min-h-screen">
      {/* Light overlay to show more of the background image */}
      <PageHeader 
        title="Photo Gallery"
        subtitle="Explore our beautiful property"
        imageUrl="/images/hero/gallery-hero.jpg"  // ← Custom image
        overlayOpacity="light"  // ← Light overlay
        height="medium"
      />
      
      {/* Rest of page content */}
    </div>
  )
}

// ============================================================
// EXAMPLE 5: About Page with White Text
// ============================================================

// File: app/about/page.tsx
import PageHeader from '../components/PageHeader'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* White text instead of cream */}
      <PageHeader 
        title="About Soulter Glamps"
        subtitle="Our story"
        textColor="white"  // ← White text
        overlayOpacity="dark"
      />
      
      {/* Rest of page content */}
    </div>
  )
}

// ============================================================
// EXAMPLE 6: Full-Screen Hero (Like Home Page)
// ============================================================

// File: app/special-page/page.tsx
import PageHeader from '../components/PageHeader'

export default function SpecialPage() {
  return (
    <div className="min-h-screen">
      {/* Full screen hero like the home page */}
      <PageHeader 
        title="Special Event"
        subtitle="Join us for something amazing"
        height="full"  // ← Full screen height
        overlayOpacity="medium"
      />
      
      {/* Rest of page content */}
    </div>
  )
}

// ============================================================
// PAGEHEADER COMPONENT - ALL OPTIONS
// ============================================================

/**
 * Complete list of all PageHeader props:
 */

<PageHeader 
  // Required
  title="Page Title"                      // Main heading text
  
  // Optional
  subtitle="Optional subtitle"            // Subtitle text (optional)
  imageUrl="/images/hero/main-hero.jpg"   // Hero image path (default: main-hero.jpg)
  height="medium"                          // small | medium | large | full
  overlayOpacity="medium"                  // light | medium | dark | darker
  textColor="cream"                        // cream | white
  className=""                             // Additional Tailwind classes
/>

// ============================================================
// HEIGHT OPTIONS
// ============================================================

height="small"   // 256px mobile → 320px desktop
height="medium"  // 320px mobile → 384px desktop (DEFAULT)
height="large"   // 384px mobile → 512px desktop
height="full"    // 100vh (full screen height)

// ============================================================
// OVERLAY OPACITY OPTIONS
// ============================================================

overlayOpacity="light"   // 30% dark overlay (shows more background)
overlayOpacity="medium"  // 50% dark overlay (balanced) (DEFAULT)
overlayOpacity="dark"    // 65% dark overlay (more contrast)
overlayOpacity="darker"  // 80% dark overlay (maximum text readability)

// ============================================================
// TEXT COLOR OPTIONS
// ============================================================

textColor="cream"  // Cream colored text (DEFAULT, matches brand)
textColor="white"  // Pure white text

// ============================================================
// IMAGE ORGANIZATION
// ============================================================

/**
 * Suggested folder structure for multiple hero images:
 * 
 * /public/images/hero/
 *   ├── main-hero.jpg       (Default for all pages)
 *   ├── glamps-hero.jpg     (Custom for glamps page)
 *   ├── packages-hero.jpg   (Custom for packages page)
 *   ├── contact-hero.jpg    (Custom for contact page)
 *   ├── gallery-hero.jpg    (Custom for gallery page)
 *   └── about-hero.jpg      (Custom for about page)
 */

// ============================================================
// TIPS FOR BEST RESULTS
// ============================================================

/**
 * 1. CHOOSE THE RIGHT OVERLAY:
 *    - Bright image → use "darker" overlay
 *    - Dark image → use "light" overlay
 *    - Mid-tone image → use "medium" overlay
 * 
 * 2. SELECT APPROPRIATE HEIGHT:
 *    - Important pages → "large" or "full"
 *    - Regular pages → "medium"
 *    - Quick info pages → "small"
 * 
 * 3. IMAGE SELECTION:
 *    - Center of image should be clear (text overlays there)
 *    - Avoid busy patterns in center
 *    - Use high contrast between image and text
 *    - Test on mobile devices
 * 
 * 4. PERFORMANCE:
 *    - Compress all images before uploading
 *    - Use WebP format for better compression
 *    - Keep file sizes under 500KB
 *    - Use lazy loading for below-fold images
 */

// ============================================================
// TESTING CHECKLIST
// ============================================================

/**
 * Before deploying:
 * 
 * □ Test on mobile (375px width)
 * □ Test on tablet (768px width)
 * □ Test on desktop (1920px width)
 * □ Check text readability on all devices
 * □ Verify button visibility
 * □ Test with different brightness settings
 * □ Check page load speed
 * □ Verify image shows correctly (not 404)
 */

// ============================================================
// COMMON PATTERNS
// ============================================================

// Pattern 1: Use same image, different overlays
// Good for: Maintaining visual consistency while adjusting readability

<PageHeader 
  title="Page A"
  overlayOpacity="light"  // Show more image
/>

<PageHeader 
  title="Page B"
  overlayOpacity="darker" // Prioritize text
/>

// Pattern 2: Different images per section
// Good for: Showcasing different aspects of your property

<PageHeader 
  title="Accommodations"
  imageUrl="/images/hero/glamps-hero.jpg"
/>

<PageHeader 
  title="Facilities"
  imageUrl="/images/hero/facilities-hero.jpg"
/>

// Pattern 3: Seasonal variations
// Good for: Keeping content fresh

// Summer version
<PageHeader 
  imageUrl="/images/hero/summer-hero.jpg"
/>

// Winter version
<PageHeader 
  imageUrl="/images/hero/winter-hero.jpg"
/>

// ============================================================
// MIGRATION GUIDE
// ============================================================

/**
 * If you have existing pages with old header code:
 * 
 * OLD CODE:
 * <section className="relative h-96...">
 *   <div style={{backgroundImage: "url('...')"}}>
 *   ...
 * </section>
 * 
 * NEW CODE:
 * import PageHeader from '../components/PageHeader'
 * 
 * <PageHeader 
 *   title="Your Title"
 *   subtitle="Your Subtitle"
 * />
 * 
 * Benefits:
 * - Consistent styling
 * - Centralized image management
 * - Auto-adjusting contrast
 * - Mobile responsive
 * - Cleaner code
 */

// ============================================================
// END OF EXAMPLES
// ============================================================
