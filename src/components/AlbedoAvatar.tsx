
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AlbedoAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const AlbedoAvatar = ({ size = 'md', animated = false }: AlbedoAvatarProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <div className="relative">
      <Avatar className={`${sizeClasses[size]} ${animated ? 'animate-bounce' : ''}`}>
        <AvatarFallback className={`
          bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 text-white font-semibold
          ${animated ? 'animate-pulse shadow-2xl shadow-purple-500/70' : 'shadow-lg shadow-purple-500/30'}
          transition-all duration-300
        `}>
          <span className={`${animated ? 'animate-spin text-shadow-lg' : ''} drop-shadow-lg`}>A</span>
        </AvatarFallback>
      </Avatar>
      {animated && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 opacity-60 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 opacity-40 animate-pulse"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-200 via-blue-200 to-cyan-200 opacity-20 animate-spin"></div>
        </>
      )}
    </div>
  );
};

export default AlbedoAvatar;
