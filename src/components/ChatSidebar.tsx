
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { MessageSquare, Plus, Trash2, ChevronLeft, ChevronRight, Edit2, Check, X } from 'lucide-react';
import { ChatSession } from '@/hooks/useChatHistory';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ChatSidebarProps {
  chatSessions: ChatSession[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat?: (chatId: string, newTitle: string) => void;
}

const ChatSidebar = ({
  chatSessions,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onRenameChat
}: ChatSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const truncateTitle = (title: string, maxLength: number = 30) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + '...';
  };

  const handleStartEdit = (chat: ChatSession) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = () => {
    if (editingChatId && onRenameChat && editTitle.trim()) {
      onRenameChat(editingChatId, editTitle.trim());
    }
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditTitle('');
  };

  // Calculate dynamic height based on chat count
  const getChatContainerHeight = () => {
    const baseHeight = 120; // Minimum height
    const chatHeight = 80; // Height per chat
    const maxHeight = 400; // Maximum height
    const calculatedHeight = baseHeight + (chatSessions.length * chatHeight);
    return Math.min(calculatedHeight, maxHeight);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gradient-to-br from-green-100 via-blue-50 to-green-50 border-r-2 border-blue-300 flex flex-col h-full">
        <div className="p-2 border-b-2 border-blue-300">
          <Button
            onClick={() => setIsCollapsed(false)}
            size="sm"
            variant="ghost"
            className="w-full p-2 hover:bg-blue-100/50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-2">
          <Button
            onClick={onNewChat}
            size="sm"
            variant="ghost"
            className="w-full p-2 hover:bg-blue-100/50 border-2 border-blue-400"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-64 bg-gradient-to-br from-green-100 via-blue-50 to-green-50 border-r-2 border-blue-300 flex flex-col h-full"
      style={{ minHeight: `${getChatContainerHeight()}px` }}
    >
      <div className="p-4 border-b-2 border-blue-300 space-y-2 bg-gradient-to-r from-green-200/50 to-blue-200/50">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm text-gray-800">Chats</h2>
          <Button
            onClick={() => setIsCollapsed(true)}
            size="sm"
            variant="ghost"
            className="p-1 hover:bg-blue-100/50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={onNewChat}
          className="w-full flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 border-2 border-blue-400 text-white shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat</span>
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {chatSessions.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group relative p-3 rounded-lg cursor-pointer border-2 transition-all duration-200",
                currentChatId === chat.id
                  ? "bg-gradient-to-r from-green-200/70 to-blue-200/70 border-blue-400 shadow-md"
                  : "bg-white/70 border-blue-200 hover:bg-gradient-to-r hover:from-green-100/50 hover:to-blue-100/50 hover:border-blue-300"
              )}
            >
              <div
                onClick={() => onSelectChat(chat.id)}
                className="flex-1"
              >
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 text-green-600" />
                  <div className="flex-1 min-w-0">
                    {editingChatId === chat.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="text-sm h-8 border-2 border-blue-300"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handleSaveEdit();
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                          autoFocus
                        />
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            onClick={handleSaveEdit}
                            className="h-6 w-6 p-0 bg-green-500 hover:bg-green-600"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="h-6 w-6 p-0 border-2 border-blue-300"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {truncateTitle(chat.title)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-600">
                            {chat.messageCount} messages
                          </p>
                          <div className="flex-1 bg-blue-200 rounded-full h-1 max-w-16">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-1 rounded-full" 
                              style={{ 
                                width: `${Math.min((chat.title.length / 50) * 100, 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {editingChatId !== chat.id && (
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex space-x-1">
                  {onRenameChat && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEdit(chat);
                      }}
                      className="h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-100/50"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-800 hover:bg-red-100/50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
