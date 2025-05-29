
import { Plus, MessageSquare, Trash2, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChatSession } from '@/hooks/useChatHistory';
import { useState } from 'react';

interface ChatSidebarProps {
  chatSessions: ChatSession[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

const ChatSidebar = ({
  chatSessions,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat
}: ChatSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return new Date(date).toLocaleDateString();
  };

  const groupedChats = chatSessions.reduce((groups, chat) => {
    const dateGroup = formatDate(chat.updatedAt);
    if (!groups[dateGroup]) groups[dateGroup] = [];
    groups[dateGroup].push(chat);
    return groups;
  }, {} as Record<string, ChatSession[]>);

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative left-0 top-0 h-full w-80 bg-gray-900 text-white z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-700">
          <Button
            onClick={onNewChat}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(groupedChats).map(([dateGroup, chats]) => (
            <div key={dateGroup}>
              <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                {dateGroup}
              </h3>
              <div className="space-y-1">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      currentChatId === chat.id 
                        ? 'bg-green-600 text-white' 
                        : 'hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      onSelectChat(chat.id);
                      setIsOpen(false);
                    }}
                  >
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-sm truncate">{chat.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
