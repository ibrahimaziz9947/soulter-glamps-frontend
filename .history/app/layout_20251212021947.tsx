import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Soulter Glamps - Luxury Glamping Experience',
  description: 'Experience nature in comfort with our luxury glamping accommodations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
