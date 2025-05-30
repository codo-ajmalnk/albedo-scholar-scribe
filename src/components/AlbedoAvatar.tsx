
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const AlbedoAvatar = () => {
  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-semibold">
        A
      </AvatarFallback>
    </Avatar>
  );
};

export default AlbedoAvatar;
