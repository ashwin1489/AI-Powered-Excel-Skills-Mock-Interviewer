import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, User, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface InterviewHeaderProps {
  interviewState: {
    isActive: boolean;
    timeElapsed: string;
  };
  onStartInterview: () => void;
}

export const InterviewHeader = ({ interviewState, onStartInterview }: InterviewHeaderProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-card/80 backdrop-blur border-b border-border p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Excel Skills Assessment</h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Welcome, {user?.email}</span>
            </div>
            
            {interviewState.isActive ? (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {interviewState.timeElapsed}
              </Badge>
            ) : (
              <Button onClick={onStartInterview} size="sm">
                <Play className="h-4 w-4 mr-2" />
                Start Interview
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};