
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
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`flex items-start gap-2 max-w-[70%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        {message.type === 'user' ? (
          <Avatar className="h-6 w-6 flex-shrink-0">
            <AvatarFallback className="bg-blue-500 text-white text-xs">U</AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex-shrink-0">
            <AlbedoAvatar />
          </div>
        )}

        <div className={`relative ${message.type === 'user' ? 'mr-2' : 'ml-2'}`}>
          <Card className={`p-3 shadow-sm border-2 ${message.type === 'assistant' 
            ? 'bg-white border-blue-200 rounded-tr-lg rounded-tl-lg rounded-bl-lg rounded-br-sm' 
            : 'bg-blue-500 text-white border-blue-600 rounded-tl-lg rounded-tr-lg rounded-br-lg rounded-bl-sm'
          }`}>
            {/* Message header */}
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium ${message.type === 'user' ? 'text-blue-100' : 'text-gray-600'}`}>
                {message.type === 'user' ? 'You' : 'Albedo AI'}
              </span>
              {message.subject && (
                <Badge variant="outline" className="text-xs">
                  {message.subject}
                </Badge>
              )}
              {message.isEdited && (
                <span className={`text-xs italic ${message.type === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>(edited)</span>
              )}
            </div>

            {/* Message content */}
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[60px] w-full text-sm"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStartEdit('')}
                    className="h-7 px-2 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onEditMessage(message.id, editedContent)}
                    className="h-7 px-2 text-xs"
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`text-sm leading-relaxed ${message.type === 'user' ? 'text-white' : 'text-gray-800'}`}>
                <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }} />
              </div>
            )}
          </Card>

          {/* Action buttons */}
          {!isEditing && (
            <div className={`flex gap-1 mt-1 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyText}
                className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              >
                <Copy className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGeneratePDF}
                className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
              >
                <FileDown className="h-3 w-3" />
              </Button>

              {message.type === 'assistant' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRegenerateResponse(message.id)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback('like')}
                    className={`h-6 w-6 p-0 ${message.feedback === 'like' 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
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
                  className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
