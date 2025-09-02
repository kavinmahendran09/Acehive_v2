import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut, User, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signIn, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomeActive = pathname === "/";
  const isAboutActive = pathname === "/about";
  const isResourcesActive = pathname === "/resource" || pathname.startsWith("/resource");



  return (
    <nav className="bg-white shadow-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand and Navigation */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="cursor-pointer"
              onClick={() => sessionStorage.setItem('comingFromHomeOrDashboard', 'true')}
            >
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors duration-200">
                Acehive
              </h1>
            </Link>

            {/* Desktop Navigation - moved to left side */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Resources Link */}
              <Button 
                variant="ghost" 
                asChild
                className={isResourcesActive ? "text-gray-900 bg-gray-100" : ""}
              >
                <Link
                  href="/resource"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={() => sessionStorage.setItem('comingFromHomeOrDashboard', 'true')}
                >
                  Resources
                </Link>
              </Button>

              {/* About Link */}
              <Button 
                variant="ghost" 
                asChild
                className={isAboutActive ? "text-gray-900 bg-gray-100" : ""}
              >
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-gray-900"
                  onClick={() => sessionStorage.setItem('comingFromHomeOrDashboard', 'true')}
                >
                  About
                </Link>
              </Button>
            </div>
          </div>

          {/* Desktop Login/User Profile Button */}
          <div className="hidden md:block">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading...</span>
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={user.avatar_url} 
                        alt={user.full_name}
                        onError={(e) => {
                          console.log('Avatar image failed to load:', user.avatar_url);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                        {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.full_name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.full_name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="w-full text-left px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded flex items-center space-x-2"
                      onClick={() => sessionStorage.setItem('comingFromHomeOrDashboard', 'true')}
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button
                      className="w-full text-left px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100 rounded flex items-center space-x-2"
                      onClick={() => signOut()}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={signIn} className="bg-gray-900 hover:bg-gray-800">
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Resources Link */}
              <div className="px-3 py-2">
                <Link
                  href="/resource"
                  className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    sessionStorage.setItem('comingFromHomeOrDashboard', 'true');
                  }}
                >
                  Resources
                </Link>
              </div>

              {/* About Link */}
              <div className="px-3 py-2">
                <Link
                  href="/about"
                  className="block px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    sessionStorage.setItem('comingFromHomeOrDashboard', 'true');
                  }}
                >
                  About
                </Link>
              </div>

              {/* Mobile Login/User Profile */}
              <div className="px-3 py-2 border-t border-gray-200">
                {loading ? (
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600">Loading...</span>
                  </div>
                ) : user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage 
                          src={user.avatar_url} 
                          alt={user.full_name}
                          onError={(e) => {
                            console.log('Avatar image failed to load:', user.avatar_url);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                          {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        sessionStorage.setItem('comingFromHomeOrDashboard', 'true');
                      }}
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md w-full"
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => {
                      signIn();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="w-full bg-gray-900 hover:bg-gray-800"
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
