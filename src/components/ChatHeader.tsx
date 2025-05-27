
import { Bot } from 'lucide-react';

interface ChatHeaderProps {
  messageCount: number;
}

const ChatHeader = ({ messageCount }: ChatHeaderProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Albedo – AI Chat Assistant
              </h1>
              <p className="text-sm text-gray-600">Educational & Smart Chatbot by Codoi Innovations 🎓</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {messageCount > 0 && `${messageCount} messages`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
