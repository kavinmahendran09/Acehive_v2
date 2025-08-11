"use client";

import React, { type FC } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, ClipboardList, BookOpen, ArrowRight } from "lucide-react";

const Home: FC = () => {
  const router = useRouter();

  // Set flag to indicate user is coming from home when they navigate to resource page
  React.useEffect(() => {
    sessionStorage.setItem('comingFromHomeOrDashboard', 'true');
  }, []);

  const handleNavigate = (resourceType: string) => {
    let mappedResourceType;
    switch (resourceType) {
      case "CT Paper":
        mappedResourceType = "CT Paper";
        break;
      case "Sem Paper":
        mappedResourceType = "Sem Paper";
        break;
      case "Study Materials":
        mappedResourceType = "Study Material";
        break;
      default:
        mappedResourceType = "CT Paper";
    }

    // Set flag to indicate user is coming from home (should reset search state)
    sessionStorage.setItem('comingFromHomeOrDashboard', 'true');
    
    // Navigate to resource page with specific type
    router.push(`/resource?type=${encodeURIComponent(mappedResourceType)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Skip to content for accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-gray-900 focus:text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
      >
        Skip to main content
      </a>

      {/* Navbar */}
      <Navbar />

      <main id="main" role="main" className="flex-1">
        {/* Hero Section */}
        <section
          className="relative h-screen flex items-center justify-center px-4 overflow-hidden"
          aria-labelledby="hero-heading"
        >
          {/* Floating background icons */}
          <div className="absolute inset-0 pointer-events-none">
            {/* FileText Icons */}
            <FileText className="absolute text-yellow-300 opacity-80 w-16 h-16 top-10 left-8 animate-float-slow" aria-hidden="true" />
            <FileText className="absolute text-blue-400 opacity-80 w-14 h-14 top-1/5 left-1/4 animate-float" aria-hidden="true" />
            <FileText className="absolute text-green-400 opacity-80 w-12 h-12 bottom-12 right-1/3 animate-float" aria-hidden="true" />

            {/* ClipboardList Icons */}
            <ClipboardList className="absolute text-red-400 opacity-80 w-20 h-20 top-1/4 right-12 animate-float" aria-hidden="true" />
            <ClipboardList className="absolute text-purple-400 opacity-80 w-12 h-12 bottom-1/4 left-12 animate-float-slow" aria-hidden="true" />

            {/* BookOpen Icons */}
            <BookOpen className="absolute text-pink-400 opacity-80 w-14 h-14 bottom-16 left-1/3 animate-float-slow" aria-hidden="true" />
            <BookOpen className="absolute text-indigo-400 opacity-80 w-12 h-12 top-20 right-1/4 animate-float" aria-hidden="true" />

            {/* ArrowRight Icons */}
            <ArrowRight className="absolute text-gray-500 opacity-80 w-12 h-12 bottom-24 right-1/4 animate-float" aria-hidden="true" />
          </div>

          {/* Text Content */}
          <div className="text-center relative z-10 px-2 sm:px-4">
            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
            >
              Welcome to{" "}
              <span className="relative inline-block px-2">
                <span className="absolute inset-0 bg-gray-900 rounded-lg rotate-1"></span>
                <span className="relative text-white">Acehive</span>
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Your one-stop platform for CT Papers, Sem Papers, and Study Materials — designed to help you prepare smarter and succeed with confidence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 text-lg">
                <Link href="/resource" aria-label="Browse resources now">
                  Browse resources
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-gray-300 hover:bg-gray-100 bg-transparent px-6 py-3 text-lg"
              >
                <Link href="/about" aria-label="Learn more about Acehive">
                  Learn more
                </Link>
              </Button>
            </div>
          </div>

          {/* Tailwind animations */}
          <style>
            {`
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
              }
              @keyframes float-slow {
                0% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-15px) rotate(3deg); }
                100% { transform: translateY(0px) rotate(0deg); }
              }
              .animate-float {
                animation: float 6s ease-in-out infinite;
              }
              .animate-float-slow {
                animation: float-slow 10s ease-in-out infinite;
              }
            `}
          </style>
        </section>

        {/* Features Section */}
        <section
          className="py-12 md:py-16"
          aria-labelledby="features-heading"
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2
              id="features-heading"
              className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-12"
            >
              Our Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {/* Card 1 - CT Paper */}
              <article
                className="group border-2 rounded-xl p-8"
                aria-labelledby="feature-ct-paper"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mx-auto mb-5">
                  <FileText
                    className="text-gray-900 w-10 h-10"
                    aria-hidden="true"
                  />
                </div>
                <h3
                  id="feature-ct-paper"
                  className="text-2xl font-semibold text-center mb-4"
                >
                  CT Paper
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Access previous CT question papers to practice and prepare effectively.
                </p>
                <div className="flex justify-center">
                  <Button
                    onClick={() => handleNavigate("CT Paper")}
                    className="bg-gray-900 hover:bg-gray-800 text-white transition-transform cursor-pointer"
                    aria-label="Explore CT papers"
                  >
                    Explore now
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
              </article>

              {/* Card 2 - Sem Paper */}
              <article
                className="group border-2 rounded-xl p-8"
                aria-labelledby="feature-sem-paper"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mx-auto mb-5">
                  <ClipboardList
                    className="text-gray-900 w-10 h-10"
                    aria-hidden="true"
                  />
                </div>
                <h3
                  id="feature-sem-paper"
                  className="text-2xl font-semibold text-center mb-4"
                >
                  Sem Paper
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Browse semester-end papers to get familiar with exam patterns.
                </p>
                <div className="flex justify-center">
                  <Button
                    onClick={() => handleNavigate("Sem Paper")}
                    className="bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                    aria-label="Explore semester-end papers"
                  >
                    Explore now
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
              </article>

              {/* Card 3 - Study Materials */}
              <article
                className="group border-2 rounded-xl p-8"
                aria-labelledby="feature-study-materials"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mx-auto mb-5">
                  <BookOpen
                    className="text-gray-900 w-10 h-10"
                    aria-hidden="true"
                  />
                </div>
                <h3
                  id="feature-study-materials"
                  className="text-2xl font-semibold text-center mb-4"
                >
                  Study Materials
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Download curated notes and study resources to enhance your learning.
                </p>
                <div className="flex justify-center">
                  <Button
                    onClick={() => handleNavigate("Study Materials")}
                    className="bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
                    aria-label="Explore study materials"
                  >
                    Explore now
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
              </article>
            </div>
          </div>
        </section>
        
        { /* Contribution Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Every Contribution Counts ❤️
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
            <span className="bg-green-600 text-white px-1 rounded selection:bg-green-400 selection:text-white">
              100% of the funds
            </span> we receive go directly to charitable causes. 
            We believe in complete transparency — you can see where every 
            rupee goes. By supporting us, you're not just helping our mission, 
            you're making a real difference in someone's life.
          </p>
          <p className="text-base md:text-lg text-gray-500 mb-10 italic">
            "Small acts, when multiplied by millions of people, can transform the world."
          </p>
          <Link
            href="/charity-transparency"
            className="inline-block px-4 py-2 text-md font-semibold rounded-md shadow-md 
                      bg-gray-900 text-white hover:bg-gray-800"
          >
            See Where Your Help Goes →
          </Link>
        </div>
      </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
