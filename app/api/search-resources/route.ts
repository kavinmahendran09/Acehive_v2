import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const type = searchParams.get('type');
    const subject = searchParams.get('subject');

    console.log('Search request:', { year, type, subject });

    if (!year || !type || !subject) {
      return NextResponse.json({ error: 'Year, type, and subject are required' }, { status: 400 });
    }

    // Map year names to database values
    const yearMapping: { [key: string]: string } = {
      '1st Year': '1st Year',
      '2nd Year': '2nd Year', 
      '3rd Year': '3rd Year',
      '4th Year': '4th Year'
    };

    // Map type names to database values
    const typeMapping: { [key: string]: string } = {
      'Sem Paper': 'Sem Paper',
      'CT Paper': 'CT Paper',
      'Study Material': 'Study Material'
    };

    const dbYear = yearMapping[year];
    const dbType = typeMapping[type];

    if (!dbYear || !dbType) {
      return NextResponse.json({ error: 'Invalid year or type' }, { status: 400 });
    }

    console.log('Database query params:', { dbYear, dbType, subject });

    // Query Firestore for resources - search in both subject and elective fields
    // We'll do two separate queries and combine results to avoid Firestore or() operator issues
    const resourcesRef = collection(db, 'resources');
    
    // Query 1: Search by subject
    const subjectQuery = query(
      resourcesRef,
      where('year', '==', dbYear),
      where('resource_type', '==', dbType),
      where('subject', '==', subject)
    );

    // Query 2: Search by elective
    const electiveQuery = query(
      resourcesRef,
      where('year', '==', dbYear),
      where('resource_type', '==', dbType),
      where('elective', '==', subject)
    );

    console.log('Executing Firestore queries...');

    // Execute both queries
    const [subjectSnapshot, electiveSnapshot] = await Promise.all([
      getDocs(subjectQuery),
      getDocs(electiveQuery)
    ]);

    console.log('Query results:', { 
      subjectCount: subjectSnapshot.size, 
      electiveCount: electiveSnapshot.size 
    });

    const resources: any[] = [];
    const seenIds = new Set<string>();

    // Process subject results
    subjectSnapshot.forEach((doc) => {
      if (!seenIds.has(doc.id)) {
        seenIds.add(doc.id);
        resources.push({
          id: doc.id,
          ...doc.data()
        });
      }
    });

    // Process elective results
    electiveSnapshot.forEach((doc) => {
      if (!seenIds.has(doc.id)) {
        seenIds.add(doc.id);
        resources.push({
          id: doc.id,
          ...doc.data()
        });
      }
    });

    // Sort resources by title
    resources.sort((a, b) => a.title.localeCompare(b.title));

    console.log('Final results:', { totalResources: resources.length });

    return NextResponse.json({ resources });
  } catch (error) {
    console.error('Error searching resources:', error);
    
    // Return more detailed error information
    return NextResponse.json({ 
      error: 'Failed to search resources',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
