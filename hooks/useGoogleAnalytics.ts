'use client'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export function useGoogleAnalytics() {
  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  }

  const trackPageView = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
        page_path: url,
      })
    }
  }

  const trackCustomEvent = (eventName: string, parameters: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters)
    }
  }

  return {
    trackEvent,
    trackPageView,
    trackCustomEvent,
  }
}

// Predefined event tracking functions
export const gaEvents = {
  // User events
  userSignUp: (method: string) => ({
    action: 'sign_up',
    category: 'engagement',
    label: method,
  }),
  
  userLogin: (method: string) => ({
    action: 'login',
    category: 'engagement',
    label: method,
  }),
  
  // Resource events
  resourceView: (resourceType: string) => ({
    action: 'view_item',
    category: 'resource',
    label: resourceType,
  }),
  
  resourceDownload: (resourceType: string) => ({
    action: 'download',
    category: 'resource',
    label: resourceType,
  }),
  
  resourceSearch: (query: string) => ({
    action: 'search',
    category: 'engagement',
    label: query,
  }),
  
  // Navigation events
  pageView: (page: string) => ({
    action: 'page_view',
    category: 'navigation',
    label: page,
  }),
}
