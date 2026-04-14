import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const notificationEmailsTable = pgTable("notification_emails", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

export type NotificationEmail = typeof notificationEmailsTable.$inferSelect;
