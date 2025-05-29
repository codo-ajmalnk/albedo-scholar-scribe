
import AlbedoAvatar from './AlbedoAvatar';

interface ChatHeaderProps {
  messageCount: number;
}

const ChatHeader = ({ messageCount }: ChatHeaderProps) => {
  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-green-100 sticky top-0 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlbedoAvatar size="lg" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Albedo Educator
              </h1>
              <p className="text-sm text-gray-600">Your friendly AI learning companion 🎓✨</p>
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
