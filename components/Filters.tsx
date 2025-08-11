"use client";

import React, { useState } from "react";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface FiltersProps {
  year: string | null;
  degree: string | null;
  specialisation: string | null;
  subject: string | null;
  elective: string | null;
  setYear: React.Dispatch<React.SetStateAction<string | null>>;
  setDegree: React.Dispatch<React.SetStateAction<string | null>>;
  setSpecialisation: React.Dispatch<React.SetStateAction<string | null>>;
  setSubject: React.Dispatch<React.SetStateAction<string | null>>;
  setElective: React.Dispatch<React.SetStateAction<string | null>>;
  handleSearch: () => void;
  warning: string | null;
  isAuthenticated: boolean;
  signIn?: () => Promise<void>;
}

const Filters: React.FC<FiltersProps> = ({
  year,
  degree,
  specialisation,
  subject,
  elective,
  setYear,
  setDegree,
  setSpecialisation,
  setSubject,
  setElective,
  handleSearch,
  warning,
  isAuthenticated,
  signIn,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubjectSelected, setIsSubjectSelected] = useState(true);

  const specialisationOptions =
    degree === "Computer Science"
      ? [
          "Core",
          "Data Science",
          "Information Technology",
          "Artificial Intelligence",
          "Cloud Computing",
          "Cyber Security",
          "Computer Networking",
          "Gaming Technology",
          "Artificial Intelligence and Machine Learning",
          "Business Systems",
          "Big Data Analytics",
          "Block Chain Technology",
          "Software Engineering",
          "Internet of Things",
        ]
      : degree === "Biotechnology"
      ? [
          "Biotechnology Core",
          "Biotechnology (Computational Biology)",
          "Biotechnology W/S in Food Technology",
          "Biotechnology W/S in Genetic Engineering",
          "Biotechnology W/S in Regenerative Medicine",
        ]
      : degree === "Electrical"
      ? ["Electrical & Electronics Engineering", "Electric Vehicle Technology"]
      : degree === "Civil"
      ? ["Civil Engineering Core", "Civil Engineering with Computer Applications"]
      : degree === "ECE"
      ? [
          "Electronics & Communication Engineering",
          "Cyber Physical Systems",
          "Data Sciences",
          "Electronics and Computer Engineering",
          "VLSI Design and Technology",
        ]
      : degree === "Automobile"
      ? ["Core", "Automotive Electronics", "Vehicle Testing"]
      : degree === "Mechanical"
      ? [
          "Core",
          "Automation and Robotics",
          "AIML",
          "Mechatronics Engineering Core",
          "Autonomous Driving Technology",
          "Immersive Technologies",
          "Industrial IoT",
          "Robotics",
        ]
      : [];

  const subjectOptions =
    year === "1st Year"
      ? degree === "Biotechnology"
        ? [
            "Communicative English",
            "Calculus and Linear Algebra",
            "Electrical and Electronics Engineering",
            "Semiconductor Physics and Computational Methods",
            "Programming for Problem Solving",
            "Advanced Calculus and Complex Analysis",
            "Chemistry",
            "Introduction to Computational Biology",
            "Object Oriented Design and Programming",
            "Philosophy of Engineering",
            "Cell Biology",
            "Biochemistry",
          ]
        : [
            "Communicative English",
            "Calculus and Linear Algebra",
            "Electrical and Electronics Engineering",
            "Semiconductor Physics and Computational Methods",
            "Programming for Problem Solving",
            "Advanced Calculus and Complex Analysis",
            "Chemistry",
            "Introduction to Computational Biology",
            "Object Oriented Design and Programming",
            "Philosophy of Engineering",
          ]
      : specialisation === "Artificial Intelligence and Machine Learning"
      ? ["Computer Networks", "Discrete Mathematics", "Machine Learning", "Formal Language and Automata"]
      : [];

  const electiveOptions = [
    "French",
    "Spanish",
    "German",
    "Japanese",
    "Korean",
    "Chinese",
  ];

  const handleYearChange = (y: string) => {
    setYear(y);
    setSpecialisation(null);
    setSubject(null);
    setElective(null);
  };

  const handleDegreeChange = (d: string) => {
    setDegree(d);
    setSpecialisation(null);
    setSubject(null);
    setElective(null);
  };

  const handleSearchClick = async () => {
    if (!isAuthenticated && signIn) {
      await signIn();
      return;
    }
    
    setIsLoading(true);
    await handleSearch();
    setIsLoading(false);
  };

  // Determine if the search button should be enabled
  const isSearchEnabled = () => {
    if (!isAuthenticated) {
      return false;
    }
    
    if (year === "1st Year") {
      // For 1st Year, only subject or elective is required
      return subject || elective;
    } else {
      // For 2nd Year and 3rd Year, specialisation is also required
      return (subject || elective) && specialisation;
    }
  };

    return (
    <div className="w-full p-4 bg-white border border-gray-200 rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Search Options</h3>
      
      {/* Year Section */}
      <div className="mb-4">
        <h5 className="text-lg font-medium mb-3 text-gray-900">Year</h5>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {["1st Year", "2nd Year", "3rd Year"].map((y) => (
            <button
              key={y}
              type="button"
              className={`w-full px-4 py-3 text-left border-b border-gray-200 last:border-b-0 flex items-center justify-between transition-colors ${
                year === y 
                  ? "bg-gray-900 text-white" 
                  : "bg-white text-gray-900 hover:bg-gray-50"
              } ${y !== "1st Year" ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:cursor-pointer"}`}
              onClick={() => y === "1st Year" && handleYearChange(y)}
              disabled={y !== "1st Year"}
            >
              <span className="text-base">{y}</span>
              {y !== "1st Year" && (
                <span className="flex items-center text-gray-500" title="Work in Progress">
                  <Wrench className="w-3 h-3 mr-2" />
                  <small>(Work in Progress)</small>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Degree Section */}
      <div className="mb-4">
        <h5 className="text-lg font-medium mb-3 text-gray-900">Degree</h5>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {["Computer Science", "Biotechnology", "Electrical", "ECE", "Mechanical", "Civil", "Automobile"].map((d) => (
            <button
              key={d}
              type="button"
              className={`w-full px-4 py-3 text-left border-b border-gray-200 last:border-b-0 transition-colors cursor-pointer hover:cursor-pointer ${
                degree === d 
                  ? "bg-gray-900 text-white" 
                  : "bg-white text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => handleDegreeChange(d)}
            >
              <span className="text-base">{d}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Specialisation Section */}
      {(year === "2nd Year" || year === "3rd Year") && (
        <div className="mb-4">
          <h5 className="text-lg font-medium mb-3 text-gray-900">Specialisation</h5>
          <Select
            value={specialisation || ""}
            onValueChange={(value) => setSpecialisation(value)}
            disabled={!year || !degree}
          >
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue placeholder="Select Specialisation" />
            </SelectTrigger>
            <SelectContent>
              {specialisationOptions.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Subject Type Toggle */}
      <div className="mb-4">
        <h5 className="text-lg font-medium mb-3 text-gray-900">Subject</h5>
        <div className="flex gap-2">
          <Button
            variant={isSubjectSelected ? "default" : "outline"}
            size="default"
            className={`flex-1 h-10 text-base cursor-pointer hover:cursor-pointer ${
              isSubjectSelected ? "bg-gray-900 hover:bg-gray-800" : ""
            }`}
            onClick={() => setIsSubjectSelected(true)}
          >
            Subject
          </Button>
          <Button
            variant={!isSubjectSelected ? "default" : "outline"}
            size="default"
            className={`flex-1 h-10 text-base cursor-pointer hover:cursor-pointer ${
              !isSubjectSelected ? "bg-gray-900 hover:bg-gray-800" : ""
            }`}
            onClick={() => setIsSubjectSelected(false)}
          >
            Language / Elective
          </Button>
        </div>
      </div>

      {/* Subject Selection */}
      {isSubjectSelected && (
        <div className="mb-4">
          <Select
            value={subject || ""}
            onValueChange={(value) => {
              setSubject(value);
              setElective(null);
            }}
            disabled={!year || !degree || (!specialisation && (year === "2nd Year" || year === "3rd Year"))}
          >
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjectOptions.map((subj) => (
                <SelectItem key={subj} value={subj}>
                  {subj}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Elective Selection */}
      {!isSubjectSelected && (
        <div className="mb-4">
          <Select
            value={elective || ""}
            onValueChange={(value) => {
              setElective(value);
              setSubject(null);
            }}
            disabled={!year || !degree || (!specialisation && (year === "2nd Year" || year === "3rd Year"))}
          >
            <SelectTrigger className="w-full h-12 text-base">
              <SelectValue placeholder="Select Language/Elective" />
            </SelectTrigger>
            <SelectContent>
              {electiveOptions.map((elec) => (
                <SelectItem key={elec} value={elec}>
                  {elec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Warning Message */}
      {year !== null && year !== "1st Year" && (
        <div className="mb-3">
          <small className="text-red-600">
            You can select either a Subject or an Elective, but not both.
          </small>
        </div>
      )}

      {/* Search Button */}
      <Button
        className="w-full h-12 mt-3 text-base font-medium bg-gray-900 hover:bg-gray-800 cursor-pointer hover:cursor-pointer"
        onClick={handleSearchClick}
        disabled={!isSearchEnabled() || isLoading}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
            Loading...
          </div>
        ) : !isAuthenticated ? (
          "Login to Search"
        ) : (
          "Search"
        )}
      </Button>

      {/* Error Alert */}
      {warning && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
          <div className="text-red-700 text-sm">
            {warning}
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
