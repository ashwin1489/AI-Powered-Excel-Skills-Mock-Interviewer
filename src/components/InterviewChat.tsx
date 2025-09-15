import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "./ChatMessage";
import { Send, Mic, MicOff } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

interface InterviewChatProps {
  onInterviewStart: () => void;
  onMessageSent: (message: string) => void;
  messages: Message[];
  isInterviewActive: boolean;
  showSummaryButton?: boolean;
  onShowSummary?: () => void;
  hasCompletedAssessment?: boolean;
  checkingPreviousAssessment?: boolean;
}

export const InterviewChat = ({ 
  onInterviewStart, 
  onMessageSent, 
  messages, 
  isInterviewActive,
  showSummaryButton = false,
  onShowSummary,
  hasCompletedAssessment = false,
  checkingPreviousAssessment = false
}: InterviewChatProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onMessageSent(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input functionality would be implemented here
  };

  if (!isInterviewActive) {
    if (checkingPreviousAssessment) {
      return (
        <Card className="p-8 text-center space-y-6 shadow-interview">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Loading...</h2>
            <p className="text-muted-foreground">
              Checking your assessment history...
            </p>
          </div>
        </Card>
      );
    }

    if (hasCompletedAssessment) {
      return (
        <Card className="p-8 text-center space-y-6 shadow-interview">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Assessment Already Completed</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              You have already completed this assessment. Each user can only take the Excel Skills Assessment once to ensure fairness and integrity.
            </p>
            <div className="p-4 bg-muted rounded-lg text-sm max-w-md mx-auto">
              <p className="text-muted-foreground">
                If you believe this is an error or need to retake the assessment for special circumstances, please contact the administrator.
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <div className="max-h-60 overflow-y-auto text-left bg-muted/50 rounded-lg p-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isBot={message.isBot}
                  timestamp={message.timestamp}
                />
              ))}
            </div>
          )}
        </Card>
      );
    }

    return (
      <Card className="p-8 text-center space-y-6 shadow-interview">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Welcome to Your Excel Skills Assessment</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            This AI-powered interview will assess your Microsoft Excel proficiency through a series of practical questions and scenarios.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-foreground mb-2">Duration</h3>
              <p className="text-muted-foreground">15-20 minutes</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-foreground mb-2">Topics Covered</h3>
              <p className="text-muted-foreground">Formulas, Analysis, Charts</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-foreground mb-2">Format</h3>
              <p className="text-muted-foreground">Conversational Q&A</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={onInterviewStart}
            className="bg-gradient-primary hover:bg-primary-hover text-white shadow-button px-8 py-3 text-lg font-medium"
            disabled={hasCompletedAssessment}
          >
            Start Assessment
          </Button>
          
          {showSummaryButton && onShowSummary && (
            <Button 
              onClick={onShowSummary}
              variant="outline"
              className="px-8 py-3 text-lg font-medium"
            >
              View Detailed Report
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-background">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isBot={message.isBot}
            timestamp={message.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex gap-3">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response here..."
              className="min-h-[80px] resize-none border-border focus:ring-primary"
              rows={3}
            />
            <div className="flex flex-col gap-2">
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-primary hover:bg-primary-hover text-white shadow-button h-10"
              >
                <Send className="w-4 h-4" />
              </Button>
              <Button
                onClick={toggleVoiceInput}
                variant="outline"
                className={`h-10 ${isListening ? 'bg-destructive text-destructive-foreground' : ''}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};