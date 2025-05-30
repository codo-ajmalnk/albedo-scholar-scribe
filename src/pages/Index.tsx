
import { useState, useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatContainer from '@/components/ChatContainer';
import ChatSidebar from '@/components/ChatSidebar';
import MessageInput from '@/components/MessageInput';
import FlyingLeavesEffect from '@/components/FlyingLeavesEffect';
import { useMessageHandling } from '@/hooks/useMessageHandling';
import { useFileHandling } from '@/hooks/useFileHandling';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLeavesEffectActive, setIsLeavesEffectActive] = useState(false);
  const [previousMessages, setPreviousMessages] = useState<any[]>([]);
  const { user } = useAuth();
  
  const {
    messages,
    isLoading,
    editingMessageId,
    setEditingMessageId,
    sendMessage,
    editMessage,
    regenerateResponse,
    setMessageFeedback,
    loadMessages
  } = useMessageHandling();

  const {
    uploadedFiles,
    setUploadedFiles,
    handleFileUpload,
    generatePDF,
    speakText
  } = useFileHandling();

  const {
    chatSessions,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    updateChatMessages,
    getCurrentChat,
    deleteChat
  } = useChatHistory();

  // Load messages when current chat changes
  useEffect(() => {
    const currentChat = getCurrentChat();
    if (currentChat) {
      loadMessages(currentChat.messages);
    } else if (chatSessions.length === 0) {
      // Create first chat if no chats exist
      createNewChat();
    }
  }, [currentChatId, chatSessions.length]);

  // Update chat history when messages change
  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      updateChatMessages(currentChatId, messages);
    }
  }, [messages, currentChatId]);

  const handleSendMessage = () => {
    if (!currentChatId) {
      const newChatId = createNewChat();
      setCurrentChatId(newChatId);
    }
    sendMessage(inputMessage, uploadedFiles);
    setInputMessage('');
    setUploadedFiles([]);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    editMessage(messageId, newContent);
  };

  const handleNewChat = () => {
    // Store current messages for the flying effect
    setPreviousMessages([...messages]);
    
    // Start the leaves effect
    setIsLeavesEffectActive(true);
  };

  const handleLeavesEffectComplete = () => {
    // Create new chat after the effect completes
    const newChatId = createNewChat();
    setCurrentChatId(newChatId);
    setIsLeavesEffectActive(false);
    setPreviousMessages([]);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex">
      <ChatSidebar
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={deleteChat}
      />
      
      <div className="flex-1 flex flex-col w-full">
        <ChatHeader messageCount={messages.length} />
        
        <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-140px)] flex flex-col w-full">
          <ChatContainer
            messages={messages}
            isLoading={isLoading}
            editingMessageId={editingMessageId}
            onGeneratePDF={generatePDF}
            onSpeakText={speakText}
            onEditMessage={handleEditMessage}
            onRegenerateResponse={regenerateResponse}
            onFeedback={setMessageFeedback}
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

      <FlyingLeavesEffect
        isActive={isLeavesEffectActive}
        onComplete={handleLeavesEffectComplete}
        messages={previousMessages}
      />
    </div>
  );
};

export default Index;
