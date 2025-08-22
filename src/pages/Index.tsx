import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DailyProblems } from '@/components/dashboard/DailyProblems';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, profile, loading } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect to auth if not logged in or email not verified
  if (!user || !profile?.email_verified) {
    return <Navigate to="/auth" replace />;
  }

  const handleProblemComplete = () => {
    // Force refresh of profile data
    setRefreshKey(prev => prev + 1);
    window.location.reload(); // Simple way to refresh profile data
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your daily coding progress and maintain your streak
          </p>
        </div>
        
        <DashboardStats profile={profile} />
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DailyProblems onProblemComplete={handleProblemComplete} />
          </div>
          
          <div className="space-y-6">
            {/* Placeholder for leaderboard or other widgets */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-2">Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Weekly leaderboard and contribution calendar will be available here.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
