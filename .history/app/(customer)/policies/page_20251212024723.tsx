import SectionHeading from '../../components/SectionHeading'

export const metadata = {
  title: 'Policies - Soulter Glamps',
  description: 'Our policies for check-in, privacy, refunds, cancellations, and safety',
}

export default function PoliciesPage() {
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
            Our Policies
          </h1>
          <p className="text-xl text-cream/90 max-w-2xl mx-auto animate-slide-up">
            Important information for your stay at Soulter Glamps
          </p>
        </div>
      </section>

      {/* Check-in / Check-out Policy */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-cream rounded-lg p-8 shadow-lg mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-green mb-4">Check-in / Check-out Policy</h2>
              </div>
            </div>
            
            <div className="space-y-6 text-text-dark">
              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Check-in Time</h3>
                <p className="text-text-light mb-2">
                  Standard check-in is between <strong>3:00 PM and 8:00 PM</strong>. Please inform us in advance if you expect to arrive outside these hours.
                </p>
                <ul className="list-disc list-inside text-text-light space-y-1 ml-4">
                  <li>Early check-in may be available upon request (subject to availability)</li>
                  <li>Late arrivals after 8:00 PM require prior arrangement</li>
                  <li>Valid ID required at check-in for all guests</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Check-out Time</h3>
                <p className="text-text-light mb-2">
                  Check-out time is <strong>11:00 AM</strong>. Late check-out may be arranged based on availability.
                </p>
                <ul className="list-disc list-inside text-text-light space-y-1 ml-4">
                  <li>Late check-out (until 2:00 PM) may incur additional charges</li>
                  <li>Please settle all dues before departure</li>
                  <li>Luggage storage available if needed</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Occupancy</h3>
                <p className="text-text-light">
                  Each glamp is designed for 2 guests with 1 extra mattress available. Maximum occupancy: 3 guests per glamp. Children under 5 years stay free.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-green mb-4">Privacy Policy</h2>
              </div>
            </div>
            
            <div className="space-y-6 text-text-dark">
              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Guest Information</h3>
                <p className="text-text-light mb-2">
                  We collect personal information (name, contact details, ID) solely for booking and security purposes. Your data is kept confidential and never shared with third parties.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Data Protection</h3>
                <ul className="list-disc list-inside text-text-light space-y-1 ml-4">
                  <li>All guest information is stored securely</li>
                  <li>Payment details are processed through secure channels</li>
                  <li>Personal data retained only as required by law</li>
                  <li>Guests may request data deletion after checkout</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Guest Privacy on Property</h3>
                <p className="text-text-light">
                  Each glamp offers complete privacy with private lawn and sitting areas. Our staff respects your privacy and will only enter your glamp for housekeeping or maintenance with prior notice, except in emergencies.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Photography & Media</h3>
                <p className="text-text-light">
                  We may take photos of the property for promotional use. If you prefer not to be photographed, please inform our staff. Guest photos shared on social media should respect the privacy of other visitors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Policy */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-cream rounded-lg p-8 shadow-lg mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-green mb-4">Refund Policy</h2>
              </div>
            </div>
            
            <div className="space-y-6 text-text-dark">
              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Standard Refund Terms</h3>
                <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                  <li>
                    <strong>More than 7 days before check-in:</strong> Full refund minus processing fee (5%)
                  </li>
                  <li>
                    <strong>3-7 days before check-in:</strong> 50% refund of total amount paid
                  </li>
                  <li>
                    <strong>Less than 3 days before check-in:</strong> No refund
                  </li>
                  <li>
                    <strong>No-show:</strong> No refund
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Processing Time</h3>
                <p className="text-text-light">
                  Approved refunds are processed within 7-10 business days. Refunds are issued to the original payment method used during booking.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Special Circumstances</h3>
                <p className="text-text-light mb-2">
                  We understand that emergencies happen. In cases of medical emergencies or natural disasters, we may offer partial refunds or credit for future stays at our discretion. Please contact us with documentation.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Modification Fees</h3>
                <p className="text-text-light">
                  Date changes are free if made more than 7 days before check-in. Changes within 7 days may incur a fee of PKR 2,500 per modification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cancellation Policy */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-green mb-4">Cancellation Policy</h2>
              </div>
            </div>
            
            <div className="space-y-6 text-text-dark">
              <div>
                <h3 className="font-semibold text-green text-lg mb-2">How to Cancel</h3>
                <p className="text-text-light mb-2">
                  Cancellations must be made in writing via:
                </p>
                <ul className="list-disc list-inside text-text-light space-y-1 ml-4">
                  <li>Email: bookings@soulterglamps.com</li>
                  <li>Phone: +92 300 1234567</li>
                  <li>Through your booking confirmation link</li>
                </ul>
                <p className="text-text-light mt-2">
                  You will receive written confirmation of your cancellation within 24 hours.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Cancellation Timeline</h3>
                <div className="bg-cream rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green rounded-full flex items-center justify-center flex-shrink-0 text-cream font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-green">7+ Days Before Check-in</p>
                      <p className="text-text-light text-sm">Full refund minus 5% processing fee</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-yellow rounded-full flex items-center justify-center flex-shrink-0 text-green font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-green">3-7 Days Before Check-in</p>
                      <p className="text-text-light text-sm">50% refund of total booking amount</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-text-light rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-green">Less Than 3 Days</p>
                      <p className="text-text-light text-sm">No refund available</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Group Bookings</h3>
                <p className="text-text-light">
                  For bookings of 3 or more glamps, special cancellation terms apply. Please contact us directly for group booking policies and flexible payment plans.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Weather Cancellations</h3>
                <p className="text-text-light">
                  In case of extreme weather conditions making the property inaccessible or unsafe, we will offer a full refund or the option to reschedule at no additional cost.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety and Conduct Policy */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-cream rounded-lg p-8 shadow-lg mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-green mb-4">Safety & Conduct Policy</h2>
              </div>
            </div>
            
            <div className="space-y-6 text-text-dark">
              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Property Rules</h3>
                <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                  <li>No smoking inside glamps (designated outdoor smoking areas available)</li>
                  <li>Quiet hours: 10:00 PM - 7:00 AM (please respect other guests)</li>
                  <li>Pets are not permitted without prior approval</li>
                  <li>Parties or events require advance permission and may incur additional fees</li>
                  <li>Maximum occupancy limits must be respected</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Safety Guidelines</h3>
                <ul className="list-disc list-inside text-text-light space-y-2 ml-4">
                  <li>Follow all fire safety instructions and know emergency exit locations</li>
                  <li>Do not leave heaters or electrical appliances unattended</li>
                  <li>Keep children supervised at all times, especially near lawn edges</li>
                  <li>Report any maintenance issues or hazards immediately</li>
                  <li>Use designated paths when walking at night</li>
                  <li>Bonfire activities must be supervised by staff</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Environmental Responsibility</h3>
                <p className="text-text-light mb-2">
                  We are committed to preserving our natural surroundings. Please help us by:
                </p>
                <ul className="list-disc list-inside text-text-light space-y-1 ml-4">
                  <li>Disposing of waste in designated bins</li>
                  <li>Conserving water and electricity</li>
                  <li>Not disturbing local wildlife or vegetation</li>
                  <li>Staying on marked trails during nature walks</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Guest Conduct</h3>
                <p className="text-text-light mb-2">
                  We expect all guests to:
                </p>
                <ul className="list-disc list-inside text-text-light space-y-1 ml-4">
                  <li>Treat staff and other guests with courtesy and respect</li>
                  <li>Take care of property and report any damages immediately</li>
                  <li>Follow Pakistani laws and local customs</li>
                  <li>Refrain from any illegal activities</li>
                </ul>
                <p className="text-text-light mt-3">
                  <strong>Note:</strong> Violation of these policies may result in immediate eviction without refund. Damages to property will be charged to the guest.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-green text-lg mb-2">Emergency Contact</h3>
                <p className="text-text-light">
                  In case of emergency, contact our 24/7 support line: <strong>+92 300 1234567</strong>
                </p>
                <p className="text-text-light mt-2">
                  First aid kits are available at reception. The nearest medical facility is 20 minutes away.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Questions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green text-cream">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Questions About Our Policies?
          </h2>
          <p className="text-xl text-cream/90 mb-8">
            Our team is here to help clarify any policy details or answer your questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:info@soulterglamps.com" className="inline-block">
              <button className="bg-yellow text-green px-8 py-3 rounded-lg font-semibold hover:bg-yellow/90 transition-smooth">
                Email Us
              </button>
            </a>
            <a href="tel:+923001234567" className="inline-block">
              <button className="bg-cream text-green px-8 py-3 rounded-lg font-semibold hover:bg-cream/90 transition-smooth">
                Call Us
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
