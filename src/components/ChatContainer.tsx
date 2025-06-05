
import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import WelcomeScreen from '@/components/WelcomeScreen';
import TypingIndicator from '@/components/TypingIndicator';
import { Message } from '@/hooks/useMessageHandling';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  editingMessageId: string | null;
  onGeneratePDF: (content: string) => void;
  onSpeakText: (text: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onRegenerateResponse: (messageId: string) => void;
  onFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
  onStartEdit: (messageId: string) => void;
  onBackToHome: () => void;
}

const ChatContainer = ({
  messages,
  isLoading,
  editingMessageId,
  onGeneratePDF,
  onSpeakText,
  onEditMessage,
  onRegenerateResponse,
  onFeedback,
  onStartEdit,
  onBackToHome
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col border-2 border-blue-200 rounded-lg bg-white/50">
      {/* Header with back button when there are messages */}
      {messages.length > 0 && (
        <div className="flex items-center p-3 border-b border-blue-200 bg-white/80">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToHome}
            className="mr-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Home
          </Button>
          <h3 className="text-sm font-medium text-gray-700">Chat with Albedo</h3>
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <div className="space-y-1">
            {messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onGeneratePDF={onGeneratePDF}
                onSpeakText={onSpeakText}
                onEditMessage={onEditMessage}
                onRegenerateResponse={onRegenerateResponse}
                onFeedback={onFeedback}
                isEditing={editingMessageId === message.id}
                onStartEdit={onStartEdit}
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ChatContainer;
