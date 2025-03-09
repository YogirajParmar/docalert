import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  documentType: text("document_type").notNull(),
  vehicleType: text("vehicle_type").notNull(),
  vehicleNumber: text("vehicle_number").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  expirationDate: timestamp("expiration_date").notNull(),
});

export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
});


// Modified to handle date string inputs
export const insertDocumentSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  issueDate: z.string().transform((str) => new Date(str)),
  expirationDate: z.string().transform((str) => new Date(str)),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;