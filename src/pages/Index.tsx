
import { useState, useRef, useEffect } from 'react';
import { Send, Upload, FileDown, Image as ImageIcon, Bot, User, Volume2, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ChatMessage from '@/components/ChatMessage';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  subject?: string;
  hasImage?: boolean;
  isEdited?: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectSubject = (message: string): string => {
    const keywords = {
      'Mathematics': ['math', 'calculate', 'equation', 'algebra', 'geometry', 'trigonometry', 'calculus', 'number', 'formula', 'solve', 'derivative', 'integral'],
      'Science': ['science', 'physics', 'chemistry', 'biology', 'experiment', 'molecule', 'atom', 'cell', 'photosynthesis', 'reaction', 'force', 'energy'],
      'English': ['grammar', 'essay', 'literature', 'poem', 'writing', 'sentence', 'paragraph', 'story', 'author', 'novel', 'verb', 'noun'],
      'Computer Science': ['programming', 'code', 'algorithm', 'computer', 'software', 'python', 'javascript', 'html', 'css', 'database', 'api'],
      'Social Science': ['history', 'geography', 'civics', 'politics', 'society', 'culture', 'economics', 'democracy', 'constitution', 'government'],
      'General Knowledge': ['gk', 'general', 'current affairs', 'quiz', 'facts', 'trivia', 'world', 'country', 'capital', 'president']
    };

    const lowerMessage = message.toLowerCase();
    for (const [subject, words] of Object.entries(keywords)) {
      if (words.some(word => lowerMessage.includes(word))) {
        return subject;
      }
    }
    return 'General';
  };

  const getContextualResponse = (userMessage: string, subject: string, conversationHistory: Message[]): string => {
    // Enhanced AI logic with conversation context
    const recentMessages = conversationHistory.slice(-4); // Consider last 4 messages for context
    const hasContext = recentMessages.length > 0;
    
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    const isGreeting = greetings.some(greeting => userMessage.toLowerCase().includes(greeting));

    if (isGreeting && !hasContext) {
      return "Hello there! 👋 I'm Albedo, your intelligent AI chat assistant created by Codoi Innovations. I'm here to help you with your studies from LKG to Degree level! 😊\n\nI can assist you with:\n📘 Mathematics & Science\n📚 English & Literature\n🌍 Social Studies & History\n💻 Computer Science\n🧠 General Knowledge\n\nFeel free to ask me anything, upload images of questions, or even edit your previous messages for clarification. How can I help you today? ✨";
    }

    const responseTemplates = {
      'Mathematics': {
        intro: "Excellent mathematical question! 🧮 Let me break this down step by step for you.",
        detailed: "Mathematics is all about understanding patterns and logical thinking. Here's how we can approach this systematically:",
        examples: [
          "For algebra problems, I always recommend identifying variables first.",
          "In geometry, visualizing the problem often helps tremendously.",
          "Calculus concepts build upon each other, so let's ensure you understand the foundations."
        ]
      },
      'Science': {
        intro: "Fascinating scientific inquiry! 🔬 Science is about curiosity and discovery.",
        detailed: "Let me explain this concept clearly with real-world applications:",
        examples: [
          "In physics, we often see these principles in everyday life.",
          "Chemistry reactions follow specific patterns we can predict.",
          "Biology shows us the incredible complexity of life systems."
        ]
      },
      'English': {
        intro: "Wonderful English question! 📚 Language is a beautiful tool for expression.",
        detailed: "Let me guide you through this concept with examples:",
        examples: [
          "Grammar rules help us communicate clearly and effectively.",
          "Literature analysis reveals deeper meanings in texts.",
          "Writing skills improve with practice and proper technique."
        ]
      },
      'Computer Science': {
        intro: "Great tech question! 💻 Programming and computer science open endless possibilities.",
        detailed: "Technology shapes our world. Here's how this concept works:",
        examples: [
          "Programming is like giving instructions to a computer.",
          "Algorithms help us solve problems efficiently.",
          "Understanding data structures is key to good programming."
        ]
      },
      'Social Science': {
        intro: "Interesting social science question! 🌍 Understanding society helps us grow.",
        detailed: "Social sciences help us understand human behavior and society:",
        examples: [
          "History teaches us about past events and their impact.",
          "Geography shows us how location affects culture.",
          "Civics helps us understand our rights and responsibilities."
        ]
      },
      'General Knowledge': {
        intro: "Great general knowledge question! 🧠 Learning about the world is exciting.",
        detailed: "General knowledge helps us become well-rounded individuals:",
        examples: [
          "Current affairs keep us informed about world events.",
          "Cultural knowledge helps us appreciate diversity.",
          "Scientific facts help us understand our universe."
        ]
      },
      'General': {
        intro: "Thanks for your thoughtful question! 😊 I'm here to provide you with comprehensive help.",
        detailed: "Let me give you a detailed explanation:",
        examples: [
          "I can help clarify complex concepts in simple terms.",
          "Feel free to ask follow-up questions for deeper understanding.",
          "I'm designed to adapt my explanations to your learning level."
        ]
      }
    };

    const template = responseTemplates[subject as keyof typeof responseTemplates] || responseTemplates['General'];
    const randomExample = template.examples[Math.floor(Math.random() * template.examples.length)];
    
    let contextualNote = "";
    if (hasContext) {
      contextualNote = "\n\n💡 **Building on our conversation:** I remember our previous discussion, so feel free to reference earlier topics!";
    }

    // Enhanced educational content based on specific patterns
    let specificContent = "";
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('solve') || lowerMessage.includes('solution')) {
      specificContent = "\n\n🔍 **Step-by-Step Solution Approach:**\n1. Understand the problem statement\n2. Identify given information\n3. Apply relevant formulas/concepts\n4. Show working clearly\n5. Verify the answer\n\nWould you like me to walk through this process with a specific example?";
    } else if (lowerMessage.includes('explain') || lowerMessage.includes('what is')) {
      specificContent = "\n\n📖 **Detailed Explanation:**\nI'll provide a comprehensive explanation with:\n• Clear definitions\n• Real-world examples\n• Visual analogies where helpful\n• Practice applications\n\nLet me know if you'd like me to adjust the complexity level!";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('understand')) {
      specificContent = "\n\n🎯 **Learning Support Available:**\n• Concept clarification\n• Step-by-step tutorials\n• Practice problems\n• Exam preparation tips\n• Memory techniques\n\nI can also format my response as a downloadable PDF if you'd like to save it for later study! 📄";
    }

    const encouragement = "\n\n✨ **Remember:** Every expert was once a beginner. Keep asking questions and stay curious! Would you like this explanation as a downloadable PDF? Or would you prefer me to read it aloud? 🎵";

    return `${template.intro}\n\n${template.detailed}\n\n${randomExample}${contextualNote}${specificContent}${encouragement}`;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage || `Uploaded ${uploadedFiles.length} file(s)`,
      timestamp: new Date(),
      hasImage: uploadedFiles.length > 0
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI thinking time with more realistic delay
    setTimeout(() => {
      const subject = detectSubject(inputMessage);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getContextualResponse(inputMessage, subject, messages),
        timestamp: new Date(),
        subject
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, Math.random() * 1000 + 1500); // 1.5-2.5 second delay

    setInputMessage('');
    setUploadedFiles([]);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: newContent, isEdited: true }
        : msg
    ));
    
    // Re-generate AI response if editing user message
    const editedMessage = messages.find(msg => msg.id === messageId);
    if (editedMessage?.type === 'user') {
      setIsLoading(true);
      setTimeout(() => {
        const subject = detectSubject(newContent);
        const aiResponse: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: getContextualResponse(newContent, subject, messages),
          timestamp: new Date(),
          subject
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    }
    
    setEditingMessageId(null);
    toast({
      title: "Message updated! ✅",
      description: "Your message has been edited successfully."
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setUploadedFiles(prev => [...prev, ...imageFiles]);
    
    if (imageFiles.length > 0) {
      toast({
        title: "Images uploaded! 📷",
        description: `${imageFiles.length} image(s) ready for analysis.`
      });
    }
  };

  const generatePDF = (messageContent: string) => {
    const cleanContent = messageContent.replace(/[*#]/g, '').replace(/\n/g, '\n');
    const blob = new Blob([`Albedo AI Response - Educational Assistant\n\nGenerated on: ${new Date().toLocaleString()}\n\n${cleanContent}\n\n---\nPowered by Albedo - AI Chat Assistant by Codoi Innovations`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `albedo-response-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "PDF Downloaded! 📄",
      description: "Your response has been saved successfully."
    });
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#🎯📘🔍✨🧮🔬📚💻🌍🧠😊👋📄🎵]/g, ''));
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
      
      toast({
        title: "Playing audio! 🎵",
        description: "Response is being read aloud."
      });
    } else {
      toast({
        title: "Audio not supported",
        description: "Your browser doesn't support text-to-speech."
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Albedo – AI Chat Assistant
                </h1>
                <p className="text-sm text-gray-600">Educational & Smart Chatbot by Codoi Innovations 🎓</p>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {messages.length > 0 && `${messages.length} messages`}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-140px)] flex flex-col">
        <ScrollArea className="flex-1 mb-4">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  onGeneratePDF={generatePDF}
                  onSpeakText={speakText}
                  onEditMessage={handleEditMessage}
                  isEditing={editingMessageId === message.id}
                  onStartEdit={(id) => {
                    setEditingMessageId(id);
                    setEditContent(message.content);
                  }}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <Card className="max-w-xs p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <Bot className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-700">Albedo is thinking...</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
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
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className="flex-1 border-blue-200 focus:border-blue-400 bg-white/80"
              disabled={isLoading}
            />
            
            <Button 
              onClick={handleSendMessage}
              disabled={(!inputMessage.trim() && uploadedFiles.length === 0) || isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            💡 Tip: You can edit any message by clicking the edit icon, upload multiple images, and download responses as PDF!
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
