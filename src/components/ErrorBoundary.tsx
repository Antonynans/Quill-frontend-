'use client'

import { useEffect } from 'react'
import { FiAlertTriangle } from 'react-icons/fi'

interface ErrorBoundaryProps {
  error: Error
  reset: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertTriangle className="text-red-600" size={32} />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong!</h1>
        <p className="text-gray-600 mb-4">
          We encountered an error while processing your request.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg text-left text-sm text-red-700 font-mono overflow-auto max-h-32">
            {error.message}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
