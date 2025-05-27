
import { BookOpen, Brain, Camera, FileText, Sparkles, GraduationCap } from 'lucide-react';
import { Card } from '@/components/ui/card';

const WelcomeScreen = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Multi-Subject Support",
      description: "From LKG to Degree level - Math, Science, English, Computer Science & more"
    },
    {
      icon: Brain,
      title: "Smart Learning",
      description: "Adapts to your level and provides step-by-step explanations"
    },
    {
      icon: Camera,
      title: "Image Recognition",
      description: "Upload screenshots of questions and get instant solutions"
    },
    {
      icon: FileText,
      title: "PDF Export",
      description: "Download explanations and solutions as formatted PDFs"
    }
  ];

  const subjects = [
    { name: "Mathematics", emoji: "🧮", color: "bg-blue-100 text-blue-700" },
    { name: "Science", emoji: "🔬", color: "bg-green-100 text-green-700" },
    { name: "English", emoji: "📚", color: "bg-purple-100 text-purple-700" },
    { name: "Computer Science", emoji: "💻", color: "bg-orange-100 text-orange-700" },
    { name: "Social Science", emoji: "🌍", color: "bg-indigo-100 text-indigo-700" },
    { name: "General Knowledge", emoji: "🧠", color: "bg-pink-100 text-pink-700" }
  ];

  return (
    <div className="text-center space-y-8 py-8">
      {/* Welcome Header */}
      <div className="space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome to Albedo! 👋
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your intelligent educational companion ready to help with studies from kindergarten to degree level.
            Ask me anything, upload images of questions, or explore topics across multiple subjects! 
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 bg-white/80 border-blue-200 hover:shadow-md transition-all duration-200">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Subjects */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">
          <Sparkles className="w-5 h-5 inline mr-2 text-yellow-500" />
          I can help you with these subjects:
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {subjects.map((subject, index) => (
            <div key={index} className={`px-4 py-2 rounded-full ${subject.color} font-medium text-sm`}>
              {subject.emoji} {subject.name}
            </div>
          ))}
        </div>
      </div>

      {/* Example Prompts */}
      <Card className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <h3 className="font-semibold text-gray-800 mb-3">
          💡 Try asking me something like:
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="bg-white/70 rounded-lg p-3 text-left">
            "Explain photosynthesis in simple terms"
          </div>
          <div className="bg-white/70 rounded-lg p-3 text-left">
            "Help me solve this quadratic equation: x² + 5x + 6 = 0"
          </div>
          <div className="bg-white/70 rounded-lg p-3 text-left">
            "What's the difference between RAM and ROM?"
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WelcomeScreen;
