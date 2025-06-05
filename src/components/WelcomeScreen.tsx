
import { BookOpen, Brain, Camera, FileText, Sparkles, GraduationCap, Volume2, Edit3, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const WelcomeScreen = () => {
  const features = [
    {
      icon: Brain,
      title: "Intelligent Multi-Turn Conversations",
      description: "Remember context across messages, edit previous messages, and engage in natural dialogue"
    },
    {
      icon: BookOpen,
      title: "Comprehensive Academic Support",
      description: "LKG to Degree level support for CBSE & State syllabus across all subjects"
    },
    {
      icon: Camera,
      title: "Advanced Image Recognition",
      description: "Upload multiple screenshots, handwritten notes, and textbook pages for instant analysis"
    },
    {
      icon: FileText,
      title: "Rich Response Formats",
      description: "Download explanations as PDFs, listen to audio responses, and format content beautifully"
    },
    {
      icon: Volume2,
      title: "Text-to-Speech Integration",
      description: "Listen to any response with natural voice synthesis for better learning"
    },
    {
      icon: Edit3,
      title: "Message Editing & Context",
      description: "Edit any message to refine your questions and get updated, contextual responses"
    }
  ];

  const subjects = [
    { name: "Mathematics", emoji: "🧮", color: "bg-blue-100 text-blue-700", topics: "Algebra, Geometry, Calculus" },
    { name: "Science", emoji: "🔬", color: "bg-green-100 text-green-700", topics: "Physics, Chemistry, Biology" },
    { name: "English", emoji: "📚", color: "bg-purple-100 text-purple-700", topics: "Grammar, Literature, Writing" },
    { name: "Computer Science", emoji: "💻", color: "bg-orange-100 text-orange-700", topics: "Programming, Algorithms, Data Structures" },
    { name: "Social Science", emoji: "🌍", color: "bg-indigo-100 text-indigo-700", topics: "History, Geography, Civics" },
    { name: "General Knowledge", emoji: "🧠", color: "bg-pink-100 text-pink-700", topics: "Current Affairs, Facts, Trivia" }
  ];

  const exampleQuestions = [
    {
      question: "Explain photosynthesis with a step-by-step diagram",
      subject: "Biology",
      level: "Class 10"
    },
    {
      question: "Solve: x² + 5x + 6 = 0 using different methods",
      subject: "Mathematics",
      level: "Class 10+"
    },
    {
      question: "What are the main causes of World War I?",
      subject: "History",
      level: "Class 9+"
    },
    {
      question: "Write a Python function to find prime numbers",
      subject: "Computer Science",
      level: "Degree"
    }
  ];

  return (
    <div className="text-center space-y-8 py-8">
      {/* Welcome Header */}
      <div className="space-y-4">
        <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg border-2 border-blue-300">
          <GraduationCap className="w-12 h-12 text-white" />
        </div>
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Welcome to Albedo! 👋
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your intelligent educational companion powered by advanced AI. I provide comprehensive academic support 
            from kindergarten to degree level with multi-turn conversations, contextual understanding, and rich interactive features.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-500">
            <MessageCircle className="w-4 h-4" />
            <span>Created by Codoi Innovations</span>
          </div>
        </div>
      </div>

      {/* Enhanced Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 bg-white/90 border-2 border-blue-200 hover:shadow-lg hover:border-blue-300">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md border border-blue-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Subjects with Topics */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          <Sparkles className="w-6 h-6 inline mr-2 text-yellow-500" />
          Subjects I can help you with:
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {subjects.map((subject, index) => (
            <Card key={index} className={`p-4 ${subject.color} border-2 border-blue-200 hover:shadow-md`}>
              <div className="text-center">
                <div className="text-2xl mb-2">{subject.emoji}</div>
                <h4 className="font-semibold mb-1">{subject.name}</h4>
                <p className="text-xs opacity-80">{subject.topics}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Example Questions */}
      <Card className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-4 text-xl">
          💡 Try asking me questions like these:
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {exampleQuestions.map((example, index) => (
            <div key={index} className="bg-white/80 rounded-lg p-4 text-left shadow-sm hover:shadow-md border border-blue-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium border border-blue-200">
                  {example.subject}
                </span>
                <span className="text-xs text-gray-500">{example.level}</span>
              </div>
              <p className="text-sm text-gray-700 font-medium">"{example.question}"</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-white/70 rounded-lg border border-blue-200">
          <h4 className="font-medium text-gray-800 mb-2">✨ Pro Features:</h4>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>• Upload images of questions for instant solutions</div>
            <div>• Edit any message to refine your questions</div>
            <div>• Download responses as formatted PDFs</div>
            <div>• Listen to explanations with text-to-speech</div>
            <div>• Multi-turn conversations with full context</div>
            <div>• Step-by-step explanations with examples</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
