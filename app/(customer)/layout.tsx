import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingWhatsAppButton from '../components/FloatingWhatsAppButton'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </>
  )
}
