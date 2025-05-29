
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
  disabled?: boolean;
}

const VoiceInput = ({ onVoiceInput, disabled = false }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onVoiceInput(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice input error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive"
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onVoiceInput, toast]);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast({
        title: "Listening... 🎤",
        description: "Speak now, I'm listening!"
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleListening}
      disabled={disabled || !recognition}
      className={`border-green-200 hover:bg-green-50 flex-shrink-0 transition-all duration-200 ${
        isListening ? 'bg-green-100 border-green-300 animate-pulse' : ''
      }`}
      title={isListening ? "Stop listening" : "Voice input"}
    >
      {isListening ? (
        <MicOff className="w-4 h-4 text-green-600" />
      ) : (
        <Mic className="w-4 h-4 text-green-600" />
      )}
    </Button>
  );
};

export default VoiceInput;
