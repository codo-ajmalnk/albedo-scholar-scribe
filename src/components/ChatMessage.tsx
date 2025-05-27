
import { Bot, User, FileDown, Copy, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  subject?: string;
  hasImage?: boolean;
}

interface ChatMessageProps {
  message: Message;
  onGeneratePDF: (content: string) => void;
}

const ChatMessage = ({ message, onGeneratePDF }: ChatMessageProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <Card className={`max-w-[80%] p-4 ${
        isUser 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-300' 
          : 'bg-white border-blue-200 shadow-sm'
      }`}>
        <div className="flex items-start space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isUser 
              ? 'bg-white/20' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}>
            {isUser ? (
              <User className={`w-4 h-4 ${isUser ? 'text-white' : 'text-blue-600'}`} />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-sm font-medium ${
                isUser ? 'text-white/90' : 'text-gray-700'
              }`}>
                {isUser ? 'You' : 'Albedo'}
              </span>
              {message.subject && !isUser && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                  {message.subject}
                </Badge>
              )}
              <span className={`text-xs ${
                isUser ? 'text-white/70' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className={`text-sm leading-relaxed ${
              isUser ? 'text-white' : 'text-gray-800'
            }`}>
              {message.content.split('\n').map((line, index) => (
                <div key={index}>
                  {line}
                  {index < message.content.split('\n').length - 1 && <br />}
                </div>
              ))}
            </div>

            {message.hasImage && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                <span className="text-xs text-blue-600">📷 Image attached</span>
              </div>
            )}
            
            {!isUser && (
              <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="text-gray-600 hover:text-gray-800 h-8"
                >
                  {isCopied ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <Copy className="w-3 h-3 mr-1" />
                  )}
                  {isCopied ? 'Copied!' : 'Copy'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onGeneratePDF(message.content)}
                  className="text-gray-600 hover:text-gray-800 h-8"
                >
                  <FileDown className="w-3 h-3 mr-1" />
                  PDF
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatMessage;
