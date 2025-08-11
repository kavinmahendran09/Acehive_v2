# Firebase Setup Guide

## Domain Authorization for Vercel Deployment

### Step 1: Add Domain to Firebase Authentication

1. **Go to Firebase Console**
   - Navigate to your project: https://console.firebase.google.com/project/acehive-76756

2. **Open Authentication Settings**
   - Click on "Authentication" in the left sidebar
   - Click on the "Settings" tab

3. **Add Authorized Domain**
   - Scroll down to "Authorized domains" section
   - Click "Add domain"
   - Add: `acehive.vercel.app`
   - Click "Add"

4. **Verify Domain**
   - The domain should now appear in the list
   - Status should show as "Verified"

### Step 2: Additional Domains (Optional)

You may also want to add these domains for development and testing:
- `localhost` (for local development)
- `acehive.vercel.app` (your production domain)
- Any custom domain you plan to use

### Step 3: Test Authentication

After adding the domain:
1. Deploy your app to Vercel
2. Try signing in with Google
3. Check that the authentication popup works
4. Verify user data is saved to Firestore

## Common Issues

### "Unauthorized Domain" Error
- **Cause**: Domain not added to Firebase Auth settings
- **Solution**: Add domain to authorized domains list

### "Popup Blocked" Error
- **Cause**: Browser blocking popup windows
- **Solution**: Allow popups for your domain

### "Popup Closed by User" Error
- **Cause**: User closed the sign-in popup
- **Solution**: User needs to try again

## Security Notes

- Only add domains you own and control
- Remove old domains when no longer needed
- Regularly review authorized domains
- Consider using custom domains for production

## Firebase Project Configuration

Your Firebase project details:
- **Project ID**: acehive-76756
- **Project Name**: Acehive
- **Web App ID**: 1:278420308399:web:a6c82949e8184ebfc0ef5a

## Environment Variables

Make sure these are set in Vercel:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB7r7MCrjHse0P7mYS7f3OtWuR80TCQJMk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=acehive-76756.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=acehive-76756
```
