"use client";

import type React from "react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Filters from "@/components/Filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const ResourceContent: React.FC = () => {
  const [year, setYear] = useState<string | null>(null);
  const [resourceType, setResourceType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, signIn } = useAuth();

  useEffect(() => {
    // First, try to restore from sessionStorage (when coming back from resource-view)
    const storedSearchState = sessionStorage.getItem('resourceSearchState');
    if (storedSearchState) {
      try {
        const parsedState = JSON.parse(storedSearchState);
        console.log('Restoring search state from sessionStorage:', parsedState);
        
        // Restore the search state
        if (parsedState.year) setYear(parsedState.year);
        if (parsedState.resourceType) setResourceType(parsedState.resourceType);
        if (parsedState.subject) {
          setSearchQuery(parsedState.subject);
          setCurrentSubject(parsedState.subject);
        }
        // Use originalResults if available (when coming back from similar resources), otherwise use results
        if (parsedState.originalResults && parsedState.originalResults.length > 0) {
          setSearchResults(parsedState.originalResults);
        } else if (parsedState.results) {
          setSearchResults(parsedState.results);
        }
        
        // Clear the stored state after restoring
        sessionStorage.removeItem('resourceSearchState');
        return; // Exit early if we restored from sessionStorage
      } catch (error) {
        console.error('Error parsing stored search state:', error);
        sessionStorage.removeItem('resourceSearchState');
      }
    }
    
    // Fallback to URL parameters if no sessionStorage data
    const type = searchParams.get('type');
    const yearParam = searchParams.get('year');
    const queryParam = searchParams.get('query');
    
    // Set resource type if it exists
    if (type) {
      setResourceType(decodeURIComponent(type));
    }
    
    // Set other parameters if they exist
    if (yearParam) setYear(decodeURIComponent(yearParam));
    if (queryParam) setSearchQuery(decodeURIComponent(queryParam));
  }, [searchParams]);

  const handleSearch = async (subject: string) => {
    // Check if user is authenticated
    if (!user) {
      console.log('User not authenticated, cannot search');
      return;
    }

    if (!year || !resourceType) {
      return;
    }

    setIsLoading(true);
    setCurrentSubject(subject);

    try {
      const response = await fetch(
        `/api/search-resources?year=${encodeURIComponent(year)}&type=${encodeURIComponent(resourceType)}&subject=${encodeURIComponent(subject)}`
      );

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.resources || []);
        
        // Store search state in sessionStorage for resource-view page
        const searchState = {
          year,
          resourceType,
          subject,
          results: data.resources || []
        };
        console.log('Storing search state in sessionStorage:', searchState);
        sessionStorage.setItem('resourceSearchState', JSON.stringify(searchState));
        
        // Update URL with search parameters
        const params = new URLSearchParams();
        params.set('year', year);
        params.set('type', resourceType);
        params.set('query', subject);
        router.push(`/resource?${params.toString()}`);
      } else {
        console.error('Search failed:', response.statusText);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPaper = (resource: any) => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Store current search state in sessionStorage
    const searchState = {
      year,
      resourceType,
      subject: currentSubject,
      results: searchResults
    };
    console.log('Storing search state in handleViewPaper:', searchState);
    console.log('Resource being viewed:', resource);
    sessionStorage.setItem('resourceSearchState', JSON.stringify(searchState));
    
    router.push(`/resource-view?id=${encodeURIComponent(resource.id || '')}`);
  };

  const Thumbnail: React.FC<{ resource: any }> = ({ resource }) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const fileUrl = resource.file_urls && Array.isArray(resource.file_urls) && resource.file_urls[0] ? resource.file_urls[0] : "/placeholder.svg";

    // Check if this is 2nd year or higher
    const isSecondYearOrHigher = year === "2nd Year" || year === "3rd Year" || year === "4th Year";
    
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

    const isPdf = fileUrl && fileUrl !== "/placeholder.svg" && fileUrl.toLowerCase().endsWith(".pdf");
    const isGoogleDoc = fileUrl && fileUrl.includes("docs.google.com/gview");
    const numberInTitle = resource.title?.match(/\d+/)?.[0] || "";

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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Banner */}
      <div className="bg-gray-900 text-white text-center py-12 sm:py-16 md:py-20">
        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Resource</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300">
            Explore curated resources for your needs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white">
        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-12 pt-8 sm:pt-12 pb-6">
          {/* Highlighted Notice */}
          <div className="mb-6 max-w-2xl">
            <Alert className="bg-amber-50 border-amber-200 text-amber-900 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 text-amber-600"
              >
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.198 0l7.355 12.748c1.155 2-.289 4.5-2.599 4.5H4.645c-2.31 0-3.754-2.5-2.6-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.9.9 0 100-1.8.9.9 0 000 1.8z" clipRule="evenodd" />
              </svg>
              <AlertTitle className="text-amber-900">Notice</AlertTitle>
              <AlertDescription className="leading-tight">
                For 2nd Year onwards only sem papers are available and the rest will be updated soon
              </AlertDescription>
            </Alert>
          </div>

          {/* Filters Section - Horizontal Layout */}
          <div className="mb-8">
            <Filters
              year={year}
              resourceType={resourceType}
              searchQuery={searchQuery}
              setYear={setYear}
              setResourceType={setResourceType}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
              isAuthenticated={!!user}
            />
          </div>

          {/* Results Section - Full Width */}
          <div className="w-full">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">Resource</h2>
                </div>
                {currentSubject && (
                  <p className="text-gray-600 mb-2">
                    Showing results for: <span className="font-medium">{currentSubject}</span>
                  </p>
                )}
                <p className="text-gray-600">
                  Showing {searchResults.length} result(s)
                </p>
              </div>

            {authLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading...</span>
              </div>
            ) : !user ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
                <svg
                  className="w-16 h-16 text-amber-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-amber-800 mb-2">
                  Authentication Required
                </h3>
                <p className="text-amber-700 mb-4">
                  Please log in to search and access resources
                </p>
                <Button 
                  onClick={signIn}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Login with Google
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                {!year || !resourceType ? (
                  <>
                    <svg
                      className="w-12 h-12 text-blue-500 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-blue-700 font-medium">
                      Select Year and Type to get started
                    </p>
                  </>
                ) : !searchQuery ? (
                  <>
                    <svg
                      className="w-12 h-12 text-blue-500 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-blue-700 font-medium">
                      Start typing to search for subjects
                    </p>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-12 h-12 text-blue-500 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-blue-700 font-medium">
                      No resources found for "{searchQuery}"
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((rawResource, index) => {
                  // Parse JSON strings for tags and file_urls with error handling
                  const parseJsonSafely = (value: any, fallback: any = []) => {
                    // If it's already an array, check if it contains a JSON string
                    if (Array.isArray(value)) {
                      if (value.length === 1 && typeof value[0] === 'string') {
                        try {
                          // Try to parse the string as JSON
                          const parsed = JSON.parse(value[0]);
                          if (Array.isArray(parsed)) {
                            return parsed;
                          }
                        } catch (e) {
                          // If parsing fails, return the original array
                          return value;
                        }
                      }
                      return value;
                    }
                    
                    if (typeof value === 'string') {
                      try {
                        // Handle double-encoded JSON strings
                        let parsed = value;
                        
                        // First parse - handle the outer JSON string
                        if (parsed.startsWith('"') && parsed.endsWith('"')) {
                          parsed = JSON.parse(parsed);
                        }
                        
                        // Second parse - handle the inner JSON array
                        if (typeof parsed === 'string' && parsed.startsWith('[') && parsed.endsWith(']')) {
                          parsed = JSON.parse(parsed);
                        }
                        
                        // If it's already an array, return it
                        if (Array.isArray(parsed)) {
                          return parsed;
                        }
                        
                        // Handle comma-separated strings as fallback
                        if (typeof parsed === 'string' && parsed.includes(',')) {
                          return parsed.split(',').map((item: string) => 
                            item.trim().replace(/^["']|["']$/g, '')
                          );
                        }
                        
                        // Single item
                        if (typeof parsed === 'string') {
                          return [parsed.trim().replace(/^["']|["']$/g, '')];
                        }
                        
                        return fallback;
                      } catch (error) {
                        console.error('Error parsing JSON:', error, 'Value:', value);
                        return fallback;
                      }
                    }
                    return value || fallback;
                  };

                  const resource = {
                    ...rawResource,
                    tags: parseJsonSafely(rawResource.tags, []),
                    file_urls: parseJsonSafely(rawResource.file_urls, [])
                  };
                  
                  return (
                  <Card key={index} className="h-full flex flex-col overflow-hidden">
                    <Thumbnail resource={resource} />
                    
                    <CardHeader className="pb-2 flex-shrink-0">
                      <CardTitle className="text-base line-clamp-2 min-h-[2.5rem]">
                        {resource.title || 'Untitled Resource'}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pt-0 flex flex-col flex-1">
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1 min-h-[2.5rem]">
                        {resource.description ? `${resource.description.slice(0, 60)}...` : 'No description available'}
                      </p>

                      {/* Tags */}
                      <div className="mb-3 min-h-[1.5rem] flex items-start flex-shrink-0">
                        {resource.tags && Array.isArray(resource.tags) && resource.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.slice(0, 3).map((tag: string, tagIndex: number) => {
                              const colors = [
                                "bg-blue-100 text-blue-800 border-blue-200",
                                "bg-green-100 text-green-800 border-green-200", 
                                "bg-yellow-100 text-yellow-800 border-yellow-200"
                              ];
                              const displayTag = tag.length > 15 ? `${tag.slice(0, 12)}...` : tag;
                              return (
                                <Badge
                                  key={tagIndex}
                                  variant="outline"
                                  className={`text-xs ${colors[tagIndex % 3]}`}
                                  title={tag.length > 15 ? tag : undefined}
                                >
                                  {displayTag}
                                </Badge>
                              );
                            })}
                            {resource.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{resource.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>

                      <Button 
                        onClick={() => handleViewPaper(rawResource)} 
                        className="w-full mt-auto cursor-pointer hover:cursor-pointer bg-gray-900 hover:bg-gray-800 flex-shrink-0"
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
      </div>

      <Footer />
    </div>
  );
};

const Resource: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ResourceContent />
    </Suspense>
  );
};

export default Resource;
