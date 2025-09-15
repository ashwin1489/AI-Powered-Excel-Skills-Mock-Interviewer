import { useState, useCallback, useEffect } from 'react';

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
  expectedAnswerPoints: string[];
}

interface InterviewState {
  isActive: boolean;
  currentQuestionIndex: number;
  startTime: Date | null;
  timeElapsed: string;
  candidateResponses: { questionId: string; response: string; score: number }[];
}

// Mock Excel interview questions
const EXCEL_QUESTIONS: InterviewQuestion[] = [
  {
    id: '1',
    category: 'Basic Formulas',
    difficulty: 'beginner',
    status: 'pending',
    question: 'Can you explain the difference between relative and absolute cell references in Excel? When would you use each type?',
    expectedAnswerPoints: ['Relative references change when copied', 'Absolute references stay fixed', 'Use $ symbol for absolute', 'Examples of use cases']
  },
  {
    id: '2',
    category: 'Data Analysis',
    difficulty: 'intermediate',
    status: 'pending',
    question: 'Walk me through how you would use VLOOKUP to find customer information from a large dataset. What are some limitations of VLOOKUP?',
    expectedAnswerPoints: ['VLOOKUP syntax', 'Table array concept', 'Column index number', 'Exact/approximate match', 'Limitations: left to right only', 'Alternative: INDEX-MATCH']
  },
  {
    id: '3',
    category: 'Pivot Tables',
    difficulty: 'intermediate',
    status: 'pending',
    question: 'Describe how you would create a pivot table to analyze sales data by region and product category. What insights could this provide?',
    expectedAnswerPoints: ['Data preparation', 'Creating pivot table', 'Rows, columns, values setup', 'Filtering options', 'Business insights', 'Drill-down capabilities']
  },
  {
    id: '4',
    category: 'Advanced Functions',
    difficulty: 'advanced',
    status: 'pending',
    question: 'How would you use array formulas or dynamic arrays to solve complex data problems? Can you give me an example scenario?',
    expectedAnswerPoints: ['Array formula concept', 'Dynamic arrays in Excel 365', 'FILTER, SORT, UNIQUE functions', 'Practical examples', 'Performance considerations']
  },
  {
    id: '5',
    category: 'Chart Creation',
    difficulty: 'intermediate',
    status: 'pending',
    question: 'What factors do you consider when choosing the right chart type for data visualization? Can you walk through creating a dashboard?',
    expectedAnswerPoints: ['Chart type selection criteria', 'Data story telling', 'Dashboard design principles', 'Interactive elements', 'Best practices for clarity']
  }
];

export const useInterviewLogic = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<InterviewQuestion[]>(EXCEL_QUESTIONS);
  const [interviewState, setInterviewState] = useState<InterviewState>({
    isActive: false,
    currentQuestionIndex: -1,
    startTime: null,
    timeElapsed: '0:00',
    candidateResponses: []
  });

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

  const startInterview = useCallback(() => {
    setInterviewState(prev => ({
      ...prev,
      isActive: true,
      startTime: new Date(),
      currentQuestionIndex: 0
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
      addMessage(EXCEL_QUESTIONS[0].question, true);
    }, 2000);
  }, [addMessage]);

  const processResponse = useCallback((response: string) => {
    if (!interviewState.isActive) return;

    // Add user response
    addMessage(response, false);

    const currentQ = questions[interviewState.currentQuestionIndex];
    if (!currentQ) return;

    // Simple scoring based on keyword matching (in a real app, this would use AI)
    const score = Math.min(
      currentQ.expectedAnswerPoints.reduce((acc, point) => {
        const keywords = point.toLowerCase().split(' ');
        const responseWords = response.toLowerCase();
        const matches = keywords.filter(keyword => responseWords.includes(keyword));
        return acc + (matches.length / keywords.length) * 25;
      }, 0),
      100
    );

    // Store response
    setInterviewState(prev => ({
      ...prev,
      candidateResponses: [
        ...prev.candidateResponses,
        { questionId: currentQ.id, response, score: Math.round(score) }
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
      if (nextIndex < EXCEL_QUESTIONS.length) {
        setInterviewState(prev => ({ ...prev, currentQuestionIndex: nextIndex }));
        setTimeout(() => {
          addMessage(EXCEL_QUESTIONS[nextIndex].question, true);
        }, 1500);
      } else {
        // Complete interview
        completeInterview();
      }
    }, 1000);
  }, [interviewState, questions, addMessage]);

  const completeInterview = useCallback(() => {
    setInterviewState(prev => ({ ...prev, isActive: false }));
    
    const avgScore = interviewState.candidateResponses.reduce(
      (acc, resp) => acc + resp.score, 0
    ) / interviewState.candidateResponses.length;

    setTimeout(() => {
      addMessage(
        `Thank you for completing the Excel skills assessment! 

Based on your responses, here's a brief summary:
• Overall Performance: ${Math.round(avgScore)}%
• Strengths: You showed good understanding of basic concepts
• Areas for improvement: Consider exploring more advanced functions and data analysis techniques

A detailed report will be generated for the hiring team. Thank you for your time!`,
        true
      );
    }, 1000);
  }, [interviewState.candidateResponses, addMessage]);

  return {
    messages,
    questions,
    interviewState,
    startInterview,
    processResponse
  };
};