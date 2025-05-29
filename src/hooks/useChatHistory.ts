
import { useState, useEffect } from 'react';
import { Message } from './useMessageHandling';

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export const useChatHistory = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('albedo-chat-history');
    if (savedChats) {
      const parsed = JSON.parse(savedChats);
      setChatSessions(parsed);
      if (parsed.length > 0) {
        setCurrentChatId(parsed[0].id);
      }
    }
  }, []);

  // Save to localStorage when sessions change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('albedo-chat-history', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
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
            title: messages.length > 0 ? messages[0].content.slice(0, 30) + '...' : 'New Chat',
            updatedAt: new Date() 
          }
        : chat
    ));
  };

  const getCurrentChat = () => {
    return chatSessions.find(chat => chat.id === currentChatId);
  };

  const deleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
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
