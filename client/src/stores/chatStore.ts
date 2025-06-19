import { create } from 'zustand';
import type { ChatMessage } from '@shared/schema';

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  
  // Actions
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setMessages: (messages) => {
    set({ messages });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  clearMessages: () => {
    set({ messages: [] });
  },
}));
