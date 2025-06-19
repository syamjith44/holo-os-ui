import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertChatMessageSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time communication
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'chat_message') {
          // Handle chat messages
          const chatMessage = await storage.createChatMessage({
            userId: data.userId || 1,
            content: data.content,
            isBot: false,
          });

          // Broadcast to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'chat_message',
                message: chatMessage,
              }));
            }
          });

          // Generate AI response (mock for now)
          setTimeout(async () => {
            const botResponse = await storage.createChatMessage({
              userId: data.userId || 1,
              content: generateAIResponse(data.content),
              isBot: true,
            });

            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'chat_message',
                  message: botResponse,
                }));
              }
            });
          }, 1000);
        }

        if (data.type === 'contact_status_update') {
          const updatedContact = await storage.updateContactStatus(data.contactId, data.status);
          
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'contact_status_update',
                contact: updatedContact,
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Chat API routes
  app.get('/api/chat/messages', async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const messages = await storage.getChatMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
  });

  app.post('/api/chat/messages', async (req, res) => {
    try {
      const validatedData = insertChatMessageSchema.parse(req.body);
      const message = await storage.createChatMessage(validatedData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid message data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create message' });
      }
    }
  });

  // Contacts API routes
  app.get('/api/contacts', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string) || 1;
      const contacts = await storage.getContacts(userId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  });

  app.post('/api/contacts', async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid contact data', details: error.errors });
      } else {
        res.status(500).json({ error: 'Failed to create contact' });
      }
    }
  });

  // System metrics API
  app.get('/api/system/metrics', async (req, res) => {
    try {
      // Always generate fresh dynamic metrics for real-time graphs
      const baseTime = Date.now();
      const cpuBase = 45 + Math.sin(baseTime / 10000) * 20;
      const memoryBase = 35 + Math.cos(baseTime / 8000) * 15;
      
      const freshMetrics = await storage.createSystemMetrics({
        cpuUsage: Math.max(5, Math.min(95, Math.floor(cpuBase + (Math.random() - 0.5) * 10))),
        memoryUsage: Math.max(10, Math.min(85, Math.floor(memoryBase + (Math.random() - 0.5) * 8))),
        networkStatus: Math.random() > 0.05 ? 'CONNECTED' : 'DISCONNECTED',
      });
      res.json(freshMetrics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch system metrics' });
    }
  });

  // Voice-to-text endpoint (placeholder for future implementation)
  app.post('/api/voice/transcribe', async (req, res) => {
    try {
      // This would integrate with a speech-to-text service
      res.json({ text: "Voice transcription not yet implemented" });
    } catch (error) {
      res.status(500).json({ error: 'Voice transcription failed' });
    }
  });

  return httpServer;
}

function generateAIResponse(userMessage: string): string {
  const responses = [
    "I understand. Let me process that information for you.",
    "Interesting. I'm analyzing the data patterns in your request.",
    "System analysis complete. Here's what I found:",
    "Processing your query through the holographic interface.",
    "Accessing database... Query resolved successfully.",
    "Holographic scan initiated. Results are being compiled.",
    "Neural network processing... Response generated.",
    "Quantum analysis complete. Data synthesis in progress.",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}
