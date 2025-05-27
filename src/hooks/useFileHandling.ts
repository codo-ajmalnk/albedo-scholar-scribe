
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFileHandling = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

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

  return {
    uploadedFiles,
    setUploadedFiles,
    handleFileUpload,
    generatePDF,
    speakText
  };
};
