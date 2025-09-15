import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Target, Users, ArrowRight, Brain, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/interview');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <Badge variant="secondary" className="px-4 py-2">
            <Brain className="mr-2 h-4 w-4" />
            AI-Powered Assessment
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Excel Skills
            <span className="text-primary block">Mock Interviewer</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Evaluate Microsoft Excel proficiency with our intelligent AI interviewer. 
            Get comprehensive assessments for hiring decisions in data analytics, finance, and operations roles.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group" onClick={() => navigate('/auth')}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In to Start
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Target className="h-8 w-8 mx-auto text-primary" />
              <CardTitle className="text-lg">Targeted Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive question bank covering formulas, pivot tables, data analysis, and advanced functions
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Brain className="h-8 w-8 mx-auto text-primary" />
              <CardTitle className="text-lg">AI Evaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Intelligent scoring system that evaluates technical knowledge and practical application skills
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="h-8 w-8 mx-auto text-primary" />
              <CardTitle className="text-lg">Real-time Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Live progress tracking with instant feedback and adaptive questioning based on responses
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-8 w-8 mx-auto text-primary" />
              <CardTitle className="text-lg">Detailed Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive assessment reports with scoring breakdown and hiring recommendations
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assessment Process */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold">Start Interview</h3>
              <p className="text-muted-foreground">
                Begin with an AI introduction and overview of the assessment process
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold">Answer Questions</h3>
              <p className="text-muted-foreground">
                Respond to Excel-focused questions across multiple difficulty levels
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Get Results</h3>
              <p className="text-muted-foreground">
                Receive detailed scoring and recommendations for hiring decisions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;