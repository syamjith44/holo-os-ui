import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useVoice } from "@/hooks/useVoice";
import { apiRequest } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

export default function ChatBotWindow() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { sendMessage } = useWebSocket();
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    speak,
    isSupported 
  } = useVoice();

  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/chat/messages'],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('POST', '/api/chat/messages', {
        userId: 1,
        content,
        isBot: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
    },
  });

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    setInput("");
    
    // Send via WebSocket for real-time experience
    sendMessage({
      type: 'chat_message',
      userId: 1,
      content: content.trim(),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Handle voice transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speak bot messages
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage && latestMessage.isBot) {
      speak(latestMessage.content);
    }
  }, [messages, speak]);

  // Listen for WebSocket messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat_message') {
        queryClient.invalidateQueries({ queryKey: ['/api/chat/messages'] });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm opacity-60">Loading chat history...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 holo-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center text-sm opacity-60 py-8">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.isBot ? "" : "flex-row-reverse space-x-reverse"
              }`}
            >
              <div className="w-6 h-6 border border-holo-accent rounded flex items-center justify-center text-xs flex-shrink-0">
                {message.isBot ? "AI" : "U"}
              </div>
              <div
                className={`flex-1 text-sm p-2 rounded border max-w-xs ${
                  message.isBot
                    ? "bg-holo-surface border-holo-border"
                    : "bg-holo-accent bg-opacity-20 border-holo-accent"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-holo-border flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message or use voice..."
            className="flex-1 holo-input px-3 py-2 rounded"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            type="submit"
            disabled={!input.trim() || sendMessageMutation.isPending}
            className="holo-button-primary"
          >
            <Send className="w-3 h-3" />
          </Button>
          {isSupported && (
            <Button
              type="button"
              onClick={toggleVoice}
              className={`holo-button ${isListening ? "border-holo-accent text-holo-accent animate-pulse" : ""}`}
            >
              {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
            </Button>
          )}
        </form>
        {isListening && (
          <div className="text-xs text-center mt-2 text-holo-accent animate-pulse">
            Listening... Speak now
          </div>
        )}
      </div>
    </div>
  );
}
