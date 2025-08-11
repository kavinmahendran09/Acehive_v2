"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />

      {/* Banner Section */}
      <header className="bg-gray-900 text-white text-center py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-medium mb-4">About Us</h1>
          <p className="text-xl text-gray-300">Learn more about our mission, values, and the team behind <strong>Acehive</strong>.</p>
        </div>
      </header>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">M Kavin Bharathi</CardTitle>
                <p className="text-gray-600">Project Developer</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-4">
                  <a 
                    href="https://www.linkedin.com/in/kavin-bharathi-081577252/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <FaLinkedin size={30} />
                  </a>
                  <a 
                    href="https://github.com/kavinmahendran09" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    <FaGithub size={30} />
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Tharun Haribabu</CardTitle>
                <p className="text-gray-600">Content Manager</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-4">
                  <a 
                    href="https://www.linkedin.com/in/tharun-haribabu/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <FaLinkedin size={30} />
                  </a>
                  <a 
                    href="https://github.com/Tharun-1604" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-900 hover:text-gray-700 transition-colors"
                  >
                    <FaGithub size={30} />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Resource Management Team Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-8">Resource Management Team</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://www.linkedin.com/in/amogha-vemuri-b9534a267/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
              Amogha
            </a>
            <a href="https://www.linkedin.com/in/ashmit-sharma-9a69b1325?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
              Ashmit Sharma
            </a>
            <a href="https://www.linkedin.com/in/dhiya-chandrasekar-824099259" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
              C Dhiya
            </a>
            <a href="https://www.linkedin.com/in/gladdin-shruthi-j-6129bb2bb/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
              Gladdin Shruthi J
            </a>
            <a href="https://www.linkedin.com/in/imran-afsar-basha-b44409299/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
              Imran Afsar Basha
            </a>
            <a href="https://www.linkedin.com/in/karan-pillai-010094285?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
              Karan Pillai
            </a>
            <a href="https://www.linkedin.com/in/lakshayakrishnaraj/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
              Lakshya Krishnaraj
            </a>
            <a href="https://www.linkedin.com/in/neeraj-variar-ab685530a/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
              Neeraj Varior
            </a>
            <a href="https://www.linkedin.com/in/nayantra-ramakrishnan-b5b8ba284/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
              Nayantra Ramakrishnan
            </a>
            <a href="https://www.linkedin.com/in/shree-srishti-mahesh-b5293b1aa/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
              Shree Srishti Mahesh
            </a>
            <a href="https://www.linkedin.com/in/srinija-gottumukkala" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
              Srinija Gottumukkala
            </a>
            <a href="https://www.linkedin.com/in/sasmita-p-578b13289" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
              Sasmita Pangulur
            </a>
            <a href="https://www.linkedin.com/in/vivish-adhik-b75917285/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
              Vivish Adhik
            </a>
          </div>
        </div>
      </section>

      <Separator />

      {/* Progress Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h5 className="text-lg font-semibold mb-2">Resources Uploaded</h5>
              <div className="text-4xl font-bold text-blue-600 mb-2">250+</div>
              <p className="text-gray-600">Curated resources and growing!</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-2">Students Reached</h5>
              <div className="text-4xl font-bold text-green-600 mb-2">1000+</div>
              <p className="text-gray-600">Supporting SRM students with essential resources</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-2">Goals Achieved</h5>
              <div className="text-4xl font-bold text-yellow-600 mb-2">45%</div>
              <p className="text-gray-600">On track to achieve 100% of our annual targets</p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What resources do you provide?</AccordionTrigger>
              <AccordionContent className="font-light">
                We provide a variety of resources, including CT papers, Semester papers, and study materials, all organized by subject and year.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I access resources?</AccordionTrigger>
              <AccordionContent className="font-light">
                Simply navigate to the resource section on our homepage, where you can filter and select the resources you need.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How can I contact support?</AccordionTrigger>
              <AccordionContent className="font-light">
                You can reach us through our contact page or email us at{' '}
                <a href="mailto:archiveatsrm@gmail.com" className="text-blue-600 hover:text-blue-700 ml-1">
                  archiveatsrm@gmail.com
                </a>.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
