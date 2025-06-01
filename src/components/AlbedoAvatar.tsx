
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AlbedoAvatarProps {
  size?: 'sm' | 'md' | 'lg';
}

const AlbedoAvatar = ({ size = 'md' }: AlbedoAvatarProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
        A
      </AvatarFallback>
    </Avatar>
  );
};

export default AlbedoAvatar;
