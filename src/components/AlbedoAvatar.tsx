
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
          bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold
          ${animated ? 'animate-pulse shadow-lg shadow-purple-500/50' : ''}
        `}>
          <span className={animated ? 'animate-spin' : ''}>A</span>
        </AvatarFallback>
      </Avatar>
      {animated && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-75 animate-ping"></div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-300 to-blue-300 opacity-50 animate-pulse"></div>
        </>
      )}
    </div>
  );
};

export default AlbedoAvatar;
