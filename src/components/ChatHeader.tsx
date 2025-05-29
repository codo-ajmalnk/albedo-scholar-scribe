
import React from 'react';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatHeaderProps {
  messageCount: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ messageCount }) => {
  const isMobile = useIsMobile();

  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {!isMobile && (
          <div className="flex-1">
            <h1 className="font-semibold text-lg text-gray-800 ml-2">Albedo AI</h1>
          </div>
        )}
        
        <div className="flex-1 flex justify-center">
          {messageCount > 0 && (
            <span className="text-sm text-gray-500">
              {messageCount} message{messageCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        <div className="flex-1 flex justify-end">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
