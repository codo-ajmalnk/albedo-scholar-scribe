import { User, FileDown, Copy, Check, Volume2, Edit3, Save, X, RefreshCcw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import AlbedoAvatar from './AlbedoAvatar';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  subject?: string;
  hasImage?: boolean;
  isEdited?: boolean;
  feedback?: 'like' | 'dislike' | null;
}

interface ChatMessageProps {
  message: Message;
  onGeneratePDF: (content: string) => void;
  onSpeakText: (text: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onRegenerateResponse: (messageId: string) => void;
  onFeedback: (messageId: string, feedback: 'like' | 'dislike') => void;
  isEditing: boolean;
  onStartEdit: (messageId: string) => void;
}

const ChatMessage = ({ 
  message, 
  onGeneratePDF, 
  onSpeakText, 
  onEditMessage,
  onRegenerateResponse,
  onFeedback,
  isEditing, 
  onStartEdit 
}: ChatMessageProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    onEditMessage(message.id, editContent);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    onStartEdit('');
  };

  const isUser = message.type === 'user';

  const formatMessageContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-semibold text-gray-800 mt-3 mb-1">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      
      if (line.startsWith('•') || line.startsWith('-')) {
        return (
          <div key={index} className="ml-4 mb-1">
            {line}
          </div>
        );
      }
      
      if (/^\d+\./.test(line)) {
        return (
          <div key={index} className="ml-4 mb-1 font-medium">
            {line}
          </div>
        );
      }
      
      return (
        <div key={index} className="mb-1">
          {line}
          {index < lines.length - 1 && line.trim() && <br />}
        </div>
      );
    });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group mb-4`}>
      <Card className={`max-w-[85%] p-4 transition-all duration-300 animate-fade-in ${
        isUser 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-300 shadow-md rounded-2xl rounded-br-md' 
          : 'bg-white border-green-200 shadow-sm hover:shadow-md rounded-2xl rounded-bl-md'
      }`}>
        <div className="flex items-start space-x-3">
          <div className={`flex-shrink-0 ${isUser ? '' : ''}`}>
            {isUser ? (
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            ) : (
              <AlbedoAvatar size="sm" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`text-sm font-medium ${
                isUser ? 'text-white/90' : 'text-green-700'
              }`}>
                {isUser ? 'You' : 'Albedo Educator'}
              </span>
              {message.isEdited && (
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700">
                  edited
                </Badge>
              )}
              {message.subject && !isUser && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                  {message.subject}
                </Badge>
              )}
              <span className={`text-xs ${
                isUser ? 'text-white/70' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-white border-gray-200"
                  placeholder="Edit your message..."
                />
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveEdit}
                    className="bg-green-600 hover:bg-green-700 text-white h-8"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    className="h-8"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`text-sm leading-relaxed ${
                isUser ? 'text-white' : 'text-gray-800'
              }`}>
                {formatMessageContent(message.content)}
              </div>
            )}

            {message.hasImage && !isEditing && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-sm text-green-600 font-medium">📷 Files uploaded and analyzed</span>
              </div>
            )}
            
            {!isEditing && (
              <div className={`flex items-center space-x-2 mt-4 pt-3 border-t ${
                isUser ? 'border-white/20' : 'border-gray-100'
              } opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className={`h-8 ${
                    isUser 
                      ? 'text-white/80 hover:text-white hover:bg-white/10' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  title="Copy message"
                >
                  {isCopied ? (
                    <Check className="w-3 h-3 mr-1" />
                  ) : (
                    <Copy className="w-3 h-3 mr-1" />
                  )}
                  {isCopied ? 'Copied!' : 'Copy'}
                </Button>
                
                {!isUser && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSpeakText(message.content)}
                      className="text-gray-600 hover:text-gray-800 h-8"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3 h-3 mr-1" />
                      Listen
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onGeneratePDF(message.content)}
                      className="text-gray-600 hover:text-gray-800 h-8"
                      title="Download as PDF"
                    >
                      <FileDown className="w-3 h-3 mr-1" />
                      PDF
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRegenerateResponse(message.id)}
                      className="text-gray-600 hover:text-gray-800 h-8"
                      title="Regenerate response"
                    >
                      <RefreshCcw className="w-3 h-3 mr-1" />
                      Regenerate
                    </Button>

                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFeedback(message.id, 'like')}
                        className={`h-8 ${
                          message.feedback === 'like' 
                            ? 'text-green-600 bg-green-50' 
                            : 'text-gray-600 hover:text-green-600'
                        }`}
                        title="Like response"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFeedback(message.id, 'dislike')}
                        className={`h-8 ${
                          message.feedback === 'dislike' 
                            ? 'text-red-600 bg-red-50' 
                            : 'text-gray-600 hover:text-red-600'
                        }`}
                        title="Dislike response"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                    </div>
                  </>
                )}
                
                {isUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStartEdit(message.id)}
                    className="text-white/80 hover:text-white hover:bg-white/10 h-8"
                    title="Edit message"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatMessage;
