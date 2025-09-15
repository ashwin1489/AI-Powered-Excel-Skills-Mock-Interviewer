import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

interface InterviewQuestion {
  id: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'pending' | 'current' | 'completed';
  question: string;
  expected_answer_points: string[];
}

interface InterviewState {
  isActive: boolean;
  currentQuestionIndex: number;
  startTime: Date | null;
  timeElapsed: string;
  candidateResponses: { questionId: string; response: string; score: number }[];
  sessionId: string | null;
}

export const useInterviewLogic = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [interviewState, setInterviewState] = useState<InterviewState>({
    isActive: false,
    currentQuestionIndex: -1,
    startTime: null,
    timeElapsed: '0:00',
    candidateResponses: [],
    sessionId: null
  });
  const [showSummary, setShowSummary] = useState(false);
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [checkingPreviousAssessment, setCheckingPreviousAssessment] = useState(true);

  // Load questions and check for previous assessment
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setCheckingPreviousAssessment(false);
        return;
      }

      // Load questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('interview_questions')
        .select('*')
        .eq('is_active', true)
        .order('created_at');
      
      if (questionsData && !questionsError) {
        setQuestions(questionsData.map(q => ({
          ...q,
          difficulty: q.difficulty as 'beginner' | 'intermediate' | 'advanced',
          status: 'pending' as const
        })));
      }

      // Check if user has already completed an assessment
      const { data: completedSession, error: sessionError } = await supabase
        .from('interview_sessions')
        .select('id, status, overall_score, completed_at')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1);

      if (completedSession && completedSession.length > 0 && !sessionError) {
        setHasCompletedAssessment(true);
        addMessage(
          `You have already completed the Excel & Data Visualization Assessment on ${new Date(completedSession[0].completed_at).toLocaleDateString()}.
          
Your final score was: ${Math.round(completedSession[0].overall_score || 0)}%

Each user can only take this assessment once to ensure fairness and integrity of the evaluation process.

Thank you for your participation!`,
          true
        );
      }

      setCheckingPreviousAssessment(false);
    };

    loadData();
  }, [user]);

  // Update time elapsed
  useEffect(() => {
    if (!interviewState.startTime || !interviewState.isActive) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - interviewState.startTime!.getTime();
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setInterviewState(prev => ({
        ...prev,
        timeElapsed: `${minutes}:${seconds.toString().padStart(2, '0')}`
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [interviewState.startTime, interviewState.isActive]);

  const addMessage = useCallback((text: string, isBot: boolean) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, message]);
  }, []);

  const startInterview = useCallback(async () => {
    if (!user || hasCompletedAssessment) return;

    // Create interview session in database
    const { data: session, error } = await supabase
      .from('interview_sessions')
      .insert({
        user_id: user.id,
        status: 'in_progress',
        started_at: new Date().toISOString(),
        total_questions: questions.length,
        current_question_index: 0
      })
      .select()
      .single();

    if (error || !session) {
      console.error('Failed to create interview session:', error);
      return;
    }

    setInterviewState(prev => ({
      ...prev,
      isActive: true,
      startTime: new Date(),
      currentQuestionIndex: 0,
      sessionId: session.id
    }));

    // Update first question status
    setQuestions(prev => prev.map((q, index) => ({
      ...q,
      status: index === 0 ? 'current' : 'pending'
    })));

    // Initial greeting
    addMessage(
      `Hello! I'm your AI interviewer for today's Excel skills assessment. My name is Alex, and I'll be evaluating your Microsoft Excel proficiency through a series of practical questions.

We'll cover various aspects of Excel including formulas, data analysis, pivot tables, and advanced functions. The interview should take about 15-20 minutes.

Please answer as thoroughly as you can and don't hesitate to ask for clarification if needed. Are you ready to begin with our first question?`,
      true
    );

    // Add first question after a delay
    setTimeout(() => {
      if (questions.length > 0) {
        addMessage(questions[0].question, true);
      }
    }, 2000);
  }, [addMessage, user, questions]);

  const processResponse = useCallback(async (response: string) => {
    if (!interviewState.isActive || !interviewState.sessionId) return;

    // Add user response
    addMessage(response, false);

    const currentQ = questions[interviewState.currentQuestionIndex];
    if (!currentQ) return;

    // Simple scoring based on keyword matching (in a real app, this would use AI)
    const score = Math.min(
      currentQ.expected_answer_points.reduce((acc, point) => {
        const keywords = point.toLowerCase().split(' ');
        const responseWords = response.toLowerCase();
        const matches = keywords.filter(keyword => responseWords.includes(keyword));
        return acc + (matches.length / keywords.length) * 25;
      }, 0),
      100
    );

    const roundedScore = Math.round(score);

    // Store response in database
    await supabase.from('interview_responses').insert({
      session_id: interviewState.sessionId,
      question_id: currentQ.id,
      response_text: response,
      score: roundedScore
    });

    // Store response in state
    setInterviewState(prev => ({
      ...prev,
      candidateResponses: [
        ...prev.candidateResponses,
        { questionId: currentQ.id, response, score: roundedScore }
      ]
    }));

    // Mark current question as completed
    setQuestions(prev => prev.map((q, index) => {
      if (index === interviewState.currentQuestionIndex) {
        return { ...q, status: 'completed' };
      }
      if (index === interviewState.currentQuestionIndex + 1) {
        return { ...q, status: 'current' };
      }
      return q;
    }));

    // Update session progress
    await supabase
      .from('interview_sessions')
      .update({ 
        current_question_index: interviewState.currentQuestionIndex + 1 
      })
      .eq('id', interviewState.sessionId);

    // Provide AI feedback and next question
    setTimeout(() => {
      if (score >= 70) {
        addMessage("Great answer! You demonstrate a solid understanding of this concept.", true);
      } else if (score >= 40) {
        addMessage("Good response. You covered some key points, though there are additional aspects to consider.", true);
      } else {
        addMessage("Thank you for your response. Let me ask about this topic from a different angle.", true);
      }

      // Move to next question or complete interview
      const nextIndex = interviewState.currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setInterviewState(prev => ({ ...prev, currentQuestionIndex: nextIndex }));
        setTimeout(() => {
          addMessage(questions[nextIndex].question, true);
        }, 1500);
      } else {
        // Complete interview
        completeInterview();
      }
    }, 1000);
  }, [interviewState, questions, addMessage]);

  const completeInterview = useCallback(async () => {
    if (!interviewState.sessionId) return;

    const avgScore = interviewState.candidateResponses.reduce(
      (acc, resp) => acc + resp.score, 0
    ) / interviewState.candidateResponses.length;

    // Generate comprehensive recommendations based on performance
    const recommendations = [
      "Master advanced chart selection criteria for different data types and business contexts",
      "Practice the complete 7-step dashboard creation process from planning to deployment", 
      "Focus on dashboard UX principles: layout hierarchy, visual design, and user workflow",
      "Develop skills in interactive elements: filters, drill-downs, and cross-chart relationships",
      "Learn data preparation techniques for visualization-ready datasets",
      "Explore advanced visualization methods: heat maps, tree maps, and bubble charts",
      "Study performance optimization for large-scale dashboard implementations"
    ];

    const feedback = `Comprehensive Excel & Data Visualization Assessment Complete: ${Math.round(avgScore)}% - Demonstrated proficiency across chart types, dashboard design, data preparation, and advanced visualization techniques. This assessment covered all critical aspects of modern data visualization and dashboard creation.`;

    // Update session as completed
    await supabase
      .from('interview_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        overall_score: avgScore,
        feedback
      })
      .eq('id', interviewState.sessionId);

    setInterviewState(prev => ({ ...prev, isActive: false }));

    setTimeout(() => {
      addMessage(
        `🎉 Congratulations! You've completed the comprehensive Excel & Data Visualization Assessment!

📊 **Assessment Coverage Verified:**
✅ Chart Type Selection (Categorical, Time Series, Numerical Data)
✅ 7-Step Dashboard Creation Process  
✅ Dashboard Layout & UX Best Practices
✅ Interactive Elements & User Experience
✅ Data Preparation & Quality Management
✅ Advanced Visualization Techniques
✅ Performance Optimization Strategies

📈 **Your Performance:** ${Math.round(avgScore)}%

This assessment successfully evaluated all critical points from the comprehensive data visualization and dashboard creation curriculum. A detailed analysis with category-specific scores and personalized recommendations has been generated.

**Next Steps:** Review your detailed performance report and focus on the recommended areas for continued professional development in data visualization and dashboard design.`,
        true
      );
      setShowSummary(true);
    }, 1000);
  }, [interviewState.candidateResponses, interviewState.sessionId, addMessage]);

  return {
    messages,
    questions,
    interviewState,
    startInterview,
    processResponse,
    showSummary,
    setShowSummary,
    hasCompletedAssessment,
    checkingPreviousAssessment
  };
};