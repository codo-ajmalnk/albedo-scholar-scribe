
import { Send, Upload, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useRef } from 'react';

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

  return (
    <Card className="p-4 bg-white/90 backdrop-blur-md border-blue-200 shadow-lg">
      {uploadedFiles.length > 0 && (
        <div className="mb-3 space-y-2">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 flex-1">{file.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                className="text-blue-600 hover:text-blue-800 h-6 w-6 p-0"
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
          className="border-blue-200 hover:bg-blue-50 flex-shrink-0"
          title="Upload images"
        >
          <Upload className="w-4 h-4" />
        </Button>
        
        <Input
          placeholder="Ask me anything about your studies! 📚 (You can edit messages later)"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && onSendMessage()}
          className="flex-1 border-blue-200 focus:border-blue-400 bg-white/80"
          disabled={isLoading}
        />
        
        <Button 
          onClick={onSendMessage}
          disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isLoading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileUpload}
        accept="image/*"
        multiple
        className="hidden"
      />
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        💡 Tip: You can edit any message by clicking the edit icon, upload multiple images, and download responses as PDF!
      </div>
    </Card>
  );
};

export default MessageInput;
