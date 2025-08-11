'use client'

import { useEffect } from 'react'

export function ConsoleErrorSuppressor() {
  useEffect(() => {
    // Suppress errors in both development and production
    const originalError = console.error
    const originalWarn = console.warn

    // Suppress common cross-origin frame errors
    console.error = (...args) => {
      const message = args[0]?.toString() || ''
      
      // Suppress specific cross-origin errors
      if (
        message.includes('Blocked a frame with origin') ||
        message.includes('Protocols, domains, and ports must match') ||
        message.includes('from accessing a frame with origin')
      ) {
        // Don't log these specific errors
        return
      }
      
      // Log all other errors normally
      originalError.apply(console, args)
    }

    // Suppress common warnings
    console.warn = (...args) => {
      const message = args[0]?.toString() || ''
      
      // Suppress specific warnings
      if (
        message.includes('AdSense head tag doesn\'t support data-nscript attribute') ||
        message.includes('recorder.js')
      ) {
        // Don't log these specific warnings
        return
      }
      
      // Log all other warnings normally
      originalWarn.apply(console, args)
    }

    // Cleanup function
    return () => {
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])

  return null
}
