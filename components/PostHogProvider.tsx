'use client'

import { PostHogProvider as Provider } from 'posthog-js/react'
import posthog from 'posthog-js'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

// Initialize PostHog only if the key is available
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    capture_pageview: false, // We'll handle this manually
    capture_pageleave: true,
    autocapture: true,
  })
}

// Component that uses navigation hooks (needs Suspense)
function PostHogTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      let url = window.origin + pathname
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // If PostHog is not configured, just render children
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>
  }

  return (
    <Provider client={posthog}>
      <Suspense fallback={null}>
        <PostHogTracker />
      </Suspense>
      {children}
    </Provider>
  )
}
