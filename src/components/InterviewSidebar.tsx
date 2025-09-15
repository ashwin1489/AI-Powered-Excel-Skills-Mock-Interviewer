import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface InterviewQuestion {
  id: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'pending' | 'current' | 'completed';
}

interface InterviewSidebarProps {
  currentQuestion?: number;
  totalQuestions: number;
  timeElapsed: string;
  questions: InterviewQuestion[];
}

export const InterviewSidebar = ({ 
  currentQuestion = 0, 
  totalQuestions, 
  timeElapsed,
  questions 
}: InterviewSidebarProps) => {
  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-warning text-warning-foreground';
      case 'advanced': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="p-6 space-y-6 h-fit shadow-card">
      {/* Progress Overview */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Interview Progress</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{currentQuestion}/{totalQuestions}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Time Elapsed:</span>
          <span className="font-medium text-foreground">{timeElapsed}</span>
        </div>
      </div>

      {/* Question Categories */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Assessment Areas</h3>
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div 
              key={question.id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                question.status === 'current' 
                  ? 'bg-primary/10 border-primary' 
                  : question.status === 'completed'
                  ? 'bg-success/10 border-success'
                  : 'bg-muted/30 border-border'
              }`}
            >
              <div className="flex-shrink-0">
                {question.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : question.status === 'current' ? (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground truncate">
                    {question.category}
                  </span>
                  <Badge className={`text-xs px-2 py-0.5 ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Question {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h4 className="font-medium text-foreground">Tips</h4>
        <ul className="space-y-2 text-xs text-muted-foreground">
          <li>• Be specific with formula explanations</li>
          <li>• Describe your thought process</li>
          <li>• Ask clarifying questions if needed</li>
          <li>• Take your time to think through answers</li>
        </ul>
      </div>
    </Card>
  );
};