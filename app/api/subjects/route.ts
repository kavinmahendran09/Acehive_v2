import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const type = searchParams.get('type');

    if (!year || !type) {
      return NextResponse.json({ error: 'Year and type are required' }, { status: 400 });
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

    // Query Firestore for subjects and electives
    const resourcesRef = collection(db, 'resources');
    const q = query(
      resourcesRef,
      where('year', '==', dbYear),
      where('resource_type', '==', dbType)
    );

    const querySnapshot = await getDocs(q);
    const subjects = new Set<string>();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Add subject if it exists
      if (data.subject) {
        subjects.add(data.subject);
      }
      
      // Add elective if it exists
      if (data.elective) {
        subjects.add(data.elective);
      }
    });

    // Convert Set to sorted array
    const subjectsArray = Array.from(subjects).sort();

    return NextResponse.json({ subjects: subjectsArray });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}
