
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { supabase } from '@/integrations/supabase/client';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  files?: File[];
  feedback?: 'positive' | 'negative';
  isResearch?: boolean;
}

export const useMessageHandling = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const { toast } = useToast();
  const { checkLimit, incrementUsage } = useUsageTracking();

  const sendMessage = useCallback(async (content: string, files?: File[], isResearch = false) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    // Check usage limits
    if (isResearch) {
      const canResearch = await checkLimit('deep_research');
      if (!canResearch) return;
    } else {
      const canChat = await checkLimit('chat');
      if (!canChat) return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      files,
      isResearch,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Increment usage
      if (isResearch) {
        await incrementUsage('deep_research');
      } else {
        await incrementUsage('chat');
      }

      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message: content,
          files: files?.map(f => f.name) || [],
          isResearch,
          context: isResearch ? 'deep_research' : 'chat',
        },
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Sorry, I could not process your request.',
        sender: 'ai',
        timestamp: new Date(),
        isResearch,
      };

      setMessages(prev => [...prev, aiMessage]);

      if (isResearch) {
        toast({
          title: "Research Complete! 🔍",
          description: "Deep research analysis has been generated.",
        });
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [checkLimit, incrementUsage, toast]);

  const editMessage = useCallback((messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, content: newContent } : msg
    ));
    setEditingMessageId(null);
  }, []);

  const regenerateResponse = useCallback(async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const userMessage = messages[messageIndex - 1];
    if (!userMessage) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          message: userMessage.content,
          isResearch: userMessage.isResearch,
          context: userMessage.isResearch ? 'deep_research' : 'chat',
        },
      });

      if (error) throw error;

      const newResponse: Message = {
        ...messages[messageIndex],
        content: data.response || 'Sorry, I could not process your request.',
        timestamp: new Date(),
      };

      setMessages(prev => prev.map((msg, index) => 
        index === messageIndex ? newResponse : msg
      ));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to regenerate response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, toast]);

  const setMessageFeedback = useCallback((messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ));
  }, []);

  const loadMessages = useCallback((loadedMessages: Message[]) => {
    setMessages(loadedMessages);
  }, []);

  return {
    messages,
    isLoading,
    editingMessageId,
    setEditingMessageId,
    sendMessage,
    editMessage,
    regenerateResponse,
    setMessageFeedback,
    loadMessages,
  };
};
