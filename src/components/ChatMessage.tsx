
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, ThumbsDown, FileDown, PlayCircle, PauseCircle, Pencil, Repeat } from 'lucide-react';
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

  const handleFeedback = (feedback: 'like' | 'dislike') => {
    onFeedback(message.id, feedback);
    
    if (feedback === 'like') {
      toast({
        title: "Thank you! 😊",
        description: "Albedo is happy to help! Your feedback helps me improve.",
      });
    } else {
      toast({
        title: "Sorry about that! 😔",
        description: "Albedo apologizes for not meeting your expectations. I'll try to do better!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-2">
      <Card className={`p-4 ${message.type === 'assistant' ? 'bg-blue-50 border-blue-100' : ''}`}>
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

        {!isEditing && message.type === 'assistant' && (
          <div className="flex flex-wrap gap-2 mt-3 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback('like')}
              className={message.feedback === 'like' ? 'bg-green-50 border-green-200' : ''}
            >
              <ThumbsUp className={`h-4 w-4 mr-1 ${message.feedback === 'like' ? 'text-green-500' : ''}`} />
              {message.feedback === 'like' ? 'Liked' : 'Like'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFeedback('dislike')}
              className={message.feedback === 'dislike' ? 'bg-red-50 border-red-200' : ''}
            >
              <ThumbsDown className={`h-4 w-4 mr-1 ${message.feedback === 'dislike' ? 'text-red-500' : ''}`} />
              {message.feedback === 'dislike' ? 'Disliked' : 'Dislike'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onGeneratePDF(message.content)}
            >
              <FileDown className="h-4 w-4 mr-1" />
              Save PDF
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleSpeakText}
            >
              {isPlaying && !isPaused ? (
                <PauseCircle className="h-4 w-4 mr-1" />
              ) : (
                <PlayCircle className="h-4 w-4 mr-1" />
              )}
              {isPlaying && !isPaused ? 'Pause' : isPaused ? 'Resume' : 'Listen'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRegenerateResponse(message.id)}
            >
              <Repeat className="h-4 w-4 mr-1" />
              Regenerate
            </Button>
          </div>
        )}

        {!isEditing && message.type === 'user' && (
          <div className="flex justify-end mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onStartEdit(message.id)}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatMessage;
