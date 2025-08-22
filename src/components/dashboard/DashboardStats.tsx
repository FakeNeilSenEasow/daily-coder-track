import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Target, Trophy, Calendar } from 'lucide-react';

interface DashboardStatsProps {
  profile: any;
}

export const DashboardStats = ({ profile }: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profile?.streak_count || 0}</div>
          <p className="text-xs text-muted-foreground">
            {profile?.streak_count === 1 ? 'day' : 'days'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profile?.longest_streak || 0}</div>
          <p className="text-xs text-muted-foreground">
            {profile?.longest_streak === 1 ? 'day' : 'days'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Solved</CardTitle>
          <Target className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profile?.total_solved || 0}</div>
          <p className="text-xs text-muted-foreground">problems</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Member Since</CardTitle>
          <Calendar className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {profile?.created_at 
              ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
              : 'New'
            }
          </div>
          <p className="text-xs text-muted-foreground">joined</p>
        </CardContent>
      </Card>
    </div>
  );
};