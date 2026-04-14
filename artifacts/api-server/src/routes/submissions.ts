import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, contactSubmissionsTable, notificationEmailsTable, adminSettingsTable } from "@workspace/db";
import { desc, eq, isNull, and } from "drizzle-orm";
import crypto from "crypto";
import { promisify } from "util";
import { Resend } from "resend";
import { logger } from "../lib/logger";

const router: IRouter = Router();
const scryptAsync = promisify(crypto.scrypt);

// ─── Session management ────────────────────────────────────────────────────
const activeSessions = new Map<string, number>();
const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours
const resetTokens = new Map<string, number>(); // token → expiresAt
const RESET_TOKEN_TTL = 60 * 60 * 1000; // 1 hour

const ADMIN_USERNAME = "asivanta";
const DEFAULT_PASSWORD = "asivanta2026!";

function cleanExpiredSessions() {
  const now = Date.now();
  for (const [token, expiresAt] of activeSessions) {
    if (now > expiresAt) activeSessions.delete(token);
  }
  for (const [token, expiresAt] of resetTokens) {
    if (now > expiresAt) resetTokens.delete(token);
  }
}
setInterval(cleanExpiredSessions, 10 * 60 * 1000);

// ─── Password hashing ──────────────────────────────────────────────────────
async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (stored.startsWith("scrypt:")) {
    const parts = stored.split(":");
    const salt = parts[1];
    const hash = parts[2];
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    const storedKey = Buffer.from(hash, "hex");
    return crypto.timingSafeEqual(derivedKey, storedKey);
  }
  // Legacy: plain-text env var comparison
  const a = Buffer.from(password);
  const b = Buffer.from(stored);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

async function getAdminPasswordHash(): Promise<string> {
  try {
    const [row] = await db
      .select({ value: adminSettingsTable.value })
      .from(adminSettingsTable)
      .where(eq(adminSettingsTable.key, "password_hash"))
      .limit(1);
    if (row) return row.value;
  } catch { /* db not ready */ }

  // Fall back to env var or default
  return process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

async function setAdminPasswordHash(hash: string): Promise<void> {
  await db
    .insert(adminSettingsTable)
    .values({ key: "password_hash", value: hash, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: adminSettingsTable.key,
      set: { value: hash, updatedAt: new Date() },
    });
}

// ─── Notification emails helpers ───────────────────────────────────────────
async function getNotificationEmails(): Promise<string[]> {
  try {
    const rows = await db
      .select({ email: notificationEmailsTable.email })
      .from(notificationEmailsTable)
      .orderBy(notificationEmailsTable.addedAt);

    if (rows.length === 0) {
      // Seed the default email on first use
      await db
        .insert(notificationEmailsTable)
        .values({ email: "contact@asivanta.com" })
        .onConflictDoNothing();
      return ["contact@asivanta.com"];
    }
    return rows.map((r) => r.email);
  } catch {
    return ["contact@asivanta.com"];
  }
}

// ─── Auth middleware ───────────────────────────────────────────────────────
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required." });
  }
  const token = authHeader.slice(7);
  const expiresAt = activeSessions.get(token);
  if (!expiresAt || Date.now() > expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }
  next();
}

