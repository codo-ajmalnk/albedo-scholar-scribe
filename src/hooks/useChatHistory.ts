
import { useState, useEffect } from 'react';
import { Message } from './useMessageHandling';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
}

export const useChatHistory = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('albedo-chat-history');
    if (savedChats) {
      try {
        const parsed = JSON.parse(savedChats).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt)
        }));
        setChatSessions(parsed);
        if (parsed.length > 0 && !currentChatId) {
          setCurrentChatId(parsed[0].id);
        }
      } catch (error) {
        console.error('Error parsing chat history:', error);
        localStorage.removeItem('albedo-chat-history');
      }
    }
  }, []);

  // Save to localStorage when sessions change
  useEffect(() => {
    localStorage.setItem('albedo-chat-history', JSON.stringify(chatSessions));
  }, [chatSessions]);

  const createNewChat = () => {
    const now = new Date();
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: `Chat ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      messages: [],
      createdAt: now,
      updatedAt: now,
      messageCount: 0
    };
    
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };

  const updateChatMessages = (chatId: string, messages: Message[]) => {
    setChatSessions(prev => prev.map(chat => 
      chat.id === chatId 
        ? { 
            ...chat, 
            messages, 
            title: messages.length > 0 ? 
              `${messages[0].content.slice(0, 25)}... (${messages.length})` : 
              `Chat ${chat.createdAt.toLocaleDateString()}`,
            updatedAt: new Date(),
            messageCount: messages.length
          }
        : chat
    ));
  };

  const getCurrentChat = () => {
    return chatSessions.find(chat => chat.id === currentChatId);
  };

  const deleteChat = (chatId: string) => {
    setChatSessions(prev => {
      const filtered = prev.filter(chat => chat.id !== chatId);
      // Update localStorage immediately
      localStorage.setItem('albedo-chat-history', JSON.stringify(filtered));
      return filtered;
    });
    
    if (currentChatId === chatId) {
      const remaining = chatSessions.filter(chat => chat.id !== chatId);
      setCurrentChatId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  return {
    chatSessions,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    updateChatMessages,
    getCurrentChat,
    deleteChat
  };
};
