"use client";

import React, { Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Calendar, 
  Crown, 
  CreditCard, 
  Clock,
  Shield,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

const DashboardContent: React.FC = () => {
  const { user, loading, refreshAvatar } = useAuth();

  // Set flag to indicate user is coming from dashboard when they navigate to resource page
  React.useEffect(() => {
    sessionStorage.setItem('comingFromHomeOrDashboard', 'true');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">Please sign in to access your dashboard.</p>
            <Button asChild>
              <Link 
                href="/"
                onClick={() => sessionStorage.setItem('comingFromHomeOrDashboard', 'true')}
              >
                Go Home
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }



  // Format dates
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Not available';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Not available';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link 
                  href="/" 
                  className="flex items-center space-x-2"
                  onClick={() => sessionStorage.setItem('comingFromHomeOrDashboard', 'true')}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Link>
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-16 h-16">
                      <AvatarImage 
                        src={user.avatar_url} 
                        alt={user.full_name}
                        onError={(e) => {
                          console.log('Avatar image failed to load:', user.avatar_url);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-semibold">
                        {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -bottom-1 -right-1 w-6 h-6 p-0 rounded-full bg-white shadow-md hover:bg-gray-50"
                      onClick={refreshAvatar}
                      title="Refresh profile picture"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{user.full_name}</h3>
                    <p className="text-sm text-gray-500 flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{user.email}</span>
                    </p>
                    {!user.avatar_url && (
                      <p className="text-xs text-orange-600 mt-1">
                        Profile picture not loaded. Click refresh button to try again.
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Member since:</span>
                    <span>{formatDate(user.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last login:</span>
                    <span>{formatDate(user.last_login)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <Badge 
                      variant="outline" 
                      className={user.is_active ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Subscription Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="w-5 h-5" />
                  <span>Premium Features</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon!</h3>
                  <p className="text-gray-600 mb-4">
                    We're working on exciting premium features including:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Unlimited downloads</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Priority support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Advanced search filters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Study progress tracking</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment & Billing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment & Billing</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon!</h3>
                  <p className="text-gray-600 mb-4">
                    Secure payment processing and subscription management will be available soon.
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Shield className="w-4 h-4" />
                    <span>Secure payment processing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Study Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon!</h3>
                  <p className="text-gray-600">
                    Track your study progress, download history, and learning analytics.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
};

export default Dashboard;
