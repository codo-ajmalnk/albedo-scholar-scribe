
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Trash2, MessageSquare, Calendar, Copy, Menu, X } from 'lucide-react';
import { ChatSession } from '@/hooks/useChatHistory';
import NewChatButton from './NewChatButton';
import { useToast } from '@/hooks/use-toast';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInDays === 1) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const copyChat = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    const chatContent = session.messages.map(msg => 
      `${msg.sender === 'user' ? 'You' : 'AI'}: ${msg.content}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(chatContent).then(() => {
      toast({
        title: "Chat copied!",
        description: "Chat history has been copied to clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Could not copy chat to clipboard.",
        variant: "destructive",
      });
    });
  };

  return (
    <>
      {/* Toggle Button - Always visible */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 bg-white shadow-md hover:shadow-lg"
      >
        {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
      </Button>

      {/* Sidebar */}
      <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-80 opacity-100'
      }`}>
        <div className="p-4 border-b border-gray-200 mt-12">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Chat History</h2>
          <NewChatButton onNewChat={onNewChat} className="w-full" />
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {chatSessions.map((session) => (
              <Card
                key={session.id}
                className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-md group ${
                  currentChatId === session.id
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectChat(session.id)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 flex-1 pr-2">
                      {session.title}
                    </h3>
                    
                    {/* Action buttons - show on hover */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => copyChat(session, e)}
                        className="p-1 h-6 w-6 text-gray-400 hover:text-blue-500"
                        title="Copy chat"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(session.id);
                        }}
                        className="p-1 h-6 w-6 text-gray-400 hover:text-red-500"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(session.updatedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{session.messageCount} msgs</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {chatSessions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No chats yet</p>
                <p className="text-xs">Start a new conversation!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default ChatSidebar;
