
import { Button } from '@/components/ui/button';
import { Plus, MessageSquare } from 'lucide-react';
import { ChatSession } from '@/hooks/useChatHistory';
import { cn } from '@/lib/utils';

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
}: ChatSidebarProps) => {
  return (
    <div className="w-16 bg-gradient-to-b from-blue-100/80 via-purple-100/60 to-cyan-100/80 border-r-2 border-blue-300/50 flex flex-col h-full backdrop-blur-sm">
      <div className="p-2 border-b-2 border-blue-300/50">
        <Button 
          onClick={onNewChat} 
          size="sm" 
          className="w-full p-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-2 border-blue-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 p-1 space-y-1 overflow-y-auto">
        {chatSessions.slice(0, 8).map(chat => (
          <Button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            size="sm"
            variant="ghost"
            className={cn(
              "w-full p-2 transition-all duration-200 border-2",
              currentChatId === chat.id 
                ? "bg-gradient-to-r from-blue-200/70 to-purple-200/70 border-blue-400 shadow-md" 
                : "bg-white/50 border-blue-200/50 hover:bg-gradient-to-r hover:from-blue-100/50 hover:to-purple-100/50 hover:border-blue-300"
            )}
          >
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
