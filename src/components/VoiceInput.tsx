
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
  disabled?: boolean;
}

const VoiceInput = ({ onVoiceInput, disabled = false }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is available
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognitionAPI() as SpeechRecognition;
      
      // Enhanced configuration
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onstart = () => {
        console.log('Voice recognition started');
        setIsListening(true);
        
        // Auto-stop after 30 seconds to prevent hanging
        timeoutRef.current = setTimeout(() => {
          if (recognitionInstance) {
            recognitionInstance.stop();
          }
        }, 30000);
      };

      recognitionInstance.onresult = (event) => {
        console.log('Voice recognition result:', event.results);
        if (event.results && event.results.length > 0) {
          const transcript = event.results[0][0].transcript;
          console.log('Transcript:', transcript);
          onVoiceInput(transcript);
          toast({
            title: "Voice captured! 🎤",
            description: `Recognized: "${transcript.slice(0, 50)}${transcript.length > 50 ? '...' : ''}"`,
          });
        }
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        let errorMessage = "Could not recognize speech. Please try again.";
        if (event.error === 'no-speech') {
          errorMessage = "No speech detected. Please speak clearly and try again.";
        } else if (event.error === 'audio-capture') {
          errorMessage = "Microphone access denied or not available.";
        } else if (event.error === 'not-allowed') {
          errorMessage = "Microphone permission denied. Please allow microphone access.";
        }
        
        toast({
          title: "Voice input error",
          description: errorMessage,
          variant: "destructive"
        });
      };

      recognitionInstance.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      setRecognition(recognitionInstance);
    } else {
      setIsSupported(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onVoiceInput, toast]);

  const toggleListening = async () => {
    if (!recognition || !isSupported) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice input. Try Chrome or Edge.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      try {
        // Request microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognition.start();
        toast({
          title: "Listening... 🎤",
          description: "Speak now, I'm listening! (Auto-stops in 30 seconds)"
        });
      } catch (error) {
        console.error('Microphone access error:', error);
        toast({
          title: "Microphone access denied",
          description: "Please allow microphone access to use voice input.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleListening}
      disabled={disabled || !isSupported}
      className={`border-green-200 hover:bg-green-50 flex-shrink-0 transition-all duration-200 ${
        isListening ? 'bg-green-100 border-green-300 animate-pulse shadow-lg' : ''
      } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={
        !isSupported 
          ? "Voice input not supported in this browser" 
          : isListening 
            ? "Stop listening" 
            : "Voice input"
      }
    >
      {isListening ? (
        <MicOff className="w-4 h-4 text-green-600" />
      ) : (
        <Mic className={`w-4 h-4 ${isSupported ? 'text-green-600' : 'text-gray-400'}`} />
      )}
    </Button>
  );
};

export default VoiceInput;
