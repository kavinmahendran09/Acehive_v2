import { collection, query, where, getDocs, QueryConstraint, limit } from 'firebase/firestore';
import { db } from './firebase';
import CacheManager from './cacheManager';

export default db;

export const fetchResources = async (
  filters: any,
  resourceType: string,
  maxRetries = 3,
  useCache = true,
  maxResults = 50
) => {
  const buildQuery = () => {
    const resourcesRef = collection(db, 'resources');
    const constraints: QueryConstraint[] = [];
    
    // Always start with resource_type as it's the most selective filter
    if (resourceType) {
      constraints.push(where('resource_type', '==', resourceType));
    }
    
    // Add year filter next as it's also very selective
    if (filters.year) {
      constraints.push(where('year', '==', filters.year));
    }
    
    // Add degree filter
    if (filters.degree) {
      constraints.push(where('degree', '==', filters.degree));
    }
    
    // Add specialisation filter
    if (filters.specialisation) {
      constraints.push(where('specialisation', '==', filters.specialisation));
    }
    
    // Add subject or elective filter (mutually exclusive)
    if (filters.subject) {
      constraints.push(where('subject', '==', filters.subject));
    } else if (filters.elective) {
      constraints.push(where('elective', '==', filters.elective));
    }
    
    // Add limit to reduce reads
    constraints.push(limit(maxResults));
    
    return query(resourcesRef, ...constraints);
  };

  const isNetworkError = (error: any) => {
    const networkErrorSignals = [
      'network',
      'connection',
      'timeout',
      'fetch',
      'lost',
      'offline',
      'unavailable',
      'permission-denied',
      'unauthenticated'
    ];

    return networkErrorSignals.some(signal => 
      String(error?.message || '').toLowerCase().includes(signal)
    );
  };

  // Check cache first if enabled
  if (useCache) {
    const cachedData = CacheManager.getCachedData(filters, resourceType);
    if (cachedData) {
      console.log('Returning cached data:', {
        dataLength: cachedData.length,
        filters,
        resourceType
      });
      return cachedData;
    }
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Fetch attempt ${attempt}:`, { 
        filters, 
        resourceType,
        timestamp: new Date().toISOString()
      });

      const q = buildQuery();
      const querySnapshot = await getDocs(q);
      
      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      console.log(`Successful fetch on attempt ${attempt}:`, {
        dataLength: data?.length || 0,
        firstItem: data?.[0]
      });

      // Cache the results if enabled
      if (useCache && data.length > 0) {
        CacheManager.setCachedData(filters, resourceType, data);
      }

      return data || [];

    } catch (error: any) {
      console.error(`Fetch attempt ${attempt} failed:`, {
        error,
        errorType: typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorCode: error?.code
      });

      // Handle specific Firebase errors
      if (error?.code === 'permission-denied') {
        console.error('Permission denied - check Firebase security rules');
        return [];
      }

      if (error?.code === 'unauthenticated') {
        console.error('User not authenticated');
        return [];
      }

      if (error?.code === 'not-found') {
        console.warn('Collection not found - this might be expected.');
        return [];
      }

      if (isNetworkError(error)) {
        if (attempt < maxRetries) {
          console.warn(`Network error on attempt ${attempt}. Retrying...`);
          await new Promise(resolve => 
            setTimeout(resolve, 1000 * attempt * Math.random())
          );
          continue;
        }
      }

      if (attempt === maxRetries) {
        console.error('Failed to fetch resources after multiple attempts', {
          filters,
          resourceType,
          error: error instanceof Error ? error.message : String(error)
        });

        return [];
      }

      await new Promise(resolve => 
        setTimeout(resolve, 1000 * attempt * Math.random())
      );
    }
  }

  return [];
};

// Helper function to check if Firebase is properly configured
export const checkFirebaseConfig = () => {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('Firebase configuration is incomplete - check environment variables');
    return false;
  }
  
  console.log('Firebase configuration loaded successfully');
  return true;
};

// Initialize Firebase configuration check
if (typeof window !== 'undefined') {
  checkFirebaseConfig();
}
