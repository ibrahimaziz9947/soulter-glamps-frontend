'use client'

import { useState } from 'react'
import SectionHeading from '../../components/SectionHeading'
import Button from '../../components/Button'
import PageHeader from '../../components/PageHeader'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 5000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Page Header - Now using centralized component */}
      <PageHeader 
        title="Get In Touch"
        subtitle="Have questions about our hill-top glamps? We're here to help plan your peaceful escape."
        height="medium"
        overlayOpacity="medium"
      />

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="font-serif text-3xl font-bold text-green mb-6">Send Us a Message</h2>
              
              {isSubmitted ? (
                <div className="bg-green/10 border-2 border-green rounded-lg p-8 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-green mb-2">Message Sent!</h3>
                  <p className="text-text-light">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="booking">Booking Inquiry</option>
                      <option value="general">General Question</option>
                      <option value="group">Group Booking</option>
                      <option value="event">Private Event</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-transparent"
                      placeholder="Tell us how we can help you..."
                      required
                    ></textarea>
                  </div>

                  <Button type="submit" variant="primary" size="large" className="w-full">
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="font-serif text-3xl font-bold text-green mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cream rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green mb-1">Phone</h3>
                      <p className="text-text-light mb-1">Bookings: +92 300 1234567</p>
                      <p className="text-text-light">Inquiries: +92 300 7654321</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cream rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green mb-1">Email</h3>
                      <p className="text-text-light mb-1">info@soulterglamps.com</p>
                      <p className="text-text-light">bookings@soulterglamps.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cream rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green mb-1">Location</h3>
                      <p className="text-text-light">Soulter Glamps</p>
                      <p className="text-text-light">Hill Station Area, Pakistan</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-cream rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-green mb-1">Operational Hours</h3>
                      <p className="text-text-light">Check-in: 3:00 PM - 8:00 PM</p>
                      <p className="text-text-light">Check-out: 11:00 AM</p>
                      <p className="text-text-light mt-2">Support: Available 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-green text-cream rounded-lg shadow-lg p-8">
                <h2 className="font-serif text-2xl font-bold mb-4">Follow Us</h2>
                <p className="text-cream/90 mb-6">
                  Stay updated with our latest news, special offers, and stunning nature photography.
                </p>
                <div className="flex gap-4">
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-cream/20 rounded-lg flex items-center justify-center hover:bg-yellow transition-smooth group"
                  >
                    <svg className="w-6 h-6 text-cream group-hover:text-green" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-cream/20 rounded-lg flex items-center justify-center hover:bg-yellow transition-smooth group"
                  >
                    <svg className="w-6 h-6 text-cream group-hover:text-green" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-cream/20 rounded-lg flex items-center justify-center hover:bg-yellow transition-smooth group"
                  >
                    <svg className="w-6 h-6 text-cream group-hover:text-green" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-64 bg-gray-200 relative">
                  <div className="absolute inset-0 bg-green/10 flex items-center justify-center border-2 border-green/20">
                    <div className="text-center p-8">
                      <svg className="w-16 h-16 text-green mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-green font-semibold text-lg mb-2">Soulter Glamps Location</p>
                      <p className="text-text-light text-sm">Hill Station Area, Pakistan</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-green mb-2">How to Reach Us</h3>
                  <p className="text-text-light text-sm">
                    Located in a serene hill station with breathtaking views. Contact us for detailed directions and GPS coordinates for your visit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Quick answers to common questions"
            centered
          />
          
          <div className="space-y-4 mt-12">
            <details className="bg-cream rounded-lg p-6 group">
              <summary className="font-semibold text-green cursor-pointer flex items-center justify-between">
                What is the cancellation policy?
                <svg className="w-5 h-5 transform group-open:rotate-180 transition-smooth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-text-light mt-4">
                Free cancellation up to 7 days before your check-in date. Cancellations made within 7 days will incur a 50% charge. No-shows are non-refundable.
              </p>
            </details>

            <details className="bg-cream rounded-lg p-6 group">
              <summary className="font-semibold text-green cursor-pointer flex items-center justify-between">
                Are pets allowed?
                <svg className="w-5 h-5 transform group-open:rotate-180 transition-smooth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-text-light mt-4">
                Yes! Select accommodations are pet-friendly. The Woodland Cabin welcomes well-behaved pets with a $50 pet fee per stay. Please inform us in advance.
              </p>
            </details>

            <details className="bg-cream rounded-lg p-6 group">
              <summary className="font-semibold text-green cursor-pointer flex items-center justify-between">
                What should I bring?
                <svg className="w-5 h-5 transform group-open:rotate-180 transition-smooth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-text-light mt-4">
                All linens, towels, and basic amenities are provided. We recommend bringing comfortable outdoor clothing, hiking shoes, sunscreen, and a reusable water bottle. A detailed packing list is sent with your confirmation.
              </p>
            </details>

            <details className="bg-cream rounded-lg p-6 group">
              <summary className="font-semibold text-green cursor-pointer flex items-center justify-between">
                Is WiFi available?
                <svg className="w-5 h-5 transform group-open:rotate-180 transition-smooth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-text-light mt-4">
                Yes, complimentary WiFi is available in all accommodations. However, we encourage guests to disconnect and enjoy nature!
              </p>
            </details>

            <details className="bg-cream rounded-lg p-6 group">
              <summary className="font-semibold text-green cursor-pointer flex items-center justify-between">
                What activities are available?
                <svg className="w-5 h-5 transform group-open:rotate-180 transition-smooth" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="text-text-light mt-4">
                Hiking trails, kayaking, fishing, stargazing, guided nature walks, yoga sessions, and more. We also offer spa treatments and can arrange special experiences upon request.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  )
}
