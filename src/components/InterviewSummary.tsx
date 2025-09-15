import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, TrendingUp, BarChart3, PieChart, LineChart, Target } from "lucide-react";

interface InterviewSummaryProps {
  overallScore: number;
  responses: { questionId: string; response: string; score: number; category: string }[];
  recommendations: string[];
}

export const InterviewSummary = ({ overallScore, responses, recommendations }: InterviewSummaryProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "bg-success text-success-foreground" };
    if (score >= 80) return { label: "Very Good", color: "bg-success/80 text-success-foreground" };
    if (score >= 70) return { label: "Good", color: "bg-warning text-warning-foreground" };
    if (score >= 60) return { label: "Fair", color: "bg-warning/70 text-warning-foreground" };
    return { label: "Needs Improvement", color: "bg-destructive text-destructive-foreground" };
  };

  const categoryScores = responses.reduce((acc, response) => {
    acc[response.category] = (acc[response.category] || []).concat(response.score);
    return acc;
  }, {} as Record<string, number[]>);

  const categoryAverages = Object.entries(categoryScores).map(([category, scores]) => ({
    category,
    average: scores.reduce((sum, score) => sum + score, 0) / scores.length
  }));

  const scoreBadge = getScoreBadge(overallScore);

  return (
    <div className="space-y-6">
      {/* Overall Performance */}
      <Card className="p-6 space-y-4 shadow-interview">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Excel Skills Assessment Complete</h2>
          <Badge className={`text-lg px-4 py-2 ${scoreBadge.color}`}>
            {scoreBadge.label}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
              {Math.round(overallScore)}%
            </div>
            <p className="text-muted-foreground">Overall Performance Score</p>
          </div>
          
          <Progress value={overallScore} className="h-3" />
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card className="p-6 space-y-4 shadow-card">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Performance by Category</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryAverages.map(({ category, average }) => (
            <div key={category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{category}</span>
                <span className={`text-sm font-bold ${getScoreColor(average)}`}>
                  {Math.round(average)}%
                </span>
              </div>
              <Progress value={average} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Key Insights */}
      <Card className="p-6 space-y-4 shadow-card">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Key Assessment Areas Covered</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Data Visualization Mastery</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                Chart type selection for different data types
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                Understanding categorical vs. time series data
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                Purpose-driven visualization choices
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Dashboard Design Excellence</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                7-step dashboard creation process
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                Layout principles and user experience
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                Interactive elements and optimization
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6 space-y-4 shadow-card">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Recommendations for Growth</h3>
        </div>
        
        <div className="space-y-3">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {index + 1}
              </div>
              <p className="text-sm text-muted-foreground">{rec}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Comprehensive Coverage */}
      <Card className="p-6 space-y-4 shadow-card border-primary/20">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Complete Assessment Coverage</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-primary/5 rounded-lg">
            <LineChart className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-medium text-foreground">Chart Types</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Categorical, Time Series, Numerical Data
            </p>
          </div>
          
          <div className="text-center p-4 bg-gradient-primary/5 rounded-lg">
            <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-medium text-foreground">Dashboard Design</h4>
            <p className="text-xs text-muted-foreground mt-1">
              7-Step Process & Best Practices
            </p>
          </div>
          
          <div className="text-center p-4 bg-gradient-primary/5 rounded-lg">
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="font-medium text-foreground">Advanced Concepts</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Interactivity & Performance
            </p>
          </div>
        </div>
        
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            ✅ This assessment covers <span className="font-semibold text-foreground">all critical points</span> from comprehensive data visualization and dashboard creation curriculum
          </p>
        </div>
      </Card>
    </div>
  );
};