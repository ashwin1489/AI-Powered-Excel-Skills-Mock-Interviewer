import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: string;
}

export const ChatMessage = ({ message, isBot, timestamp }: ChatMessageProps) => {
  return (
    <div className={`flex gap-4 p-4 ${isBot ? 'bg-muted/30' : ''}`}>
      <Avatar className={`w-8 h-8 ${isBot ? 'bg-gradient-primary' : 'bg-secondary'}`}>
        <AvatarFallback className={isBot ? 'text-white' : 'text-secondary-foreground'}>
          {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {isBot ? 'AI Interviewer' : 'You'}
          </span>
          {timestamp && (
            <span className="text-xs text-muted-foreground">{timestamp}</span>
          )}
        </div>
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {message}
        </div>
      </div>
    </div>
  );
};