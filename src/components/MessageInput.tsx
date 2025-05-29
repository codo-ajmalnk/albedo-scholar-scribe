
import { Send, Upload, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useRef } from 'react';
import VoiceInput from './VoiceInput';

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  uploadedFiles: File[];
  setUploadedFiles: (files: File[] | ((prev: File[]) => File[])) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MessageInput = ({
  inputMessage,
  setInputMessage,
  uploadedFiles,
  setUploadedFiles,
  onSendMessage,
  isLoading,
  onFileUpload
}: MessageInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVoiceInput = (text: string) => {
    setInputMessage(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <Card className="p-4 bg-white/95 backdrop-blur-md border-green-200 shadow-lg rounded-2xl">
      {uploadedFiles.length > 0 && (
        <div className="mb-3 space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg border border-green-100">
              <ImageIcon className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 flex-1">{file.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                className="text-green-600 hover:text-green-800 h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="border-green-200 hover:bg-green-50 flex-shrink-0"
          title="Upload files or images"
        >
          <Upload className="w-4 h-4 text-green-600" />
        </Button>
        
        <VoiceInput onVoiceInput={handleVoiceInput} disabled={isLoading} />
        
        <Input
          placeholder="Ask Albedo Educator anything! 🎓 Upload images or speak your question..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 border-green-200 focus:border-green-400 bg-white/90 rounded-xl"
          disabled={isLoading}
        />
        
        <Button 
          onClick={onSendMessage}
          disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isLoading}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 flex-shrink-0 rounded-xl shadow-md"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileUpload}
        accept="image/*,.pdf,.doc,.docx,.txt"
        multiple
        className="hidden"
      />
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        💡 I'm Albedo Educator! Ask me about web development, hosting, educational topics, or upload files for analysis! 🚀
      </div>
    </Card>
  );
};

export default MessageInput;
