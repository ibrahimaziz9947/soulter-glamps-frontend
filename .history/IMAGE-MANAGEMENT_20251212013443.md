# Image Management System - Soulter Glamps

## 📁 Folder Structure

```
/public/images/
├── hero/           # Hero/header images for all pages
│   └── main-hero.jpg      (Upload your new hero image here)
├── glamps/         # Individual glamping accommodation photos
├── packages/       # Package promotional images
├── facilities/     # Facility photos (restaurant, spa, pool, etc.)
└── gallery/        # Gallery photos and album images
```

## 📸 Image Specifications

### Hero Image (`main-hero.jpg`)
- **Recommended Size**: 1920x1080px (Full HD) or higher
- **Format**: JPG (optimized) or WebP for better performance
- **File Size**: Keep under 500KB for fast loading
- **Aspect Ratio**: 16:9 works best for responsive design
- **Content Focus**: Center of image should be clear (text will overlay here)
- **Brightness**: Mid-tone images work best (not too dark, not too bright)

### Other Images
- **Glamps**: 800x600px minimum, landscape orientation
- **Packages**: 1200x800px recommended
- **Facilities**: 800x600px minimum
- **Gallery**: 1200x800px or higher for quality viewing

## 🔄 How to Update the Hero Image

### Step 1: Upload Your Image
1. Place your new hero image in: `/public/images/hero/main-hero.jpg`
2. If using a different name, update `/app/config/images.ts`

### Step 2: Image is Automatically Applied
The new image will automatically appear on:
- ✅ Home page (Hero section)
- ✅ Glamps page (PageHeader)
- ✅ Packages page (PageHeader)
- ✅ Facilities page (PageHeader)
- ✅ Contact page (PageHeader)
- ✅ About page (PageHeader)
- ✅ Policies page (PageHeader)
- ✅ Gallery page (PageHeader)

### Step 3: Styling Auto-Adjusts
The components automatically handle:
- ✅ Text contrast and readability
- ✅ Button visibility
- ✅ Mobile responsiveness
- ✅ Dark overlay optimization
- ✅ Gradient effects
- ✅ Text shadows
- ✅ Smooth transitions

## 🎨 Customization Options

### Adjusting Overlay Darkness (PageHeader Component)
If text is hard to read on your new image:

```tsx
<PageHeader 
  title="Your Title"
  overlayOpacity="darker"  // Options: light, medium, dark, darker
/>
```

### Changing Hero Image for Specific Pages
If you want different images for different pages:

1. Add more images to `/public/images/hero/`:
   - `glamps-hero.jpg`
   - `packages-hero.jpg`
   - `contact-hero.jpg`

2. Update the page component:
```tsx
<PageHeader 
  title="Our Glamps"
  imageUrl="/images/hero/glamps-hero.jpg"
/>
```

## 🔧 Technical Details

### Components Updated
1. **Hero.tsx** - Home page full-screen hero
2. **PageHeader.tsx** - Reusable header for internal pages
3. **images.ts** - Centralized image path configuration

### Features Implemented
- **Text Shadows**: Multiple layers for maximum readability
- **Gradient Overlays**: Smooth dark gradient for text contrast
- **Responsive Design**: Mobile-first approach with breakpoints
- **Hover Effects**: Subtle zoom effect on background
- **Performance**: Optimized loading and transitions
- **Accessibility**: Proper contrast ratios maintained

### CSS Classes Applied
- Text shadows: `0 4px 12px rgba(0,0,0,0.5)` for hero titles
- Overlay gradient: `from-green-dark/60 via-green-dark/50 to-green-dark/70`
- Responsive heights: Automatic scaling from mobile to desktop
- Button shadows: Enhanced with `shadow-2xl` for visibility

## 🚀 Quick Start

### To Replace Hero Image NOW:
1. Save your new image as `main-hero.jpg`
2. Place it in: `C:\Users\Ibrahim\soulter-glamps-restored\public\images\hero\`
3. Refresh your browser - Done! ✅

### No Code Changes Needed!
The image path is centralized, so one upload updates ALL pages automatically.

## ⚠️ Important Notes

1. **Don't delete the folders** - They're referenced in the code
2. **Image optimization** - Compress images before uploading (use TinyPNG or similar)
3. **Test on mobile** - Always check how the image looks on mobile devices
4. **Backup originals** - Keep original high-res images in a separate folder
5. **Consistent style** - Use similar color tones across all hero images

## 📝 Example Usage

### Home Page (Already Updated)
```tsx
// Uses Hero.tsx component
// Image: /images/hero/main-hero.jpg
<Hero />
```

### Internal Pages (Use PageHeader)
```tsx
// Glamps, Packages, Contact, etc.
import PageHeader from '../components/PageHeader'

<PageHeader 
  title="Our Glamps"
  subtitle="Discover luxury in nature"
  height="medium"
  overlayOpacity="medium"
/>
```

### Custom Image Per Page
```tsx
<PageHeader 
  title="Contact Us"
  subtitle="Get in touch"
  imageUrl="/images/hero/contact-hero.jpg"
  overlayOpacity="dark"
/>
```

## 🎯 Best Practices

1. **Test Different Lighting**: Upload test images with varying brightness
2. **Check Mobile View**: Text should be readable on small screens
3. **Monitor Performance**: Ensure images load quickly (use WebP format)
4. **Maintain Branding**: Keep consistent color schemes
5. **Update Regularly**: Refresh hero images seasonally for engagement

---

**Questions?** Check the components for inline documentation:
- `/app/components/Hero.tsx`
- `/app/components/PageHeader.tsx`
- `/app/config/images.ts`
