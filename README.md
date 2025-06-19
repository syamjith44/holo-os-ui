# Holographic OS

A minimal futuristic holographic web-based operating system with single-color wireframe design, featuring voice-enabled chatbot and interactive navigation.

## Features

- **Draggable Window System**: Multi-window interface with overlapping, resizable, and minimizable windows
- **Voice-Enabled AI Assistant**: Chatbot with speech recognition and text-to-speech capabilities
- **Interactive Map Navigation**: Wireframe-style map with node-based navigation system
- **Real-time Performance Graphs**: Live CPU, memory, and network monitoring with animated charts
- **Communications Hub**: Contact management and messaging interface
- **Holographic Design**: Minimal cyan/blue color scheme with transparent effects and wireframe aesthetics

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Real-time Communication**: WebSockets
- **Voice Processing**: Web Speech API
- **Routing**: Wouter

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## Local Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd holographic-os
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
```

### 4. Start Development Server

```bash
npm run dev
```

This will start both the frontend and backend servers:
- Frontend: Accessible via Vite dev server
- Backend: Express server running on port 5000
- WebSocket server: Available at `/ws` endpoint

### 5. Open in Browser

The application will automatically open in your default browser. If not, navigate to:
```
http://localhost:5000
```

## Project Structure

```
holographic-os/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── desktop/    # Desktop environment components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   └── windows/    # Window-specific components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand state stores
│   │   └── main.tsx        # Application entry point
│   └── index.html
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes and WebSocket setup
│   ├── storage.ts         # In-memory data storage
│   └── vite.ts            # Vite integration
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schemas and types
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production version
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking

## Key Components

### Window System
- **BaseWindow**: Core window functionality with drag, resize, minimize
- **WindowManager**: Global window state management
- **DesktopEnvironment**: Main desktop container

### Application Windows
- **ChatBotWindow**: AI assistant with voice capabilities
- **MapWindow**: Interactive navigation system
- **CommunicationsWindow**: Contact and messaging interface
- **SimpleGraphWindow**: Real-time performance monitoring
- **SystemMonitorWindow**: Basic system information

### Voice Features
- **Speech Recognition**: Convert speech to text for chatbot input
- **Text-to-Speech**: AI responses spoken with robotic voice
- **Voice Controls**: Hands-free interaction capabilities

## API Endpoints

- `GET /api/chat/messages` - Retrieve chat history
- `POST /api/chat/messages` - Send new message to AI
- `GET /api/contacts` - Get contact list
- `GET /api/system/metrics` - Real-time system metrics
- `WebSocket /ws` - Real-time bidirectional communication

## Customization

### Adding New Windows
1. Create component in `client/src/components/windows/`
2. Import in `DesktopEnvironment.tsx`
3. Add to window creation in `useEffect`
4. Update TaskBar window types for dynamic creation

### Styling
- Main theme colors defined in `client/src/index.css`
- Holographic effects use CSS custom properties
- Wireframe aesthetics achieved through border styles and transparency

### Voice Configuration
- Voice settings configurable in `client/src/lib/voice.ts`
- Supports different speech synthesis voices
- Adjustable rate, pitch, and volume parameters

## Browser Compatibility

- Chrome/Chromium (recommended for voice features)
- Firefox (limited voice support)
- Safari (basic functionality)
- Edge (full support)

**Note**: Voice features require HTTPS in production environments.

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **WebSocket Connection**: Check browser console for connection status
3. **Voice Permissions**: Browser may prompt for microphone permissions
4. **Window Management**: Use mouse drag for window positioning, corners for resizing

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set production environment variables
3. Deploy to your preferred hosting platform
4. Ensure HTTPS for voice features

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

*Experience the future of computing with Holographic OS - where minimalism meets functionality in a stunning wireframe interface.*