
import { Bot } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AlbedoAvatarProps {
  isThinking?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  subjectTag?: string;
}

const AlbedoAvatar = ({ isThinking = false, size = 'md', className, subjectTag }: AlbedoAvatarProps) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (isThinking) {
      const interval = setInterval(() => {
        setPulse(prev => !prev);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isThinking]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
      isThinking ? (pulse ? 'scale-110 shadow-xl' : 'scale-100') : ''
    } ${className || ''}`}>
      <Bot className={`${iconSizes[size]} text-white ${isThinking ? 'animate-pulse' : ''}`} />
    </div>
  );
};

export default AlbedoAvatar;
