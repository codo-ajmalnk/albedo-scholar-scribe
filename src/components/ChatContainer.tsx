
import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 mb-4">
      {messages.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <div className="space-y-2 p-2">
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
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};

export default ChatContainer;
