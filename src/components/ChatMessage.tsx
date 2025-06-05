
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, ThumbsDown, FileDown, PlayCircle, PauseCircle, Pencil, RotateCcw, Copy, Star } from 'lucide-react';
import AlbedoAvatar from './AlbedoAvatar';
import { Message } from '@/hooks/useMessageHandling';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface ChatMessageProps {
  message: Message;
  isEditing: boolean;
  onStartEdit: (messageId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onRegenerateResponse: (messageId: string) => void;
  onFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
  onGeneratePDF: (content: string) => void;
  onSpeakText: (text: string) => void;
}

const ChatMessage = ({
  message,
  isEditing,
  onStartEdit,
  onEditMessage,
  onRegenerateResponse,
  onFeedback,
  onGeneratePDF,
  onSpeakText,
}: ChatMessageProps) => {
  const [editedContent, setEditedContent] = useState(message.content);
  const { speak, pause, resume, isPlaying, isPaused } = useTextToSpeech();
  const { toast } = useToast();

  const handleSpeakText = () => {
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(message.content);
    }
  };

  const handleCopyText = async () => {
    try {
      const cleanContent = message.content
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');

      await navigator.clipboard.writeText(cleanContent);
      
      toast({
        title: "Copied! 📋",
        description: "Message content has been copied to your clipboard.",
        duration: 1000,
      });
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = message.content.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Copied! 📋",
        description: "Message content has been copied to your clipboard.",
        duration: 1000,
      });
    }
  };

  const handleGeneratePDF = () => {
    onGeneratePDF(message.content);
  };

  const handleFeedback = (feedback: 'like' | 'dislike') => {
    onFeedback(message.id, feedback);
    
    if (feedback === 'like') {
      toast({
        title: "Thank you! 😊",
        description: "Albedo appreciates your feedback!",
        duration: 1000,
      });
    } else {
      toast({
        title: "Sorry about that! 😔",
        description: "I'll try to do better!",
        variant: "destructive",
        duration: 1000,
      });
    }
  };

  return (
    <div className="py-2">
      <Card className={`p-4 ${message.type === 'assistant' 
        ? 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200' 
        : 'bg-white border border-gray-200 shadow-sm'
      }`}>
        <div className="flex items-start gap-3">
          {message.type === 'user' ? (
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-500 text-white">U</AvatarFallback>
            </Avatar>
          ) : (
            <AlbedoAvatar />
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">
                {message.type === 'user' ? 'You' : 'Albedo AI'}
              </span>
              {message.subject && (
                <Badge variant="outline" className="text-xs">
                  {message.subject}
                </Badge>
              )}
              {message.isEdited && (
                <span className="text-xs text-gray-500 italic">(edited)</span>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[100px] w-full"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStartEdit('')}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onEditMessage(message.id, editedContent)}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }} />
              </div>
            )}
          </div>
        </div>

        {/* Bottom action buttons for all messages */}
        {!isEditing && (
          <div className="flex justify-end gap-1 mt-3 pt-2 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyText}
              className="h-8 px-2 text-xs text-gray-600 hover:text-blue-600"
            >
              <Copy className="h-3 w-3" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGeneratePDF}
              className="h-8 px-2 text-xs text-gray-600 hover:text-blue-600"
            >
              <FileDown className="h-3 w-3" />
            </Button>

            {message.type === 'assistant' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRegenerateResponse(message.id)}
                  className="h-8 px-2 text-xs text-gray-600 hover:text-blue-600"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('like')}
                  className={`h-8 px-2 text-xs ${message.feedback === 'like' 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <Star className="h-3 w-3" />
                </Button>
              </>
            )}

            {message.type === 'user' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStartEdit(message.id)}
                className="h-8 px-2 text-xs text-gray-600 hover:text-blue-600"
              >
                <Pencil className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatMessage;
