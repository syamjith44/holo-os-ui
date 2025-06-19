import { useState, useCallback, useRef, useEffect } from "react";

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      
      // Initialize speech recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
      synthRef.current = speechSynthesis;
    }
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }, [isListening]);

  const speak = useCallback((text: string) => {
    if (!synthRef.current || !text) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    // Try to use a more robotic/synthetic voice if available
    const voices = synthRef.current.getVoices();
    const roboticVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('robotic') || 
      voice.name.toLowerCase().includes('computer') ||
      voice.name.toLowerCase().includes('synthetic')
    );
    
    if (roboticVoice) {
      utterance.voice = roboticVoice;
    }
    
    synthRef.current.speak(utterance);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speak,
  };
}
