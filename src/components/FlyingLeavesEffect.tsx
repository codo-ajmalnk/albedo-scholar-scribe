
import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface FlyingLeavesEffectProps {
  isActive: boolean;
  onComplete: () => void;
  messages: any[];
}

const FlyingLeavesEffect: React.FC<FlyingLeavesEffectProps> = ({ 
  isActive, 
  onComplete, 
  messages 
}) => {
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    if (isActive && messages.length > 0) {
      // Limit to 4 leaves maximum for better performance
      const newLeaves = messages.slice(0, 4).map((_, index) => ({
        id: index,
        x: Math.random() * (window.innerWidth - 100) + 50,
        y: Math.random() * 200 + 100,
        delay: index * 100,
      }));
      
      setLeaves(newLeaves);

      // Reduced animation time for better performance
      const timer = setTimeout(() => {
        setLeaves([]);
        onComplete();
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [isActive, messages, onComplete]);

  if (!isActive || leaves.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute animate-flyAway"
          style={{
            left: leaf.x,
            top: leaf.y,
            animationDelay: `${leaf.delay}ms`,
            willChange: 'transform, opacity',
          }}
        >
          <div className="bg-green-100 p-2 rounded-lg shadow-sm border border-green-200">
            <MessageSquare className="w-4 h-4 text-green-600" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FlyingLeavesEffect;
