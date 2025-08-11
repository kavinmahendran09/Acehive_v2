'use client'

import { usePostHog as usePostHogOriginal } from 'posthog-js/react'

export function usePostHog() {
  return usePostHogOriginal()
}

// Utility functions for common PostHog events
export const postHogEvents = {
  // User events
  userSignUp: (method: string) => ({
    event: 'user_sign_up',
    properties: { method }
  }),
  
  userLogin: (method: string) => ({
    event: 'user_login',
    properties: { method }
  }),
  
  // Resource events
  resourceView: (resourceId: string, resourceType: string) => ({
    event: 'resource_view',
    properties: { resource_id: resourceId, resource_type: resourceType }
  }),
  
  resourceDownload: (resourceId: string, resourceType: string) => ({
    event: 'resource_download',
    properties: { resource_id: resourceId, resource_type: resourceType }
  }),
  
  resourceSearch: (query: string, resultsCount: number) => ({
    event: 'resource_search',
    properties: { query, results_count: resultsCount }
  }),
  
  // Navigation events
  pageView: (page: string) => ({
    event: 'page_view',
    properties: { page }
  }),
  
  // Feature usage
  featureUsed: (feature: string) => ({
    event: 'feature_used',
    properties: { feature }
  })
}
