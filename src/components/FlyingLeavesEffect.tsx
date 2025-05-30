
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
      // Create leaf elements based on messages
      const newLeaves = messages.slice(0, 8).map((_, index) => ({
        id: index,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.6 + 100,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        delay: index * 50,
      }));
      
      setLeaves(newLeaves);

      // Complete the effect after animation
      const timer = setTimeout(() => {
        setLeaves([]);
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isActive, messages, onComplete]);

  if (!isActive || leaves.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute animate-[flyAway_2s_ease-in-out_forwards]"
          style={{
            left: leaf.x,
            top: leaf.y,
            transform: `rotate(${leaf.rotation}deg) scale(${leaf.scale})`,
            animationDelay: `${leaf.delay}ms`,
          }}
        >
          <div className="bg-green-100 p-2 rounded-lg shadow-md border border-green-200 opacity-80">
            <MessageSquare className="w-4 h-4 text-green-600" />
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes flyAway {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-200px) rotate(180deg) scale(0.8);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-400px) rotate(360deg) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FlyingLeavesEffect;
