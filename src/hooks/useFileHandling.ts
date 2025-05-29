
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useFileHandling = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = ['image/', 'application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats-officedocument'];
    const validFiles = files.filter(file => 
      allowedTypes.some(type => file.type.startsWith(type))
    );
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    if (validFiles.length > 0) {
      toast({
        title: "Files uploaded! 📁",
        description: `${validFiles.length} file(s) ready for analysis by Albedo Educator.`
      });
    }
    
    if (files.length > validFiles.length) {
      toast({
        title: "Some files skipped",
        description: "Only images, PDFs, and documents are supported.",
        variant: "destructive"
      });
    }
  };

  const generatePDF = (messageContent: string) => {
    const cleanContent = messageContent.replace(/[*#]/g, '').replace(/\n/g, '\n');
    const blob = new Blob([`Albedo Educator Response\n\nGenerated on: ${new Date().toLocaleString()}\n\n${cleanContent}\n\n---\nPowered by Albedo Educator - Your AI Learning Companion`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `albedo-educator-response-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Response Downloaded! 📄",
      description: "Your learning material has been saved successfully."
    });
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#🎯📘🔍✨🧮🔬📚💻🌍🧠😊👋📄🎵🎓]/g, ''));
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.voice = speechSynthesis.getVoices().find(voice => voice.name.includes('Female')) || null;
      speechSynthesis.speak(utterance);
      
      toast({
        title: "Playing audio! 🎵",
        description: "Albedo is reading the response aloud."
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
