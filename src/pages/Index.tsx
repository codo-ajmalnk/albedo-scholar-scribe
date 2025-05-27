
import { useState } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatContainer from '@/components/ChatContainer';
import MessageInput from '@/components/MessageInput';
import { useMessageHandling } from '@/hooks/useMessageHandling';
import { useFileHandling } from '@/hooks/useFileHandling';

const Index = () => {
  const [inputMessage, setInputMessage] = useState('');
  
  const {
    messages,
    isLoading,
    editingMessageId,
    setEditingMessageId,
    sendMessage,
    editMessage
  } = useMessageHandling();

  const {
    uploadedFiles,
    setUploadedFiles,
    handleFileUpload,
    generatePDF,
    speakText
  } = useFileHandling();

  const handleSendMessage = () => {
    sendMessage(inputMessage, uploadedFiles);
    setInputMessage('');
    setUploadedFiles([]);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    editMessage(messageId, newContent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ChatHeader messageCount={messages.length} />
      
      <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-140px)] flex flex-col">
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          editingMessageId={editingMessageId}
          onGeneratePDF={generatePDF}
          onSpeakText={speakText}
          onEditMessage={handleEditMessage}
          onStartEdit={setEditingMessageId}
        />

        <MessageInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default Index;
