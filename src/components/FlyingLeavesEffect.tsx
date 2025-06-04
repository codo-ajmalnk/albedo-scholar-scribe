
import React from 'react';

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
  // Immediately complete without any animation to prevent shaking
  React.useEffect(() => {
    if (isActive) {
      onComplete();
    }
  }, [isActive, onComplete]);

  // Return null to not render anything
  return null;
};

export default FlyingLeavesEffect;
