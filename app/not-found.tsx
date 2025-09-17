"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <section className="w-full max-w-3xl text-center">
          <div className="flex items-center justify-center mb-6">
            <AlertTriangle className="h-12 w-12 text-yellow-500" aria-hidden="true" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            404 — Page not found
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            The page you’re looking for doesn’t exist or may have been moved. Try one of the options below to get back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" aria-hidden="true" />
                Go to Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-300 hover:bg-gray-100">
              <Link href="/resource">
                <Compass className="mr-2 h-5 w-5" aria-hidden="true" />
                Browse Resources
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


