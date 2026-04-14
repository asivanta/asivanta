import { useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  ArrowLeft, X, Paperclip, Clock, Lock, LogOut, Mail, Eye, EyeOff,
  Trash2, Download, CheckCircle2, Circle, Plus, AlertCircle, Loader2,
  ChevronRight, Bell, Key, Inbox, RefreshCw,
} from "lucide-react";
import { Link } from "wouter";
import logoImage from "../assets/logo-new-transparent.png";

// ─── Types ─────────────────────────────────────────────────────────────────

interface SubmissionSummary {
  id: number;
  fullName: string;
  company: string;
  email: string;
  projectType: string;
  isRead: boolean;
  submittedAt: string;
}

interface SubmissionDetail extends SubmissionSummary {
  phone: string;
  message: string;
  files: Array<{ original: string; stored: string; size: number }>;
  ip: string;
}

interface NotificationEmail {
  id: number;
  email: string;
  addedAt: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const API_BASE = "/api";
const TOKEN_KEY = "asivanta_admin_token";
type AdminSection = "submissions" | "notification-emails" | "change-password";

// ─── Session helpers ────────────────────────────────────────────────────────

function getToken(): string | null { return sessionStorage.getItem(TOKEN_KEY); }
function setToken(t: string) { sessionStorage.setItem(TOKEN_KEY, t); }
function clearToken() { sessionStorage.removeItem(TOKEN_KEY); }
function authHeaders(): HeadersInit {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

// ─── Formatters ─────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── CSV export ──────────────────────────────────────────────────────────────

function exportCSV(submissions: SubmissionSummary[]) {
  const headers = ["ID", "Date", "Company", "Contact Name", "Email", "Project Type", "Status"];
  const rows = submissions.map((s) => [
    s.id,
    fmtDate(s.submittedAt),
    `"${s.company.replace(/"/g, '""')}"`,
    `"${s.fullName.replace(/"/g, '""')}"`,
    s.email,
    s.projectType,
    s.isRead ? "Read" : "Unread",
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `asivanta-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Reset password URL detection ───────────────────────────────────────────

function getResetToken(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("reset");
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ══════════════════════════════════════════════════════════════════════════════

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Access denied."); return; }
      setToken(data.token);
      onSuccess();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setForgotLoading(true);
    try {
      await fetch(`${API_BASE}/admin/forgot-password`, { method: "POST" });
      setForgotSent(true);
    } catch {
      setForgotSent(true); // show message regardless
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logoImage} alt="ASIVANTA" className="h-10 object-contain" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#0a1128] px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Lock className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Admin Portal</p>
                <p className="text-blue-300 text-xs font-light">ASIVANTA Advisory</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            {forgotSent ? (
              <div className="text-center py-2">
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Reset link sent</p>
                <p className="text-xs text-gray-500 mb-5">Check contact@asivanta.com for the reset link.</p>
                <button
                  onClick={() => setForgotSent(false)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin username"
                    autoComplete="username"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0a1128]/20 focus:border-[#0a1128] transition-colors"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0a1128]/20 focus:border-[#0a1128] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !username || !password}
                  className="w-full py-2.5 bg-[#0a1128] text-white rounded-lg text-sm font-medium hover:bg-[#0d1a3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                    </span>
                  ) : "Sign In"}
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {forgotLoading ? "Sending..." : "Forgot password?"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">ASIVANTA Advisory · Internal Access Only</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// RESET PASSWORD PAGE
// ══════════════════════════════════════════════════════════════════════════════

function ResetPasswordPage({ token }: { token: string }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Reset failed."); return; }
      setSuccess(true);
      window.history.replaceState({}, "", "/admin");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Password updated</h2>
          <p className="text-sm text-gray-500 mb-6">Your admin password has been changed successfully.</p>
          <a href="/admin" className="inline-block py-2.5 px-6 bg-[#0a1128] text-white rounded-lg text-sm font-medium hover:bg-[#0d1a3a] transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img src={logoImage} alt="ASIVANTA" className="h-10 object-contain" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-[#0a1128] px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Key className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Set New Password</p>
                <p className="text-blue-300 text-xs font-light">ASIVANTA Admin</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0a1128]/20 focus:border-[#0a1128] transition-colors"
                  autoFocus
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0a1128]/20 focus:border-[#0a1128] transition-colors"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full py-2.5 bg-[#0a1128] text-white rounded-lg text-sm font-medium hover:bg-[#0d1a3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Saving...</span> : "Set New Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SUBMISSION DETAIL MODAL
// ══════════════════════════════════════════════════════════════════════════════

function SubmissionModal({
  id,
  onClose,
  onDelete,
  onToggleRead,
  authError,
}: {
  id: number;
  onClose: () => void;
  onDelete: (id: number) => void;
  onToggleRead: (id: number, isRead: boolean) => void;
  authError: () => void;
}) {
  const { data: detail, isLoading } = useQuery<SubmissionDetail>({
    queryKey: ["submission", id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/submissions/${id}`, { headers: authHeaders() });
      if (res.status === 401) { authError(); throw new Error("Session expired"); }
      if (!res.ok) throw new Error("Failed to fetch submission");
      return res.json();
    },
    enabled: true,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Submission Details</h2>
            {detail && <p className="text-xs text-gray-400 mt-0.5">{fmtDate(detail.submittedAt)}</p>}
          </div>
          <div className="flex items-center gap-2">
            {detail && (
              <>
                <button
                  onClick={() => onToggleRead(id, !detail.isRead)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {detail.isRead ? <Circle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  {detail.isRead ? "Mark unread" : "Mark read"}
                </button>
                <button
                  onClick={() => { onDelete(id); onClose(); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isLoading && <div className="px-6 py-16 text-center text-sm text-gray-400">Loading...</div>}

        {detail && !isLoading && (
          <div className="px-6 py-6 space-y-6">
            {/* Contact info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Company", value: detail.company },
                { label: "Contact Name", value: detail.fullName },
                { label: "Email", value: detail.email, href: `mailto:${detail.email}` },
                { label: "Phone", value: detail.phone || "Not provided" },
              ].map(({ label, value, href }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                  {href
                    ? <a href={href} className="text-sm text-blue-600 hover:underline font-medium">{value}</a>
                    : <p className="text-sm text-gray-900 font-medium">{value}</p>
                  }
                </div>
              ))}
            </div>

            {/* Project type */}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Project Type</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                {detail.projectType}
              </span>
            </div>

            {/* Message */}
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</p>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100">
                {detail.message}
              </div>
            </div>

            {/* Attachments */}
            {detail.files && detail.files.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Attached Files</p>
                <div className="space-y-2">
                  {detail.files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                      <Paperclip className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="flex-1 truncate">{f.original}</span>
                      <span className="text-xs text-gray-400 shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                {fmtDate(detail.submittedAt)} · ID #{detail.id}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SUBMISSIONS PANEL
// ══════════════════════════════════════════════════════════════════════════════

function SubmissionsPanel({ authError }: { authError: () => void }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading, error, refetch } = useQuery<SubmissionSummary[]>({
    queryKey: ["submissions"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/submissions`, { headers: authHeaders() });
      if (res.status === 401) { authError(); throw new Error("Session expired"); }
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    refetchInterval: 60_000,
  });

  const toggleRead = useMutation({
    mutationFn: async ({ id, isRead }: { id: number; isRead: boolean }) => {
      const res = await fetch(`${API_BASE}/submissions/${id}/read`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ isRead }),
      });
      if (res.status === 401) { authError(); throw new Error("Session expired"); }
      if (!res.ok) throw new Error("Failed to update");
    },
    onSuccess: (_, { id, isRead }) => {
      queryClient.setQueryData<SubmissionSummary[]>(["submissions"], (old = []) =>
        old.map((s) => s.id === id ? { ...s, isRead } : s)
      );
      queryClient.setQueryData<SubmissionDetail>(["submission", id], (old) =>
        old ? { ...old, isRead } : old
      );
    },
  });

  const deleteSubmission = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_BASE}/submissions/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.status === 401) { authError(); throw new Error("Session expired"); }
      if (!res.ok) throw new Error("Failed to delete");
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<SubmissionSummary[]>(["submissions"], (old = []) =>
        old.filter((s) => s.id !== id)
      );
    },
  });

  const unreadCount = submissions.filter((s) => !s.isRead).length;

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Contact Submissions</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {submissions.length} total
            {unreadCount > 0 && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">{unreadCount} unread</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          {submissions.length > 0 && (
            <button
              onClick={() => exportCSV(submissions)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          )}
        </div>
      </div>

      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading submissions...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Failed to load submissions.</p>
            <p className="text-xs text-gray-400 mt-1">Make sure the API server is running.</p>
          </div>
        </div>
      )}

      {!isLoading && !error && submissions.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Inbox className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No submissions yet</p>
            <p className="text-xs text-gray-400 mt-1">Contact form submissions will appear here.</p>
          </div>
        </div>
      )}

      {!isLoading && !error && submissions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Project Type</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {submissions.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={`cursor-pointer hover:bg-blue-50/30 transition-colors ${!s.isRead ? "bg-blue-50/50" : ""}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center">
                        {s.isRead
                          ? <span className="text-xs text-gray-400 font-medium">Read</span>
                          : <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700"><span className="h-1.5 w-1.5 rounded-full bg-blue-600 inline-block" />New</span>
                        }
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className={`text-sm ${!s.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>{s.company}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm text-gray-600">{s.fullName}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {s.projectType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">{fmtDateShort(s.submittedAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleRead.mutate({ id: s.id, isRead: !s.isRead })}
                          title={s.isRead ? "Mark as unread" : "Mark as read"}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          {s.isRead ? <Circle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => deleteSubmission.mutate(s.id)}
                          title="Delete"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <ChevronRight className="h-4 w-4 text-gray-300 ml-1" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {submissions.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`px-4 py-4 cursor-pointer ${!s.isRead ? "bg-blue-50/40" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!s.isRead && <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />}
                      <p className={`text-sm truncate ${!s.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>{s.company}</p>
                    </div>
                    <p className="text-xs text-gray-500">{s.fullName} · {s.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{s.projectType}</span>
                      <span className="text-xs text-gray-400">{fmtDateShort(s.submittedAt)}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedId !== null && (
        <SubmissionModal
          id={selectedId}
          onClose={() => setSelectedId(null)}
          onDelete={(id) => { deleteSubmission.mutate(id); }}
          onToggleRead={(id, isRead) => toggleRead.mutate({ id, isRead })}
          authError={authError}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// NOTIFICATION EMAILS PANEL
// ══════════════════════════════════════════════════════════════════════════════

function NotificationEmailsPanel({ authError }: { authError: () => void }) {
  const [newEmail, setNewEmail] = useState("");
  const [addError, setAddError] = useState("");
  const queryClient = useQueryClient();

  const { data: emails = [], isLoading } = useQuery<NotificationEmail[]>({
    queryKey: ["notification-emails"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/admin/notification-emails`, { headers: authHeaders() });
      if (res.status === 401) { authError(); throw new Error("Session expired"); }
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const addEmail = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch(`${API_BASE}/admin/notification-emails`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.status === 401) { authError(); throw new Error("Session expired"); }
      if (!res.ok) throw new Error(data.error || "Failed to add email");
      return data as NotificationEmail;
    },
    onSuccess: (newRow) => {
      queryClient.setQueryData<NotificationEmail[]>(["notification-emails"], (old = []) => [...old, newRow]);
      setNewEmail("");
      setAddError("");
    },
    onError: (err: Error) => {
      setAddError(err.message);
    },
  });

  const removeEmail = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_BASE}/admin/notification-emails/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (res.status === 401) { authError(); throw new Error("Session expired"); }
      if (!res.ok) throw new Error(data.error || "Failed to remove email");
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<NotificationEmail[]>(["notification-emails"], (old = []) =>
        old.filter((e) => e.id !== id)
      );
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    if (!newEmail.trim()) { setAddError("Email is required."); return; }
    addEmail.mutate(newEmail.trim());
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Notification Emails</h2>
        <p className="text-sm text-gray-400 mt-1">
          Every email in this list will receive a notification whenever a contact form is submitted.
        </p>
      </div>

      {/* Current list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
        {isLoading ? (
          <div className="px-6 py-8 text-center text-sm text-gray-400">Loading...</div>
        ) : emails.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-gray-400">No notification emails configured.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {emails.map((e) => (
              <div key={e.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{e.email}</p>
                    <p className="text-xs text-gray-400">Added {fmtDateShort(e.addedAt)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeEmail.mutate(e.id)}
                  disabled={removeEmail.isPending}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add new email */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Add Email Address</h3>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => { setNewEmail(e.target.value); setAddError(""); }}
            placeholder="name@company.com"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0a1128]/20 focus:border-[#0a1128] transition-colors"
          />
          <button
            type="submit"
            disabled={addEmail.isPending || !newEmail}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0a1128] text-white rounded-lg text-sm font-medium hover:bg-[#0d1a3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {addEmail.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </button>
        </form>
        {addError && (
          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />{addError}
          </p>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CHANGE PASSWORD PANEL
// ══════════════════════════════════════════════════════════════════════════════

function ChangePasswordPanel({ authError }: { authError: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!current || !next || !confirm) { setError("All fields are required."); return; }
    if (next !== confirm) { setError("New passwords do not match."); return; }
    if (next.length < 8) { setError("New password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/change-password`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ currentPassword: current, newPassword: next, confirmPassword: confirm }),
      });
      const data = await res.json();
      if (res.status === 401) { authError(); return; }
      if (!res.ok) { setError(data.error || "Failed to change password."); return; }
      setSuccess(true);
      setCurrent(""); setNext(""); setConfirm("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pwField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    setShow: (v: boolean) => void,
    autoComplete: string,
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0a1128]/20 focus:border-[#0a1128] transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
        <p className="text-sm text-gray-400 mt-1">Update your admin panel password. Minimum 8 characters.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {pwField("Current Password", current, setCurrent, showCurrent, setShowCurrent, "current-password")}
          <div className="border-t border-gray-100 pt-5">
            {pwField("New Password", next, setNext, showNew, setShowNew, "new-password")}
          </div>
          {pwField("Confirm New Password", confirm, setConfirm, showConfirm, setShowConfirm, "new-password")}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <p className="text-xs text-green-700 font-medium">Password changed successfully.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !current || !next || !confirm}
            className="w-full py-2.5 bg-[#0a1128] text-white rounded-lg text-sm font-medium hover:bg-[#0d1a3a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Saving...</span> : "Save New Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD SHELL
// ══════════════════════════════════════════════════════════════════════════════

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<AdminSection>("submissions");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: submissions = [] } = useQuery<SubmissionSummary[]>({
    queryKey: ["submissions"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/submissions`, { headers: authHeaders() });
      if (res.status === 401) return [];
      if (!res.ok) return [];
      return res.json();
    },
    refetchInterval: 60_000,
  });

  const unreadCount = submissions.filter((s) => !s.isRead).length;

  const handleAuthError = useCallback(() => {
    clearToken();
    queryClient.clear();
    onLogout();
  }, [onLogout, queryClient]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/admin/logout`, { method: "POST", headers: authHeaders() });
    } catch { /* ignore */ }
    clearToken();
    queryClient.clear();
    onLogout();
  };

  const navItems: Array<{ id: AdminSection; label: string; icon: React.ElementType; badge?: number }> = [
    { id: "submissions", label: "Submissions", icon: Inbox, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: "notification-emails", label: "Notification Emails", icon: Bell },
    { id: "change-password", label: "Change Password", icon: Key },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-[#0a1128]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <img src={logoImage} alt="ASIVANTA" className="h-8 object-contain brightness-0 invert opacity-80" />
        <p className="text-[10px] text-blue-400 font-medium tracking-widest uppercase mt-2">Admin Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => { setSection(id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              section === id
                ? "bg-white/10 text-white"
                : "text-blue-200/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="h-5 min-w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center px-1">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-200/70 hover:bg-white/5 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 shrink-0" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-blue-200/70 hover:bg-white/5 hover:text-white transition-colors text-left"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-56 shrink-0 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-56 bg-[#0a1128] z-50">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {navItems.find((n) => n.id === section)?.label}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </header>

        {/* Section content */}
        <main className="flex-1 p-5 lg:p-8">
          {section === "submissions" && <SubmissionsPanel authError={handleAuthError} />}
          {section === "notification-emails" && <NotificationEmailsPanel authError={handleAuthError} />}
          {section === "change-password" && <ChangePasswordPanel authError={handleAuthError} />}
        </main>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT: Admin entry point
// ══════════════════════════════════════════════════════════════════════════════

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(() => !!getToken());
  const resetToken = getResetToken();

  // Show reset password flow if URL has ?reset=TOKEN
  if (resetToken && !authenticated) {
    return <ResetPasswordPage token={resetToken} />;
  }

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setAuthenticated(false)} />;
}
