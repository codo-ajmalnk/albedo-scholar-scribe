
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
    onNewChat();
    toast({
      title: "✨ New Chat Created",
      description: "Ready for your questions!",
      duration: 1000,
    });
  };

  return (
    <Button
      onClick={handleNewChat}
      disabled={disabled}
      className={`bg-white border-2 border-blue-500 hover:bg-blue-50 text-blue-600 hover:text-blue-700 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
      size="lg"
    >
      <Plus className="w-5 h-5 mr-2" />
      New Chat
    </Button>
  );
};

export default NewChatButton;
