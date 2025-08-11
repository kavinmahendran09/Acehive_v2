# Analytics Integration Guide

This project includes comprehensive analytics integration with PostHog, Google Analytics, and Google AdSense.

## Environment Variables

Make sure you have the following environment variables in your `.env.local` file:

```env
# PostHog Configuration
NEXT_PUBLIC_POSTHOG_KEY=phc_bt4jZAGRMdJvAtspOWknx36abkZN7SlYpbz7i8fADE8
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-B4XJ86EEGF

# Google Search Console
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=zNR-4LK2d6-aruPQW1hy45w_DTdTgdbyhQqZ_ti91nk

# Google AdSense
NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-8796424958611750

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB7r7MCrjHse0P7mYS7f3OtWuR80TCQJMk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=acehive-76756.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=acehive-76756
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=acehive-76756.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=278420308399
NEXT_PUBLIC_FIREBASE_APP_ID=1:278420308399:web:a6c82949e8184ebfc0ef5a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-0LPF01LBQG
```

## Components

### PostHogProvider
Located at `components/PostHogProvider.tsx`
- Automatically initializes PostHog
- Tracks page views automatically
- Wraps the entire application

### GoogleAnalytics
Located at `components/GoogleAnalytics.tsx`
- Loads Google Analytics 4
- Automatically tracks page views
- Uses Next.js Script component for optimal loading

### GoogleAdSense
Located at `components/GoogleAdSense.tsx`
- Loads Google AdSense script
- Ready for ad placement

## Firebase Configuration

The Firebase configuration has been moved to environment variables for security. The following files have been updated:

### lib/firebase.ts
- Updated to use environment variables
- Added validation for required environment variables
- Throws clear error messages if variables are missing

### lib/firebaseClient.ts
- Updated `checkFirebaseConfig()` function to use environment variables
- Improved error messaging for missing configuration

## Hooks

### usePostHog
Located at `hooks/usePostHog.ts`

```typescript
import { usePostHog, postHogEvents } from '@/hooks/usePostHog'

function MyComponent() {
  const posthog = usePostHog()
  
  const handleUserSignUp = () => {
    posthog.capture('user_sign_up', { method: 'email' })
  }
  
  const handleResourceView = (resourceId: string) => {
    posthog.capture('resource_view', { 
      resource_id: resourceId, 
      resource_type: 'pdf' 
    })
  }
}
```

### useGoogleAnalytics
Located at `hooks/useGoogleAnalytics.ts`

```typescript
import { useGoogleAnalytics, gaEvents } from '@/hooks/useGoogleAnalytics'

function MyComponent() {
  const { trackEvent, trackCustomEvent } = useGoogleAnalytics()
  
  const handleUserSignUp = () => {
    trackEvent('sign_up', 'engagement', 'email')
  }
  
  const handleResourceDownload = (resourceType: string) => {
    trackEvent('download', 'resource', resourceType)
  }
}
```

## Predefined Events

### PostHog Events
- `user_sign_up` - User registration
- `user_login` - User login
- `resource_view` - Resource viewed
- `resource_download` - Resource downloaded
- `resource_search` - Search performed
- `page_view` - Page navigation
- `feature_used` - Feature usage

### Google Analytics Events
- `sign_up` - User registration
- `login` - User login
- `view_item` - Resource viewed
- `download` - Resource downloaded
- `search` - Search performed
- `page_view` - Page navigation

## Usage Examples

### Tracking User Actions
```typescript
// In a login component
const handleLogin = async (email: string, password: string) => {
  try {
    await signIn(email, password)
    
    // Track with PostHog
    posthog.capture('user_login', { method: 'email' })
    
    // Track with Google Analytics
    trackEvent('login', 'engagement', 'email')
    
  } catch (error) {
    console.error('Login failed:', error)
  }
}
```

### Tracking Resource Interactions
```typescript
// In a resource component
const handleResourceView = (resource: Resource) => {
  // Track with PostHog
  posthog.capture('resource_view', {
    resource_id: resource.id,
    resource_type: resource.type,
    resource_title: resource.title
  })
  
  // Track with Google Analytics
  trackEvent('view_item', 'resource', resource.type)
}
```

### Tracking Search
```typescript
// In a search component
const handleSearch = (query: string, results: Resource[]) => {
  // Track with PostHog
  posthog.capture('resource_search', {
    query,
    results_count: results.length
  })
  
  // Track with Google Analytics
  trackEvent('search', 'engagement', query, results.length)
}
```

## Best Practices

1. **Consistent Event Names**: Use the predefined event names for consistency
2. **Meaningful Properties**: Include relevant properties with each event
3. **User Privacy**: Respect user privacy and comply with GDPR/CCPA
4. **Performance**: Analytics should not impact application performance
5. **Testing**: Test analytics in development environment

## Troubleshooting

### PostHog Not Loading
- Check if `NEXT_PUBLIC_POSTHOG_KEY` is set correctly
- Verify the PostHog host URL
- Check browser console for errors

### Google Analytics Not Working
- Verify `NEXT_PUBLIC_GA_MEASUREMENT_ID` is correct
- Check if ad blockers are interfering
- Use Google Analytics Debugger extension

### AdSense Not Loading
- Ensure `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT` is set
- Check if the site is approved for AdSense
- Verify ad placement code is correct
