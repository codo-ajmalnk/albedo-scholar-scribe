
import { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import ChatMessage from '@/components/ChatMessage';
import WelcomeScreen from '@/components/WelcomeScreen';
import { Message } from '@/hooks/useMessageHandling';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  editingMessageId: string | null;
  onGeneratePDF: (content: string) => void;
  onSpeakText: (text: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onStartEdit: (messageId: string) => void;
}

const ChatContainer = ({
  messages,
  isLoading,
  editingMessageId,
  onGeneratePDF,
  onSpeakText,
  onEditMessage,
  onStartEdit
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="flex-1 mb-4">
      {messages.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message} 
              onGeneratePDF={onGeneratePDF}
              onSpeakText={onSpeakText}
              onEditMessage={onEditMessage}
              isEditing={editingMessageId === message.id}
              onStartEdit={onStartEdit}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <Card className="max-w-xs p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-sm">
                <div className="flex items-center space-x-3">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-700">Albedo is thinking...</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export default ChatContainer;
