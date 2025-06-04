import { useState, useEffect } from 'react';
import ChatHeader from '@/components/ChatHeader';
import ChatContainer from '@/components/ChatContainer';
import ChatSidebar from '@/components/ChatSidebar';
import MessageInput from '@/components/MessageInput';
import FlyingLeavesEffect from '@/components/FlyingLeavesEffect';
import DeepResearchTool from '@/components/DeepResearchTool';
import UsageIndicator from '@/components/UsageIndicator';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useMessageHandling } from '@/hooks/useMessageHandling';
import { useFileHandling } from '@/hooks/useFileHandling';
import { useChatHistory } from '@/hooks/useChatHistory';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const Index = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLeavesEffectActive, setIsLeavesEffectActive] = useState(false);
  const [previousMessages, setPreviousMessages] = useState<any[]>([]);
  const [showDeepResearch, setShowDeepResearch] = useState(false);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  
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

  const handleDeepResearch = (query: string) => {
    if (!currentChatId) {
      const newChatId = createNewChat();
      setCurrentChatId(newChatId);
    }
    sendMessage(query, [], true); // true indicates this is a research query
    setShowDeepResearch(false);
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

  // Allow access if user is authenticated OR if user is admin
  if (!user && !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex relative">
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
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <WelcomeScreen />
            </div>
          ) : (
            <div className="flex-1 flex gap-6">
              <div className="flex-1">
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
              </div>
              <div className="w-80 hidden lg:block">
                <div className="sticky top-4 space-y-4">
                  <UsageIndicator />
                  <DeepResearchTool 
                    onResearch={handleDeepResearch}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

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
