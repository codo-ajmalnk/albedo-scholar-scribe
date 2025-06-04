
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface NewChatButtonProps {
  onNewChat: () => void;
  disabled?: boolean;
  className?: string;
}

const NewChatButton = ({ onNewChat, disabled = false, className = "" }: NewChatButtonProps) => {
  const { toast } = useToast();

  const handleNewChat = () => {
    // Optimized new chat creation - immediate response
    onNewChat();
    toast({
      title: "✨ New Chat Created",
      description: "Ready for your questions!",
      duration: 2000, // Shorter duration for better UX
    });
  };

  return (
    <Button
      onClick={handleNewChat}
      disabled={disabled}
      className={`bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-150 ${className}`}
      size="lg"
    >
      <Plus className="w-5 h-5 mr-2" />
      New Chat
    </Button>
  );
};

export default NewChatButton;
