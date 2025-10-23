"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface FiltersProps {
  year: string | null;
  resourceType: string | null;
  searchQuery: string;
  setYear: React.Dispatch<React.SetStateAction<string | null>>;
  setResourceType: React.Dispatch<React.SetStateAction<string | null>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  onSearch: (subject: string) => void;
  isAuthenticated: boolean;
}

const Filters: React.FC<FiltersProps> = ({
  year,
  resourceType,
  searchQuery,
  setYear,
  setResourceType,
  setSearchQuery,
  onSearch,
  isAuthenticated,
}) => {
  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const [resourceTypeOptions, setResourceTypeOptions] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [suggestionClicked, setSuggestionClicked] = useState(false);

  // Update resource type options based on year selection
  useEffect(() => {
    if (year === "1st Year") {
      setResourceTypeOptions(["Sem Paper", "CT Paper", "Study Material"]);
      // Reset resource type if it's Study Material (disabled for 1st Year)
      if (resourceType && resourceType === "Study Material") {
        setResourceType(null);
      }
    } else if (year === "2nd Year" || year === "3rd Year" || year === "4th Year") {
      setResourceTypeOptions(["Sem Paper"]);
      // Reset resource type if it's not Sem Paper
      if (resourceType && resourceType !== "Sem Paper") {
        setResourceType(null);
      }
    } else {
      setResourceTypeOptions([]);
    }
  }, [year, resourceType]);

  // Fetch subjects from Firebase when year and resource type are selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (year && resourceType) {
        console.log('Fetching subjects for:', { year, resourceType });
        try {
          const response = await fetch(`/api/subjects?year=${encodeURIComponent(year)}&type=${encodeURIComponent(resourceType)}`);
          if (response.ok) {
            const data = await response.json();
            console.log('Received subjects from API:', data);
            setSubjects(data.subjects || []);
          }
        } catch (error) {
          console.error('Error fetching subjects:', error);
          setSubjects([]);
        }
      } else {
        console.log('Clearing subjects - missing year or resource type:', { year, resourceType });
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, [year, resourceType]);

  // Filter subjects based on search query
  useEffect(() => {
    if (suggestionClicked) {
      // If a suggestion was clicked, don't show any suggestions
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    if (searchQuery.trim() && subjects.length > 0) {
      console.log('Filtering subjects for search:', {
        searchQuery,
        selectedYear: year,
        selectedResourceType: resourceType,
        availableSubjects: subjects,
        subjectsCount: subjects.length
      });
      
      // Additional safeguard: ensure we only show subjects for the current year selection
      const currentYearSubjects = subjects.filter(subject => {
        // Since subjects are already fetched year-specifically, this should always be true
        // But adding this as a double-check
        return true; // subjects array already contains only year-specific subjects
      });
      
      const filtered = currentYearSubjects.filter(subject =>
        subject.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      
      console.log('Filtered suggestions:', {
        filtered,
        filteredCount: filtered.length,
        yearValidation: `All suggestions are for ${year}`
      });
      
      setSearchSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, subjects, suggestionClicked, year, resourceType]);

  const handleYearChange = (value: string) => {
    setYear(value);
    // Reset other fields when year changes
    setResourceType(null);
    setSearchQuery("");
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };

  const handleResourceTypeChange = (value: string) => {
    setResourceType(value);
    // Reset search when resource type changes
    setSearchQuery("");
    setSearchSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If user starts typing again, reset the suggestion clicked flag
    if (value.trim() && suggestionClicked) {
      setSuggestionClicked(false);
    }
    
    // Clear suggestions if input is empty
    if (!value.trim()) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (subject: string) => {
    setSearchQuery(subject);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    setSuggestionClicked(true);
    // Trigger search with the selected subject
    onSearch(subject);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4 text-gray-900">Search Resources</h3>
      
      {/* Responsive Filters Layout */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-3 lg:items-end">
        {/* Year Dropdown */}
        <div className="w-full lg:w-auto lg:flex-[0_0_auto]">
          <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
            Year
          </label>
          <Select
            value={year || ""}
            onValueChange={handleYearChange}
            disabled={!isAuthenticated}
          >
            <SelectTrigger className="w-full lg:w-40 h-9 text-sm border-gray-300 focus:border-gray-400 focus:ring-gray-400">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((y) => (
                <SelectItem 
                  key={y} 
                  value={y} 
                  className="text-sm"
                >
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Resource Type Dropdown */}
        <div className="w-full lg:w-auto lg:flex-[0_0_auto]">
          <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
            Type
          </label>
          <Select
            value={resourceType || ""}
            onValueChange={handleResourceTypeChange}
            disabled={!year || !isAuthenticated}
          >
            <SelectTrigger className="w-full lg:w-44 h-9 text-sm border-gray-300 focus:border-gray-400 focus:ring-gray-400">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              {resourceTypeOptions.map((type) => (
                <SelectItem 
                  key={type} 
                  value={type} 
                  className="text-sm"
                  disabled={year === "1st Year" && type === "Study Material"}
                >
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Input */}
        <div className="w-full lg:w-auto lg:flex-[0_0_auto] relative">
          <label className="block text-xs font-medium text-gray-600 mb-1 uppercase tracking-wide">
            Search
          </label>
          <Input
            type="text"
            placeholder="Search subjects..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="w-full lg:w-80 h-9 text-sm border-gray-300 focus:border-gray-400 focus:ring-gray-400 placeholder:text-gray-400"
            disabled={!year || !resourceType || !isAuthenticated}
          />
          
          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {/* Debug info */}
              <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                Showing suggestions for {year} - {resourceType} ({searchSuggestions.length} results)
              </div>
              {searchSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
