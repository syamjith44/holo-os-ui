import { create } from 'zustand';

interface WindowState {
  id: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
}

interface WindowStore {
  windows: Map<string, WindowState>;
  activeWindowId: string | null;
  nextZIndex: number;
  
  // Actions
  addWindow: (window: Omit<WindowState, 'zIndex'>) => void;
  removeWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowState>) => void;
  setActiveWindow: (id: string) => void;
  bringToFront: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  moveWindow: (id: string, position: { x: number; y: number }) => void;
  resizeWindow: (id: string, size: { width: number; height: number }) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: new Map(),
  activeWindowId: null,
  nextZIndex: 1,

  addWindow: (window) => {
    const { nextZIndex } = get();
    set((state) => ({
      windows: new Map(state.windows).set(window.id, {
        ...window,
        zIndex: nextZIndex,
      }),
      nextZIndex: nextZIndex + 1,
      activeWindowId: window.id,
    }));
  },

  removeWindow: (id) => {
    set((state) => {
      const newWindows = new Map(state.windows);
      newWindows.delete(id);
      return {
        windows: newWindows,
        activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
      };
    });
  },

  updateWindow: (id, updates) => {
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;
      
      const newWindows = new Map(state.windows);
      newWindows.set(id, { ...window, ...updates });
      return { windows: newWindows };
    });
  },

  setActiveWindow: (id) => {
    set({ activeWindowId: id });
  },

  bringToFront: (id) => {
    const { nextZIndex } = get();
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;
      
      const newWindows = new Map(state.windows);
      newWindows.set(id, { ...window, zIndex: nextZIndex });
      return {
        windows: newWindows,
        nextZIndex: nextZIndex + 1,
        activeWindowId: id,
      };
    });
  },

  minimizeWindow: (id) => {
    get().updateWindow(id, { isMinimized: true });
  },

  maximizeWindow: (id) => {
    const window = get().windows.get(id);
    if (!window) return;
    
    get().updateWindow(id, {
      isMaximized: !window.isMaximized,
      position: window.isMaximized ? window.position : { x: 0, y: 0 },
      size: window.isMaximized 
        ? window.size 
        : { width: window.innerWidth || 1200, height: (window.innerHeight || 800) - 48 },
    });
  },

  moveWindow: (id, position) => {
    get().updateWindow(id, { position });
  },

  resizeWindow: (id, size) => {
    get().updateWindow(id, { size });
  },
}));
