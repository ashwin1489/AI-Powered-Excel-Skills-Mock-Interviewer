import React from 'react';
import { InterviewHeader } from '@/components/InterviewHeader';
import { InterviewSidebar } from '@/components/InterviewSidebar';
import { InterviewChat } from '@/components/InterviewChat';
import { useInterviewLogic } from '@/hooks/useInterviewLogic';
import ProtectedRoute from '@/components/ProtectedRoute';

const InterviewPage = () => {
  const { messages, questions, interviewState, startInterview, processResponse } = useInterviewLogic();

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
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default InterviewPage;