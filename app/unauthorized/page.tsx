'use client'

import Link from 'next/link'
import Button from '../components/Button'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7m0 6h4m-4 0H8"
              />
            </svg>
          </div>
          <h1 className="font-serif text-4xl font-bold text-green mb-2">403</h1>
          <h2 className="font-serif text-2xl font-bold text-green mb-4">Access Denied</h2>
        </div>

        <div className="mb-8">
          <p className="text-text-light mb-4">
            You do not have permission to access this page. Your user role does not have the required privileges.
          </p>
          <p className="text-text-light text-sm">
            If you believe this is an error, please contact the administrator.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/" className="block">
            <Button variant="primary" size="large" className="w-full">
              Go Home
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 border-2 border-green text-green font-semibold rounded-lg hover:bg-green hover:text-cream transition-smooth"
          >
            Go Back
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-300">
          <p className="text-text-light text-xs mb-3">Need help?</p>
          <a
            href="/contact"
            className="text-green font-semibold hover:text-yellow transition-smooth inline-flex items-center gap-2"
          >
            Contact Support
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
