import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  subject?: string;
  hasImage?: boolean;
  isEdited?: boolean;
}

export const useMessageHandling = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const { toast } = useToast();

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
    const recentMessages = conversationHistory.slice(-4);
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

  const sendMessage = (inputMessage: string, uploadedFiles: File[]) => {
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
    }, Math.random() * 1000 + 1500);
  };

  const editMessage = (messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: newContent, isEdited: true }
        : msg
    ));
    
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

  return {
    messages,
    isLoading,
    editingMessageId,
    setEditingMessageId,
    sendMessage,
    editMessage
  };
};
