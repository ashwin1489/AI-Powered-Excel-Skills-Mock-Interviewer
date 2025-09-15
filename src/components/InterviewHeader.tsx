import { Badge } from "@/components/ui/badge";

interface InterviewHeaderProps {
  candidateName?: string;
  position?: string;
  duration?: string;
  status: 'waiting' | 'in-progress' | 'completed';
}

export const InterviewHeader = ({ 
  candidateName = "Excel Candidate", 
  position = "Data Analyst", 
  duration = "0:00",
  status 
}: InterviewHeaderProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'waiting': return 'bg-muted text-muted-foreground';
      case 'in-progress': return 'bg-gradient-primary text-white';
      case 'completed': return 'bg-success text-success-foreground';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'waiting': return 'Ready to Start';
      case 'in-progress': return 'Interview in Progress';
      case 'completed': return 'Interview Completed';
    }
  };

  return (
    <header className="bg-card border-b border-border p-6 shadow-card">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Excel Skills Assessment</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Candidate: <span className="font-medium text-foreground">{candidateName}</span></span>
              <span>•</span>
              <span>Position: <span className="font-medium text-foreground">{position}</span></span>
              <span>•</span>
              <span>Duration: <span className="font-medium text-foreground">{duration}</span></span>
            </div>
          </div>
          <Badge className={`px-4 py-2 font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </Badge>
        </div>
      </div>
    </header>
  );
};