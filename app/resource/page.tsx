"use client";

import type React from "react";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Filters from "@/components/Filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchResources } from "@/lib/firebaseClient";
import { useAuth } from "@/contexts/AuthContext";
import CacheManager from "@/lib/cacheManager";

const ResourceContent: React.FC = () => {
  const [year, setYear] = useState<string | null>(null);
  const [degree, setDegree] = useState<string | null>(null);
  const [specialisation, setSpecialisation] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [elective, setElective] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resourceType, setResourceType] = useState<string>("CT Paper");
  const [shouldAutoSearch, setShouldAutoSearch] = useState<boolean>(false);
  const autoSearchTriggeredRef = useRef<boolean>(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signIn } = useAuth();

  const handleSearch = useCallback(async () => {
    console.log('Search button clicked');
    // Check if user is authenticated
    if (!user) {
      setWarning("Please sign in to search for resources.");
      return;
    }

    if (year === "1st Year") {
      if ((subject || elective) && !(subject && elective)) {
        setWarning(null);
        setIsLoading(true);

        try {
          console.log('Attempting search with filters:', { year: "1st Year", subject, elective, resourceType });
          
          // Check if we have cached data first
          const cachedData = CacheManager.getCachedData({ year: "1st Year", subject: subject || undefined, elective: elective || undefined }, resourceType);
          if (cachedData) {
            setSearchResults(cachedData);
            setWarning(null);
            
            if (cachedData.length === 0) {
              setWarning("Oops! we might have missed out on this one. Don't worry, we will update it soon.");
            }
          } else {
            const results = await fetchResources({ year: "1st Year", subject: subject || undefined, elective: elective || undefined }, resourceType);
            
            results.sort((a: any, b: any) => a.title.localeCompare(b.title));

            setSearchResults(results);
            setWarning(null); // Clear any previous warnings

            if (results.length === 0) {
              setWarning("Oops! we might have missed out on this one. Don't worry, we will update it soon.");
            }
          }

          // Update URL with search parameters
          const params = new URLSearchParams();
          if (year) params.set('year', year);
          if (degree) params.set('degree', degree);
          if (specialisation) params.set('specialisation', specialisation);
          if (subject) params.set('subject', subject);
          if (elective) params.set('elective', elective);
          if (resourceType) params.set('type', resourceType);
          
          router.push(`/resource?${params.toString()}`);
        } catch (error: any) {
          console.error("Search failed:", error);
          setWarning("Unable to fetch resources. Please check your connection and try again.");
          setSearchResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setWarning("Please select a subject or elective before searching.");
      }
    } else if (year && degree && specialisation && (subject || elective) && !(subject && elective)) {
      setWarning(null);
      setIsLoading(true);

      try {
        // Check if we have cached data first
        const cachedData = CacheManager.getCachedData({ year, degree, specialisation, subject: subject || undefined, elective: elective || undefined }, resourceType);
        if (cachedData) {
          setSearchResults(cachedData);
          setWarning(null);
          
          if (cachedData.length === 0) {
            setWarning("No resources found matching your criteria.");
          }
        } else {
          const results = await fetchResources({ year, degree, specialisation, subject: subject || undefined, elective: elective || undefined }, resourceType);
          
          results.sort((a: any, b: any) => a.title.localeCompare(b.title));

          setSearchResults(results);
          setWarning(null); // Clear any previous warnings

          if (results.length === 0) {
            setWarning("No resources found matching your criteria.");
          }
        }

        // Update URL with search parameters
        const params = new URLSearchParams();
        if (year) params.set('year', year);
        if (degree) params.set('degree', degree);
        if (specialisation) params.set('specialisation', specialisation);
        if (subject) params.set('subject', subject);
        if (elective) params.set('elective', elective);
        if (resourceType) params.set('type', resourceType);
        
        router.push(`/resource?${params.toString()}`);
      } catch (error: any) {
        console.error("Search failed:", error);
        setWarning("Unable to fetch resources. Please check your connection and try again.");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setWarning("Please select all required filters before searching.");
    }
  }, [year, degree, specialisation, subject, elective, resourceType, user, router]);

  useEffect(() => {
    // Get all parameters from URL query
    const type = searchParams.get('type');
    const yearParam = searchParams.get('year');
    const degreeParam = searchParams.get('degree');
    const specialisationParam = searchParams.get('specialisation');
    const subjectParam = searchParams.get('subject');
    const electiveParam = searchParams.get('elective');
    
    // Check if user is coming from home or dashboard (should reset search state)
    const comingFromHomeOrDashboard = sessionStorage.getItem('comingFromHomeOrDashboard');
    
    // Check if resource type changed
    if (type) {
      const newType = decodeURIComponent(type);
      if (newType !== resourceType) {
        // Reset all search state when resource type changes
        setResourceType(newType);
        setYear(null);
        setDegree(null);
        setSpecialisation(null);
        setSubject(null);
        setElective(null);
        setSearchResults([]);
        setWarning(null);
        setShouldAutoSearch(false);
        autoSearchTriggeredRef.current = false;
        
        // Clear cache for the old resource type to ensure fresh data
        CacheManager.clearCacheForResourceType(resourceType);
        return;
      }
    }
    
    // Set resource type if it exists
    if (type) {
      setResourceType(decodeURIComponent(type));
    }
    
    // If coming from home or dashboard, reset all search state
    if (comingFromHomeOrDashboard === 'true') {
      // Clear the flag
      sessionStorage.removeItem('comingFromHomeOrDashboard');
      
      // Reset all search state
      setYear(null);
      setDegree(null);
      setSpecialisation(null);
      setSubject(null);
      setElective(null);
      setSearchResults([]);
      setWarning(null);
      setShouldAutoSearch(false);
      autoSearchTriggeredRef.current = false;
      
      // Clear stored search state
      sessionStorage.removeItem('resourceSearchState');
      
      // Clear URL parameters by navigating to clean URL
      if (type) {
        router.replace(`/resource?type=${encodeURIComponent(type)}`);
      } else {
        router.replace('/resource');
      }
      return;
    }
    
    // Check if we have search state in sessionStorage (coming from resource-view)
    const storedSearchState = sessionStorage.getItem('resourceSearchState');
    if (storedSearchState) {
      const parsedState = JSON.parse(storedSearchState);
      
      // If we have stored state and no URL parameters, restore the search state
      if (!yearParam && !degreeParam && !specialisationParam && !subjectParam && !electiveParam) {
        setYear(parsedState.year || null);
        setDegree(parsedState.degree || null);
        setSpecialisation(parsedState.specialisation || null);
        setSubject(parsedState.subject || null);
        setElective(parsedState.elective || null);
        setSearchResults(parsedState.results || []);
        setShouldAutoSearch(false);
        autoSearchTriggeredRef.current = true; // Prevent auto-search since we have results
      } else {
        // URL parameters take precedence
        if (yearParam) setYear(decodeURIComponent(yearParam));
        if (degreeParam) setDegree(decodeURIComponent(degreeParam));
        if (specialisationParam) setSpecialisation(decodeURIComponent(specialisationParam));
        if (subjectParam) setSubject(decodeURIComponent(subjectParam));
        if (electiveParam) setElective(decodeURIComponent(electiveParam));
        
        if (yearParam || degreeParam || specialisationParam || subjectParam || electiveParam) {
          setShouldAutoSearch(true);
        }
      }
    } else {
      // No stored state, use URL parameters if they exist
      if (yearParam) setYear(decodeURIComponent(yearParam));
      if (degreeParam) setDegree(decodeURIComponent(degreeParam));
      if (specialisationParam) setSpecialisation(decodeURIComponent(specialisationParam));
      if (subjectParam) setSubject(decodeURIComponent(subjectParam));
      if (electiveParam) setElective(decodeURIComponent(electiveParam));
    }
  }, [searchParams, resourceType, router]);

  // Clear search results when user logs out
  useEffect(() => {
    if (!user) {
      setSearchResults([]);
      setWarning(null);
      setYear(null);
      setDegree(null);
      setSpecialisation(null);
      setSubject(null);
      setElective(null);
      autoSearchTriggeredRef.current = false; // Reset the ref when user logs out
    }
  }, [user]);

  // Auto-search when filters are loaded from URL parameters (only when coming from resource-view)
  useEffect(() => {
    const hasFilters = year || degree || specialisation || subject || elective;
    const hasRequiredFilters = year === "1st Year" ? (subject || elective) : (year && degree && specialisation && (subject || elective));
    
    if (hasFilters && hasRequiredFilters && user && searchResults.length === 0 && shouldAutoSearch && !autoSearchTriggeredRef.current) {
      autoSearchTriggeredRef.current = true;
      // Small delay to ensure all state is set
      const timer = setTimeout(() => {
        handleSearch();
        setShouldAutoSearch(false); // Reset the flag after auto-searching
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [year, degree, specialisation, subject, elective, user, shouldAutoSearch, handleSearch, searchResults.length]);

  const handleViewPaper = (resource: any) => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Store search state in sessionStorage for the resource view page
    const searchState = { year, degree, specialisation, subject, elective, results: searchResults, resourceType };
    sessionStorage.setItem('resourceSearchState', JSON.stringify(searchState));
    
    router.push(`/resource-view?id=${encodeURIComponent(resource.id || '')}`);
  };

  const Thumbnail: React.FC<{ resource: any }> = ({ resource }) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const fileUrl = resource.file_urls && Array.isArray(resource.file_urls) && resource.file_urls[0] ? resource.file_urls[0] : "/placeholder.svg";

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
    const numberInTitle = resource.title?.match(/\d+/)?.[0] || "";

    if (isPdf) {
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
      <div className="bg-gray-900 text-white text-center py-16 md:py-20">
        <div className="max-w-none mx-auto px-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{resourceType}</h1>
          <p className="text-lg md:text-xl text-gray-300">
            Explore curated {resourceType} resources for your needs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white">
        <div className="max-w-none mx-auto px-12 pt-12 pb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar - Expanded Width */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
              <Filters
                year={year}
                degree={degree}
                specialisation={specialisation}
                subject={subject}
                elective={elective}
                setYear={setYear}
                setDegree={setDegree}
                setSpecialisation={setSpecialisation}
                setSubject={setSubject}
                setElective={setElective}
                handleSearch={handleSearch}
                warning={warning}
                isAuthenticated={!!user}
                signIn={signIn}
              />
            </div>

            {/* Results Section - Flexible Width */}
            <div className="flex-1 min-w-0">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{resourceType}</h2>
                </div>
                <p className="text-gray-600">
                  Showing {searchResults.length} result(s)
                </p>
              </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                {!user ? (
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <p className="text-blue-700 font-medium mb-3">
                      Login to get started
                    </p>
                    <Button onClick={signIn} className="bg-gray-900 hover:bg-gray-800">
                      Login
                    </Button>
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
                      Get started by searching
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