// ─── POST /admin/login ─────────────────────────────────────────────────────
router.post("/admin/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || typeof username !== "string" || username.trim().toLowerCase() !== ADMIN_USERNAME) {
    return res.status(403).json({ error: "Invalid credentials." });
  }
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Password is required." });
  }

  try {
    const storedHash = await getAdminPasswordHash();
    const isValid = await verifyPassword(password, storedHash);

    if (!isValid) {
      return res.status(403).json({ error: "Invalid credentials." });
    }

    // If password was stored as plain text (env var / default), migrate to hash
    if (!storedHash.startsWith("scrypt:")) {
      const newHash = await hashPassword(password);
      await setAdminPasswordHash(newHash).catch(() => { /* non-fatal */ });
    }

    const token = crypto.randomBytes(32).toString("hex");
    activeSessions.set(token, Date.now() + SESSION_TTL);
    return res.json({ token });
  } catch (err) {
    logger.error({ err }, "Admin login error");
    return res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// ─── POST /admin/logout ────────────────────────────────────────────────────
router.post("/admin/logout", requireAdminAuth, (req: Request, res: Response) => {
  const token = req.headers.authorization!.slice(7);
  activeSessions.delete(token);
  return res.json({ success: true });
});

// ─── POST /admin/forgot-password ──────────────────────────────────────────
router.post("/admin/forgot-password", async (_req: Request, res: Response) => {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  const resetToken = crypto.randomBytes(32).toString("hex");
  resetTokens.set(resetToken, Date.now() + RESET_TOKEN_TTL);

  const resetUrl = `${process.env.SITE_URL || "https://asivanta.com"}/admin?reset=${resetToken}`;

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: fromEmail,
        to: ["contact@asivanta.com"],
        subject: "ASIVANTA Admin — Password Reset Request",
        text: `A password reset was requested for the ASIVANTA admin panel.\n\nClick the link below to set a new password. This link expires in 1 hour.\n\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
      });
    } catch (err) {
      logger.error({ err }, "Failed to send reset email");
    }
  }

  logger.info("Admin password reset requested");
  return res.json({ success: true });
});

// ─── POST /admin/reset-password ───────────────────────────────────────────
router.post("/admin/reset-password", async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ error: "Reset token is required." });
  }
  if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters." });
  }

  const expiresAt = resetTokens.get(token);
  if (!expiresAt || Date.now() > expiresAt) {
    resetTokens.delete(token);
    return res.status(400).json({ error: "Reset link has expired. Please request a new one." });
  }

  try {
    const hash = await hashPassword(newPassword);
    await setAdminPasswordHash(hash);
    resetTokens.delete(token);
    logger.info("Admin password reset successfully");
    return res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Failed to reset password");
    return res.status(500).json({ error: "Failed to reset password. Please try again." });
  }
});

// ─── POST /admin/change-password ──────────────────────────────────────────
router.post("/admin/change-password", requireAdminAuth, async (req: Request, res: Response) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ error: "All password fields are required." });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "New passwords do not match." });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters." });
  }

  try {
    const storedHash = await getAdminPasswordHash();
    const isValid = await verifyPassword(currentPassword, storedHash);
    if (!isValid) {
      return res.status(403).json({ error: "Current password is incorrect." });
    }

    const hash = await hashPassword(newPassword);
    await setAdminPasswordHash(hash);
    logger.info("Admin password changed successfully");
    return res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Failed to change password");
    return res.status(500).json({ error: "Failed to change password. Please try again." });
  }
});

// ─── GET /submissions ──────────────────────────────────────────────────────
router.get("/submissions", requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select({
        id: contactSubmissionsTable.id,
        fullName: contactSubmissionsTable.fullName,
        company: contactSubmissionsTable.company,
        email: contactSubmissionsTable.email,
        projectType: contactSubmissionsTable.projectType,
        isRead: contactSubmissionsTable.isRead,
        submittedAt: contactSubmissionsTable.submittedAt,
      })
      .from(contactSubmissionsTable)
      .where(isNull(contactSubmissionsTable.deletedAt))
      .orderBy(desc(contactSubmissionsTable.submittedAt));

    return res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to fetch submissions");
    return res.status(500).json({ error: "Failed to fetch submissions." });
  }
});

// ─── GET /submissions/:id ──────────────────────────────────────────────────
router.get("/submissions/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid submission ID." });

    const [row] = await db
      .select()
      .from(contactSubmissionsTable)
      .where(and(eq(contactSubmissionsTable.id, id), isNull(contactSubmissionsTable.deletedAt)))
      .limit(1);

    if (!row) return res.status(404).json({ error: "Submission not found." });

    // Auto-mark as read when opened
    if (!row.isRead) {
      await db
        .update(contactSubmissionsTable)
        .set({ isRead: true })
        .where(eq(contactSubmissionsTable.id, id));
    }

    return res.json({ ...row, isRead: true });
  } catch (err) {
    logger.error({ err }, "Failed to fetch submission detail");
    return res.status(500).json({ error: "Failed to fetch submission." });
  }
});

// ─── PATCH /submissions/:id/read ──────────────────────────────────────────
router.patch("/submissions/:id/read", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid submission ID." });

    const { isRead } = req.body;
    if (typeof isRead !== "boolean") {
      return res.status(400).json({ error: "isRead must be a boolean." });
    }

    await db
      .update(contactSubmissionsTable)
      .set({ isRead })
      .where(and(eq(contactSubmissionsTable.id, id), isNull(contactSubmissionsTable.deletedAt)));

    return res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Failed to update read status");
    return res.status(500).json({ error: "Failed to update status." });
  }
});

// ─── DELETE /submissions/:id ───────────────────────────────────────────────
router.delete("/submissions/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid submission ID." });

    await db
      .update(contactSubmissionsTable)
      .set({ deletedAt: new Date() })
      .where(eq(contactSubmissionsTable.id, id));

    return res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Failed to delete submission");
    return res.status(500).json({ error: "Failed to delete submission." });
  }
});

// ─── GET /admin/notification-emails ───────────────────────────────────────
router.get("/admin/notification-emails", requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const rows = await db
      .select()
      .from(notificationEmailsTable)
      .orderBy(notificationEmailsTable.addedAt);

    // Seed default if empty
    if (rows.length === 0) {
      await db
        .insert(notificationEmailsTable)
        .values({ email: "contact@asivanta.com" })
        .onConflictDoNothing();
      return res.json([{ id: 1, email: "contact@asivanta.com", addedAt: new Date().toISOString() }]);
    }

    return res.json(rows);
  } catch (err) {
    logger.error({ err }, "Failed to fetch notification emails");
    return res.status(500).json({ error: "Failed to fetch notification emails." });
  }
});

// ─── POST /admin/notification-emails ──────────────────────────────────────
router.post("/admin/notification-emails", requireAdminAuth, async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required." });
  }
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  try {
    const [row] = await db
      .insert(notificationEmailsTable)
      .values({ email: trimmed })
      .onConflictDoNothing()
      .returning();

    if (!row) {
      return res.status(409).json({ error: "This email is already in the list." });
    }
    return res.json(row);
  } catch (err) {
    logger.error({ err }, "Failed to add notification email");
    return res.status(500).json({ error: "Failed to add email." });
  }
});

// ─── DELETE /admin/notification-emails/:id ────────────────────────────────
router.delete("/admin/notification-emails/:id", requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID." });

    // Check at least one email remains
    const all = await db.select().from(notificationEmailsTable);
    if (all.length <= 1) {
      return res.status(400).json({ error: "You must keep at least one notification email." });
    }

    await db.delete(notificationEmailsTable).where(eq(notificationEmailsTable.id, id));
    return res.json({ success: true });
  } catch (err) {
    logger.error({ err }, "Failed to delete notification email");
    return res.status(500).json({ error: "Failed to remove email." });
  }
});

export { getNotificationEmails };
export default router;
