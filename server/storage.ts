import { 
  users, 
  chatMessages, 
  contacts, 
  systemMetrics,
  type User, 
  type InsertUser,
  type ChatMessage,
  type InsertChatMessage,
  type Contact,
  type InsertContact,
  type SystemMetrics,
  type InsertSystemMetrics
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getChatMessages(userId?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  getContacts(userId: number): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContactStatus(contactId: number, status: string): Promise<Contact | undefined>;
  
  getLatestSystemMetrics(): Promise<SystemMetrics | undefined>;
  createSystemMetrics(metrics: InsertSystemMetrics): Promise<SystemMetrics>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private chatMessages: Map<number, ChatMessage>;
  private contacts: Map<number, Contact>;
  private systemMetrics: Map<number, SystemMetrics>;
  private currentUserId: number;
  private currentChatId: number;
  private currentContactId: number;
  private currentMetricsId: number;

  constructor() {
    this.users = new Map();
    this.chatMessages = new Map();
    this.contacts = new Map();
    this.systemMetrics = new Map();
    this.currentUserId = 1;
    this.currentChatId = 1;
    this.currentContactId = 1;
    this.currentMetricsId = 1;
    
    // Initialize with some default data
    this.initializeDefaults();
  }

  private initializeDefaults() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "admin",
      password: "admin123",
    };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;

    // Create initial contacts
    const initialContacts: Contact[] = [
      { id: 1, userId: 1, name: "John Doe", status: "online", avatarInitials: "JD" },
      { id: 2, userId: 1, name: "Alice Smith", status: "away", avatarInitials: "AS" },
      { id: 3, userId: 1, name: "Mike Brown", status: "online", avatarInitials: "MB" },
    ];
    initialContacts.forEach(contact => {
      this.contacts.set(contact.id, contact);
    });
    this.currentContactId = 4;

    // Create initial chat messages
    const initialMessages: ChatMessage[] = [
      { id: 1, userId: 1, content: "Hello! I'm your holographic assistant. How can I help you today?", isBot: true, timestamp: new Date() },
    ];
    initialMessages.forEach(message => {
      this.chatMessages.set(message.id, message);
    });
    this.currentChatId = 2;

    // Create initial system metrics
    const initialMetrics: SystemMetrics = {
      id: 1,
      cpuUsage: 47,
      memoryUsage: 39,
      networkStatus: "CONNECTED",
      timestamp: new Date(),
    };
    this.systemMetrics.set(1, initialMetrics);
    this.currentMetricsId = 2;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getChatMessages(userId?: number): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values());
    if (userId) {
      return messages.filter(msg => msg.userId === userId);
    }
    return messages.sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatId++;
    const message: ChatMessage = {
      id,
      content: insertMessage.content,
      userId: insertMessage.userId || null,
      isBot: insertMessage.isBot || null,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getContacts(userId: number): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(contact => contact.userId === userId);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = {
      id,
      name: insertContact.name,
      userId: insertContact.userId || null,
      status: insertContact.status || "offline",
      avatarInitials: insertContact.avatarInitials,
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async updateContactStatus(contactId: number, status: string): Promise<Contact | undefined> {
    const contact = this.contacts.get(contactId);
    if (contact) {
      const updatedContact = { ...contact, status };
      this.contacts.set(contactId, updatedContact);
      return updatedContact;
    }
    return undefined;
  }

  async getLatestSystemMetrics(): Promise<SystemMetrics | undefined> {
    const metrics = Array.from(this.systemMetrics.values());
    return metrics.sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))[0];
  }

  async createSystemMetrics(insertMetrics: InsertSystemMetrics): Promise<SystemMetrics> {
    const id = this.currentMetricsId++;
    const metrics: SystemMetrics = {
      ...insertMetrics,
      id,
      timestamp: new Date(),
    };
    this.systemMetrics.set(id, metrics);
    return metrics;
  }
}

export const storage = new MemStorage();
