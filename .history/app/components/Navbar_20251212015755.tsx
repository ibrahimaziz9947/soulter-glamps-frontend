'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-green text-cream sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-serif text-3xl font-bold text-yellow">Soulter Glamps</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-yellow transition-smooth">
              HOME
            </Link>
            <Link href="/glamps" className="hover:text-yellow transition-smooth">
              GLAMPS
            </Link>
            <Link href="/packages" className="hover:text-yellow transition-smooth">
              PACKAGES
            </Link>
            <Link href="/about" className="hover:text-yellow transition-smooth">
              ABOUT
            </Link>
            <Link href="/facilities" className="hover:text-yellow transition-smooth">
              FACILITIES
            </Link>
            <Link href="/policies" className="hover:text-yellow transition-smooth">
              POLICIES
            </Link>
            <Link href="/gallery" className="hover:text-yellow transition-smooth">
              GALLERY
            </Link>
            <Link href="/contact" className="hover:text-yellow transition-smooth">
              CONTACT
            </Link>
            <Link 
              href="/booking" 
              className="bg-yellow text-green px-6 py-2 rounded-full font-semibold hover:bg-yellow-light transition-smooth"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-green-light transition-smooth"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="hover:text-yellow transition-smooth"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/glamps" 
                className="hover:text-yellow transition-smooth"
                onClick={() => setIsOpen(false)}
              >
                Glamps
              </Link>
              <Link 
                href="/packages" 
                className="hover:text-yellow transition-smooth"
                onClick={() => setIsOpen(false)}
              >
                Packages
              </Link>
              <Link 
                href="/about" 
                className="hover:text-yellow transition-smooth"
                onClick={() => setIsOpen(false)}
              >
                ABOUT
              </Link>
              <Link 
                href="/facilities" 
                className="hover:text-yellow transition-smooth"
                onClick={() => setIsOpen(false)}
              >
                Facilities
              </Link>
              <Link 
                href="/policies" 
                className="hover:text-yellow transition-smooth"
                onClick={() => setIsOpen(false)}
              >
                Policies
              </Link>
              <Link 
                href="/gallery" 
                className="hover:text-yellow transition-smooth"
                onClick={() => setIsOpen(false)}
              >
                Gallery
              </Link>
              <Link 
                href="/contact" 
                className="hover:text-yellow transition-smooth"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/booking" 
                className="bg-yellow text-green px-6 py-2 rounded-full font-semibold hover:bg-yellow-light transition-smooth text-center"
                onClick={() => setIsOpen(false)}
              >
                Book Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
