"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchResources } from '@/lib/firebaseClient';

const ResourceViewContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [resource, setResource] = useState<any>(null);
  const [searchState, setSearchState] = useState<any>(null);
  const [exactTagResources, setExactTagResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Get resource data from sessionStorage
    const storedSearchState = sessionStorage.getItem('resourceSearchState');
    console.log('Stored search state:', storedSearchState);
    
    if (storedSearchState) {
      const parsedState = JSON.parse(storedSearchState);
      setSearchState(parsedState);
      console.log('Parsed search state:', parsedState);
      
      // Get resource ID from URL
      const resourceId = searchParams.get('id');
      console.log('Resource ID from URL:', resourceId);
      
      if (resourceId && parsedState.results) {
        console.log('Looking for resource with ID:', resourceId);
        console.log('Available results:', parsedState.results);
        console.log('Result IDs:', parsedState.results.map((r: any) => r.id));
        
        const foundResource = parsedState.results.find((r: any) => 
          String(r.id) === String(resourceId) || r.id === resourceId
        );
        console.log('Found resource:', foundResource);
        
        if (foundResource) {
          setResource(foundResource);
        } else {
          console.error('Resource not found with ID:', resourceId);
          console.error('Available IDs:', parsedState.results.map((r: any) => r.id));
        }
      }
    } else {
      console.log('No stored search state found');
    }
  }, [searchParams]);

  const handleBack = () => {
    // Store the complete search state before going back
    if (searchState) {
      sessionStorage.setItem('resourceSearchState', JSON.stringify(searchState));
    }
    router.push('/resource');
  };

  const fetchSimilarResources = async () => {
    if (!resource || !searchState) return;

    console.log('Using original search results as similar resources:', {
      resourceId: resource.id,
      resourceTitle: resource.title,
      originalResultsCount: searchState.results?.length || 0
    });
    
    // Use the original search results as similar resources, excluding the current resource
    const similarResults = (searchState.results || [])
      .filter((res: any) => {
        // Exclude the current resource
        return res.id !== resource.id;
      })
      .map((res: any) => {
        // All results from the same search have the same relevance
        return {
          ...res,
          relevanceScore: 1.0
        };
      });

    console.log('Similar results from original search:', similarResults.length, 'items');
    setExactTagResources(similarResults);
  };

  const countMatchingTags = (resourceTags: string[], searchTags: string[]): number => {
    return resourceTags.filter((tag) => searchTags.includes(tag)).length;
  };

  const parseJsonSafely = (value: any, fallback: any = []) => {
    if (Array.isArray(value)) {
      if (value.length === 1 && typeof value[0] === 'string') {
        try {
          const parsed = JSON.parse(value[0]);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch (e) {
          return value;
        }
      }
      return value;
    }
    
    if (typeof value === 'string') {
      try {
        let parsed = value;
        
        if (parsed.startsWith('"') && parsed.endsWith('"')) {
          parsed = JSON.parse(parsed);
        }
        
        if (typeof parsed === 'string' && parsed.startsWith('[') && parsed.endsWith(']')) {
          parsed = JSON.parse(parsed);
        }
        
        if (Array.isArray(parsed)) {
          return parsed;
        }
        
        if (typeof parsed === 'string' && parsed.includes(',')) {
          return parsed.split(',').map((item: string) => 
            item.trim().replace(/^["']|["']$/g, '')
          );
        }
        
        if (typeof parsed === 'string') {
          return [parsed.trim().replace(/^["']|["']$/g, '')];
        }
        
        return fallback;
      } catch (error) {
        return fallback;
      }
    }
    return value || fallback;
  };

  const Thumbnail: React.FC<{ resource: any }> = ({ resource }) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const fileUrl = resource.file_urls && Array.isArray(resource.file_urls) && resource.file_urls[0] ? resource.file_urls[0] : "/placeholder.svg";

    // Check if this is 2nd year or higher based on search state
    const isSecondYearOrHigher = searchState?.year === "2nd Year" || searchState?.year === "3rd Year" || searchState?.year === "4th Year";
    
    // For 2nd year+ resources, always show PDF icon instead of trying to load images
    if (isSecondYearOrHigher) {
      const numberInTitle = resource.title?.match(/\d+/)?.[0] || "";
      return (
        <div className="flex justify-center items-center h-32 bg-gray-100">
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            <span className="mt-1 text-sm font-medium">{numberInTitle}</span>
          </div>
        </div>
      );
    }

    if (isSafari) {
      return (
        <img
          src={fileUrl}
          className="w-full h-32 object-cover"
          alt={resource.title || "Resource thumbnail"}
        />
      );
    }

    const isPdf = fileUrl && fileUrl !== "/placeholder.svg" && fileUrl.toLowerCase().endsWith('.pdf');
    const isGoogleDoc = fileUrl && fileUrl.includes('docs.google.com/gview');
    const numberInTitle = resource.title?.match(/\d+/)?.[0] || '';

    if (isPdf || isGoogleDoc) {
      return (
        <div className="flex justify-center items-center h-32 bg-gray-100">
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
            <span className="mt-1 text-sm font-medium">{numberInTitle}</span>
          </div>
        </div>
      );
    }

    return (
      <img
        src={fileUrl}
        className="w-full h-32 object-cover"
        alt={resource.title || "Resource thumbnail"}
      />
    );
  };

  useEffect(() => {
    if (resource && searchState) {
      fetchSimilarResources();
    }
  }, [resource, searchState]);

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resource not found</h2>
            <Button onClick={handleBack} className="bg-gray-900 hover:bg-gray-800">
              Back to Resources
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const parsedTags = parseJsonSafely(resource.tags, []);
  const parsedFileUrls = parseJsonSafely(resource.file_urls, []);
  
  console.log('Resource data in resource-view:', {
    resource,
    parsedTags,
    parsedFileUrls,
    fileUrlsRaw: resource.file_urls
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Header */}
      <div className="bg-gray-900 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">{resource.title}</h1>
        <p className="text-xl text-gray-300 max-w-4xl mx-auto px-4">
          Explore this resource and discover similar materials
        </p>
      </div>

      {/* Tags Section */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {parsedTags && parsedTags.length > 0 && parsedTags.map((tag: string, index: number) => {
              const colors = [
                "bg-blue-100 text-blue-800 border-blue-200",
                "bg-green-100 text-green-800 border-green-200", 
                "bg-yellow-100 text-yellow-800 border-yellow-200"
              ];
              return (
                <Badge
                  key={index}
                  variant="outline"
                  className={`text-sm ${colors[index % 3]}`}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6">Content</h3>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="text-xl font-semibold mb-4">
              Introduction: <span className="font-normal text-lg">{resource.description}</span>
            </h4>

            {resource.bullet_points && resource.bullet_points.length > 0 && (
              <ul className="list-disc list-inside space-y-2 mb-6">
                {resource.bullet_points.map((point: string, index: number) => (
                  <li key={index} className="font-semibold">{point}</li>
                ))}
              </ul>
            )}

            <h4 className="text-xl font-semibold mb-4">Resource:</h4>
            <div className="space-y-4">
              {parsedFileUrls.map((url: string, index: number) => (
                <div key={index} className="w-full">
                  {url.toLowerCase().endsWith('.pdf') ? (
                    <div className="h-[700px] overflow-y-auto w-full border rounded-lg">
                      <iframe
                        src={url}
                        width="100%"
                        height="100%"
                        title={`PDF ${index + 1}`}
                        className="rounded-lg"
                      />
                    </div>
                  ) : url.includes('docs.google.com/gview') ? (
                    <div className="w-full">
                      <div className="bg-gray-50 border rounded-lg p-6 text-center">
                        <div className="mb-4">
                          <svg
                            className="w-16 h-16 text-red-500 mx-auto"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold mb-2">Google Docs Document</h4>
                        <p className="text-gray-600 mb-4">
                          This document is hosted on Google Docs and cannot be embedded directly due to security restrictions.
                        </p>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open Document in New Tab
                        </a>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt={`Image ${index + 1}`}
                      className="w-full h-auto rounded-lg max-w-full mx-auto block"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Button onClick={handleBack} className="bg-gray-900 hover:bg-gray-800 text-lg px-6 py-3">
            Back
          </Button>
        </div>
      </div>

      {/* Similar Resources */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Similar Resources</h1>
          {exactTagResources.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No similar resources found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exactTagResources.slice(0, 12).map((similarResource: any, index: number) => {
                const parsedSimilarTags = parseJsonSafely(similarResource.tags, []);
                const parsedSimilarFileUrls = parseJsonSafely(similarResource.file_urls, []);
                
                const processedResource = {
                  ...similarResource,
                  tags: parsedSimilarTags,
                  file_urls: parsedSimilarFileUrls
                };

                                 return (
                   <Card key={index} className="h-full flex flex-col overflow-hidden">
                     <Thumbnail resource={processedResource} />
                     <CardHeader className="pb-2 flex-shrink-0">
                       <CardTitle className="text-base line-clamp-2 min-h-[2.5rem]">{processedResource.title}</CardTitle>
                     </CardHeader>
                     <CardContent className="pt-0 flex flex-col flex-1">
                       <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1 min-h-[2.5rem]">
                         {processedResource.description?.slice(0, 60)}...
                       </p>

                       {/* Tags */}
                       <div className="mb-3 min-h-[1.5rem] flex items-start flex-shrink-0">
                         {processedResource.tags && Array.isArray(processedResource.tags) && processedResource.tags.length > 0 ? (
                           <div className="flex flex-wrap gap-1">
                             {processedResource.tags.slice(0, 3).map((tag: string, tagIndex: number) => {
                               const colors = [
                                 "bg-blue-100 text-blue-800 border-blue-200",
                                 "bg-green-100 text-green-800 border-green-200", 
                                 "bg-yellow-100 text-yellow-800 border-yellow-200"
                               ];
                               const displayTag = tag.length > 12 ? `${tag.slice(0, 9)}...` : tag;
                               return (
                                 <Badge
                                   key={tagIndex}
                                   variant="outline"
                                   className={`text-xs ${colors[tagIndex % 3]}`}
                                   title={tag.length > 12 ? tag : undefined}
                                 >
                                   {displayTag}
                                 </Badge>
                               );
                             })}
                             {processedResource.tags.length > 3 && (
                               <Badge variant="outline" className="text-xs">
                                 +{processedResource.tags.length - 3}
                               </Badge>
                             )}
                           </div>
                         ) : (
                           <div></div>
                         )}
                       </div>

                       <Button 
                         onClick={() => {
                           // Preserve the original search state but update the results to include the similar resources
                           // This ensures the user can navigate back to their original search context
                           const newSearchState = { 
                             ...searchState, 
                             results: exactTagResources,
                             // Keep the original search context for navigation back
                             originalResults: searchState?.results || []
                           };
                           sessionStorage.setItem('resourceSearchState', JSON.stringify(newSearchState));
                           router.push(`/resource-view?id=${encodeURIComponent(processedResource.id || '')}`);
                         }}
                         className="w-full bg-gray-900 hover:bg-gray-800 flex-shrink-0"
                       >
                         View Resource
                       </Button>
                     </CardContent>
                   </Card>
                 );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

const ResourceView: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResourceViewContent />
    </Suspense>
  );
};

export default ResourceView;
