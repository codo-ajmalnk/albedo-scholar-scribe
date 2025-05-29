
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
  feedback?: 'like' | 'dislike' | null;
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

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const getAIResponse = async (userMessage: string, conversationHistory: Message[], uploadedFiles?: File[]): Promise<string> => {
    try {
      console.log('Calling Albedo AI via Supabase function...');
      
      let imageData = null;
      let hasImage = false;

      // Handle image upload
      if (uploadedFiles && uploadedFiles.length > 0) {
        try {
          imageData = await convertImageToBase64(uploadedFiles[0]);
          hasImage = true;
          console.log('Image converted to base64 for processing');
        } catch (error) {
          console.error('Error converting image:', error);
        }
      }

      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message: userMessage,
          conversationHistory: conversationHistory,
          hasImage,
          imageData
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
      
      // Enhanced fallback response for Albedo
      return `I apologize, but I'm having trouble connecting to my knowledge base right now! 🤖📚

This might be a temporary issue. Here's what you can try:
• Check your internet connection
• Try your question again in a moment
• Make sure the OpenAI API key is properly configured

**Study Tip:** While we wait, remember that breaking big problems into smaller steps always helps! ✨

I'm here to help with:
📘 Mathematics & Science
📚 English & Literature  
🌍 Social Studies & History
💻 Computer Science
🧠 General Knowledge & Study Skills

Which grade or class is this for? Once I'm back online, I'll provide age-appropriate explanations! 🎯`;
    }
  };

  const sendMessage = async (inputMessage: string, uploadedFiles: File[]) => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage || `Uploaded ${uploadedFiles.length} image(s) for analysis`,
      timestamp: new Date(),
      hasImage: uploadedFiles.length > 0
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponseContent = await getAIResponse(inputMessage, messages, uploadedFiles);
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
    // Update the user message
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: newContent, isEdited: true }
        : msg
    ));
    
    const editedMessage = messages.find(msg => msg.id === messageId);
    if (editedMessage?.type === 'user') {
      // Remove all messages after the edited message
      const messageIndex = messages.findIndex(msg => msg.id === messageId);
      setMessages(prev => prev.slice(0, messageIndex + 1));
      
      setIsLoading(true);
      try {
        const aiResponseContent = await getAIResponse(newContent, messages.slice(0, messageIndex));
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

  const regenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || messages[messageIndex].type !== 'assistant') return;
    
    // Find the user message that prompted this response
    const userMessageIndex = messageIndex - 1;
    if (userMessageIndex < 0 || messages[userMessageIndex].type !== 'user') return;
    
    const userMessage = messages[userMessageIndex];
    const conversationHistory = messages.slice(0, userMessageIndex);
    
    setIsLoading(true);
    try {
      const aiResponseContent = await getAIResponse(userMessage.content, conversationHistory);
      const subject = detectSubject(userMessage.content);
      
      const newResponse: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: aiResponseContent,
        timestamp: new Date(),
        subject
      };
      
      // Replace the old response with the new one
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? newResponse : msg
      ));
    } catch (error) {
      console.error('Error in regenerateResponse:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setMessageFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, feedback: msg.feedback === feedback ? null : feedback }
        : msg
    ));
  };

  const loadMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
  };

  return {
    messages,
    isLoading,
    editingMessageId,
    setEditingMessageId,
    sendMessage,
    editMessage,
    regenerateResponse,
    setMessageFeedback,
    loadMessages
  };
};
