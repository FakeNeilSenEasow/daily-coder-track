import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface Problem {
  id: string;
  title: string;
  platform: string;
  url: string;
  difficulty: string;
  tags: string[];
  description?: string;
}

interface DailyProblemsProps {
  onProblemComplete: () => void;
}

export const DailyProblems = ({ onProblemComplete }: DailyProblemsProps) => {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodaysProblems();
    fetchUserProgress();
  }, [user]);

  const fetchTodaysProblems = async () => {
    try {
      const { data: problemSet, error } = await supabase
        .from('daily_problem_sets')
        .select('problem_ids')
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;

      if (problemSet?.problem_ids) {
        const { data: problemsData, error: problemsError } = await supabase
          .from('problems')
          .select('*')
          .in('id', problemSet.problem_ids);

        if (problemsError) throw problemsError;
        setProblems(problemsData || []);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load today\'s problems.',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('problem_submissions')
        .select('problem_id')
        .eq('user_id', user.id)
        .eq('date', today);

      if (error) throw error;

      setCompletedProblems(new Set(data?.map(sub => sub.problem_id) || []));
    } catch (error) {
      console.error('Error fetching user progress:', error);
    }
  };

  const toggleProblemComplete = async (problemId: string) => {
    if (!user) return;

    const isCompleted = completedProblems.has(problemId);
    
    try {
      if (isCompleted) {
        // Remove completion
        const { error } = await supabase
          .from('problem_submissions')
          .delete()
          .eq('user_id', user.id)
          .eq('problem_id', problemId)
          .eq('date', today);

        if (error) throw error;

        setCompletedProblems(prev => {
          const newSet = new Set(prev);
          newSet.delete(problemId);
          return newSet;
        });

        toast({
          title: 'Problem unmarked',
          description: 'Problem removed from today\'s completed list.',
        });
      } else {
        // Add completion
        const { error } = await supabase
          .from('problem_submissions')
          .insert({
            user_id: user.id,
            problem_id: problemId,
            date: today,
          });

        if (error) throw error;

        setCompletedProblems(prev => new Set([...prev, problemId]));

        toast({
          title: 'Problem completed! 🎉',
          description: 'Great job! Keep up the consistency.',
        });
      }

      // Update streak count
      await supabase.rpc('update_user_streak', { p_user_id: user.id });
      onProblemComplete();
      
    } catch (error) {
      console.error('Error toggling problem completion:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update problem status.',
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'hard': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (problems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Today's Problems</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No problems assigned for today. Check back later or contact an admin.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Today's Problems
          <Badge variant="outline">
            {completedProblems.size} of {problems.length} completed
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {problems.map((problem) => {
            const isCompleted = completedProblems.has(problem.id);
            
            return (
              <div
                key={problem.id}
                className={`p-4 border rounded-lg transition-colors ${
                  isCompleted 
                    ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                        {problem.title}
                      </h3>
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {problem.platform}
                      </Badge>
                    </div>
                    
                    {problem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {problem.description && (
                      <p className="text-sm text-muted-foreground">
                        {problem.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(problem.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Solve
                    </Button>
                    
                    <Button
                      variant={isCompleted ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => toggleProblemComplete(problem.id)}
                    >
                      {isCompleted ? (
                        <><X className="h-3 w-3 mr-1" />Undo</>
                      ) : (
                        <><Check className="h-3 w-3 mr-1" />Done</>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};