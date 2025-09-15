import React from 'react';
import { InterviewHeader } from '@/components/InterviewHeader';
import { InterviewSidebar } from '@/components/InterviewSidebar';
import { InterviewChat } from '@/components/InterviewChat';
import { InterviewSummary } from '@/components/InterviewSummary';
import { useInterviewLogic } from '@/hooks/useInterviewLogic';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';

const InterviewPage = () => {
  const { 
    messages, 
    questions, 
    interviewState, 
    startInterview, 
    processResponse, 
    showSummary, 
    setShowSummary,
    hasCompletedAssessment,
    checkingPreviousAssessment
  } = useInterviewLogic();

  // Generate summary data when showing summary
  const summaryData = showSummary ? {
    overallScore: interviewState.candidateResponses.reduce((acc, resp) => acc + resp.score, 0) / interviewState.candidateResponses.length,
    responses: interviewState.candidateResponses.map(resp => ({
      ...resp,
      category: questions.find(q => q.id === resp.questionId)?.category || 'Unknown'
    })),
    recommendations: [
      "Master advanced chart selection criteria for different data types and business contexts",
      "Practice the complete 7-step dashboard creation process from planning to deployment", 
      "Focus on dashboard UX principles: layout hierarchy, visual design, and user workflow",
      "Develop skills in interactive elements: filters, drill-downs, and cross-chart relationships",
      "Learn data preparation techniques for visualization-ready datasets",
      "Explore advanced visualization methods: heat maps, tree maps, and bubble charts",
      "Study performance optimization for large-scale dashboard implementations"
    ]
  } : null;

  if (showSummary && summaryData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
          <InterviewHeader 
            interviewState={interviewState}
            onStartInterview={startInterview}
          />
          
          <div className="container mx-auto p-4">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground">Assessment Complete</h1>
                <Button 
                  onClick={() => setShowSummary(false)}
                  variant="outline"
                >
                  Back to Chat
                </Button>
              </div>
              
              <InterviewSummary {...summaryData} />
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
        <InterviewHeader 
          interviewState={interviewState}
          onStartInterview={startInterview}
        />
        
        <div className="container mx-auto p-4 h-[calc(100vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
            <div className="lg:col-span-1">
              <InterviewSidebar 
                questions={questions}
                totalQuestions={questions.length}
                timeElapsed={interviewState.timeElapsed}
                currentQuestion={interviewState.currentQuestionIndex + 1}
              />
            </div>
            
            <div className="lg:col-span-3">
              <InterviewChat 
                messages={messages}
                onMessageSent={processResponse}
                onInterviewStart={startInterview}
                isInterviewActive={interviewState.isActive}
                showSummaryButton={!interviewState.isActive && interviewState.candidateResponses.length > 0}
                onShowSummary={() => setShowSummary(true)}
                hasCompletedAssessment={hasCompletedAssessment}
                checkingPreviousAssessment={checkingPreviousAssessment}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default InterviewPage;