import { InterviewHeader } from "@/components/InterviewHeader";
import { InterviewChat } from "@/components/InterviewChat";
import { InterviewSidebar } from "@/components/InterviewSidebar";
import { useInterviewLogic } from "@/hooks/useInterviewLogic";

const InterviewPage = () => {
  const {
    messages,
    questions,
    interviewState,
    startInterview,
    processResponse
  } = useInterviewLogic();

  const getInterviewStatus = () => {
    if (!interviewState.isActive && interviewState.currentQuestionIndex === -1) {
      return 'waiting';
    }
    if (interviewState.isActive) {
      return 'in-progress';
    }
    return 'completed';
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      <InterviewHeader
        status={getInterviewStatus()}
        duration={interviewState.timeElapsed}
      />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <InterviewSidebar
              currentQuestion={interviewState.currentQuestionIndex + 1}
              totalQuestions={questions.length}
              timeElapsed={interviewState.timeElapsed}
              questions={questions}
            />
          </div>
          
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg shadow-interview h-full">
              <InterviewChat
                onInterviewStart={startInterview}
                onMessageSent={processResponse}
                messages={messages}
                isInterviewActive={interviewState.isActive || messages.length > 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;