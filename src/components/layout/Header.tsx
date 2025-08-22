import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user, profile, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Daily Coder Hub
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Welcome, {profile?.full_name || user.email}
              </span>
              {profile?.streak_count > 0 && (
                <div className="flex items-center space-x-1 rounded-full bg-accent px-2 py-1 text-xs">
                  🔥 <span>{profile.streak_count}</span>
                </div>
              )}
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {user && (
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};