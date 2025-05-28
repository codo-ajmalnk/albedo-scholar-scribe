
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  subject?: string;
  hasImage?: boolean;
  isEdited?: boolean;
}

export const useMessageHandling = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const { toast } = useToast();

  const detectSubject = (message: string): string => {
    const keywords = {
      'Mathematics': ['math', 'calculate', 'equation', 'algebra', 'geometry', 'trigonometry', 'calculus', 'number', 'formula', 'solve', 'derivative', 'integral'],
      'Science': ['science', 'physics', 'chemistry', 'biology', 'experiment', 'molecule', 'atom', 'cell', 'photosynthesis', 'reaction', 'force', 'energy'],
      'English': ['grammar', 'essay', 'literature', 'poem', 'writing', 'sentence', 'paragraph', 'story', 'author', 'novel', 'verb', 'noun'],
      'Computer Science': ['programming', 'code', 'algorithm', 'computer', 'software', 'python', 'javascript', 'html', 'css', 'database', 'api'],
      'Social Science': ['history', 'geography', 'civics', 'politics', 'society', 'culture', 'economics', 'democracy', 'constitution', 'government'],
      'General Knowledge': ['gk', 'general', 'current affairs', 'quiz', 'facts', 'trivia', 'world', 'country', 'capital', 'president']
    };

    const lowerMessage = message.toLowerCase();
    for (const [subject, words] of Object.entries(keywords)) {
      if (words.some(word => lowerMessage.includes(word))) {
        return subject;
      }
    }
    return 'General';
  };

  const getAIResponse = async (userMessage: string, conversationHistory: Message[]): Promise<string> => {
    try {
      console.log('Calling OpenAI API via Supabase function...');
      
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message: userMessage,
          conversationHistory: conversationHistory
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function call failed: ${error.message}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'AI response failed');
      }

      return data.response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback response
      return `I apologize, but I'm having trouble connecting to my AI brain right now! 🤖💭 

This might be a temporary issue. Here's what I can suggest:
• Check your internet connection
• Try your question again in a moment
• Make sure the OpenAI API key is properly configured

In the meantime, feel free to try rephrasing your question or ask something else! I'm here to help with:
📘 Mathematics & Science
📚 English & Literature  
🌍 Social Studies & History
💻 Computer Science
🧠 General Knowledge

Would you like to try asking your question again? ✨`;
    }
  };

  const sendMessage = async (inputMessage: string, uploadedFiles: File[]) => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage || `Uploaded ${uploadedFiles.length} file(s)`,
      timestamp: new Date(),
      hasImage: uploadedFiles.length > 0
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponseContent = await getAIResponse(inputMessage, messages);
      const subject = detectSubject(inputMessage);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponseContent,
        timestamp: new Date(),
        subject
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editMessage = async (messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: newContent, isEdited: true }
        : msg
    ));
    
    const editedMessage = messages.find(msg => msg.id === messageId);
    if (editedMessage?.type === 'user') {
      setIsLoading(true);
      try {
        const aiResponseContent = await getAIResponse(newContent, messages);
        const subject = detectSubject(newContent);
        
        const aiResponse: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: aiResponseContent,
          timestamp: new Date(),
          subject
        };
        
        setMessages(prev => [...prev, aiResponse]);
      } catch (error) {
        console.error('Error in editMessage:', error);
        toast({
          title: "Error",
          description: "Failed to get AI response for edited message.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    setEditingMessageId(null);
    toast({
      title: "Message updated! ✅",
      description: "Your message has been edited successfully."
    });
  };

  return {
    messages,
    isLoading,
    editingMessageId,
    setEditingMessageId,
    sendMessage,
    editMessage
  };
};
