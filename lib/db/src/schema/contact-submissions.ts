import { pgTable, serial, text, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const contactSubmissionsTable = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  phone: text("phone").default(""),
  projectType: text("project_type").notNull(),
  message: text("message").notNull(),
  files: jsonb("files").$type<Array<{ original: string; stored: string; size: number }>>().default([]),
  ip: text("ip").default(""),
  isRead: boolean("is_read").default(false).notNull(),
  deletedAt: timestamp("deleted_at"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissionsTable).omit({ id: true });
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissionsTable.$inferSelect;
