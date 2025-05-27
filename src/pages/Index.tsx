
import { useState, useRef, useEffect } from 'react';
import { Send, Upload, FileDown, Image as ImageIcon, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ChatMessage from '@/components/ChatMessage';
import WelcomeScreen from '@/components/WelcomeScreen';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  subject?: string;
  hasImage?: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectSubject = (message: string): string => {
    const keywords = {
      'Mathematics': ['math', 'calculate', 'equation', 'algebra', 'geometry', 'trigonometry', 'calculus', 'number'],
      'Science': ['science', 'physics', 'chemistry', 'biology', 'experiment', 'molecule', 'atom', 'cell'],
      'English': ['grammar', 'essay', 'literature', 'poem', 'writing', 'sentence', 'paragraph'],
      'Computer Science': ['programming', 'code', 'algorithm', 'computer', 'software', 'python', 'javascript'],
      'Social Science': ['history', 'geography', 'civics', 'politics', 'society', 'culture', 'economics'],
      'General Knowledge': ['gk', 'general', 'current affairs', 'quiz', 'facts', 'trivia']
    };

    const lowerMessage = message.toLowerCase();
    for (const [subject, words] of Object.entries(keywords)) {
      if (words.some(word => lowerMessage.includes(word))) {
        return subject;
      }
    }
    return 'General';
  };

  const generateAIResponse = (userMessage: string, subject: string): string => {
    const responses = {
      'Mathematics': [
        "Great math question! 📘 Let me break this down step by step for you.",
        "Excellent! Mathematics is all about understanding patterns. Let me explain this clearly. 🧮",
        "I love helping with math problems! Here's how we can solve this systematically. ✨"
      ],
      'Science': [
        "Fascinating science question! 🔬 Science is all about curiosity and discovery. Let me explain this concept.",
        "Great scientific thinking! 🧪 Let me help you understand this phenomenon step by step.",
        "Science is amazing! 🌟 Here's what's happening in this case..."
      ],
      'English': [
        "Wonderful question about English! 📚 Language is a beautiful tool for expression. Let me help you with this.",
        "Great English query! ✍️ Let me guide you through this concept clearly.",
        "English can be fun and creative! 📖 Here's how we can approach this..."
      ],
      'Computer Science': [
        "Excellent tech question! 💻 Programming and computer science open up endless possibilities. Let me explain this.",
        "Great computer science question! 🚀 Technology shapes our world. Here's how this works...",
        "Love the coding curiosity! 👨‍💻 Let me break down this concept for you."
      ],
      'Social Science': [
        "Interesting social science question! 🌍 Understanding society and history helps us grow. Let me explain this.",
        "Great question about our world! 🏛️ Social sciences help us understand human behavior and society.",
        "Wonderful curiosity about society! 📜 Here's what you need to know about this topic..."
      ],
      'General Knowledge': [
        "Great general knowledge question! 🧠 Learning about the world around us is always exciting.",
        "Interesting question! 🌟 General knowledge helps us become well-rounded individuals.",
        "Love your curiosity! 💡 Here's some fascinating information about this topic..."
      ],
      'General': [
        "Thanks for your question! 😊 I'm here to help you learn and understand better.",
        "Great question! 🌟 Let me provide you with a clear and helpful explanation.",
        "I'm happy to help! 💫 Here's what I can share about this topic..."
      ]
    };

    const subjectResponses = responses[subject as keyof typeof responses] || responses['General'];
    const randomResponse = subjectResponses[Math.floor(Math.random() * subjectResponses.length)];
    
    // Add some educational content based on the subject
    let educationalContent = "";
    if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('explain')) {
      educationalContent = "\n\nI notice you're looking for help! I'm designed to assist students from LKG to Degree level with various subjects. Feel free to ask me about:\n• Mathematics (algebra, geometry, calculus)\n• Science (physics, chemistry, biology)\n• English (grammar, literature, writing)\n• Computer Science (programming, algorithms)\n• Social Science (history, geography, civics)\n• General Knowledge and much more!\n\nWould you like me to explain any specific topic? 📚";
    }

    return randomResponse + educationalContent + "\n\n💡 **Pro tip:** You can upload images of questions or textbook pages, and I'll help solve them! Would you like this response as a downloadable PDF? 📄";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() && !uploadedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage || 'Uploaded an image',
      timestamp: new Date(),
      hasImage: !!uploadedFile
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const subject = detectSubject(inputMessage);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage, subject),
        timestamp: new Date(),
        subject
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);

    setInputMessage('');
    setUploadedFile(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      console.log('Image uploaded successfully:', file.name);
    }
  };

  const generatePDF = (messageContent: string) => {
    // Simple PDF generation simulation - in production, use jsPDF or similar
    const blob = new Blob([`Albedo AI Response\n\n${messageContent}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `albedo-response-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Albedo – AI Chat Assistant
              </h1>
              <p className="text-sm text-gray-600">Educational & Smart Chatbot 🎓</p>
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
                />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <Card className="max-w-xs p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-5 h-5 text-blue-600" />
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
        <Card className="p-4 bg-white/80 backdrop-blur-md border-blue-200">
          {uploadedFile && (
            <div className="mb-3 flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">{uploadedFile.name}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUploadedFile(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </Button>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="border-blue-200 hover:bg-blue-50"
            >
              <Upload className="w-4 h-4" />
            </Button>
            
            <Input
              placeholder="Ask me anything about your studies! 📚"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border-blue-200 focus:border-blue-400"
            />
            
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() && !uploadedFile}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </Card>
      </div>
    </div>
  );
};

export default Index;
