
import React from 'react';
import AlbedoAvatar from '@/components/AlbedoAvatar';
import UserMenu from '@/components/UserMenu';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatHeaderProps {
  messageCount: number;
}

const ChatHeader = ({ messageCount }: ChatHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <AlbedoAvatar size="sm" />
        <div>
          <h1 className="font-semibold text-lg text-gray-900">Albedo AI</h1>
          <p className="text-sm text-gray-600">
            {messageCount > 0 ? `${messageCount} messages in this conversation` : 'Ready to help you learn and research'}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Link
          to="/profile"
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </Link>
        <UserMenu />
      </div>
    </header>
  );
};

export default ChatHeader;
