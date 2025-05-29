
import AlbedoAvatar from './AlbedoAvatar';
import { Card } from '@/components/ui/card';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <Card className="max-w-xs p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-md">
        <div className="flex items-center space-x-3">
          <AlbedoAvatar isThinking={true} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm text-green-700 font-medium">Albedo Educator</span>
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-xs text-green-600">thinking</span>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TypingIndicator;
