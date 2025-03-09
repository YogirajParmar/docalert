import {
  users,
  documents,
  type User,
  type InsertUser,
  type Document,
  type InsertDocument,
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store;

  // Document operations
  getDocuments(userId: number): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(userId: number, doc: InsertDocument): Promise<Document>;
  updateDocument(id: number, doc: InsertDocument): Promise<Document>;
  deleteDocument(id: number): Promise<void>;
  getDocumentStats(
    userId: number
  ): Promise<{ totalDocuments: number; expiredDocuments: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private documents: Map<number, Document>;
  currentId: number;
  currentDocId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.currentId = 1;
    this.currentDocId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDocuments(userId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (doc) => doc.userId === userId
    );
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(userId: number, doc: InsertDocument): Promise<Document> {
    const id = this.currentDocId++;
    const document: Document = { ...doc, id, userId };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: number, doc: InsertDocument): Promise<Document> {
    const existing = this.documents.get(id);
    if (!existing) throw new Error("Document not found");
    const updated: Document = { ...doc, id, userId: existing.userId };
    this.documents.set(id, updated);
    return updated;
  }

  async deleteDocument(id: number): Promise<void> {
    this.documents.delete(id);
  }

  async getDocumentStats(
    userId: number
  ): Promise<{ totalDocuments: number; expiredDocuments: number }> {
    const docs = await this.getDocuments(userId);
    const now = new Date();
    return {
      totalDocuments: docs.length,
      expiredDocuments: docs.filter((doc) => new Date(doc.expirationDate) < now)
        .length,
    };
  }
}

export const storage = new MemStorage();
