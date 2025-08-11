import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// User interface matching your database schema
export interface User {
  id: string;
  google_id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  phone?: string;
  created_at: any;
  updated_at: any;
  last_login: any;
  is_active: boolean;
  subscription_status: string;
  subscription_plan: string;
  razorpay_customer_id?: string;
  razorpay_subscription_id?: string;
  current_period_start?: any;
  current_period_end?: any;
  cancel_at_period_end: boolean;
  cancelled_at?: any;
  payment_method_id?: string;
}

// Sign in with Google
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user exists in our database
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      
      // Always prioritize the current Google photo URL
      const currentAvatarUrl = user.photoURL || userData.avatar_url || '';
      
      // Update last login and ensure avatar_url is set with current Google photo
      await setDoc(userDocRef, {
        last_login: serverTimestamp(),
        updated_at: serverTimestamp(),
        avatar_url: currentAvatarUrl
      }, { merge: true });
      
      // Return updated user data with current avatar_url
      return {
        ...userData,
        avatar_url: currentAvatarUrl
      };
    } else {
      // Create new user
      const newUser: User = {
        id: user.uid,
        google_id: user.uid,
        email: user.email || '',
        full_name: user.displayName || '',
        avatar_url: user.photoURL || '',
        phone: user.phoneNumber || '',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        last_login: serverTimestamp(),
        is_active: true,
        subscription_status: 'inactive',
        subscription_plan: 'free',
        cancel_at_period_end: false
      };
      
      console.log('Creating new user with avatar URL:', user.photoURL);
      
      await setDoc(userDocRef, newUser);
      return newUser;
    }
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    
    // Handle specific Firebase auth errors
    if (error.code === 'auth/unauthorized-domain') {
      console.error('Domain not authorized. Please add your domain to Firebase Authentication settings.');
      throw new Error('This domain is not authorized for sign-in. Please contact support.');
    }
    
    if (error.code === 'auth/popup-closed-by-user') {
      console.error('Sign-in popup was closed by user');
      throw new Error('Sign-in was cancelled. Please try again.');
    }
    
    if (error.code === 'auth/popup-blocked') {
      console.error('Sign-in popup was blocked by browser');
      throw new Error('Sign-in popup was blocked. Please allow popups and try again.');
    }
    
    // Generic error message
    throw new Error('Sign-in failed. Please try again.');
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// Get current user from database
export const getCurrentUser = async (): Promise<User | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  
  try {
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      
      // Always prioritize the current Google photo URL
      const currentAvatarUrl = currentUser.photoURL || userData.avatar_url || '';
      
      // Debug: Log avatar URL for troubleshooting
      console.log('User avatar URL:', {
        firebasePhotoURL: currentUser.photoURL,
        storedAvatarURL: userData.avatar_url,
        finalAvatarURL: currentAvatarUrl,
        hasPhotoURL: !!currentUser.photoURL,
        hasStoredURL: !!userData.avatar_url
      });
      
      // Return user data with updated avatar URL
      return {
        ...userData,
        avatar_url: currentAvatarUrl
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const user = await getCurrentUser();
        callback(user);
      } catch (error) {
        console.error('Error getting user data:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Force refresh user avatar URL
export const refreshUserAvatar = async (): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;
  
  try {
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      const newAvatarUrl = currentUser.photoURL || userData.avatar_url || '';
      
      // Update avatar URL in database
      await setDoc(userDocRef, {
        avatar_url: newAvatarUrl,
        updated_at: serverTimestamp()
      }, { merge: true });
      
      console.log('Avatar URL refreshed:', newAvatarUrl);
    }
  } catch (error) {
    console.error('Error refreshing avatar URL:', error);
  }
};
